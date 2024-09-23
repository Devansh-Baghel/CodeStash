import { Response } from "express";
import { generateUsername } from "unique-username-generator";

import { cookieOptions } from "../constants";
import { User, UserTypes } from "../models/user.model";
import { UserRequest } from "../types/userTypes";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { Community } from "../models/community.model";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = (await User.findById(userId)) as UserTypes;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

export const registerUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) throw new ApiError(400, "Firstname is required");
    if (!lastName) throw new ApiError(400, "Lastname is required");
    if (!password) throw new ApiError(400, "Password is required");
    if (!email) throw new ApiError(400, "Email is required");

    const emailExists = await User.findOne({ email });
    if (emailExists) throw new ApiError(409, "Email has already been used");

    const username = generateUsername("-", 0);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      communitiesJoined: ["all"],
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered sucessfully"));
  }
);

export const loginUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { email, password } = req.body;

    if (!email) throw new ApiError(400, "Email required");
    if (!password) throw new ApiError(400, "Password required");

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(401, "Invalid Password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  }
);

export const logoutUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(400, "User doesn't exist");
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User logged out"));
  }
);

export const getCurrentUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: req.user }, "User fetched successfully")
      );
  }
);

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.body;

  // FIXME: add zod verification here
  if (!username) throw new ApiError(400, "Username is required");

  const user = await User.findOne({ username }).select(
    "-password -refreshToken -email"
  );

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User sent successfully"));
});

export const updateUsername = asyncHandler(async (req: UserRequest, res) => {
  const { newUsername } = req.body;
  const user = req.user;

  if (!newUsername) throw new ApiError(400, "New username is required");

  if (newUsername === user?.username)
    throw new ApiError(400, "New username can't be the same as old username");

  const userExists = await User.findOne({ username: newUsername });
  if (userExists)
    throw new ApiError(409, "User with this username already exists");

  // Updating posts, comments and communities made by the user
  await Post.updateMany(
    { "madeBy.username": user?.username },
    { $set: { "madeBy.username": newUsername } }
  );

  await Comment.updateMany(
    { "madeBy.username": user?.username },
    { $set: { "madeBy.username": newUsername } }
  );

  await Community.updateMany(
    { "madeBy.username": user?.username },
    { $set: { "madeBy.username": newUsername } }
  );

  user!.username = newUsername;
  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser: user },
        "Username updated successfully"
      )
    );
});

export const uploadAvatar = asyncHandler(async (req: UserRequest, res) => {
  const avatarLocalPath = req?.file?.path;
  const user = req.user;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { avatar: avatar.url },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser)
    throw new ApiError(500, "Something went wrong uploading avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: updatedUser }, "Avatar uploaded sucessfully")
    );
});

export const changeCurrentPassword = asyncHandler(
  async (req: UserRequest, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      throw new ApiError(400, "Both old and new passwords are required");

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid old password");
    }

    user!.password = newPassword;
    await user?.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  }
);

export const setUserDownloadPath = asyncHandler(
  async (req: UserRequest, res) => {
    const { downloadPath } = req.body;
    const user = req.user!;

    if (!downloadPath) throw new ApiError(400, "Download path is required");

    user.downloadPath = downloadPath;
    await user?.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedUser: user },
          "Download path set sucessfully"
        )
      );
  }
);

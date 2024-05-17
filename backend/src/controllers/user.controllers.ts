import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { User, UserTypes } from "../models/user.model";
import { Response } from "express";
import { UserRequest } from "../types/userTypes";
import { cookieOptions } from "../constants";
import { generateUsername } from "unique-username-generator";

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

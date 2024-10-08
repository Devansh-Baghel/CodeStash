import { z } from "zod";
import { Community } from "../models/community.model";
import { communityNameSchema } from "../schemas/communitySchema";
import { UserRequest } from "../types/userTypes";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

// TODO: Add extra validation for name of cummunity, it cant contain whitespace for example
export const createCommunity = asyncHandler(async (req: UserRequest, res) => {
  let { name, description } = req.body;
  const user = req.user;

  if (!name) throw new ApiError(400, "Name of community is required");
  if (!description)
    throw new ApiError(400, "Description of community is required");

  name = name.trim();
  name = name.replaceAll(" ", "-");

  try {
    name = communityNameSchema.parse(name);
  } catch (error) {
    throw new ApiError(
      400,
      (error as z.ZodError).errors[0]?.message || "Invalid subreddit name"
    );
  }

  const doesCommunityExist = await Community.findOne({ name });
  if (doesCommunityExist)
    throw new ApiError(409, "A community with this name already exists");

  const community = await Community.create({
    name,
    description,
    madeBy: {
      userId: user?._id,
      username: user?.username,
    },
  });

  if (!community) {
    throw new ApiError(
      500,
      "Something went wrong while creating the community"
    );
  }

  user?.communitiesJoined.push(community.name);

  await user?.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user, community },
        "Community created successfully"
      )
    );
});

export const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, communities, "Communities sent successfully"));
});

export const getCommunity = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name)
    throw new ApiError(400, "Community name is required to get it's details");

  const community = await Community.findOne({ name });
  if (!community)
    throw new ApiError(404, "Community with this name does not exist");

  return res
    .status(200)
    .json(
      new ApiResponse(200, community, "Community details sent successfully")
    );
});

export const joinCommunity = asyncHandler(async (req: UserRequest, res) => {
  const { community } = req.body;
  const user = req.user;

  if (!community)
    throw new ApiError(400, "Community name is required to join a community");

  if (user?.communitiesJoined.includes(community)) {
    throw new ApiError(400, "You have already joined this community");
  }

  const updatedCommunity = await Community.findOneAndUpdate(
    { name: community },
    { $inc: { joinedMembers: +1 } }
  );

  if (!updatedCommunity)
    throw new ApiError(404, "Community with this name does not exist");

  user?.communitiesJoined.push(community);
  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedCommunity, user },
        "Community joined successfully"
      )
    );
});

export const leaveCommunity = asyncHandler(async (req: UserRequest, res) => {
  const { community } = req.body;
  const user = req.user;

  if (!community) throw new ApiError(400, "Community name is required");

  if (!user?.communitiesJoined.includes(community)) {
    throw new ApiError(
      400,
      "You haven't joined this community yet, can't remove"
    );
  }

  const updatedCommunity = await Community.findOneAndUpdate(
    { name: community },
    { $inc: { joinedMembers: -1 } }
  );

  user.communitiesJoined = user.communitiesJoined.filter(
    (item) => item !== community
  );

  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedCommunity, user },
        "Left the community successfully"
      )
    );
});

export const uploadAvatar = asyncHandler(async (req: UserRequest, res) => {
  const { name } = req.body;
  const avatarLocalPath = req?.file?.path;
  const user = req.user;

  if (!name) throw new ApiError(400, "Name of community is required");

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  const community = await Community.findOne({ name });
  if (!community) throw new ApiError(404, "Community not found");

  if (community.madeBy.username !== user?.username) {
    throw new ApiError(
      401,
      "You are not authorized to change the avatar image of this community"
    );
  }

  const updatedCommunity = await Community.findByIdAndUpdate(
    community._id,
    { avatar: avatar.url },
    { new: true }
  );

  if (!updatedCommunity)
    throw new ApiError(500, "Something went wrong uploading avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { community: updatedCommunity },
        "Avatar uploaded sucessfully"
      )
    );
});

export const uploadCoverImage = asyncHandler(async (req: UserRequest, res) => {
  const { name } = req.body;
  const coverImageLocalPath = req?.file?.path;
  const user = req.user;

  if (!name) throw new ApiError(400, "Name of community is required");

  if (!coverImageLocalPath)
    throw new ApiError(400, "Cover image file is required");

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) throw new ApiError(400, "Cover image file is required");

  const community = await Community.findOne({ name });
  if (!community) throw new ApiError(404, "Community not found");

  if (community.madeBy.username !== user?.username) {
    throw new ApiError(
      401,
      "You are not authorized to change the cover image of this community"
    );
  }

  const updatedCommunity = await Community.findByIdAndUpdate(
    community._id,
    { coverImage: coverImage.url },
    { new: true }
  );

  if (!updatedCommunity)
    throw new ApiError(500, "Something went wrong uploading cover image");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { community: updatedCommunity },
        "Cover image uploaded sucessfully"
      )
    );
});

export const updateCommunityInfo = asyncHandler(
  async (req: UserRequest, res) => {
    const { description, communityName } = req.body;
    const user = req.user;

    if (!description)
      throw new ApiError(400, "Description is required to update info.");

    const community = await Community.findOne({ name: communityName });

    if (!community) throw new ApiError(404, "Community does not exist");

    if (user?.username !== community.madeBy.username)
      throw new ApiError(401, "You are not allowed to update this community");

    community.description = description;

    await community.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, { community }, "Community updated successfully")
      );
  }
);

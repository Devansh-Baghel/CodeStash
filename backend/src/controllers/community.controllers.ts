import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { UserRequest } from "../types/userTypes";
import { Community } from "../models/community.model";

export const createCommunity = asyncHandler(async (req: UserRequest, res) => {
  const { name, description } = req.body;
  const user = req.user;

  if (!name) throw new ApiError(400, "Name of community is required");
  if (!description)
    throw new ApiError(400, "Description of community is required");

  const doesCommunityExist = await Community.findOne({ name });
  if (doesCommunityExist)
    throw new ApiError(400, "A community with this name already exists");

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

  return res
    .status(201)
    .json(new ApiResponse(201, community, "Community created successfully"));
});

export const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({});

  if (!communities) throw new ApiError(404, "There are no communities yet");

  return res
    .status(200)
    .json(new ApiResponse(200, communities, "Communities sent successfully"));
});

export const getCommunity = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name)
    throw new ApiError(400, "Community name is required to get it's details");

  const community = await Community.find({ name });
  if (!community)
    throw new ApiError(404, "Community with this name does not exist");

  return res
    .status(200)
    .json(
      new ApiResponse(200, community, "Community details sent successfully")
    );
});

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { UserRequest } from "../types/userTypes";
import { Community } from "../models/community.model";

// TODO: Add extra validation for name of cummunity, it cant contain whitespace for example
export const createCommunity = asyncHandler(async (req: UserRequest, res) => {
  const { name, description } = req.body;
  const user = req.user;

  if (!name) throw new ApiError(400, "Name of community is required");
  if (!description)
    throw new ApiError(400, "Description of community is required");

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

  const community = await Community.find({ name });
  if (!community || community.length === 0)
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

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { Post } from "../models/post.model";
import { ApiError } from "../utils/apiError";
import { Comment } from "../models/comment.model";
import { UserRequest } from "../types/userTypes";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return new ApiError(400, "Post id is required to get comments");
  }

  const post = await Post.findById(postId);

  if (!post) return new ApiError(404, "Post with this id does not exist");

  const comments = await Comment.find({ _id: { $in: post.comments } });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments sent successfully"));
});

export const createComment = asyncHandler(async (req: UserRequest, res) => {
  const { content, postId } = req.body;
  const user = req.user;

  if (!content) throw new ApiError(400, "Comment body is required");

  const post = await Post.findById(postId);

  if (!post) throw new ApiError(404, "Post with this postId not found");

  const comment = await Comment.create({
    madeBy: user?._id,
    parent: post._id,
    type: "comment",
    content,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

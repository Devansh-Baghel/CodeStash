import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { Post } from "../models/post.model";
import { ApiError } from "../utils/apiError";
import { Comment } from "../models/comment.model";

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

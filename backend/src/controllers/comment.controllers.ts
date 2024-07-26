import { Comment } from "../models/comment.model";
import { Post } from "../models/post.model";
import { UserRequest } from "../types/userTypes";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return new ApiError(400, "Post id is required to get comments");
  }

  const post = await Post.findById(postId);

  if (!post) return new ApiError(404, "Post with this id does not exist");

  let comments = await Comment.find({ _id: { $in: post.comments } });

  comments = comments.reverse();

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
    madeBy: { userId: user?._id, username: user?.username },
    parent: post._id,
    type: "comment",
    content,
  });

  post.comments?.push(comment._id);

  // FIXME: fix ts errors
  if (!post.madeBy.username) {
    // @ts-ignore
    post.madeBy.username = user?.username;
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

export const upvoteComment = asyncHandler(async (req: UserRequest, res) => {
  const { commentId } = req.body;
  const user = req.user;

  if (!commentId) {
    throw new ApiError(400, "Comment id is required to upvote the comment");
  }

  // Remove the upvote
  if (user?.upvotedComments.includes(commentId)) {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { upvotes: -1 },
    });

    user.upvotedComments = user.upvotedComments.filter(
      (item) => item.toString() !== commentId,
    );

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedComment, user },
          "Comment was already upvoted, so removed it from upvotedComments",
        ),
      );
  }

  let updatedComment;

  // If user has downvoted the post before, we remove that here
  if (user?.downvotedComments.includes(commentId)) {
    updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { upvotes: +1, downvotes: -1 },
    });
    user.downvotedComments = user.downvotedComments.filter(
      (item) => item.toString() !== commentId,
    );
  } else {
    updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { upvotes: +1 },
    });
  }

  if (!updatedComment) {
    throw new ApiError(404, "Comment with this id does not exist");
  }

  user?.upvotedComments.push(commentId);
  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedComment, user },
        "Post upvoted successfully",
      ),
    );
});

export const downvoteComment = asyncHandler(async (req: UserRequest, res) => {
  const { commentId } = req.body;
  const user = req.user;

  if (!commentId) {
    throw new ApiError(400, "Comment id is required to downvote the comment");
  }

  // Remove the downvote
  if (user?.downvotedComments.includes(commentId)) {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { downvotes: -1 },
    });

    user.downvotedComments = user.downvotedComments.filter(
      (item) => item.toString() !== commentId,
    );

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedComment, user },
          "Comment was downvoted already, so removing the downvote instead",
        ),
      );
  }

  let updatedComment;

  // If user has upvoted the comment before, we remove that here
  if (user?.upvotedComments.includes(commentId)) {
    updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { downvotes: +1, upvotes: -1 },
    });

    user.upvotedComments = user.upvotedComments.filter(
      (item) => item.toString() !== commentId,
    );
  } else {
    updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { downvotes: +1 },
    });
  }

  if (!updatedComment) {
    throw new ApiError(404, "Comment with this id does not exist");
  }

  user?.downvotedComments.push(commentId);
  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedComment, user },
        "Post downvoted successfully",
      ),
    );
});

// TODO: fix all "return new ApiError" with "throw new ApiError"

export const updateComment = asyncHandler(async (req: UserRequest, res) => {
  const { commentId, content } = req.body;
  const user = req.user;

  if (!commentId)
    throw new ApiError(400, "Comment id is required to update comment");
  if (!content)
    throw new ApiError(400, "Comment body is required to update comment");

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment with this id does not exist");

  if (comment.madeBy.username !== user?.username)
    throw new ApiError(403, "You are not authorized to update this comment");

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req: UserRequest, res) => {
  const { commentId } = req.body;
  const user = req.user;

  if (!commentId)
    throw new ApiError(400, "Comment id is required to delete comment");

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment with this id does not exist");

  if (comment.madeBy.username !== user?.username)
    throw new ApiError(403, "You are not authorized to delete this comment");

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

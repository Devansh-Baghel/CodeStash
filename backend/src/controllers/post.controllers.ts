import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { Post } from "../models/post.model";
import { ApiError } from "../utils/apiError";
import { postSchema } from "../schemas/postSchema";
import { UserRequest } from "../types/userTypes";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  // TODO: don't send the post.content to client
  let posts = await Post.find();

  posts = posts.reverse();

  // FIXME: use zod verification here
  if (!posts) throw new ApiError(404, "There aren't any posts");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts sent successfully"));
});

export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) throw new ApiError(400, "Post id is required");

  const post = await Post.findById(postId);

  if (!post) throw new ApiError(404, "Post not found");

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post sent successfully"));
});

export const getPostsByLang = asyncHandler(
  async (req: Request, res: Response) => {
    // FIXME: Add proper language verification w/ zod
    const { language } = req.body;
    if (!language) throw new ApiError(400, "Language is required");

    const posts = await Post.find({ language });
    if (!posts) throw new ApiError(404, "There aren't any posts");

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts got successfully"));
  }
);

export const createPost = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { title, content, language, description } = postSchema.parse(
      req.body
    );

    const post = await Post.create({
      title,
      madeBy: {
        userId: req.user?._id,
        fullname: `${req.user?.firstName} ${req.user?.lastName}`,
        username: req.user?.username,
      },
      content,
      language,
      description,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post created successfully"));
  }
);

export const upvotePost = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post id is required to upvote the post");
  }

  // FIXME: only let a user upvote a post once

  const updatedPost = await Post.findByIdAndUpdate(postId, {
    $inc: { upvotes: +1 },
  });

  if (!updatedPost) {
    throw new ApiError(404, "Post with this id does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedPost }, "Post upvoted successfully"));
});

// FIXME: Change this to toggle save or make a new controller for toggle save
export const savePost = asyncHandler(async (req: UserRequest, res) => {
  const { postId } = req.body;
  const user = req.user;

  if (!postId) {
    throw new ApiError(400, "Post id is required to save posts");
  }

  if (user?.savedPosts?.includes(postId)) {
    throw new ApiError(400, "You have already saved this post");
  }

  user?.savedPosts?.push(postId);

  await user?.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Post saved successfully"));
});

export const getSavedPosts = asyncHandler(async (req: UserRequest, res) => {
  const user = req.user;

  const savedPosts = await Post.find({
    _id: { $in: user?.savedPosts },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, savedPosts, "Saved posts sent successfully"));
});

export const removeSavedPost = asyncHandler(async (req: UserRequest, res) => {
  const { postId } = req.body;
  const user = req.user;

  if (!postId)
    throw new ApiError(400, "Post id is required to remove saved post");

  if (!user?.savedPosts?.includes(postId)) {
    throw new ApiError(400, "You haven't saved this post yet");
  }

  user.savedPosts = user.savedPosts.filter((item) => item !== postId);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Post removed successfully"));
});

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { Post, allowedLanguages } from "../models/post.model";
import { ApiError } from "../utils/apiError";
import { postSchema } from "../schemas/postSchema";
import { UserRequest } from "../types/userTypes";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find();
  if (!posts) throw new ApiError(404, "There aren't any posts");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts sent successfully"));
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
      // @ts-expect-error
      madeBy: req.user._id,
      content,
      language,
      description,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post created successfully"));
  }
);

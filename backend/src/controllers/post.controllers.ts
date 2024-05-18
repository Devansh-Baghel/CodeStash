import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { Post, allowedLanguages } from "../models/post.model";
import { ApiError } from "../utils/apiError";
import { postSchema } from "../schemas/postSchema";

export const getPosts = asyncHandler((req: Request, res: Response) => {
  const posts = Post.find();
  if (!posts) throw new ApiError(404, "There aren't any posts");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts sent successfully"));
});

export const getPostsByLang = asyncHandler((req: Request, res: Response) => {
  const { language } = req.body;
  if (!language) throw new ApiError(400, "Language is required");

  const posts = Post.find({ language });
  if (!posts) throw new ApiError(404, "There aren't any posts");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts sent successfully"));
});

export const createPost = asyncHandler((req: Request, res: Response) => {
  const { title, content, language, description } = postSchema.parse(req.body);

  const post = Post.create({
    title,
    content,
    language,
    description,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Posts sent successfully"));
});

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { Post, allowedLanguages } from "../models/post.model";
import { ApiError } from "../utils/apiError";
import { postSchema } from "../schemas/postSchema";
import { UserRequest } from "../types/userTypes";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  // TODO: don't send the post.content to client, cause the coed can be very large
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
    const { language } = req.body;
    if (!language) throw new ApiError(400, "Language is required");

    if (!allowedLanguages.includes(language)) {
      throw new ApiError(404, "This language isn't supported yet");
    }

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

export const upvotePost = asyncHandler(async (req: UserRequest, res) => {
  const { postId } = req.body;
  const user = req.user;

  if (!postId) {
    throw new ApiError(400, "Post id is required to upvote the post");
  }

  // Remove the upvote
  if (user?.upvotedPosts.includes(postId)) {
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      $inc: { upvotes: -1 },
    });

    user.upvotedPosts = user.upvotedPosts.filter(
      (item) => item.toString() !== postId
    );

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedPost, user },
          "Post was already upvoted, so removed it from upvotedPosts"
        )
      );
  }

  let updatedPost;

  // If user has downvoted the post before, we remove that here
  if (user?.downvotedPosts.includes(postId)) {
    updatedPost = await Post.findByIdAndUpdate(postId, {
      $inc: { upvotes: +1, downvotes: -1 },
    });
    user.downvotedPosts = user.downvotedPosts.filter(
      (item) => item.toString() !== postId
    );
  } else {
    updatedPost = await Post.findByIdAndUpdate(postId, {
      $inc: { upvotes: +1 },
    });
  }

  if (!updatedPost) {
    throw new ApiError(404, "Post with this id does not exist");
  }

  user?.upvotedPosts.push(postId);
  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedPost, user }, "Post upvoted successfully")
    );
});

export const downvotePost = asyncHandler(async (req: UserRequest, res) => {
  const { postId } = req.body;
  const user = req.user;

  if (!postId) {
    throw new ApiError(400, "Post id is required to downvote the post");
  }

  // Remove the downvote
  if (user?.downvotedPosts.includes(postId)) {
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      $inc: { downvotes: -1 },
    });

    user.downvotedPosts = user.downvotedPosts.filter(
      (item) => item.toString() !== postId
    );

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedPost, user },
          "Post was downvoted already, so removing the downvote instead"
        )
      );
  }

  let updatedPost;

  // If user has upvoted the post before, we remove that here
  if (user?.upvotedPosts.includes(postId)) {
    updatedPost = await Post.findByIdAndUpdate(postId, {
      $inc: { downvotes: +1, upvotes: -1 },
    });

    user.upvotedPosts = user.upvotedPosts.filter(
      (item) => item.toString() !== postId
    );
  } else {
    updatedPost = await Post.findByIdAndUpdate(postId, {
      $inc: { downvotes: +1 },
    });
  }

  if (!updatedPost) {
    throw new ApiError(404, "Post with this id does not exist");
  }

  user?.downvotedPosts.push(postId);
  await user?.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedPost, user }, "Post downvoted successfully")
    );
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

  console.log(user.savedPosts);

  user.savedPosts = user.savedPosts.filter(
    (item) => item.toString() !== postId
  );

  console.log(user.savedPosts);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Post removed successfully"));
});

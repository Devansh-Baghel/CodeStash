import { Request, Response } from "express";

import { allowedLanguages, Post } from "../models/post.model";
import { postSchema } from "../schemas/postSchema";
import { UserRequest } from "../types/userTypes";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { Community } from "../models/community.model";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
  const limit = 3; // Send 3 posts at a time
  const skip = (page - 1) * limit;

  // TODO: don't send the post.content to client, cause the coed can be very large
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // FIXME: use zod verification here
  if (!posts || posts.length === 0)
    throw new ApiError(404, "There aren't any posts");

  const totalPosts = await Post.countDocuments(); // Get the total number of posts
  const totalPages = Math.ceil(totalPosts / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, currentPage: page, totalPages, totalPosts },
        "Posts sent successfully"
      )
    );
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
  async (req: UserRequest, res: Response) => {
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

export const getPostsByUsername = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { username } = req.body;
    if (!username) throw new ApiError(400, "Username is required");

    const findUser = await User.findOne({ username });
    if (!findUser) throw new ApiError(404, "User not found");

    const posts = await Post.find({ "madeBy.username": username });

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts sent successfully"));
  }
);

export const getPostsByCommunity = asyncHandler(async (req, res) => {
  const { community, filter } = req.body;
  if (!community)
    throw new ApiError(400, "Name of community is required to get posts");

  const findCommunity = await Community.findOne({ name: community });
  if (!findCommunity)
    throw new ApiError(404, "Community with this name does not exist");

  let posts;

  switch (filter) {
    case "Oldest":
      posts = await Post.find({ community }).sort({ createdAt: "asc" });
      break;
    case "Latest":
      posts = await Post.find({ community }).sort({ createdAt: "desc" });
      break;
    case "Popular":
      posts = await Post.find({ community }).sort({ comments: "desc" });
      break;
    default:
      throw new ApiError(400, "Filter option must be included");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts sent successfully"));
});

export const createPost = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { title, content, language, description, community } =
      postSchema.parse(req.body);

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
      community: community ? community : "all",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          post,
          `Post created successfully in c/${community}`
        )
      );
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

  user.savedPosts = user.savedPosts.filter(
    (item) => item.toString() !== postId
  );

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Post removed successfully"));
});

export const getUpvotedPosts = asyncHandler(async (req: UserRequest, res) => {
  const user = req.user;

  if (user?.upvotedPosts.length === 0) {
    throw new ApiError(404, "You don't have any upvoted posts");
  }

  let upvotedPosts = await Post.find({
    _id: { $in: user?.upvotedPosts },
  });

  upvotedPosts = upvotedPosts.reverse();

  return res
    .status(200)
    .json(
      new ApiResponse(200, upvotedPosts, "Upvoted posts sent successfully")
    );
});

export const getDownvotedPosts = asyncHandler(async (req: UserRequest, res) => {
  const user = req.user;

  if (user?.downvotedPosts.length === 0) {
    throw new ApiError(404, "You don't have any downvoted posts");
  }

  let downvotedPosts = await Post.find({
    _id: { $in: user?.downvotedPosts },
  });

  downvotedPosts = downvotedPosts.reverse();

  return res
    .status(200)
    .json(
      new ApiResponse(200, downvotedPosts, "Downvoted posts sent successfully")
    );
});

export const deletePost = asyncHandler(async (req: UserRequest, res) => {
  const { postId } = req.body;
  const user = req.user;

  if (!postId)
    throw new ApiError(400, "Post id is required to delete the post");

  const postToDelete = await Post.findById(postId);

  if (postToDelete?.madeBy.username !== user?.username) {
    throw new ApiError(
      401,
      "Cannot delete post as this post hasn't been created by you"
    );
  }

  const post = await Post.deleteOne({ _id: postId });

  if (!post) throw new ApiError(404, "Post with this id does not exist");

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post deleted successfully"));
});

export const updatePost = asyncHandler(async (req: UserRequest, res) => {
  const { postId, title, description, content, language } = req.body;
  const user = req.user;

  if (!postId) throw new ApiError(400, "Post id is required to update post");

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post with this id does not exist");
  if (post.madeBy.username !== user?.username) {
    throw new ApiError(
      401,
      "Cannot update post as this post hasn't been created by you"
    );
  }

  if (title) post.title = title;
  if (description) post.description = description;
  if (content) post.content = content;
  if (language) {
    if (!allowedLanguages.includes(language)) {
      throw new ApiError(400, "This language is not supported yet");
    }
    post.language = language;
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post updated successfully"));
});

export const searchPosts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  // query validation
  // TODO: do this with zod
  if (!query || typeof query !== "string") {
    throw new ApiError(400, "Query is required and must be a string");
  }

  const posts = await Post.find({
    $text: { $search: query },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts sent successfully"));
});

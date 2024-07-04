import { Router } from "express";
import {
  createPost,
  deletePost,
  downvotePost,
  getDownvotedPosts,
  getPost,
  getPosts,
  getPostsByLang,
  getSavedPosts,
  getUpvotedPosts,
  removeSavedPost,
  savePost,
  upvotePost,
} from "../controllers/post.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// routes without auth
router.route("/get-posts").get(getPosts);
router.route("/get-posts-by-language").post(getPostsByLang);
router.route("/get-post").post(getPost);

// secure posts
router.route("/create-post").post(verifyJWT, createPost);
router.route("/upvote").patch(verifyJWT, upvotePost);
router.route("/downvote").patch(verifyJWT, downvotePost);
router.route("/save").post(verifyJWT, savePost);
router.route("/get-saved-posts").get(verifyJWT, getSavedPosts);
router.route("/remove-saved-post").patch(verifyJWT, removeSavedPost);
router.route("/get-upvoted").get(verifyJWT, getUpvotedPosts);
router.route("/get-downvoted").get(verifyJWT, getDownvotedPosts);
router.route("/delete-post").post(verifyJWT, deletePost);
router.route("/");

export default router;

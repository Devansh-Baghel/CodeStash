import { Router } from "express";
import {
  createPost,
  downvotePost,
  getPost,
  getPosts,
  getPostsByLang,
  getSavedPosts,
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

export default router;

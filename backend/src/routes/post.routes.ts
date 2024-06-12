import { Router } from "express";
import {
  createPost,
  getPost,
  getPosts,
  getPostsByLang,
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

export default router;

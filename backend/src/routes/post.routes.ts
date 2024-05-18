import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostsByLang,
} from "../controllers/post.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// routes without auth
router.route("/get-posts").get(getPosts);
router.route("/get-posts-by-language").post(getPostsByLang);

// secure posts
router.route("/create-post").post(verifyJWT, createPost);

export default router;

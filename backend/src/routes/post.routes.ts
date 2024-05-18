import { Router } from "express";
import { getPosts, getPostsByLang } from "../controllers/post.controllers";

const router = Router();

// routes without auth
router.route("/get-posts").get(getPosts);
router.route("/get-posts-by-language").post(getPostsByLang);

export default router;

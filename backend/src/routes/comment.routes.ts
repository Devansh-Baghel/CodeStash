import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createComment, getComments } from "../controllers/comment.controllers";

const router = Router();

// routes without auth
router.route("/get-comments").post(getComments);

// secure posts
router.route("/create-comment").put(verifyJWT, createComment);

export default router;
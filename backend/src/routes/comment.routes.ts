import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createComment,
  deleteComment,
  downvoteComment,
  getComments,
  updateComment,
  upvoteComment,
} from "../controllers/comment.controllers";

const router = Router();

// routes without auth
router.route("/get-comments").post(getComments);

// secure posts
router.route("/create-comment").put(verifyJWT, createComment);
router.route("/upvote").patch(verifyJWT, upvoteComment);
router.route("/downvote").patch(verifyJWT, downvoteComment);
router.route("/update-comment").patch(verifyJWT, updateComment); // Added route for updating a comment
router.route("/delete-comment").post(verifyJWT, deleteComment);

export default router;

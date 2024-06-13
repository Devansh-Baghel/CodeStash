import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getComments } from "../controllers/comment.controllers";

const router = Router();

// routes without auth
router.route("/get-comments").post(getComments);

// secure posts

export default router;

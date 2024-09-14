import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getAiAnswer } from "../controllers/ai.controller";

const router = Router();

// routes without auth

// secure posts
router.route("/explain").get(verifyJWT, getAiAnswer);

export default router;

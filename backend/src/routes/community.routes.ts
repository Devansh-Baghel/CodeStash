import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createCommunity } from "../controllers/community.controllers";

const router = Router();

// routes without auth

// secure posts
router.route("/create-community").put(verifyJWT, createCommunity);

export default router;

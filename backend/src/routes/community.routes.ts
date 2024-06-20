import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
} from "../controllers/community.controllers";

const router = Router();

// routes without auth
router.route("/get-all").get(getCommunities);
router.route("/get-community").post(getCommunity);

// secure posts
router.route("/create-community").post(verifyJWT, createCommunity);
router.route("/join").post(verifyJWT, joinCommunity);

export default router;

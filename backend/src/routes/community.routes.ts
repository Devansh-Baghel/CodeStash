import { Router } from "express";
import {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
  updateCommunityInfo,
  uploadAvatar,
  uploadCoverImage,
} from "../controllers/community.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// routes without auth
router.route("/get-all").get(getCommunities);
router.route("/get-community").post(getCommunity);

// secure posts
router.route("/create-community").post(verifyJWT, createCommunity);
router.route("/join").post(verifyJWT, joinCommunity);
router.route("/leave").post(verifyJWT, leaveCommunity);
router
  .route("/upload-avatar")
  .post(verifyJWT, upload.single("avatar"), uploadAvatar);
router
  .route("/upload-cover-image")
  .post(verifyJWT, upload.single("cover-image"), uploadCoverImage);
router.route("/update-info").put(verifyJWT, updateCommunityInfo);

export default router;

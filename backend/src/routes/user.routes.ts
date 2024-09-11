import { Router } from "express";

import {
  changeCurrentPassword,
  getCurrentUser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  setUserDownloadPath,
  updateUsername,
  uploadAvatar,
} from "../controllers/user.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-user-profile").post(getUserProfile);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/update-username").patch(verifyJWT, updateUsername);
router.route("/update-password").patch(verifyJWT, changeCurrentPassword);
router
  .route("/upload-avatar")
  .post(verifyJWT, upload.single("avatar"), uploadAvatar);
router.route("/set-download-path").patch(verifyJWT, setUserDownloadPath);

export default router;

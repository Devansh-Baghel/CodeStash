import { Router } from 'express';

import {
    getCurrentUser, getUserProfile, loginUser, logoutUser, registerUser, updateUsername
} from '../controllers/user.controllers';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-user-profile").post(getUserProfile);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/update-username").patch(verifyJWT, updateUsername);

export default router;

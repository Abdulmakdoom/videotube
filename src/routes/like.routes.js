import { Router } from 'express';
import {
    // getLikedVideos,
    // toggleCommentLike,
    // toggleVideoLike,
    // toggleTweetLike,
    toggleLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/toggle/v/:videoId").post(toggleVideoLike);
// router.route("/toggle/c/:commentId").post(toggleCommentLike);
// router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/toggle/v/type/:Id").post(toggleLike);
router.route("/videos").get(getLikedVideos);

export default router
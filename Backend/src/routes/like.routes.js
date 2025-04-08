import { Router } from 'express';
import {
    // getLikedVideos,
    // toggleCommentLike,
    // toggleVideoLike,
    // toggleTweetLike,
    toggleLike,
    getLikedVideos,
    getAllVideoLikes,
    getVideoCommentLikes,
    getPostLikes
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/videos/:id").get(getAllVideoLikes)
router.route("/videos/c/:commentId").get(getVideoCommentLikes)
router.route("/post/c/:postId").get(getPostLikes)

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/toggle/v/:videoId").post(toggleVideoLike);
// router.route("/toggle/c/:commentId").post(toggleCommentLike);
// router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/toggle/v/:type/:Id").post(verifyJWT, toggleLike);
router.route("/videos").get(verifyJWT, getLikedVideos);

export default router
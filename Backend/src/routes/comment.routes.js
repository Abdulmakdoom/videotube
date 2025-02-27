import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/:videoId")
        .get(getVideoComments)
        .post(verifyJWT, upload.none(), addComment);
router
    .route("/c/:commentId")
        .delete(verifyJWT, deleteComment)
        .patch(verifyJWT,upload.none(), updateComment);

export default router
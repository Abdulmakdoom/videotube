import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    viwesUpdate,
    getVideos,
    getAllUserVideos
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();


router
    .route("/u/")
    .get(getAllVideos)

router
    .route("/u/videos")
    .get(getAllUserVideos)

router
    .route("/:videoId")
    .get(getVideoById)

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );


router
    .route("/u/:userId")
    .get(getVideos)

router
    .route("/views/:videoId")
    .post(verifyJWT, viwesUpdate)



router
    .route("/:videoId")
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router
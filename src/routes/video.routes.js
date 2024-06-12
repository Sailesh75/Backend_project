import { Router } from "express";
import {
  getVideoById,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/upload-video")
  .post(
    verifyJWT,
    upload.fields([{ name: "videoFile" }, { name: "thumbnail" }]),
    uploadVideo
  );
router.route("/video/:videoId").get(verifyJWT, getVideoById);

router
  .route("/update-video/:videoId")
  .post(
    verifyJWT,
    upload.fields([{ name: "videoFile" }, { name: "thumbnail" }]),
    updateVideo
  );

export default router;

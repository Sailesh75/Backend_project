import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryService.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video File is missing");
  }
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail File is missing");
  }
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile || !thumbnail) {
    throw new ApiError(400, "Error while uploading on cloudinary!");
  }
  const { title, description } = req.body;
  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    owner: req.user,
    duration: videoFile.duration,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded Successfully!!"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not available");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  console.log("inside update controller");
  const { videoId } = req.params;
  const { title, description } = req.body;
  console.log(req.files);
  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
      },
    },
    {
      new: true,
    }
  );
  if (!video) {
    throw new ApiError("Error while updating the video fields");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Video details updated successfully"));

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export { uploadVideo, getVideoById, updateVideo };

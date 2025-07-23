const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const {
  uploadToDiskStorage,
  multipleUploadToDiskStorage,
  uploadToCloudinary,
  multipleUploadToCloudinary,
} = require("../controllers/post.controller");

router.post("/upload/disk", upload.single("image"), uploadToDiskStorage);
router.post(
  "/upload/disk/multiple",
  upload.array("images"),
  multipleUploadToDiskStorage
);

//cloudinary uploads
router.post("/upload", upload.single("image"), uploadToCloudinary);
router.post(
  "/upload/multiple",
  upload.array("images"),
  multipleUploadToCloudinary
);
module.exports = router;

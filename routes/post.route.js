const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const isAuthorised = require("../middlewares/isAuthorised");
const {
  uploadToDiskStorage,
  multipleUploadToDiskStorage,
  uploadToCloudinary,
  multipleUploadToCloudinary,
  createPost,
  editPost,
  deletePost,
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
router.post("/create", isAuthorised, createPost);
router.post("/edit/:id", isAuthorised, editPost);
router.post("/delete/post/:id", isAuthorised, deletePost);
module.exports = router;

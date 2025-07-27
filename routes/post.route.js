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
  getPostById,
  getMyPosts,
  getAllPosts,
  likePostById,
  disLikePostById,
  postStatsById,
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
router.put("/edit/:postId", isAuthorised, editPost);
router.delete("/delete/post/:postId", isAuthorised, deletePost);
router.get("/view/:id", isAuthorised, getPostById);
router.get("/myposts", isAuthorised, getMyPosts);
router.get("/allposts", isAuthorised, getAllPosts);

//like and dislike
router.put("/like/:id", isAuthorised, likePostById);
router.put("/dislike/:id", isAuthorised, disLikePostById);

//stats
router.get("/stats/:postId", isAuthorised, postStatsById);
module.exports = router;

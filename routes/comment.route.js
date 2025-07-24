const express = require("express");
const router = express.Router();
const isAuthorised = require("../middlewares/isAuthorised");
const {
  createComment,
  deleteComment,
  getCommentsById,
} = require("../controllers/comment.controller");

router.post("/create/:postId", isAuthorised, createComment);
router.delete("/delete/:id", isAuthorised, deleteComment);
router.get("/:postId", isAuthorised, getCommentsById);
module.exports = router;

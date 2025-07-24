const express = require("express");
const router = express.Router();
const userRouter = require("./user.route");
const postRouter = require("./post.route");
const commentRouter = require("./comment.route");
router.use("/auth", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);
module.exports = router;

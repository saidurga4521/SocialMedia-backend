const express = require("express");
const router = express.Router();
const userRouter = require("./user.route");
const postRouter = require("./post.route");
router.use("/auth", userRouter);
router.use("/post", postRouter);
module.exports = router;

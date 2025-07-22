const express = require("express");
const router = express.Router();
const userRouter = require("./user.route");
router.use("/auth", userRouter);
module.exports = router;

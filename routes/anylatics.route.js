const express = require("express");
const router = express.Router();
const { getPostByDate } = require("../controllers/anylatics.controller");
//middlewares
const isAuthorised = require("../middlewares/isAuthorised");
const authorize = require("../middlewares/authorize");

router.get(
  "/get-posts-by-date",
  isAuthorised,
  authorize(["creator"]),
  getPostByDate
);
module.exports = router;

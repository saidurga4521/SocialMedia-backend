const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  loggedInUserInfo,
} = require("../controllers/user.controller");
//middleware
const isAuthorised = require("../middlewares/isAuthorised");
router.post("/signup", signup);
router.post("/login", login);
router.get("/user/me", isAuthorised, loggedInUserInfo);
module.exports = router;

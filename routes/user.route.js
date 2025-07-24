const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  loggedInUserInfo,
  getAllUsers,
  updateUserInfo,
} = require("../controllers/user.controller");
//middleware
const isAuthorised = require("../middlewares/isAuthorised");
router.post("/signup", signup);
router.post("/login", login);
router.get("/user/me", isAuthorised, loggedInUserInfo);
router.get("/allusers", isAuthorised, getAllUsers);
router.put("/user/profile", isAuthorised, updateUserInfo);
module.exports = router;

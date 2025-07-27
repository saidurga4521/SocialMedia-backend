const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  deleteUser,
  loggedInUserInfo,
  getAllUsers,
  updateUserInfo,
  followUser,
  unFollowUser,
  getAllFollowers,
  getAllFollowings,
} = require("../controllers/user.controller");
//middleware
const isAuthorised = require("../middlewares/isAuthorised");
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", isAuthorised, deleteUser);
router.get("/user/me", isAuthorised, loggedInUserInfo);
router.get("/allusers", isAuthorised, getAllUsers);
router.put("/user/profile", isAuthorised, updateUserInfo);

//follow and unfollow users
router.put("/user/follow/:userId", isAuthorised, followUser);
router.put("/user/unfollow/:userId", isAuthorised, unFollowUser);
router.get("/user/followers", isAuthorised, getAllFollowers);
router.get("/user/followings", isAuthorised, getAllFollowings);
module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
require("../config/passport");
const {
  signup,
  login,
  logout,
  deleteUser,
  loggedInUserInfo,
  getAllUsers,
  updateUserInfo,
  followUser,
  unFollowUser,
  getAllFollowers,
  getAllFollowings,
  deleteuser,
  resetAccount,
} = require("../controllers/user.controller");
const {
  forgotPassword,
  resetpassword,
} = require("../controllers/resetPassword.controller");
//middleware
const isAuthorised = require("../middlewares/isAuthorised");
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.delete("/delete", isAuthorised, deleteUser);
router.get("/user/me", isAuthorised, loggedInUserInfo);
router.get("/allusers", isAuthorised, getAllUsers);
router.put("/user/profile", isAuthorised, updateUserInfo);

//follow and unfollow users
router.put("/user/follow/:userId", isAuthorised, followUser);
router.put("/user/unfollow/:userId", isAuthorised, unFollowUser);
router.get("/user/followers", isAuthorised, getAllFollowers);
router.get("/user/followings", isAuthorised, getAllFollowings);

// soft delete
router.put("/delete", isAuthorised, deleteuser);
// user reset
router.put("/reset", resetAccount);

//forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetpassword);

//oAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log(req.user);
  const token = jwt.sign(
    {
      email: req.user.email,
      name: req.user.name,
      id: req.user._id,
      role: req.user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  //
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});
module.exports = router;

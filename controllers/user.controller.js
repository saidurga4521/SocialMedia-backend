const User = require("../models/user.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await User.insertOne({
      name: name,
      email: email,
      password: password,
      role: role,
    });
    //generate the token
    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.send({
      data: {
        user: newUser,
        token: token,
      },
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.send({
      data: error.message,
    });
  }
};
//login
const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
module.exports.login = async (req, res) => {
  console.log("the req", req?.user);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password ?? "");
    console.log("isMatch", isMatch);
    if (!user || !isMatch) {
      return res.send({
        data: null,
        success: false,
        message: "Email/password do not match ",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.send({
      data: {
        user,
        token,
      },
      success: true,
      message: "user LoggedIn successfully",
    });
  } catch (error) {
    console.log("the error", error);
    res.send({
      message: error.message,
    });
  }
};

module.exports.loggedInUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req?.user?.id);
    res.status(200).send({
      data: {
        user,
      },
      success: true,
      message: "USER Details fetched successfully !!",
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    sendResponse(res, true, "User details fetched successfully", users);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, false, "user is not found", null, 404);
    }
    user.name = name;
    const updatedUser = await user.save();
    sendResponse(res, true, "name updated successfully", updatedUser);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, false, "user is not found", null, 404);
    }
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { followings: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: req.user.id },
    });
    sendResponse(res, true, "user follow successfully", null);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};

module.exports.unFollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, false, "user is not found", null, 404);
    }
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { followings: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user.id },
    });
    sendResponse(res, true, "user unfollow successfully", null);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};

module.exports.getAllFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "followers",
      "name email"
    );
    sendResponse(res, true, "get all followers successfully", user);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};
module.exports.getAllFollowings = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "followings",
      "name email"
    );
    sendResponse(res, true, "get all followings successfully", user);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

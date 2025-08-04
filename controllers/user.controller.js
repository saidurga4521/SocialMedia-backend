const User = require("../models/user.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({
      name: name,
      email: email,
      password: password,
      role: role,
    });
    const newUser = await user.save();
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
  try {
    const { email, password } = req.body;
    console.log("the password", password, email);
    const user = await User.findOne({ email, isActive: true });
    console.log("the user", user);
    if (!user) {
      return sendResponse(res, false, "user is not found", null, 404);
    }

    const isMatch = await bcrypt.compare(password, user.password ?? "");
    console.log("isMatch", isMatch);
    if (!isMatch) {
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
module.exports.logout = async (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return sendResponse(res, false, "please login", null, 404);
    }
    sendResponse(res, true, "user logout successfully", null);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};
module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return sendResponse(res, false, "user is not found", null, 404);
    }
    sendResponse(res, true, "user is deleted successfully", null);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};
module.exports.loggedInUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, isActive: true });
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
    const users = await User.find({ isActive: true });
    sendResponse(res, true, "User details fetched successfully", users);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const user = await User.findOne({ _id: userId, isActive: true });
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
    const user = await User.findOne({ _id: userId, isActive: true });
    console.log("the user", user);
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
    const user = await User.findOne({ _id: userId, isActive: true });
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
    const user = await User.findOne({ _id: userId, isActive: true }).populate(
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
    const user = await User.findOne({ _id: userId, isActive: true }).populate(
      "followings",
      "name email"
    );
    sendResponse(res, true, "get all followings successfully", user);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

//soft delete
const mongoose = require("mongoose");
module.exports.deleteuser = async (req, res) => {
  try {
    // const userId = new mongoose.Types.ObjectId(req?.user?.id);
    const userId = req?.user?.id;
    const user = await User.findOne({ _id: userId });
    console.log("the user", user);
    user.isActive = false;
    await user.save();
    sendResponse(res, true, "user deleted successfully", null);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.resetAccount = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, false, "email is not valid", null, 404);
    }
    await User.updateOne({ email }, { isActive: true });
    const updatedUser = await User.findOne({ email });
    sendResponse(res, true, "user details reset successfully", updatedUser);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

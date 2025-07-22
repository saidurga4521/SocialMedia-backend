const User = require("../models/user.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
module.exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.insertOne({
      name: name,
      email: email,
      password: password,
    });
    //generate the token
    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        id: newUser._id,
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

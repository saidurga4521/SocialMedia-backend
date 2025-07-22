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
    console.log("the error", error);
    res.send({
      data: error.message,
    });
  }
};

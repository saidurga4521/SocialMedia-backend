const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const isAuthorised = async (req, res, next) => {
  try {
    const bearerToken = req?.headers?.authorization;
    if (!bearerToken) {
      return res.status(500).send({
        data: "user is not loged in",
      });
    }
    const token = bearerToken.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    const user = await User.findOne({ _id: decodedToken?.id, isActive: true });
    if (!user) {
      return res.status(500).send({
        data: "user is not logged in",
      });
    }
    req.user = {
      id: decodedToken?.id,
      email: decodedToken?.email,
      role: user?.role ?? "personal",
    };
    next();
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).send({
      data: error.message,
    });
  }
};
module.exports = isAuthorised;

const { forgotPasswordService } = require("../services/resetPassword.service");
const sendResponse = require("../utils/response");
const passwordReset = require("../models/forgotPassword.model");
const User = require("../models/user.model");
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const message = await forgotPasswordService(email);
    sendResponse(res, true, message, null);
  } catch (error) {
    sendResponse(res, false, error.message, 500);
  }
};
module.exports.resetpassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const resetToken = await passwordReset.findOne({ token });
    if (!resetToken || resetToken.used || resetToken.expiredAt < new Date()) {
      return sendResponse(res, false, "invalid link", null, 404);
    }
    //update the password
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return sendResponse(res, false, "user not found", null, 404);
    }
    user.password = newPassword;
    await user.save();
    resetToken.used = true;
    await resetToken.save();
    sendResponse(res, true, "password is changed", null);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

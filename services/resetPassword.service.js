const User = require("../models/user.model");
const sendResponse = require("../utils/response");
const crypto = require("crypto");
const passwordReset = require("../models/forgotPassword.model");
const dotenv = require("dotenv");
const sendMail = require("../utils/sendMail");
dotenv.config();
module.exports.forgotPasswordService = async (email) => {
  const user = await User.findOne({ email, isActive: true });

  if (!user) {
    return sendResponse(res, false, "user not found", null, 404);
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiredAt = new Date(Date.now() + 1000 * 60 * 15);
  await passwordReset.create({
    userId: user?._id,
    token,
    expiredAt,
  });
  const resetLink = `${process.env.CLIENT_APP_URL}/reset-password?token=${token}`;

  //send Email
  sendMail({
    to: user.email,
    subject: `Password reset link | ${user.name}`,
    html: `<div>
       <p>Here is your below password reset link,note that it will be expired in  15 minutes<p/>
       <a href=${resetLink} target="_blank"
       ><button>Reset Link</button><a/>
    </div>`,
  });
  return {
    message: "if email exists ,the reset link will be sent",
    resetLink,
    token,
  };
};

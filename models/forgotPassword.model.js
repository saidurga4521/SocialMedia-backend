const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passwordResetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});
const passwordReset = model("passwordReset", passwordResetSchema);
module.exports = passwordReset;

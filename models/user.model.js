const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name should be required"],
    },
    email: {
      type: String,
      required: [true, "email should be required"],
      unique: [true, "email should be unique"],
    },
    password: {
      type: String,
      required: [true, "password should be required"],
    },
    role: {
      type: String,
      enum: ["personal", "creator"],
      default: "personal",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//hashing the password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(15);
  console.log("password", this.password);
  const hashedPasword = await bcrypt.hash(this.password, salt);
  this.password = hashedPasword;
  next();
});
const User = model("User", userSchema);
module.exports = User;

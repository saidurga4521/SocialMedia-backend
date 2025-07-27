const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "caption is required"],
    },
    image: String,
    imageId: String,
    gallery: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: { type: Number, default: 0 },
    isScheduled: {
      type: Object,
      default: false,
    },
    scheduleTime: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Post = model("Post", postSchema);
module.exports = Post;

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    required: [true, "comment is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});
const Comment = model("Comment", commentSchema);
module.exports = Comment;

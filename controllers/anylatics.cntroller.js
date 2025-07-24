const sendResponse = require("../utils/response");
const mongoose = require("mongoose");
const Post = require("../models/post.model");
module.exports.getPostByDate = async (req, res) => {
  try {
    const postStats = await Post.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    sendResponse(res, true, "Post Stats fetched Successfully!", postStats);
  } catch (error) {
    sendResponse(res, false, error?.message, null);
  }
};

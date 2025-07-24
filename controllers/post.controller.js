//upload the post
const cloudinary = require("../config/cloudinary");

//post management
const sendResponse = require("../utils/response");
const Post = require("../models/post.model");
//for stats
const Comment = require("../models/comment.model");
module.exports.uploadToDiskStorage = async (req, res) => {
  res.status(200).send({
    file: req.file,
  });
};

module.exports.multipleUploadToDiskStorage = async (req, res) => {
  res.status(200).send({
    files: req.files,
  });
};

module.exports.uploadToCloudinary = async (req, res) => {
  try {
    const uploadedDetails = await cloudinary.uploader.upload(req.file.path);
    const { secure_url: image, public_id: imageId } = uploadedDetails;
    res.status(200).send({
      data: {
        image,
        imageId,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports.multipleUploadToCloudinary = async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path)
    );
    const results = await Promise.all(uploadPromises);
    const finalResults = results.map(({ secure_url, public_id }) => ({
      image: secure_url,
      imageId: public_id,
    }));
    res.status(200).send({ data: finalResults });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// creating post
module.exports.createPost = async (req, res) => {
  try {
    const { text, image, imageId } = req.body;
    const newPost = new Post({
      text,
      image,
      imageId,
      user: req.user.id,
    });
    const savedPost = await newPost.save();
    sendResponse(res, true, "post create successfully", savedPost);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.editPost = async (req, res) => {
  try {
    const { text, image, imageId } = req.body;
    const { id } = req.params;
    if (!text) {
      return sendResponse(res, false, "caption is required", null);
    }
    const foundPost = await Post.findById(id);
    if (!foundPost) {
      return sendResponse(res, false, "Post not found", null);
    }
    //now check whether the post is releated to logged in user or not
    if (foundPost.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        false,
        "User is not authorized to modify this post",
        null
      );
    }
    if (text) {
      foundPost.text = text;
    }
    if (image) {
      foundPost.image = image;
    }
    if (imageId) {
      foundPost.imageId = imageId;
    }
    const savedPost = await foundPost.save();

    sendResponse(res, true, "Post Edited Successfully!", savedPost);
  } catch (error) {
    sendResponse(res, false, error?.message, null);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, false, "No Post not found", null);
    }
    if (post.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        false,
        "User is not authorized to modify this post",
        null
      );
    }
    //delete the image form cloudinary
    await cloudinary.uploader.destroy(post.imageId);
    await Post.deleteOne({ _id: postId });
    await Comment.deleteMany({ post: postId });
    sendResponse(res, true, "Post Deleted Successfully!", null);
  } catch (error) {
    sendResponse(res, false, error?.message, null);
  }
};

module.exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, false, "Post Id is a required", null);
    }
    const post = await Post.findById(id);
    if (!post) {
      return sendResponse(res, false, "No Post not found", null);
    }
    if (post.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        false,
        "User is not authorized to view this post",
        null
      );
    }
    sendResponse(res, true, "Post Fetched Successfully!", post);
  } catch (error) {
    sendResponse(res, false, error?.message, null);
  }
};
module.exports.getMyPosts = async (req, res) => {
  try {
    const foundPosts = await Post.find({ user: req.user.id });
    if (!foundPosts) {
      return sendResponse(res, false, "No Post not found", null);
    }
    sendResponse(res, true, "posts fetched successfully", foundPosts);
  } catch (error) {
    return sendResponse(res, false, error.message, null);
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const foundPosts = await Post.find();
    if (!foundPosts) {
      return sendResponse(res, false, "No Post found", null);
    }
    sendResponse(res, true, " all posts fetched successfully", foundPosts);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};

module.exports.likePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }
    if (post.likes.includes(req.user.id)) {
      return sendResponse(res, false, "User already liked the post", null);
    }
    post.likes.push(req.user.id);
    post.likesCount = post.likes.length;
    const updatedRecord = await post.save();
    sendResponse(res, true, "Post Liked Successfully!", updatedRecord);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};
module.exports.disLikePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }
    if (!post.likes.includes(req.user.id)) {
      return sendResponse(res, false, "User not likes yet", null);
    }
    post.likes = post.likes.filter((p) => p.toString() !== req.user.id);
    post.likesCount = post.likes.length;
    const updatedRecord = await post.save();
    sendResponse(res, true, "Post Disliked Successfully!", updatedRecord);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};

//post stats
module.exports.postStatsById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, false, "No Post found", null);
    }
    const totalComments = await Comment.countDocuments({ post: postId });
    const stats = {
      likesCount: post.likesCount,
      isLikedByMe: post.likes.includes(req.user.id),
      commentsCount: totalComments,
    };
    sendResponse(res, true, "Stats fetched successfully", stats);
  } catch (error) {
    sendResponse(res, false, error?.message, null);
  }
};

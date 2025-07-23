//upload the post
const cloudinary = require("../config/cloudinary");

//post management
const sendResponse = require("../utils/response");
const Post = require("../models/post.model");
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
    const { id } = req.params;
    const post = await Post.findById(id);
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
    await Post.deleteOne({ _id: id });
    sendResponse(res, true, "Post Deleted Successfully!", null);
  } catch (error) {
    sendResponse(res, false, error?.message, null);
  }
};

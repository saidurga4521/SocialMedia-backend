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

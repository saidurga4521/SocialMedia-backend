const cloudinary = require("../config/cloudinary");
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

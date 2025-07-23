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

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

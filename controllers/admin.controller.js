const os = require("os");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const sendResponse = require("../utils/response");
module.exports.SystemHealthInfo = async (req, res) => {
  try {
    const SystemInfo = {
      platform: os.platform(),
      freemem: os.freemem(),
      cpus: os.cpus().length,
    };
    sendResponse(res, true, "success", SystemInfo);
  } catch (error) {
    sendResponse(res, false, error.message, null);
  }
};
module.exports.exportUser = async (req, res) => {
  try {
    const user = await User.find().lean();
    const uploadDir = path.join(__dirname, "../Users");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    //creating file
    const filePath = path.join(uploadDir, "users.json");
    fs.writeFileSync(filePath, JSON.stringify(user, null, 2));
    res.download(filePath);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};
module.exports.streamData = async (req, res) => {
  try {
    const user = await User.find().lean();
    const userStream = stream.Readable.from(JSON.stringify(user, null, 2));
    userStream.pipe(res);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
};

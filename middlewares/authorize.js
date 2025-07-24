const sendResponse = require("../utils/response");
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendResponse(res, false, "access denied", null, 404);
  }
  next();
};
module.exports = authorize;

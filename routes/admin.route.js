const {
  SystemHealthInfo,
  exportUser,
  streamData,
} = require("../controllers/admin.controller");
const express = require("express");
const router = express.Router();
const isAuthorised = require("../middlewares/isAuthorised");
router.get("/getSystemHealth", isAuthorised, SystemHealthInfo);
router.get("/exportUser", isAuthorised, exportUser);
router.get("/streamData", isAuthorised, streamData);
module.exports = router;

const {
  SystemHealthInfo,
  exportUser,
} = require("../controllers/admin.controller");
const express = require("express");
const router = express.Router();
const isAuthorised = require("../middlewares/isAuthorised");
router.get("/getSystemHealth", isAuthorised, SystemHealthInfo);
router.get("/exportUser", isAuthorised, exportUser);
module.exports = router;

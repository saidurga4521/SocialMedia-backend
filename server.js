const express = require("express");
require("./config/mongoose");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server is running",
  });
});
app.listen(9999, () => {
  console.log("server is running on port 9999");
});

const express = require("express");
require("./config/mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use("/api", require("./routes"));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server is running",
  });
});
app.listen(9999, () => {
  console.log("server is running on port 9999");
});

const express = require("express");
require("./config/mongoose");
const cors = require("cors");
const passport = require("passport");
const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = ["http://localhost:5173"];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/api", require("./routes"));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server is running",
  });
});
app.listen(9999, () => {
  console.log("server is running on port 9999");
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("error", () => console.log("Error Ocured"));
db.once("open", () => console.log("Connection Established Successfully !!"));
module.exports = db;

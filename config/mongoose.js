const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
console.log("the mongouri", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
console.log(db);
db.on("error", () => console.log("Error Ocured"));
db.once("open", () => console.log("Connection Established Successfully !!"));
module.exports = db;

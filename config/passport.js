const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
dotenv.config();

const StrategyOptions = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecretKey: process.env.GOOGLE_SECRET_KEY,
  clientURL: process.env.GOOGLE_CALLBACK_URL,
};

const verifyCallBack = (accessToken, refreshToken, profile, done) => {
  try {
    console.log(error);
  } catch (error) {}
};
passport.use(new GoogleStrategy(StrategyOptions, verifyCallBack));

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
dotenv.config();

const StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const verifyCallBack = (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile);
  } catch (error) {
    console.log(error);
  }
};
passport.use(new GoogleStrategy(StrategyOptions, verifyCallBack));

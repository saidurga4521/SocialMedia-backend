const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const dotenv = require("dotenv");
dotenv.config();

const StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const verifyCallBack = async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile);
    const salt = await bcrypt.genSalt(10);
    const randomPassword = crypto.randomBytes(20).toString("hex");
    const hashedpassword = await bcrypt.hash(randomPassword, salt);
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: hashedpassword,
      });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
    console.log(error);
  }
};
passport.use(new GoogleStrategy(StrategyOptions, verifyCallBack));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

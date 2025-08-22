const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user.js'); 
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://peerlink.up.railway.app/auth/google/callback'

  },
  async (profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          isVerified: true
        });
      }
      return done(null, user);
    } catch (error) {
        console.log('erorrr::', error)
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

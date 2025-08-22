// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20');
// const User = require('../models/user.js'); 
// const dotenv = require('dotenv');
// dotenv.config();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: 'http://localhost:3000/auth/google/callback'

//   },
//   async (profile, done) => {
//     try {
//       let user = await User.findOne({ googleId: profile.id });
//       if (!user) {
//         user = await User.create({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//           googleId: profile.id,
//           isVerified: true
//         });
//       }
//       return done(null, user);
//     } catch (error) {
//         console.log('erorrr::', error)
//       return done(error, null);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });




// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user.js');
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // CORRECT callback URL for peerlink (not mindmap)
    callbackURL: 'https://peerlink.up.railway.app/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Strategy - Profile ID:', profile.id);
        
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            // Check if user exists with same email
            const existingUser = await User.findOne({ email: profile.emails[0].value });
            
            if (existingUser) {
                // Link Google account to existing user
                existingUser.googleId = profile.id;
                existingUser.isVerified = true;
                await existingUser.save();
                console.log('Linked Google to existing user:', existingUser._id);
                return done(null, existingUser);
            }
            
            // Create new user
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                isVerified: true
            });
            console.log('Created new user:', user._id);
        }
        
        return done(null, user);
    } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        console.log('Deserializing user:', user ? user._id : 'not found');
        done(null, user);
    } catch (error) {
        console.error('Deserialize error:', error);
        done(error, null);
    }
});
// const express = require('express');
// const router = express.Router();

// const passport = require('passport');
// const jwt = require('jsonwebtoken');

// const { registerUser, loginUser, verifyToken, verifyEmail, resendVerificationEmail } = require('../controllers/auth-controller');

// router.post('/register', registerUser); 
// router.post('/login', loginUser);
// router.get('/verifyToken', verifyToken);
// router.get('/verifyEmail', verifyEmail);
// router.post('/resendVerification', resendVerificationEmail)





// router.get('/auth/google', passport.authenticate('google', {
//   scope: ['profile', 'email'],
//   prompt: 'select_account' 
// }));



// router.get('/auth/google/callback', passport.authenticate('google', {
//   failureRedirect: '/authPage',
//   session: false
// }), (req, res) => {

//     console.log('userrrr:::', req.user)
//   // Generate JWT token
//   const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
//     expiresIn: '1h'
//   });

  
//   res.redirect(`http://localhost:5173/google-success?token=${token}`);
// });


// module.exports = router;




// routes/auth-routes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { registerUser, loginUser, verifyToken, verifyEmail, resendVerificationEmail } = require('../controllers/auth-controller');

// Regular auth routes
router.post('/register', registerUser); 
router.post('/login', loginUser);
router.get('/verifyToken', verifyToken);
router.get('/verifyEmail', verifyEmail);
router.post('/resendVerification', resendVerificationEmail);

// Google OAuth routes with CORRECT URLs for peerlink
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' 
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'https://peerlink-phi.vercel.app/auth?error=google_auth_failed',
    session: false
}), (req, res) => {
    try {
        console.log('Google callback user:', req.user);
        
        if (!req.user) {
            return res.redirect('https://peerlink-phi.vercel.app/auth?error=no_user');
        }

        // Generate JWT token
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        // Redirect to PEERLINK frontend (not mindmap)
        res.redirect(`https://peerlink-phi.vercel.app/google-success?token=${token}`);
        
    } catch (error) {
        console.error('Callback error:', error);
        res.redirect('https://peerlink-phi.vercel.app/auth?error=callback_failed');
    }
});

module.exports = router;
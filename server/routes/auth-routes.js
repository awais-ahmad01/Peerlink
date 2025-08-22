const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const { registerUser, loginUser, verifyToken, verifyEmail, resendVerificationEmail } = require('../controllers/auth-controller');

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.get('/verifyToken', verifyToken);
router.get('/verifyEmail', verifyEmail);
router.post('/resendVerification', resendVerificationEmail)





router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account' 
}));



router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth',
  session: false
}), (req, res) => {

    console.log('userrrr:::', req.user)
  // Generate JWT token
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  
  res.redirect(`https://peerlink-phi.vercel.app/google-success?token=${token}`);
});


module.exports = router;
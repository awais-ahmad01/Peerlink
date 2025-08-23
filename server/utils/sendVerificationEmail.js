const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);



const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `https://peerlink-phi.vercel.app/verify-email?token=${token}&email=${email}`;
  console.log('email verification sending...')
  await transporter.sendMail({
    from: '"Peerlink" <aahmad19376@gmail.com>',
    to: email,
    subject: 'Verify Your Email',
    html: `<h3>Click to verify your email:</h3><a href="${verificationLink}">${verificationLink}</a>`,
  });

   console.log('email verification sended...')
};

module.exports = sendVerificationEmail; 

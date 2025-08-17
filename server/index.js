const app = require('express')();

const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');
const passport = require('passport');
require('./config/passport');



const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth-routes');




mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use(cors({
    origin: 'http://localhost:5173',
    // origin: 'https://mind-map-puce-mu.vercel.app',
    methods: 'GET,POST', 
}));
app.use(bodyParser.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(authRoute)




app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running on port ', process.env.PORT);
});
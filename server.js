import './config/db.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import UserRouter from './api/user.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import User from './models/user.js';
import twilio from 'twilio';

const accountSid = 'AC5640f6769e92e5adc8107d9d1c9ff1fc';
const authToken = '76aead2e31533334f000bc3226ad2bd3';
const client = twilio(accountSid, authToken);



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use express-session middleware
app.use(session({
  secret: 'Varalakshmi@25072003', // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware for user information
app.use((req, res, next) => {
  console.log('Session User:', req.session.user);
  res.locals.currentUser = req.session.user ? req.session.user.name : null;
  res.locals.username = res.locals.currentUser;
  next();
});
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use('/user', UserRouter);

// Static file serving

// Define your routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/donor', (req, res) => {
  res.sendFile(__dirname + '/public/donor.html');
});

app.get('/recipient', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/search', (req, res) => {
  res.sendFile(__dirname + '/public/search.html');
});

app.get('/profile', async (req, res) => {
  try {
      const user = await User.findOne({ email: req.session.user.email });

      if (user) {
          res.render('profile', { user });
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching user details.' });
  }
});

app.get('/profile1', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.user.email });

    if (user) {
      res.render('profile1', {
        username: user.name,
        bloodGroup: user.bloodGroup,
        email: user.email,
        phone: user.phone,
        age: user.age,
        address: user.address,
        district: user.district,
        state: user.state,
        country: user.country,
        pincode: user.pincode
      });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user details.' });
  }
});

app.get('/logout', (req, res) => {
  // Destroy the session and redirect to the index page
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});


app.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
          return res.send('Invalid or expired reset token.');
      }

      // Render your reset password HTML page
      res.sendFile(__dirname + '/public/reset-password.html');
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while processing the password reset page request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
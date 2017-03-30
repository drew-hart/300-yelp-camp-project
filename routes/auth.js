const express = require('express');
const logger = require('morgan');

const passport = require('passport');

const router = express.Router();

// models
const User = require('../models/user');

// functions
router.use(logger('combined'));

// Default route
router.get('/', (req, res) => {
  res.render('landing');
});

// --------------
// Routes
// --------------

// REGISTER route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  const password = req.body.password;

  User.register(newUser, password, (err) => {
    if (err) {
      console.log(`error: $${err}`);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/campgrounds');
      });
    }
  });
});

// LOGIN route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}));

// LOGOUT route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;

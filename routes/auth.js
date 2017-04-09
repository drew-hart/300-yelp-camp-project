const express = require('express');
const middleware = require('../middleware');

const passport = require('passport');

const router = express.Router({ mergeParams: true });

// models
const User = require('../models/user');

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
      req.flash('error', err.message);
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
router.get('/logout', middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.flash('success', 'You have been successfully logged out.');
  res.redirect('/campgrounds');
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const seedDB = require('./seeds');

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

// models
const User = require('./models/user');

// ----------------
// Config
// ----------------

// app init
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// db init
mongoose.connect('mongodb://localhost/yelp_camp', (err) => {
  if (err) {
    console.log('Could not connect to mongodb on localhost.');
  }
});

// auth init
app.use(session({
  secret: 'the quick brown fox jumped over the lazy dogs',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy
passport.serializeUser(User.serializeUser()); // use static serialize of model for passport session support
passport.deserializeUser(User.deserializeUser()); // use static deserialize of model for passport session support
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// route init
app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// seed db
seedDB();

// start app
app.listen(8080, () => {
  console.log('Yelp Camp app started ..');
});

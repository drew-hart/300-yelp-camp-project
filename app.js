const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const seedDB = require('./seeds');

// Models
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

// Config
const app = express();
mongoose.connect('mongodb://localhost/yelp_camp', (err) => {
  if (err) {
    console.log('Could not connect to mongodb on localhost.');
  }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
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

seedDB();

// Route for root path
app.get('/', (req, res) => {
  res.render('landing');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  return false;
}

// INDEX Route
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(`error: ${err}`);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// NEW Route
app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new.ejs');
});

// CREATE Route
app.post('/campgrounds', isLoggedIn, (req, res) => {
  const campgroundFromForm = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
  };

  // create a new record in the Campground object defined through MongooseJS
  Campground.create({ campgroundFromForm }, (err) => {
    if (err) {
      console.log(`err ${err}`);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// SHOW Route
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
    if (err) {
      console.log(`err: ${err}`);
    } else {
      res.render('campgrounds/show', { campground });
    }
  });
});

// ==============================
// COMMENTS ROUTES
// ==============================

// NEW Route
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// CREATE Route
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  const commentFromForm = req.body.comment;

  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment and push it into the campground
      Comment.create(commentFromForm, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground.id}`);
        }
      });
      // connect new comment to campground
      // redirect to campground show page
    }
  });
});

// =======================
// Auth routes
// =======================

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  const password = req.body.password;

  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(`error: $${err}`);
      return res.redirect('/register');
    }
    console.log(`user registered: ${user}`);
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}));

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

app.listen(8080, () => {
  console.log('Yelp Camp app started ..');
});

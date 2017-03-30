const express = require('express');
const logger = require('morgan');

const router = express.Router();

// models
const Campground = require('../models/campground');

// functions
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  return false;
}

router.use(logger('combined'));

// --------------
// Routes
// --------------

// INDEX Route
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(`error: ${err}`);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// NEW Route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new.ejs');
});

// CREATE Route
router.post('/', isLoggedIn, (req, res) => {
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
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
    if (err) {
      console.log(`err: ${err}`);
    } else {
      res.render('campgrounds/show', { campground });
    }
  });
});

module.exports = router;

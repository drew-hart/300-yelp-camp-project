const express = require('express');
const middleware = require('../middleware');

const router = express.Router({ mergeParams: true });

// models
const Campground = require('../models/campground');

// --------------
// Routes
// --------------

// INDEX Route
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`An error occured: ${err}`);
    }
    return res.render('campgrounds/index', { campgrounds });
  });
});

// NEW Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new.ejs');
});

// CREATE Route
router.post('/', middleware.isLoggedIn, (req, res) => {
  // create object with campground form and meta data
  const campgroundFromForm = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: {
      id: req.user.id,
      username: req.user.username,
    },
  };
  // create a new record in the Campground object defined through MongooseJS
  Campground.create(campgroundFromForm, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.redirect('/campgrounds');
  });
});

// SHOW Route
router.get('/:id', (req, res) => {
  // .populate links Comments to Campgrounds so we can see them on the show page
  Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.render('campgrounds/show', { campground });
  });
});

// EDIT Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.render('campgrounds/edit', { campground });
  });
});

// UPDATE Route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.redirect(`/campgrounds/${req.params.id}/`);
  });
});

// DESTROY Route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.redirect('/campgrounds');
  });
});

module.exports = router;

const express = require('express');
const logger = require('morgan');

const router = express.Router({ mergeParams: true });

// models
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// functions
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  return false;
}

// Middleware for logging
// router.use(logger('combined'));

// --------------
// Routes
// --------------

// NEW Route
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// CREATE Route
router.post('/', isLoggedIn, (req, res) => {
  // create object with comment form and meta data
  const commentFromForm = {
    text: req.body.comment.text,
    author: {
      id: req.user.id,
      username: req.user.username,
    },
  };
  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment and push it into the campground
      Comment.create(commentFromForm, (err, comment) => {
        if (err) { return console.log(err); }
        comment.save();
        campground.comments.push(comment);
        campground.save();
        res.redirect(`/campgrounds/${campground.id}`);
        return false;
      });
    }
  });
});

module.exports = router;

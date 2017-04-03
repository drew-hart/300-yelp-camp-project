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
  const commentFromForm = req.body.comment;
  const authorUsername = req.user.username;
  const authorId = req.user._id;

  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment and push it into the campground
      Comment.create(commentFromForm, (err, comment) => {
        if (err) { return console.log(err); }
        const thisComment = comment;

        thisComment.author.username = authorUsername;
        thisComment.author.id = authorId;
        thisComment.save();
        campground.comments.push(thisComment);
        campground.save();
        console.log(comment);
        res.redirect(`/campgrounds/${campground.id}`);
        return false;
      });
      // connect new comment to campground
      // redirect to campground show page
    }
  });
});

module.exports = router;

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

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        console.log(`error: ${err}`);
        return res.redirect('back');
      }

      if (comment.author.id.equals(req.user.comment_id)) {
        next();
      } else {
        console.log('You do not have permission to edit this campground');
        return res.redirect('back');
      }
    });
  } else {
    console.log('You are not logged in');
    return res.redirect('back');
  }
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

// EDIT Route
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        console.log(`error: ${err}`);
        return res.send(`error: ${err}`);
      }
      return res.render('comments/edit', { campground, comment });
    });
    return false;
  });
});

// UPDATE Route
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  const commentData = {
    text: req.body.comment.text,
  };

  Comment.findByIdAndUpdate(req.params.comment_id, commentData, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});

// DELETE Route
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});
module.exports = router;

const express = require('express');
const middleware = require('../middleware');

const router = express.Router({ mergeParams: true });

// models
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// --------------
// Routes
// --------------

// NEW Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// CREATE Route
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
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
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
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
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      return res.send(`error: ${err}`);
    }
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});
module.exports = router;

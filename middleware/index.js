// models
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  return false;
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        console.log(`error: ${err}`);
        return res.redirect('back');
      }

      if (comment.author.id.equals(req.user.id)) {
        next();
      } else {
        console.log('You do not have permission to edit this comment');
        return res.redirect('back');
      }
      return false;
    });
  } else {
    console.log('You are not logged in');
    return res.redirect('back');
  }
  return false;
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(`error: ${err}`);
        return res.redirect('back');
      }

      if (campground.author.id.equals(req.user.id)) {
        next();
      } else {
        console.log('You do not have permission to edit this campground');
        return res.redirect('back');
      }
      return false;
    });
  } else {
    console.log('You are not logged in');
    return res.redirect('back');
  }
  return false;
};

module.exports = middlewareObj;

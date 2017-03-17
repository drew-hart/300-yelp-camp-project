const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const path = require('path');

const app = express();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

seedDB();

// Route for root path
app.get('/', (req, res) => {
  res.render('landing');
});

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
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new.ejs');
});

// CREATE Route
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// CREATE Route
app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(8080, () => {
  console.log('Yelp Camp app started ..');
});

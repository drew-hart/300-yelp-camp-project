const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Schema Setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', (req, res) => {
  res.render('landing');
});

// Campgrounds display
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(`error: ${err}`);
    } else {
      res.render('campgrounds', { campgrounds });
    }
  });
});

// Create a form and post to the /campgrounds post route (below)
app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

// When we hit the post route, create a new campground, then redirect to display
app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  // create a new campground record in the Campground object
  Campground.create({ name, image }, (err) => {
    if (err) {
      console.log(`err ${err}`);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.listen(8080, () => {
  console.log('Yelp Camp app started ..');
});

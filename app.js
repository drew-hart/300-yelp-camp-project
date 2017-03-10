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
  description: String,
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
      res.render('index', { campgrounds });
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
  const description = req.body.description;

  // create a new campground record in the Campground object
  Campground.create({ name, image, description }, (err) => {
    if (err) {
      console.log(`err ${err}`);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(`err: ${err}`);
    } else {
      res.render('show', { campground });
    }
  });
});

app.listen(8080, () => {
  console.log('Yelp Camp app started ..');
});

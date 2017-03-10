const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const campgrounds = [
  { name: 'Salmon Creek', image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg' },
  { name: 'Granite Hill', image: 'https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg' },
  { name: 'Blue Lake', image: 'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg' },
];

app.get('/', (req, res) => {
  res.render('landing');
});

// Campgrounds display
app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

// Create a form and post to the /campgrounds post route (below)
app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

// When we hit the post route, create a new campground, then redirect to display
app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = { name, image }; // using object notation shorthand
  campgrounds.push(newCampground);

  res.redirect('/campgrounds');
});

app.listen(8080, () => {
  console.log('Yelp Camp app started ..');
});

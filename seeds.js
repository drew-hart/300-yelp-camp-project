// create campgrounds and comments
const Campground = require('./models/campground');
const Comment = require('./models/comment');

// Seed data
const data = [
  {
    name: 'Cloud\'s Rest',
    image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg',
    description: 'Adipisicing Lorem ipsum incididunt tempor id proident aute irure excepteur nostrud eiusmod tempor aliqua est. Non anim reprehenderit exercitation esse et exercitation velit. Et fugiat consequat ut tempor elit incididunt fugiat laboris aliquip tempor. Officia anim veniam mollit do irure in veniam id mollit labore velit consectetur id consectetur ipsum consequat.',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg',
    description: 'Adipisicing Lorem ipsum incididunt tempor id proident aute irure excepteur nostrud eiusmod tempor aliqua est. Non anim reprehenderit exercitation esse et exercitation velit. Et fugiat consequat ut tempor elit incididunt fugiat laboris aliquip tempor. Officia anim veniam mollit do irure in veniam id mollit labore velit consectetur id consectetur ipsum consequat.',
  },
  {
    name: 'Canyon Floor',
    image: 'http://www.photosforclass.com/download/31733208',
    description: 'Adipisicing Lorem ipsum incididunt tempor id proident aute irure excepteur nostrud eiusmod tempor aliqua est. Non anim reprehenderit exercitation esse et exercitation velit. Et fugiat consequat ut tempor elit incididunt fugiat laboris aliquip tempor. Officia anim veniam mollit do irure in veniam id mollit labore velit consectetur id consectetur ipsum consequat.',
  },
];

function seedDB() {
  // Remove all data from the model
  Campground.remove({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('removed campground data...');
      data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`added campground: ${seed.name}`);
            Comment.create({
              text: 'Commodo amet nulla in laborum occaecat ullamco veniam duis veniam officia ipsum id incididunt occaecat minim.',
              author: 'Homer',
            }, (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log(`added comment by author ${comment.author}`);
              }
            });
          }
        });
      });
    }
  });

  // Add campground seed data
}

module.exports = seedDB;

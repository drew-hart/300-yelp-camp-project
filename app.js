const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String,
});

const Cat = mongoose.model('Cat', catSchema);

// const george = new Cat({
//   name: 'Mrs. Norris',
//   age: 11,
//   temperament: 'Evil',
// });
//
// george.save((err, cat) => {
//   if (err) {
//     console.log('Somethign went wrong..');
//   } else {
//     console.log('Record saved to database..');
//     console.log(cat);
//   }
// });

Cat.create({
  name: 'Drew',
  age: 15,
  temperament: 'Bland',
}, (err, cat) => {
  if (err) {
    console.log(`err ${err}`);
  } else {
    console.log(`create: ${cat}`);
  }
});

Cat.find({}, (err, cats) => {
  if (err) {
    console.log(`err: ${err}`);
  } else {
    console.log(`find: ${cats}`);
  }
});

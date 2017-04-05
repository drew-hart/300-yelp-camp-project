const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
});
commentSchema.plugin(timestamps);

module.exports = mongoose.model('Comment', commentSchema);

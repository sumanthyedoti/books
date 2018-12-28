const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Books', { useNewUrlParser: true }).then(() => {
  console.log('Connected to db');
});

module.exports = { mongoose };

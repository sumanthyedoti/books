const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

function connectToDB() {
  mongoose.connect('mongodb://localhost:27017/Books', { useNewUrlParser: true }).then(() => {
    console.log('Connected to db');
  });
}

module.exports = { connectToDB };

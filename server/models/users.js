const mongoose = require('mongoose');

const { Schema } = mongoose;
// const { ObjectId } = Schema;

const UsersSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    trim: true,
  },
  wantToRead: {
    type: [{
      type: String,
      trim: true,
      unique: true,
    }],
  },
  reading: {
    type: [{
      type: String,
      trim: true,
      unique: true,
    }],
  },
  read: {
    type: [{
      type: String,
      trim: true,
      unique: true,
    }],
  },
});
const Users = mongoose.model('users', UsersSchema);

module.exports = { Users };

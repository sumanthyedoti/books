const mongoose = require('mongoose');

const { Schema } = mongoose;
// const { ObjectId } = Schema;

const UsersSchema = new Schema({
  userName: {
    type: String,
    required: [true, 'Username required!'],
    unique: true,
    minlength: 2,
    trim: true,
    validate: {
      validator(username) {
        return /^[a-z][a-z0-9_]+$/.test(username);
      },
      message: 'Username is not valid. Should start with an alphabet. Use only a-z, _, 0-9!',
    },
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
    validate: {
      validator(name) {
        return /^[a-zA-Z][a-zA-Z\s]+$/.test(name);
      },
      message: 'Name is not valid. Should not contain any special characters. Use only A-Z, a-z, [space]',
    },
  },
  email: {
    type: String,
    required: [true, 'Email required!'],
    unique: true,
    minlength: 6,
    trim: true,
    validate: {
      validator(email) {
        return /\S+@\S+\.\S+/.test(email);
      },
      message: 'Please use valid Email!',
    },
  },
  wantToRead: {
    type: [{
      type: String,
      trim: true,
    }],
  },
  reading: {
    type: [{
      type: String,
      trim: true,
    }],
  },
  read: {
    type: [{
      type: String,
      trim: true,
    }],
  },
});
const Users = mongoose.model('users', UsersSchema);

module.exports = { Users };

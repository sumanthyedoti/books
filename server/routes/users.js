const express = require('express');
const { Users } = require('../models/users');

const router = express.Router();

function getUser(userName) {
  return new Promise((resolve, reject) => {
    Users.findOne({ userName }).then((user) => {
      if (!user) {
        reject(new Error('No such User found!'));
      }
      resolve(user);
    }).catch((err) => {
      reject(new Error(err));
    });
  });
}

router.post('/', (req, res) => {
  const { userName } = req.body;
  const { name } = req.body;
  const { email } = req.body;
  if (userName === undefined || name === undefined || email === undefined) {
    res.status(400).json({
      errorMessage: 'Invalid Request',
    });
    return;
  }
  const user = new Users({
    userName,
    name,
    email,
  });
  user.save().then((book) => {
    res.json({
      message: 'User added',
    });
    return book;
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:userName', async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await getUser(userName);
    res.json(user);
  } catch (err) {
    res.status(404).json({
      errorMessage: 'No such User found!',
    });
  }
});

module.exports = {
  router,
  getUser,
};

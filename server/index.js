const express = require('express');
const bodyParser = require('body-parser');
require('./db');
const { Users } = require('./models/users');
const books = require('./routes/books');
const users = require('./routes/users').router;
const list = require('./routes/list');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use('/books', books);
app.use('/user', users);
app.use('/list', list);

function getUserInfo(userName) {
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

app.post('/register', (req, res) => {
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
  user.save().then((user) => {
    res.json({
      message: 'User added',
    });
    return user;
  }).catch((err) => {
    res.status(400).send({
      errorMessage: 'Username/email is already taken!',
    });
  });
});

app.get('/login/:userName', async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await getUserInfo(userName);
    res.json(user);
  } catch (err) {
    res.status(404).json({
      errorMessage: 'No such User found!',
    });
  }
});

app.listen(port, () => {
  console.log(`Server connect at port ${port}`);
});

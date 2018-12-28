const express = require('express');
const bodyParser = require('body-parser');
require('./db');
// const { Books } = require('./models/books');
const { Users } = require('./models/users');

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

const userName = 'y_sumanth';
// const user = new Users({
//   userName: 'y_sumanth',
//   name: 'Yedoti Sumanth',
//   email: 'yedoti.sumanth@mountblue.io',
// });
// user.save().then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.log(err);
// });

app.post('/list/want-to-read', (req, res) => {
  const isbn = req.body.wantToRead.trim();
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Users.updateOne({ userName }, { $push: { wantToRead: isbn } }).then(() => {
    res.send(`'${isbn}' is added want-to-read list`);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/list/want-to-read', (req, res) => {
  Users.findOne({ userName }).then((books) => {
    res.json({
      books: books.wantToRead,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/list/want-to-read/:id', (req, res) => {
  const isbn = req.params.id;
  if (!isbn) {
    res.status(400).send('Invalid Request');
    return;
  }
  Users.updateOne({ userName }, { $pull: { wantToRead: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(400).send('There is no such book!');
    }
    return res.send(book);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


app.listen(port, () => {
  console.log(`Server connect at port ${port}`);
});

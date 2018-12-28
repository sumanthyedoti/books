const express = require('express');
const bodyParser = require('body-parser');
require('./db');
const { Books } = require('./models/books');
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

app.get('/books', (req, res) => {
  Books.find().then((books) => {
    res.json({
      books,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/books/:id', (req, res) => {
  const isbn = req.params.id;
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Books.find({ isbn }).then((book) => {
    if (book.length === 0) {
      res.send('0 results');
      return;
    }
    res.json({
      book,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.post('/list/want-to-read', (req, res) => {
  if (req.body.wantToRead === undefined) {
    res.status(400).send('Invalid Key. Use \'wantToRead\'');
  }
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
      wantToRead: books.wantToRead,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/list/want-to-read/:id', (req, res) => {
  const isbn = req.params.id;
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Users.updateOne({ userName }, { $pull: { wantToRead: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(400).send('There is no such book in want-to-read list!');
    }
    res.send('book deleted from want-to-read list');
    return book;
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.post('/list/reading', (req, res) => {
  if (!req.body.reading === undefined) {
    res.status(400).send('Invalid Key. Use \'reading\'');
  }
  const isbn = req.body.reading.trim();
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!req.body.reading) {
    res.status(400).send('Invalid Request');
  }
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Users.updateOne({ userName }, { $push: { reading: isbn } }).then(() => {
    res.send(`'${isbn}' is added reading list`);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/list/reading', (req, res) => {
  Users.findOne({ userName }).then((books) => {
    res.json({
      reading: books.reading,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/list/reading/:id', (req, res) => {
  const isbn = req.params.id;
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Users.updateOne({ userName }, { $pull: { reading: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(400).send('There is no such book in reading list!');
    }
    res.send('book deleted from reading list');
    return book;
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.post('/list/read', (req, res) => {
  if (!req.body.read === undefined) {
    res.status(400).send('Invalid Key. Use \'read\'');
  }
  const isbn = req.body.read.trim();
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Users.updateOne({ userName }, { $push: { read: isbn } }).then(() => {
    res.send(`'${isbn}' is added read list`);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/list/read', (req, res) => {
  Users.findOne({ userName }).then((books) => {
    res.json({
      read: books.read,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/list/read/:id', (req, res) => {
  const isbn = req.params.id;
  console.log(isbn);
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).send('Invalid Request: ID you sent is not ISBN');
    return;
  }
  Users.updateOne({ userName }, { $pull: { read: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(400).send('There is no such book in read list!');
    }
    res.send('book deleted from read list');
    return book;
  }).catch((err) => {
    res.status(400).send(err);
  });
});


app.listen(port, () => {
  console.log(`Server connect at port ${port}`);
});

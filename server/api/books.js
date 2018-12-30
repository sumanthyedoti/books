const express = require('express');
const bodyParser = require('body-parser');
require('../db');
const { Books } = require('../models/books');

const app = express();
app.use(bodyParser.json());

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


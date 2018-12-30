const express = require('express');
const { Books } = require('../models/books');

const router = express.Router();

router.get('/', (req, res) => {
  Books.find().then((books) => {
    res.json({
      books,
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id', (req, res) => {
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

router.get('/exists/:id', (req, res) => {
  const isbn = req.params.id;
  Books.findOne({ isbn }).then((book) => {
    if (book) {
      res.send(book);
    }else{
      res.send(404).send('Book dosnt exists!');
    }
  }).catch((err) => {
    res.status(404).send(err);
  });
});


module.exports = router;

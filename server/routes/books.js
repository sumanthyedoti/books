const express = require('express');
const { Books } = require('../models/books');

const router = express.Router();

router.get('/', (req, res) => {
  Books.find().then((books) => {
    res.json({
      books,
    });
  }).catch((err) => {
    res.status(500).send(err);
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
      res.status(404).send({
        errorMessage: '0 results',
      });
      return;
    }
    res.json({
      book: book[0],
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});


module.exports = router;

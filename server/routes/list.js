const express = require('express');
const { Users } = require('../models/users');
const { Books } = require('../models/books');

const router = express.Router();

router.use((req, res, next) => {
  const { username } = req.headers;
  Users.findOne({ userName: username }).then((user) => {
    if (!user) {
      res.status(401).send({
        errorMessage: 'User not found!',
      });
      res.end();
    }
    next();
  }).catch((err) => {
    res.status(500).send(err);
    res.end();
  });
});

function getBook(isbn) {
  return new Promise((resolve, reject) => {
    Books.findOne({ isbn }).then((book) => {
      if (!book) {
        reject(new Error('The book does not exists!'));
      }
      resolve(book);
    }).catch((err) => {
      reject(new Error(err));
    });
  });
}

function checkBookInLsit(userName, list, isbn) {
  return new Promise((resolve, reject) => {
    const searchObject = {
      userName,
      [list]: isbn,
    };
    Users.find(searchObject).then((book) => {
      console.log(book.length);
      if (book.length === 0) {
        resolve(0);
      }
      resolve(book[0][list].filter(x => x === isbn).length);
    }).catch((err) => {
      reject(new Error(err));
    });
  });
}

router.post('/want-to-read', async (req, res) => {
  const userName = req.headers.username.trim();
  if (req.body.wantToRead === undefined) {
    res.status(400).json({
      errorMessage: 'Invalid Key. Use \'wantToRead\'',
    });
  }
  const isbn = req.body.wantToRead.trim();
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).json({
      errorMessage: 'Invalid Request: ID you sent is not ISBN',
    });
    return;
  }
  try {
    const book = await getBook(isbn);
    try {
      let dupNumber = 0;
      dupNumber += await checkBookInLsit(userName, 'wantToRead', isbn);
      dupNumber += await checkBookInLsit(userName, 'reading', isbn);
      dupNumber += await checkBookInLsit(userName, 'read', isbn);
      if (dupNumber !== 0) {
        res.status(400).send({
          errorMessage: 'The book already exists in a list',
        });
        res.end();
        return;
      }
    } catch (err) {
      res.status(500).send(err);
      res.end();
      return;
    }
    Users.updateOne({ userName }, { $push: { wantToRead: isbn } })
      .then((data) => {
        res.json({
          book: isbn,
          message: 'The book is added want-to-read list',
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      errorMessage: 'The book does not exists',
    });
  }
});

router.get('/want-to-read', async (req, res) => {
  const userName = req.headers.username.trim();
  Users.findOne({ userName }).then((books) => {
    res.json({
      wantToRead: books.wantToRead,
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.delete('/want-to-read/:id', async (req, res) => {
  const userName = req.headers.username.trim();
  const isbn = req.params.id;
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).json({
      errorMessage: 'Invalid Request: ID you sent is not ISBN',
    });
    return;
  }
  Users.updateOne({ userName }, { $pull: { wantToRead: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(404).json({
        errorMessage: 'There is no such book in want-to-read list!',
      });
    }
    res.json({
      book: isbn,
      message: 'The book is deleted from want-to-read list',
    });
    return book;
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/reading', async (req, res) => {
  const userName = req.headers.username.trim();
  if (!req.body.reading === undefined) {
    res.status(400).json({
      errorMessage: 'Invalid Key. Use \'reading\'',
    });
  }
  const isbn = req.body.reading.trim();
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).json({
      errorMessage: 'Invalid Request: ID you sent is not ISBN',
    });
    return;
  }
  try {
    const book = await getBook(isbn);
    try {
      let dupNumber = 0;
      dupNumber += await checkBookInLsit(userName, 'wantToRead', isbn);
      dupNumber += await checkBookInLsit(userName, 'reading', isbn);
      dupNumber += await checkBookInLsit(userName, 'read', isbn);
      if (dupNumber !== 0) {
        res.status(400).send({
          errorMessage: 'The book already exists in a list',
        });
        res.end();
        return;
      }
    } catch (err) {
      res.status(500).send(err);
      res.end();
      return;
    }
    Users.updateOne({ userName }, { $push: { reading: isbn } })
      .then((data) => {
        res.json({
          book: isbn,
          message: 'The book is added reading list',
        });
      }).catch((err) => {
        res.status(500).send(err);
      });
  } catch (err) {
    res.status(404).json({
      errorMessage: 'The book does not exists',
    });
  }
});

router.get('/reading', async (req, res) => {
  const userName = req.headers.username.trim();
  Users.findOne({ userName }).then((books) => {
    res.json({
      reading: books.reading,
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.delete('/reading/:id', async (req, res) => {
  const userName = req.headers.username.trim();
  const isbn = req.params.id;
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).json({
      errorMessage: 'Invalid Request: ID you sent is not ISBN',
    });
    return;
  }
  Users.updateOne({ userName }, { $pull: { reading: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(404).json({
        errorMessage: 'There is no such book in reading list!',
      });
    }
    res.json({
      book: isbn,
      message: 'The book is deleted from reading list',
    });
    return book;
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/read', async (req, res) => {
  const userName = req.headers.username.trim();
  if (!req.body.read === undefined) {
    res.status(400).json({
      errorMessage: 'Invalid Key. Use \'read\'',
    });
  }
  const isbn = req.body.read.trim();
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).json({
      message: 'Invalid Request: ID you sent is not ISBN',
    });
    return;
  }
  try {
    const book = await getBook(isbn);
    try {
      let dupNumber = 0;
      dupNumber += await checkBookInLsit(userName, 'wantToRead', isbn);
      dupNumber += await checkBookInLsit(userName, 'reading', isbn);
      dupNumber += await checkBookInLsit(userName, 'read', isbn);
      if (dupNumber !== 0) {
        res.status(400).send({
          errorMessage: 'The book already exists in a list',
        });
        res.end();
        return;
      }
    } catch (err) {
      res.status(500).send(err);
      res.end();
      return;
    }
    Users.updateOne({ userName }, { $push: { read: isbn } })
      .then((data) => {
        res.json({
          book: isbn,
          message: 'The book is added read list',
        });
      }).catch((err) => {
        res.status(500).send(err);
      });
  } catch (err) {
    res.status(404).json({
      errorMessage: 'The book does not exists',
    });
  }
});

router.get('/read', async (req, res) => {
  const userName = req.headers.username.trim();
  Users.findOne({ userName }).then((books) => {
    res.json({
      read: books.read,
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.delete('/read/:id', async (req, res) => {
  const userName = req.headers.username.trim();
  const isbn = req.params.id;
  const isIsbn = (/^\d+$/.test(isbn)) && (isbn.length === 13);
  if (!isIsbn) {
    res.status(400).json({
      errorMessage: 'Invalid Request: ID you sent is not ISBN',
    });
    return;
  }
  Users.updateOne({ userName }, { $pull: { read: isbn } }).then((book) => {
    if (book.nModified === 0) {
      return res.status(404).json({
        errorMessage: 'There is no such book in read list!',
      });
    }
    res.json({
      book: isbn,
      message: 'The book is deleted from read list',
    });
    return book;
  }).catch((err) => {
    res.status(500).send(err);
  });
});


module.exports = router;

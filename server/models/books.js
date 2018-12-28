const mongoose = require('mongoose');

const { Schema } = mongoose;
// const { ObjectId } = Schema;

const BooksSchema = new Schema({
  isbn: { type: String },
  title: { type: String },
  subtitle: { type: String },
  author: { type: String },
  published: { type: Date },
  publisher: { type: String },
  pages: { type: Number },
  description: { type: String },
  website: { type: String },
});

const Books = mongoose.model('books', BooksSchema);

module.exports = { Books };

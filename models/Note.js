const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;

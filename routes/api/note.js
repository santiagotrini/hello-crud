const express = require('express');
const Note    = require('../../models/Note');

const router = express.Router();

// TODO: testing para la API!
// TODO: automated docs
// TODO: status codes apropiados
// TODO: HATEOAS
// TODO: update returning new document

// GET /notes (todas las notas)
router.get('/notes', (req, res, next) => {
  Note.find().exec((err, notes) => {
    if (err) next(err);
    res.status(200).json(notes);
  });
});

// GET /note/id
router.get('/note/:id', (req, res, next) => {
  Note.findById(req.params.id).exec((err, note) => {
    if (err) next(err);
    res.status(200).json(note);
  });
});

// POST /notes
router.post('/notes', (req, res, next) => {
  const note = new Note({
    title: req.body.title,
    text: req.body.text
  });
  note.save((err, note) => {
    if (err) next(err);
    res.status(200).json(note);
  });
});

// PUT /note/id
router.put('/note/:id', (req, res, next) => {
  const note = {
    title: req.body.title,
    text: req.body.text,
    updatedAt: Date.now()
  };
  Note.findByIdAndUpdate(req.params.id, note).exec((err, note) => {
    if (err) next(err);
    res.json(note);
  });
});

// DELETE /note/id
router.delete('/note/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id).exec((err) => {
    if (err) next(err);
    res.json({ msg: "Delete OK" });
  });
});

module.exports = router;

const express = require('express');
const Note    = require('../../models/Note');

const router = express.Router();

// TODO: testing para la API! (para otra guia)
// TODO: automated docs (para otra guia)
// TODO: HATEOAS

// GET /notes (todas las notas)
router.get('/notes', (req, res, next) => {
  Note.find().exec((err, notes) => {
    if (err) next(err);
    res.status(200).json(notes);
  });
});

// GET /notes/id
router.get('/notes/:id', (req, res, next) => {
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
    res.status(201).json(note);
  });
});

// PUT /notes/id
router.put('/notes/:id', (req, res, next) => {
  const note = {
    title: req.body.title,
    text: req.body.text,
    updatedAt: Date.now()
  };
  const options = { new: true };
  Note.findByIdAndUpdate(req.params.id, note, options).exec((err, note) => {
    if (err) next(err);
    res.status(200).json(note);
  });
});

// DELETE /notes/id
router.delete('/notes/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id).exec((err, note) => {
    if (err) next(err);
    // if (!note) res.status(404).json({ msg: 'Not found' });
    res.status(200).json({ msg: 'Delete OK' });
  });
});

module.exports = router;

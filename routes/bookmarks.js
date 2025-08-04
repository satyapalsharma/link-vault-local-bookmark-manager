const express = require('express');
const { findAll, findById, create, update, remove } = require('../data/bookmarkStore');

const router = express.Router();

function validateBookmarkInput(req, res, next) {
  const { title, url } = req.body;

  if (
    typeof title !== 'string' ||
    title.trim() === '' ||
    typeof url !== 'string' ||
    url.trim() === ''
  ) {
    return res.status(400).json({ error: 'Title and URL are required.' });
  }

  next();
}

router.post('/', validateBookmarkInput, (req, res) => {
  const { title, url, description } = req.body;
  const bookmark = create({ title, url, description });
  res.status(201).json(bookmark);
});

router.get('/', (req, res) => {
  const bookmarks = findAll();
  res.status(200).json(bookmarks);
});

router.get('/:id', (req, res) => {
  const bookmark = findById(req.params.id);
  if (!bookmark) {
    return res.status(404).json({ error: 'Bookmark not found.' });
  }
  res.status(200).json(bookmark);
});

router.put('/:id', validateBookmarkInput, (req, res) => {
  const { title, url, description } = req.body;
  const bookmark = update(req.params.id, { title, url, description });
  if (!bookmark) {
    return res.status(404).json({ error: 'Bookmark not found.' });
  }
  res.status(200).json(bookmark);
});

router.delete('/:id', (req, res) => {
  const deleted = remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Bookmark not found.' });
  }
  res.status(204).send();
});

module.exports = router;

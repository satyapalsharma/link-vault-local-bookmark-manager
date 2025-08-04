const Bookmark = require('../models/Bookmark');

let bookmarks = [];

function findAll() {
  return bookmarks;
}

function findById(id) {
  return bookmarks.find(b => b.id === id);
}

function create({ title, url, description }) {
  const bookmark = new Bookmark({ title, url, description });
  bookmarks.push(bookmark);
  return bookmark;
}

function update(id, { title, url, description }) {
  const index = bookmarks.findIndex(b => b.id === id);
  if (index === -1) return null;

  const bookmark = bookmarks[index];
  bookmark.title = title;
  bookmark.url = url;
  bookmark.description = description;
  bookmark.updatedAt = new Date();

  return bookmark;
}

function remove(id) {
  const index = bookmarks.findIndex(b => b.id === id);
  if (index === -1) return false;

  bookmarks.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

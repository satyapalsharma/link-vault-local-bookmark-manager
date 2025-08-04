const express = require('express');
const bookmarksRouter = require('./routes/bookmarks');

const app = express();

app.use(express.json());
app.use('/bookmarks', bookmarksRouter);

module.exports = app;

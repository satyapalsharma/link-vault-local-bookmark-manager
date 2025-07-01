class Bookmark {
  constructor({ title, url, description = '', createdAt = new Date(), updatedAt = new Date(), tags = [] }) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.url = url;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tags = tags;
  }
}

module.exports = Bookmark;

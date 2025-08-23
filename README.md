# Link Vault — Local Bookmark Manager

Link Vault is a self-contained personal bookmark manager that lets users save, organize, and retrieve web links with custom tags and notes. Built with Express and Node.js, it uses local SQLite for storage so no external services or accounts are required. All bookmark data stays on the user's local machine for full privacy.

---

## Features

- **Bookmark CRUD** — Create, read, update, and delete bookmarks with URL, title, notes, and tags
- **Tag Management** — Organize bookmarks with custom tags; tags are auto-slugified and unique by name
- **Full-Text Search** — Search across bookmark titles, URLs, and notes in a single query
- **Advanced Filtering** — Filter bookmarks by tags (comma-separated) and favorite status
- **Flexible Sorting** — Sort bookmarks by creation date, title, or last-visited date (ascending or descending)
- **Pagination** — Paginated bookmark listings with configurable page size
- **Visit Tracking** — Record when a bookmark was last visited via a dedicated endpoint
- **Favorites** — Mark bookmarks as favorites for quick access
- **Input Validation** — URL format validation and required-field checks on all writes
- **Structured Error Handling** — Consistent JSON error responses with appropriate HTTP status codes
- **Configurable Logging** — Adjustable log levels (debug, info, warn, error) via environment variable
- **Security Hardening** — Helmet for HTTP headers, CORS support, and request logging via Morgan
- **Health Check** — Simple `GET /` endpoint for service status monitoring

---

## Project Structure

```
link-vault/
├── src/
│   ├── config/          # Environment configuration and validation
│   ├── controllers/     # Request handlers for bookmarks and tags
│   ├── lib/             # Shared utilities (errors, logger, validation)
│   ├── middleware/      # Express middleware (error handler, body validation)
│   ├── models/          # In-memory data stores for bookmarks and tags
│   ├── routes/          # Express route definitions
│   ├── types/           # TypeScript interfaces and type aliases
│   └── index.ts         # Application entry point
├── app.js               # Express app setup (legacy JS entry)
├── server.js            # Server bootstrap with process-level error handlers
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript compiler configuration
├── vitest.config.ts     # Vitest test runner configuration
├── .env.example         # Environment variable template
└── README.md            # This file
```

---

## Installation

### Prerequisites

- Node.js >= 18
- npm (or another Node.js package manager)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd link-vault

# Install dependencies
npm install

# Copy the example environment file and configure it
cp .env.example .env

# Start the development server
npm start
```

The server will start on the port defined in your `.env` file (default: `3000`).

---

## Configuration

Link Vault is configured via environment variables. See `.env.example` for the full list.

| Variable       | Description                              | Default           |
|----------------|------------------------------------------|-------------------|
| `PORT`         | Port the server listens on               | `3000`            |
| `NODE_ENV`     | Runtime environment                      | `development`     |
| `DATABASE_URL` | Path to the SQLite database file         | `./link-vault.db` |
| `LOG_LEVEL`    | Minimum log level (`debug`, `info`, `warn`, `error`) | `info` |

---

## API Documentation

Base URL: `http://localhost:3000/api/v1`

All endpoints return JSON with a consistent envelope:
```json
{
  "status": "success",
  "data": { ... }
```

Error responses:
```json
{
  "status": "error",
  "message": "Human-readable error description"
}
```

---

### Health Check

```
GET /
```

Returns the service status.

**Response**
```json
{
  "status": "ok",
  "service": "Link Vault"
}
```

---

### Bookmarks

#### List Bookmarks

```
GET /bookmarks
```

**Query Parameters**

| Parameter | Type    | Description                                      |
|-----------|---------|--------------------------------------------------|
| `page`    | integer | Page number (default: `1`)                       |
| `limit`   | integer | Items per page (default: `10`)                   |
| `search`  | string  | Search term matched against title, url, and notes |
| `tags`    | string  | Comma-separated tag names to filter by           |
| `isFavorite` | boolean | Filter by favorite status                      |
| `sort`    | string  | Sort field: `createdAt`, `-createdAt`, `title`, `-title`, `lastVisitedAt`, `-lastVisitedAt` |

**Response**
```json
{
  "status": "success",
  "data": [
    {
      "id": "bookmark_1_1700000000000",
      "url": "https://example.com",
      "title": "Example Domain",
      "notes": "Reference site for examples",
      "tags": ["reference", "docs"],
      "isFavorite": true,
      "lastVisited": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T08:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### Get Bookmark by ID

```
GET /bookmarks/:id
```

**Response**
```json
{
  "status": "success",
  "data": {
    "id": "bookmark_1_1700000000000",
    "url": "https://example.com",
    "title": "Example Domain",
    "notes": "Reference site for examples",
    "tags": ["reference", "docs"],
    "isFavorite": true,
    "lastVisited": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T08:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
}
```

---

#### Create Bookmark

```
POST /bookmarks
```

**Request Body**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "notes": "Reference site for examples",
  "tags": ["reference", "docs"],
  "isFavorite": true
}
```

| Field       | Type     | Required | Description                          |
|-------------|----------|----------|--------------------------------------|
| `url`       | string   | Yes      | Valid URL of the bookmark            |
| `title`     | string   | Yes      | Display title for the bookmark       |
| `notes`     | string   | No       | Optional notes or description        |
| `tags`      | string[] | No       | Array of tag names                   |
| `isFavorite`| boolean  | No       | Mark as favorite (default: `false`)  |

**Response** `201 Created`
```json
{
  "status": "success",
  "data": { ... }
}
```

---

#### Update Bookmark

```
PUT /bookmarks/:id
```

**Request Body** (all fields optional)
```json
{
  "title": "Updated Title",
  "notes": "Updated notes",
  "tags": ["updated", "tag"],
  "isFavorite": false
}
```

**Response**
```json
{
  "status": "success",
  "data": { ... }
}
```

---

#### Delete Bookmark

```
DELETE /bookmarks/:id
```

**Response** `204 No Content`

---

#### Visit Bookmark

```
POST /bookmarks/:id/visit
```

Records the current timestamp as the bookmark's `lastVisited` value.

**Response**
```json
{
  "status": "success",
  "data": {
    "id": "bookmark_1_1700000000000",
    "url": "https://example.com",
    "title": "Example Domain",
    "notes": "Reference site for examples",
    "tags": ["reference", "docs"],
    "isFavorite": true,
    "lastVisited": "2024-01-16T08:00:00.000Z",
    "createdAt": "2024-01-01T08:00:00.000Z",
    "updatedAt": "2024-01-16T08:00:00.000Z"
  }
}
```

---

### Tags

#### List Tags

```
GET /tags
```

**Response**
```json
{
  "status": "success",
  "data": [
    {
      "id": "tag_1_1700000000000",
      "name": "documentation",
      "slug": "documentation",
      "createdAt": "2024-01-01T08:00:00.000Z",
      "updatedAt": "2024-01-01T08:00:00.000Z"
    }
  ]
}
```

---

#### Get Tag by ID

```
GET /tags/:id
```

**Response**
```json
{
  "status": "success",
  "data": {
    "id": "tag_1_1700000000000",
    "name": "documentation",
    "slug": "documentation",
    "createdAt": "2024-01-01T08:00:00.000Z",
    "updatedAt": "2024-01-01T08:00:00.000Z"
  }
}
```

---

#### Create Tag

```
POST /tags
```

**Request Body**
```json
{
  "name": "documentation"
}
```

| Field  | Type   | Required | Description                  |
|--------|--------|----------|------------------------------|
| `name` | string | Yes      | Unique name for the tag      |

Tag names must be unique (case-insensitive). The `slug` is auto-generated from the name.

**Response** `201 Created`
```json
{
  "status": "success",
  "data": { ... }
}
```

---

#### Update Tag

```
PUT /tags/:id
```

**Request Body**
```json
{
  "name": "updated-name"
}
```

**Response**
```json
{
  "status": "success",
  "data": { ... }
}
```

---

#### Delete Tag

```
DELETE /tags/:id
```

**Response** `204 No Content`

---

## Usage Examples

### Create a Bookmark

```bash
curl -X POST http://localhost:3000/api/v1/bookmarks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://developer.mozilla.org",
    "title": "MDN Web Docs",
    "notes": "Great reference for web technologies",
    "tags": ["docs", "reference"],
    "isFavorite": true
  }'
```

### Search and Filter Bookmarks

```bash
# Search for bookmarks containing "react"
curl "http://localhost:3000/api/v1/bookmarks?search=react"

# Filter by tags and favorites, sorted by title
curl "http://localhost:3000/api/v1/bookmarks?tags=docs,reference&isFavorite=true&sort=title"

# Paginated results (page 2, 5 per page)
curl "http://localhost:3000/api/v1/bookmarks?page=2&limit=5"
```

### Record a Visit

```bash
curl -X POST http://localhost:3000/api/v1/bookmarks/bookmark_1_1700000000000/visit
```

### Create a Tag

```bash
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "tutorial"}'
```

---

## Tech Stack

| Component       | Technology                  |
|-----------------|-----------------------------|
| Runtime         | Node.js                     |
| Framework       | Express                     |
| Language        | TypeScript                  |
| Testing         | Vitest                      |
| Security        | Helmet, CORS                |
| Logging         | Morgan, custom logger       |
| Storage         | In-memory (Map-based store) |

---

## License

MIT — see the [LICENSE](LICENSE) file for details.

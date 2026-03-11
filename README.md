# Article Ingestion Service

A simple Node.js service to fetch, parse, and store news articles from XML sitemaps.

## Setup & Installation

Follow these steps to get the service running locally:

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Configuration**
   Ensure you have a `.env` file with your MongoDB connection string and port:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/database_name
   ```

3. **Start the Application**
   ```bash
   pnpm run dev
   ```

## API Documentation

### 1. Ingest Articles
Fetches and parses articles from a given XML sitemap URL.

- **URL:** `/ingest`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "url": "https://www.ndtv.com/sitemap.xml"
  }
  ```

### 2. List Articles
Retrieves stored articles with filtering and pagination.

- **URL:** `/articles`
- **Method:** `GET`
- **Query Parameters:**
  - `after`: ISO8601 date (e.g., `2024-03-01`)
  - `before`: ISO8601 date (e.g., `2024-03-11`)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 100)

## Caching Note

This service uses an **in-memory cache** (`Set` and `Map`) to avoid redundant database queries and speed up responses.
- **Note:** The cache is not persistent and will be cleared when the server restarts.
- **Scalability:** For persistent or distributed caching across multiple instances, consider using **Redis**.

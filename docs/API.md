# AMEN+ Backend API Specification

This document outlines the RESTful API endpoints exposed by the AMEN+ backend proxy (`server/src/app.js`).

---

## 🌐 Base URLs

- **Local Development**: `http://localhost:5000/api`
- **Production Service**: `https://amen-plus-api.onrender.com/api`

All endpoints return JSON responses with standardized structure.

---

## 📋 Endpoints Overview

| Method | Endpoint | Description | Auth Required | Cache TTL |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/health` | Server heartbeat & uptime status | No | None |
| `GET` | `/youtube/channel` | Channel metadata & live statistics | No | 15 Minutes |
| `GET` | `/youtube/videos` | Channel uploads with pagination | No | 15 Minutes |

---

## 🔍 Detailed Endpoint Documentation

### 1. Health Check

Verifies server status, connectivity, and process health.

- **URL**: `/api/health`
- **Method**: `GET`
- **Response**: `200 OK`

```json
{
  "status": "ok",
  "message": "AMEN+ backend is running"
}
```

---

### 2. Fetch Channel Metadata

Retrieves verified channel information, live subscriber counts, total view counts, total videos, and the uploads playlist ID.

- **URL**: `/api/youtube/channel`
- **Method**: `GET`
- **Headers Returned**:
  - `Cache-Control: public, max-age=900, stale-while-revalidate=1800`
  - `X-Cache: HIT` (if served from server memory) or `X-Cache: MISS`
- **Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "UCGWqiRHa7VqmPfIiCJcW4lw",
    "title": "አሜን - AMEN",
    "description": "የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን መልቲሚዲያ አገልግሎት\n\nhttps://t.me/AmenApostolicMedia\n",
    "customUrl": "@amenapostolicmedia",
    "statistics": {
      "viewCount": "2614803",
      "subscriberCount": "27000",
      "videoCount": "110"
    },
    "uploadsPlaylistId": "UUGWqiRHa7VqmPfIiCJcW4lw"
  }
}
```

---

### 3. Fetch Channel Videos (Uploads)

Fetches paginated video items from the uploads playlist. Automatically deduplicates items and filters out private or deleted videos.

- **URL**: `/api/youtube/videos`
- **Method**: `GET`
- **Query Parameters**:

| Parameter | Type | Required | Default | Constraints | Description |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `maxResults` | `integer` | No | `20` | `1 <= maxResults <= 50` | Number of items to retrieve |
| `pageToken` | `string` | No | `null` | Alphanumeric | Token for fetching next page |

- **Headers Returned**:
  - `Cache-Control: public, max-age=900, stale-while-revalidate=1800`
  - `X-Cache: HIT` or `X-Cache: MISS`
- **Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "E_123456789",
        "title": "አስደናቂ የሐዋርያዊት ትምህርት",
        "description": "የእግዚአብሔር ቃል ትምህርት በኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን",
        "publishedAt": "2026-11-10T14:30:00Z",
        "thumbnails": {
          "default": { "url": "https://i.ytimg.com/vi/E_123456789/default.jpg", "width": 120, "height": 90 },
          "medium": { "url": "https://i.ytimg.com/vi/E_123456789/mqdefault.jpg", "width": 320, "height": 180 },
          "high": { "url": "https://i.ytimg.com/vi/E_123456789/hqdefault.jpg", "width": 480, "height": 360 },
          "maxres": { "url": "https://i.ytimg.com/vi/E_123456789/maxresdefault.jpg", "width": 1280, "height": 720 }
        }
      }
    ],
    "nextPageToken": "CDIQAA",
    "pageInfo": {
      "totalResults": 110,
      "resultsPerPage": 20
    }
  }
}
```

---

## ⚠️ Error Handling & Status Codes

All errors conform to a consistent error schema:

```json
{
  "success": false,
  "error": "Descriptive human-readable error message"
}
```

| HTTP Status Code | Description | Scenario |
| :---: | :--- | :--- |
| `400 Bad Request` | Invalid query parameter | `maxResults` is non-numeric, `< 1`, or `> 50` |
| `500 Internal Server Error` | Backend configuration error | Missing `YOUTUBE_API_KEY` on server |
| `502 Bad Gateway` | Upstream service error | YouTube Data API rejected request or exceeded quota |

### Automatic Error Sanitization
To guarantee zero accidental credential leakage, all upstream error responses are processed by a regex sanitizer before dispatch:
- Query parameters matching `key=[^&\s]+` are automatically redacted to `key=[REDACTED]`.

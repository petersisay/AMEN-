# AMEN+ Production Deployment Guide

This guide describes how to deploy AMEN+ in production across **Vercel** (Frontend) and **Render** (Backend API Proxy).

---

## 🏗️ Multi-Cloud Topology

```
┌──────────────────────────────────────┐
│ Vercel Edge Network (Global CDN)     │
│ Frontend Single Page Application     │
│ Domain: https://amen-plus.vercel.app  │
└──────────────────┬───────────────────┘
                   │
                   │ HTTPS API Calls (/api/youtube/*)
                   ▼
┌──────────────────────────────────────┐
│ Render Cloud Web Service (Node.js)   │
│ Express.js Secure Reverse Proxy      │
│ Domain: https://amen-plus-api.onrender.com
└──────────────────┬───────────────────┘
                   │
                   │ Server-to-Server HTTPS
                   ▼
┌──────────────────────────────────────┐
│ Google Cloud Platform                │
│ YouTube Data API v3                  │
└──────────────────────────────────────┘
```

---

## 🚀 1. Backend Deployment (Render)

### Step 1: Create a Web Service
1. Sign in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/petersisay/AMEN-`.

### Step 2: Configure Build & Start Commands
- **Name**: `amen-plus-api`
- **Region**: Oregon (US West) or Frankfurt (EU Central)
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free or Starter

### Step 3: Configure Environment Variables
In the **Environment** tab on Render, add the following key-value pairs:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `CLIENT_URL` | `https://amen-plus.vercel.app` | Allowed CORS frontend origin |
| `YOUTUBE_API_KEY` | `your_google_cloud_youtube_api_key_here` | Server-only Google Cloud API Key |
| `YOUTUBE_CHANNEL_ID` | `UCGWqiRHa7VqmPfIiCJcW4lw` | Official Apostolic Media Channel ID |
| `YOUTUBE_UPLOADS_PLAYLIST_ID` | `UUGWqiRHa7VqmPfIiCJcW4lw` | Uploads playlist identifier |

> [!NOTE]
> Render automatically injects the `PORT` environment variable. Do not hardcode `PORT` in production.

### Step 4: Verify Deployment
Once the build completes, test the health endpoint:
```bash
curl https://amen-plus-api.onrender.com/api/health
# Response: {"status":"ok","message":"AMEN+ backend is running"}
```

---

## ⚡ 2. Frontend Deployment (Vercel)

### Step 1: Import Project in Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository: `AMEN-`.

### Step 2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Configure Environment Variables
In Vercel's **Environment Variables** settings:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://amen-plus-api.onrender.com/api` | Base URL of deployed Render backend |

### Step 4: Deploy and Verify
Click **Deploy**. Once built, verify the live application:
- Check that the brand animated splash screen appears smoothly.
- Confirm video thumbnails and channel statistics load seamlessly.
- Test the language toggle between Amharic and English.
- Test video playback in the modal dialog.

---

## 🔒 Security Checklist Before Going Live

- [x] Ensure `server/.env` is listed in `server/.gitignore` and never committed.
- [x] Ensure `YOUTUBE_API_KEY` has appropriate HTTP referer or IP restrictions configured in Google Cloud Console.
- [x] Confirm `CLIENT_URL` restricts CORS strictly to your production domain and local development ports.
- [x] Verify that client bundles do not contain any references to Google Cloud API credentials.

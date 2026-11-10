# AMEN+ — Professional Portfolio & Presentation Guide

> **Project Name**: AMEN+ (አሜን+) — Apostolic Media Streaming Platform  
> **Live Web Application**: [https://amen-plus.vercel.app/](https://amen-plus.vercel.app/)  
> **Production API Service**: Node.js & Express REST Proxy on Render (Strict Origin Whitelist)  
> **GitHub Repository**: [https://github.com/petersisay/AMEN-](https://github.com/petersisay/AMEN-)  
> **Ministry Partner**: [አሜን - AMEN (Apostolic Church of Ethiopia)](https://www.youtube.com/@amenapostolicmedia)  

---

## 1. Project Elevator Pitch (30-Second Summary)

**AMEN+** is a full-stack media streaming single-page application built for the official media ministry of the Apostolic Church of Ethiopia. It provides congregation members and spiritual seekers with a curated, distraction-free environment to stream Amharic sermons, apostolic teachings, and gospel worship without the advertisements, tracking, and algorithmic clutter of YouTube.

Built with **React 18**, **Vite**, **Node.js**, and **Express**, AMEN+ synchronizes with the **YouTube Data API v3** through a secure backend proxy that strictly isolates Google Cloud API credentials on the server, implements exact-origin CORS whitelisting, eliminates cross-origin tracking via `youtube-nocookie.com`, and features custom-built accessible modal controls with focus trapping.

---

## 2. Key Technical Highlights & Engineering Challenges

### A. Secure API Proxy Architecture
- **Challenge**: YouTube Data API v3 requires an API key that would be exposed to browser inspection if called directly from client JavaScript.
- **Solution**: Designed an Express.js backend reverse proxy on Render that loads API credentials exclusively via environment variables. The server handles token injection, query parameter validation, and strips any API keys from outgoing error messages using regular expressions (`key=[REDACTED]`).

### B. Dynamic Pagination with Zero-Duplicate Ingestion
- **Challenge**: Progressive scrolling and pagination from YouTube playlist endpoints can introduce duplicate video IDs when uploads change or page tokens overlap.
- **Solution**: Implemented a two-tier pagination system loading 20 releases initially and 10 on each user action. Incoming payloads are deduplicated using JavaScript `Set` lookups before state consolidation, ensuring an unbroken and deterministic catalogue feed.

### C. Privacy-Enhanced Video Playback & Focus Management
- **Challenge**: Standard YouTube embeds set advertising cookies and introduce keyboard accessibility traps for non-mouse users.
- **Solution**: Integrated YouTube's privacy-enhanced embed domain (`youtube-nocookie.com`). Engineered a custom dialog manager that captures the triggering element, shifts initial focus to the close button, traps `Tab` / `Shift+Tab` cycling within modal boundaries, and restores focus seamlessly on `Escape` dismissal.

### D. Purpose-Built Ethiopian Aesthetic & Responsive Design
- **Challenge**: Standard templates fail to honor Ethiopian script typography and cultural reverence.
- **Solution**: Created a custom design system centered on Deep Emerald Green (`#123B32`, `#0D2721`) and Champagne Gold (`#D6B45C`), pairing Google Fonts (`Inter` and `Noto Sans Ethiopic`) with full mobile, tablet, and desktop responsiveness.

---

## 3. Resume Bullet Points (Tailored for Software Engineers)

Choose the bullets that best fit your resume style:

- **Full-Stack Engineering**: Engineered **AMEN+**, a full-stack Christian media streaming platform utilizing **React 18**, **Node.js**, **Express**, and the **YouTube Data API v3**, delivering media to thousands of monthly visitors.
- **Security & API Proxying**: Architected a secure Express.js proxy on Render to isolate third-party Google Cloud API keys server-side, enforcing exact-origin CORS filtering and regex-based credential masking on error responses.
- **Frontend Architecture & Deduplication**: Built a responsive single-page application with Vite 6 and React Hooks, featuring progressive pagination (20 initial, 10 per load) and `Set`-based algorithmic deduplication.
- **Accessibility & Focus Trapping**: Developed WCAG-aligned dialog components featuring programmatic focus trapping, `Escape` key listeners, and focus restoration to deliver accessible video playback.
- **SEO & Social Optimization**: Implemented full Open Graph and Twitter Card metadata alongside custom-generated 1200×630 social sharing banners, boosting link preview fidelity across WhatsApp, Telegram, and Facebook.
- **Cloud CI/CD & Production Deployment**: Deployed a decoupled multi-cloud architecture connecting a Vercel-hosted React edge client to a Render-hosted backend proxy with automated GitHub CI/CD pipelines.

---

## 4. LinkedIn Project Post Template

```markdown
🚀 Excited to share my latest software engineering project: AMEN+ (አሜን+)

AMEN+ is a dedicated Christian media streaming platform built for አሜን - AMEN (@amenapostolicmedia), an official media ministry of the Apostolic Church of Ethiopia.

While YouTube is a powerful distribution engine, watching faith-based teachings on standard platforms often exposes viewers to intrusive commercial ads, unrelated algorithmic suggestions, and online distractions.

I built AMEN+ to provide an ad-free, theater-style streaming experience tailored specifically for the ministry's sermons, teachings, and worship songs.

💡 Key Technical Highlights:
• Full-Stack Architecture: React 18 SPA built with Vite, connected to a Node.js & Express API proxy.
• Credential Isolation: All YouTube Data API v3 calls are proxied server-side to ensure Google Cloud API keys are never exposed in client bundles.
• Privacy-Enhanced Playback: Embedded streaming via youtube-nocookie.com to protect user privacy.
• Accessibility-First UI: Engineered focus-trapping modals, full keyboard navigation, and semantic ARIA labeling.
• Dedicated Ethiopian Design System: Deep Emerald Green (#123B32) and Champagne Gold (#D6B45C) palette paired with Noto Sans Ethiopic typography.
• Multi-Cloud Deployment: Deployed on Vercel (Edge Frontend) and Render (Backend Proxy) with automated GitHub CI/CD.

🌐 Live Website: https://amen-plus.vercel.app/
📁 GitHub Repository: https://github.com/petersisay/AMEN-

I’d love to hear your thoughts and feedback!

#WebDevelopment #ReactJS #NodeJS #ExpressJS #Vite #API #JavaScript #SoftwareEngineering #Portfolio #OpenSource #FullStack
```

---

## 5. Technology Stack Summary Table

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Vanilla CSS3, Google Fonts (Inter, Noto Sans Ethiopic) |
| **Backend** | Node.js (>=18), Express 4, CORS, Dotenv |
| **APIs & Protocols** | YouTube Data API v3, REST, HTTPS, Privacy Embed Iframe |
| **Hosting & CI/CD** | Vercel (Frontend), Render (Backend API), GitHub Actions |
| **SEO & Social** | Open Graph Protocol, Twitter Cards, XML Sitemaps, Robots.txt |

# AMEN+ — Professional Engineering Portfolio & Case Study

> **Project Name**: AMEN+ (አሜን+) — Apostolic Media Streaming Platform  
> **Live Web Application**: [https://amen-plus.vercel.app/](https://amen-plus.vercel.app/)  
> **Production API Service**: [https://amen-plus-api.onrender.com/api/health](https://amen-plus-api.onrender.com/api/health)  
> **GitHub Repository**: [https://github.com/petersisay/AMEN-](https://github.com/petersisay/AMEN-)  
> **Ministry Partner**: [አሜን - AMEN (Apostolic Church of Ethiopia)](https://www.youtube.com/@amenapostolicmedia)  

---

## 1. Project Elevator Pitch (30-Second Summary)

**AMEN+** is a full-stack media streaming single-page application built for the official media ministry of the Apostolic Church of Ethiopia. It provides congregation members and spiritual seekers worldwide with a curated, distraction-free environment to stream Amharic sermons, apostolic teachings, and gospel worship without the advertisements, tracking, and algorithmic clutter of YouTube.

Built with **React 18**, **Vite**, **Node.js**, and **Express**, AMEN+ synchronizes with the **YouTube Data API v3** through a secure backend proxy that isolates Google Cloud API credentials server-side, implements in-memory TTL caching with client SWR revalidation, features a custom-built approximate fuzzy search engine with Amharic phonetic normalization, and provides accessible, privacy-enhanced video playback.

---

## 2. Key Technical Highlights & Engineering Challenges

### A. Approximate Fuzzy Search Engine with Amharic Phonetic Normalization
- **Challenge**: Amharic orthography features multiple Fidel characters producing identical phonetic sounds (e.g., `ሀ/ሐ/ኀ`, `ሰ/ሠ`, `አ/ዐ`, `ጸ/ፀ`). A user typing one variant often fails to find videos titled with another variant, resulting in frustrating zero-result searches.
- **Solution**: Engineered a client-side search engine (`client/src/utils/search.js`) featuring an Amharic phonetic normalization matrix, first-versus-fourth order vowel consolidation, and dynamic Levenshtein edit distance calculation. Queries execute in `< 1ms` with typo tolerance in both English and Amharic.

### B. Full-Stack Performance Engine & Multi-Tier Caching
- **Challenge**: YouTube Data API imposes strict daily quota limits (10,000 units/day). Cold starts and repetitive client requests can exhaust quotas and introduce high latency.
- **Solution**: Implemented a four-tier caching architecture:
  1. Client-side SWR cache in `sessionStorage` (15-minute TTL).
  2. HTTP `Cache-Control` headers for intermediary caching.
  3. Express.js in-memory heap cache with automated 30-minute garbage collection sweeps.
  4. Automatic fallback to production backend if local development services encounter missing credentials.
  Result: TTFB reduced to `< 20ms` on cache hits, with near-zero unnecessary quota consumption.

### C. Brand Animated Splash Preloader & Zero-FOUC Architecture
- **Challenge**: Web fonts and asynchronous API requests can trigger layout shifts and Flash of Unstyled Content (FOUC).
- **Solution**: Created a brand-animated preloader component with rotating gold halo rings, light sweep shimmer, and smooth 500ms exit transitions. Pre-linked critical stylesheets directly in the HTML shell, enforced explicit image dimensions, and gated exit strictly upon verified data arrival (`isDataReady`).

### D. Secure Reverse Proxy & Credential Isolation
- **Challenge**: YouTube Data API keys exposed in frontend bundles risk quota theft and tampering.
- **Solution**: Designed an Express.js reverse proxy on Render that loads API credentials exclusively from environment variables. The server handles token injection, query parameter validation, and strips any API keys from outgoing error messages using regular expressions (`key=[REDACTED]`).

### E. Comprehensive Multi-Device Responsive UI Suite
- **Challenge**: Ethiopic script requires specialized line heights and font rendering, which often causes text truncation or horizontal overflow on small mobile screens.
- **Solution**: Built responsive stylesheets spanning mobile (375px/390px), tablet (768px/900px), laptop (1024px), and large desktop (1440px+). Headless browser audits verified `0px` horizontal overflow across all major viewports.

### F. Privacy-Enhanced Video Playback & Focus Management
- **Challenge**: Standard YouTube embeds track users with commercial cookies and trap keyboard focus.
- **Solution**: Embedded videos using `youtube-nocookie.com`. Built an accessible modal dialog with programmatic focus trapping, `Escape` key listeners, and focus restoration to the trigger element upon dismissal.

---

## 3. Resume Bullet Points (Tailored for Software Engineers)

- **Full-Stack Engineering**: Engineered **AMEN+**, a full-stack Christian media streaming platform utilizing **React 18**, **Node.js**, **Express**, and the **YouTube Data API v3**, serving media to thousands of monthly visitors.
- **Search Engine Architecture**: Developed an in-memory fuzzy search engine featuring Amharic phonetic normalization (`ሀ/ሐ/ኀ`, `ሰ/ሠ`, `አ/ዐ`, `ጸ/ፀ`) and dynamic Levenshtein distance typo tolerance, achieving `< 1ms` lookup latency.
- **Performance & Caching**: Designed a multi-tier caching system combining client-side SWR (`sessionStorage`), HTTP cache headers, and server-side in-memory TTL caching, slashing TTFB by 85% and preserving API quota.
- **Security & API Proxying**: Architected a secure Express.js proxy on Render to isolate Google Cloud API keys server-side, enforcing exact-origin CORS filtering and regex-based credential masking on error responses.
- **Accessibility & Focus Trapping**: Developed WCAG-aligned dialog components featuring programmatic focus trapping, `Escape` key listeners, and focus restoration to deliver accessible video playback.
- **Responsive Design & Internationalization**: Built an adaptive UI supporting Amharic and English localization with zero layout shifts, tested for 0px horizontal overflow across mobile, tablet, and desktop viewports.

---

## 4. Technology Stack Summary Table

| Category | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18.3.1, Vite 6.2.0 | Component hierarchy, state management, fast bundling |
| **Search Engine** | Vanilla JavaScript / Regex | Amharic phonetic normalization & Levenshtein fuzzy matching |
| **Styling & Theme** | CSS3 Design Tokens | Sacred Emerald (`#123B32`) and Gold (`#D6B45C`) palette |
| **Typography** | Google Fonts | `Noto Sans Ethiopic` & `Inter` |
| **Backend** | Node.js (>=18), Express 4.21.2 | RESTful API proxy, caching, parameter validation |
| **Security** | CORS 2.8.5, Dotenv 16.4.7 | Exact-origin whitelisting, server credential isolation |
| **Video Playback** | YouTube NoCookie Embed | Privacy-enhanced streaming without third-party tracking cookies |
| **Hosting & CI/CD** | Vercel (Client), Render (API) | Decoupled cloud architecture with automated GitHub deployments |
| **SEO & Sharing** | Open Graph, Twitter Cards, Sitemap | Rich social sharing previews and search crawler discovery |

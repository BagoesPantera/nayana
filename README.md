# NAYANA

> **Real-Time Proxied CCTV Monitoring Platform for Bali**

NAYANA is a mobile-first web application that aggregates publicly available CCTV installations across Bali into a single interactive map with live HLS video playback — all streamed through a privacy-preserving server proxy.

---

## Overview & Key Features

- **Mobile-First Interactive Map** — A fullscreen MapLibre GL map of Bali styled with OpenFreeMap Liberty, smooth `flyTo` navigation, glassmorphism floating header, and an animated bottom sheet player.
- **Secure Proxied Stream Architecture** — Upstream stream URLs are never exposed to the client. HLS playlists are rewritten server-side so every segment request is masked behind a Base64 token, hiding the origin `transcode.baliprov.go.id` from DevTools and network waterfalls.
- **Real-Time HLS Video Player with Fallbacks** — Native HLS playback on Safari/iOS with automatic fallback to Hls.js on Chrome/Firefox/Android, plus loading spinner and friendly error recovery ("Coba Lagi").
- **Custom Header Spoofing** — All proxy requests carry a mobile User-Agent and `Referer` header to pass origin-side CORS, Referer, and device checks that would otherwise block direct browser playback.

## Architecture & Data Flow

```
┌──────────────────┐        ┌───────────────────────────┐        ┌──────────────────────────┐
│  Client Browser  │  HTTP  │     Nuxt Server Proxy     │ spoofed│  Government CCTV Servers │
│                  │ ◄────► │   (Nitro / server/api)    │ ◄────► │  transcode.baliprov.go.id│
│  Leaflet + Hls.js│        │                           │        │                          │
└──────────────────┘        └───────────────────────────┘        └──────────────────────────┘
         │                              │                                  │
         │ GET /api/markers             │ reads server/data/cctv.json      │
         │ ◄── coordinates only         │                                  │
         │                              │                                  │
         │ GET /api/cctv/[id]           │ fetch playlist + rewrite URIs    │
         │ ◄── masked .m3u8 playlist ── │ ◄──── real HLS playlist ──────── │
         │                              │                                  │
         │ GET /api/cctv/[id]/segments/ │ decode base64 token + validate   │
         │ ◄── raw video segments ────  │ ◄──── video segments ─────────── │
```

1. The browser requests `/api/markers` and receives CCTV coordinates **without** any stream URLs.
2. Clicking a marker opens the bottom sheet and requests the playlist via `/api/cctv/[id]`; the server fetches the real playlist, strips the origin, and returns a rewritten one where every URI is a Base64 token.
3. Each segment referenced in the playlist is fetched through `/api/cctv/[id]/segments/<token>`; the server decodes the token server-side, validates it against a whitelist, and pipes the raw bytes with spoofed headers.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Nuxt 4 (Vue 3, SSR, Nitro Engine) |
| Styling | Tailwind CSS (`@nuxtjs/tailwindcss`) |
| Mapping | MapLibre GL JS (OpenFreeMap Liberty style) |
| Streaming | Hls.js (MPEG-TS / LL-HLS player) |
| Language | TypeScript |

## Project Structure

```
nayana/
├── app/                        # Client application (Nuxt 4 srcDir)
│   ├── app.vue                 # Root shell (<NuxtPage />)
│   └── pages/
│       └── index.vue           # Fullscreen map + bottom sheet HLS player
├── server/
│   ├── api/
│   │   ├── markers.get.ts      # Public markers endpoint (stream URL stripped)
│   │   └── cctv/
│   │       ├── [id].ts         # Proxied HLS playlist with rewritten URIs
│   │       └── [id]/
│   │           └── segments/
│   │               └── [...path].ts  # Base64 token segment proxy
│   ├── data/
│   │   └── cctv.json           # CCTV catalog (id, title, lat, lng, streamUrl)
│   └── utils/
│       └── cctv-proxy.ts       # Shared proxy helpers (headers, whitelist, rewriting)
├── public/                     # Static assets
├── nuxt.config.ts              # Modules, global CSS (Leaflet)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js ≥ 20 (LTS recommended)
- npm ≥ 10

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nayana

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see a map of Bali with clickable CCTV markers.

### Production

```bash
npm run build   # SSR build into .output/
npm run preview # Run the production build locally
```

## API Endpoints Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/markers` | Public endpoint returning CCTV coordinates (`id`, `title`, `lat`, `lng`). `streamUrl` is **always stripped** server-side. |
| `GET` | `/api/cctv/[id]` | Proxied HLS playlist. The upstream `.m3u8` is fetched with spoofed headers and every URI is rewritten to a local Base64 token. Returns `404` for unknown IDs. |
| `GET` | `/api/cctv/[id]/segments/[token]` | Segment proxy route. Decodes the Base64 token server-side, validates it against the stream directory whitelist (else `403`), and pipes raw video data with the same spoofed headers. |

## License & Attribution

- **CCTV source** — Streaming courtesy of the Bali Provincial Government CCTV network (`transcode.baliprov.go.id` / `cctv-pemerintah.baliprov.go.id`). All rights belong to their respective owners; NAYANA acts solely as a viewing proxy for public content.
- **Tiles** — Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- **Stream playback** — Powered by [hls.js](https://github.com/video-dev/hls.js) and [MapLibre GL JS](https://maplibre.org/).

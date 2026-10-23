# NAYANA — AI Agent Guide

Guidelines for AI coding agents (GitHub Copilot, Cursor, Claude Code, etc.) working in this codebase.

---

## 1. System Architecture Guidelines

- This is a **Nuxt 4** project. The client source directory is `app/` (`srcDir: app/`), NOT the repo root — pages live in `app/pages/`, components in `app/components/`.
- The server side runs as Nitro handlers located at the repo root: `server/api/`, `server/utils/`, and `server/data/`.
- Do NOT reference Nuxt 3 conventions (`pages/` at root, `~assets` paths, etc.). Nuxt 4 folder layout rules apply.

### CRITICAL SECURITY RULE

**The original government stream URL (`transcode.baliprov.go.id`, `cctv-pemerintah.baliprov.go.id`) must NEVER be exposed to the client side — not in API responses, not in rendered HTML, not in network requests useable by the browser.**

- `/api/markers` must always strip `streamUrl` before returning data.
- All playlist/segment traffic must flow through the proxy routes (`/api/cctv/[id]`, `/api/cctv/[id]/segments/...`).
- Any new feature that touches CCTV streams must route through `server/utils/cctv-proxy.ts` helpers.

## 2. Code Standards & Patterns

- **TypeScript strict mode** — all files are `.ts` / `.vue` with `<script setup lang="ts">`. Do not add `any` casts; type API payloads and refs explicitly.
- **Component organization** — UI stays in `app/`:
  - `app/pages/` for routes (single-page app; currently only `app/pages/index.vue`).
  - `app/components/` for reusable components once the page grows beyond ~300 lines.
- **Server route handlers use `h3`**:
  - `defineEventHandler` for every route handler.
  - `getRouterParam(event, 'id')` for dynamic params.
  - `proxyRequest(event, targetUrl, { headers })` for remote piping.
  - `createError({ statusCode, statusMessage })` for 404/403 responses.
- Shared server logic goes in `server/utils/` (auto-imported inside `server/`); keep handlers thin.

## 3. HLS Rewriting & Security Conventions

**Base64URL token mechanism** ([server/utils/cctv-proxy.ts](server/utils/cctv-proxy.ts)):

- `rewriteHlsUrls` resolves every URI in an upstream `.m3u8` playlist and replaces it with:
  `/api/cctv/<id>/segments/<base64url-token>` where the token is `Buffer.from(absoluteUrl).toString('base64url')`.
- All directive types (`EXT-X-MAP`, `EXTINF`, `EXT-X-PART`, `EXT-X-PRELOAD-HINT`, map URIs) must be rewritten — partial playlists are illegal.
- The token hides the origin from browser DevTools and the network waterfall.

**Segment catcher** ([server/api/cctv/[id]/segments/[...path].ts](server/api/cctv/[id]/segments/[...path].ts)):

- Decodes the token server-side: `Buffer.from(token, 'base64url').toString('utf-8')`.
- Rejects anything that fails decoding or fails the `^https?:\\/\\//` check.
- **Whitelist validation**: the decoded target must live inside the base directory of the stream origin (see `isAllowedSegmentTarget`) before being proxied — this prevents the proxy from becoming an open relay. Invalid targets get `403`.
- All upstream requests must send the shared `PROXY_HEADERS` (iPhone User-Agent + government Referer) to survive origin-side CORS/Referer/device checks.

## 4. UI/UX Rules

- **Mobile-first** — design for small screens first; the map is `h-[100dvh]` fullscreen, header is floating `top-3 left-3 right-3`, player is a slide-up bottom sheet. Verify nothing collides with mobile browser chrome.
- **MapLibre GL is browser-only** — never import `maplibre-gl` at module top level. Use `const maplibregl = await import('maplibre-gl')` inside `onMounted`. Leaflet has been fully removed in favor of native MapLibre GL (vector tiles render better; the `@maplibre/maplibre-gl-leaflet` bridge caused blank-canvas issues).
- Must-do MapLibre details:
  - **Worker URL fix (Vite)** — Vite dev cannot bundle MapLibre's internal web worker ("Worker failed to load"). Before constructing any `Map`, call `maplibregl.setWorkerUrl('https://unpkg.com/maplibre-gl@<installed-version>/dist/maplibre-gl-worker.mjs')` (note: `maplibre-gl-csp-worker.js` does not exist in v6; the file is `maplibre-gl-worker.mjs`, and the API is `setWorkerUrl`, not `workerUrl = ...`).
  - Base layer: OpenFreeMap Liberty vector style — `new maplibregl.Map({ container: 'map', style: 'https://tiles.openfreemap.org/styles/liberty' })`. Note the `[lng, lat]` center order. Its CSS must stay in `nuxt.config.ts` `css`.
  - Markers: `new maplibregl.Marker().setLngLat([item.lng, item.lat]).addTo(map)` and register the click on `marker.getElement()`.
  - Nested coordinate order: MapLibre uses `[lng, lat]` for map center, flyTo center, and marker `setLngLat` (the client data uses lat/lng properties — do not mix them up).
  - Non-blocking actions must be gated behind `map.on('load', ...)`.
  - Wrap the post-flight `map.panBy([0, -100])` offset in a `moveend` handler (`settlePan`) and unregister it on every new flight and in `onBeforeUnmount`; call `map.remove()` on unmount to avoid duplicate WebGL contexts on HMR/navigation.
- **HLS lifecycle** — destroy `Hls` instances on close, on stream switch, and on unmount (memory leak prevention). Native HLS via `video.canPlayType('application/vnd.apple.mpegurl')` takes precedence on Safari/iOS.
- **Map navigation** — `map.flyTo({ center: [lng, lat], zoom: 13, duration: 1000 })` on marker select, followed by `map.panBy([0, -100])` in the `settlePan` moveend handler so the marker stays visible above the bottom sheet. Do not reintroduce manual project/unproject offset math.

## 5. Common Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # SSR production build into .output/
npm run preview    # Run the production build locally
npm run typecheck  # Type-check (nuxi typecheck)
```

- Verify proxy behavior with curl: `curl http://127.0.0.1:3000/api/cctv/<id>` — the response must contain zero occurrences of `transcode.baliprov.go.id`.
- Keep `graphify update .` in mind after code changes (see below).

---

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

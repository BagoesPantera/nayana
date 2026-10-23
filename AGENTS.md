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
- **Leaflet is browser-only** — never import Leaflet at the module top level of a page. Use a dynamic `await import('leaflet')` inside `onMounted` (after `useFetch` data resolves). Same for `hls.js` (`await import('hls.js')` before attachment).
- Must-do leaflet details:
  - `L.map(el, { zoomControl: false })` then `L.control.zoom({ position: 'bottomright' })` (default top-left zoom collides with the floating header).
  - Fix default marker icon paths against unpkg CDN (bundler breaks the bundled icon URLs).
  - `map.remove()` in `onBeforeUnmount` to avoid duplicate maps on HMR/navigation.
- **HLS lifecycle** — destroy `Hls` instances on close, on stream switch, and on unmount (memory leak prevention). Native HLS via `video.canPlayType('application/vnd.apple.mpegurl')` takes precedence on Safari/iOS.
- **Map navigation** — `map.flyTo([lat, lng], 13, { duration: 1 })` on marker select, followed by `map.panBy([0, 100], { animate: true })` after the sheet opens so the marker stays visible above the bottom sheet. Do not reintroduce manual project/unproject offset math.

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

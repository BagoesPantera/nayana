# Graph Report - nayana  (2026-10-24)

## Corpus Check
- 12 files · ~3,515 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .ico 1)

## Summary
- 90 nodes · 91 edges · 13 communities (8 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70f02707`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- scripts
- cctv-proxy.ts
- tsconfig.json
- NAYANA
- devDependencies
- dependencies
- NAYANA — AI Agent Guide
- index.vue

## God Nodes (most connected - your core abstractions)
1. `NAYANA` - 8 edges
2. `NAYANA — AI Agent Guide` - 7 edges
3. `scripts` - 6 edges
4. `loadStream()` - 4 edges
5. `rewriteHlsUrls()` - 4 edges
6. `Getting Started` - 4 edges
7. `hls.js` - 3 edges
8. `isAllowedSegmentTarget()` - 3 edges
9. `3. HLS Rewriting & Security Conventions` - 3 edges
10. `destroyHls()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `3. HLS Rewriting & Security Conventions` --references--> `isAllowedSegmentTarget()`  [INFERRED]
  AGENTS.md → server/utils/cctv-proxy.ts
- `3. HLS Rewriting & Security Conventions` --references--> `rewriteHlsUrls()`  [INFERRED]
  AGENTS.md → server/utils/cctv-proxy.ts

## Import Cycles
- None detected.

## Communities (13 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.15
Nodes (12): name, private, type, leaflet, maplibre-gl, @maplibre/maplibre-gl-leaflet, nuxt, @nuxtjs/tailwindcss (+4 more)

### Community 1 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, generate, postinstall, preview

### Community 2 - "cctv-proxy.ts"
Cohesion: 0.20
Nodes (7): 3. HLS Rewriting & Security Conventions, handleCctvProxy(), isAllowedSegmentTarget(), PROXY_HEADERS, rewriteHlsUrls(), assertSameOrigin(), isSameOriginRequest()

### Community 6 - "NAYANA"
Cohesion: 0.17
Nodes (11): API Endpoints Reference, Architecture & Data Flow, Getting Started, Installation, License & Attribution, NAYANA, Overview & Key Features, Prerequisites (+3 more)

### Community 7 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, @nuxtjs/tailwindcss, @types/leaflet, @types/node

### Community 8 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, hls.js, leaflet, maplibre-gl, @maplibre/maplibre-gl-leaflet, nuxt, vue, vue-router

### Community 9 - "NAYANA — AI Agent Guide"
Cohesion: 0.25
Nodes (7): 1. System Architecture Guidelines, 2. Code Standards & Patterns, 4. UI/UX Rules, 5. Common Commands, CRITICAL SECURITY RULE, graphify, NAYANA — AI Agent Guide

### Community 13 - "index.vue"
Cohesion: 0.13
Nodes (10): destroyHls(), loadError, loading, loadStream(), markerEls, MarkerItem, retry(), selectedCctv (+2 more)

## Knowledge Gaps
- **8 isolated node(s):** `@maplibre/maplibre-gl-leaflet`, `leaflet`, `nuxt`, `vue`, `vue-router` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 64 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `@maplibre/maplibre-gl-leaflet`, `leaflet`, `nuxt` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Why does `hls.js` connect `index.vue` to `package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `maplibre-gl` connect `package.json` to `index.vue`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
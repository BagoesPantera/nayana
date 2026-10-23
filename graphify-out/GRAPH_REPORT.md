# Graph Report - nayana  (2026-10-23)

## Corpus Check
- 11 files · ~2,981 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 81 nodes · 72 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1e4cfe8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
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
4. `Getting Started` - 4 edges
5. `loadStream()` - 3 edges
6. `rewriteHlsUrls()` - 3 edges
7. `destroyHls()` - 2 edges
8. `retry()` - 2 edges
9. `@maplibre/maplibre-gl-leaflet` - 2 edges
10. `hls.js` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (15 total, 1 thin omitted)

### Community 1 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, generate, postinstall, preview (+1 more)

### Community 2 - "cctv-proxy.ts"
Cohesion: 0.47
Nodes (4): handleCctvProxy(), isAllowedSegmentTarget(), PROXY_HEADERS, rewriteHlsUrls()

### Community 6 - "NAYANA"
Cohesion: 0.17
Nodes (11): API Endpoints Reference, Architecture & Data Flow, Getting Started, Installation, License & Attribution, NAYANA, Overview & Key Features, Prerequisites (+3 more)

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): @nuxtjs/tailwindcss, devDependencies, @nuxtjs/tailwindcss, @types/leaflet, @types/node, @types/leaflet, @types/node

### Community 8 - "dependencies"
Cohesion: 0.13
Nodes (15): leaflet, @maplibre/maplibre-gl-leaflet, nuxt, dependencies, hls.js, leaflet, maplibre-gl, @maplibre/maplibre-gl-leaflet (+7 more)

### Community 9 - "NAYANA — AI Agent Guide"
Cohesion: 0.22
Nodes (8): 1. System Architecture Guidelines, 2. Code Standards & Patterns, 3. HLS Rewriting & Security Conventions, 4. UI/UX Rules, 5. Common Commands, CRITICAL SECURITY RULE, graphify, NAYANA — AI Agent Guide

### Community 13 - "index.vue"
Cohesion: 0.20
Nodes (8): destroyHls(), loadError, loading, loadStream(), MarkerItem, retry(), selectedCctv, videoRef

## Knowledge Gaps
- **41 isolated node(s):** `MarkerItem`, `videoRef`, `selectedCctv`, `loading`, `loadError` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `MarkerItem`, `videoRef`, `selectedCctv` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
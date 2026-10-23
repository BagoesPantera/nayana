# Graph Report - nayana  (2026-10-23)

## Corpus Check
- 11 files · ~1,129 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 55 nodes · 44 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95058cbf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- cctv-proxy.ts
- tsconfig.json
- Nuxt Minimal Starter
- package.json
- dependencies
- AGENTS.md
- index.vue

## God Nodes (most connected - your core abstractions)
1. `scripts` - 6 edges
2. `Nuxt Minimal Starter` - 4 edges
3. `rewriteHlsUrls()` - 3 edges
4. `hls.js` - 2 edges
5. `leaflet` - 2 edges
6. `nuxt` - 2 edges
7. `vue` - 2 edges
8. `vue-router` - 2 edges
9. `@nuxtjs/tailwindcss` - 2 edges
10. `@types/leaflet` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 1 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, generate, postinstall, preview

### Community 2 - "cctv-proxy.ts"
Cohesion: 0.47
Nodes (4): handleCctvProxy(), isAllowedSegmentTarget(), PROXY_HEADERS, rewriteHlsUrls()

### Community 6 - "Nuxt Minimal Starter"
Cohesion: 0.40
Nodes (4): Development Server, Nuxt Minimal Starter, Production, Setup

### Community 7 - "package.json"
Cohesion: 0.22
Nodes (8): @nuxtjs/tailwindcss, devDependencies, @nuxtjs/tailwindcss, @types/leaflet, name, private, type, @types/leaflet

### Community 8 - "dependencies"
Cohesion: 0.18
Nodes (11): nuxt, dependencies, hls.js, leaflet, nuxt, vue, vue-router, hls.js (+3 more)

### Community 13 - "index.vue"
Cohesion: 0.33
Nodes (4): mapEl, MarkerItem, selectedCctv, videoRef

## Knowledge Gaps
- **26 isolated node(s):** `MarkerItem`, `mapEl`, `selectedCctv`, `videoRef`, `name` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `MarkerItem`, `mapEl`, `selectedCctv` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
# Graph Report - nayana  (2026-10-23)

## Corpus Check
- 10 files · ~394 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 41 nodes · 32 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `32f2c60f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- nuxt
- scripts
- package.json
- tsconfig.json
- Nuxt Minimal Starter
- devDependencies
- dependencies
- AGENTS.md
- leaflet
- vue
- vue-router

## God Nodes (most connected - your core abstractions)
1. `scripts` - 6 edges
2. `Nuxt Minimal Starter` - 4 edges
3. `hls.js` - 2 edges
4. `leaflet` - 2 edges
5. `nuxt` - 2 edges
6. `vue` - 2 edges
7. `vue-router` - 2 edges
8. `@nuxtjs/tailwindcss` - 2 edges
9. `@types/leaflet` - 2 edges
10. `private` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (16 total, 6 thin omitted)

### Community 1 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, generate, postinstall, preview

### Community 2 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, type

### Community 6 - "Nuxt Minimal Starter"
Cohesion: 0.40
Nodes (4): Development Server, Nuxt Minimal Starter, Production, Setup

### Community 7 - "devDependencies"
Cohesion: 0.40
Nodes (5): @nuxtjs/tailwindcss, devDependencies, @nuxtjs/tailwindcss, @types/leaflet, @types/leaflet

### Community 8 - "dependencies"
Cohesion: 0.67
Nodes (3): hls.js, dependencies, hls.js

## Knowledge Gaps
- **21 isolated node(s):** `name`, `type`, `private`, `build`, `dev` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `nuxt`, `package.json`, `leaflet`, `vue`, `vue-router`?**
  _High betweenness centrality (0.244) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `name`, `type`, `private` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
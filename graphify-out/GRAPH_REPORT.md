# Graph Report - nayana  (2026-10-23)

## Corpus Check
- 5 files · ~209 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 27 nodes · 22 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e76b83ce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- scripts
- package.json
- tsconfig.json
- Nuxt Minimal Starter

## God Nodes (most connected - your core abstractions)
1. `scripts` - 6 edges
2. `Nuxt Minimal Starter` - 4 edges
3. `nuxt` - 2 edges
4. `vue` - 2 edges
5. `vue-router` - 2 edges
6. `private` - 1 edges
7. `build` - 1 edges
8. `dev` - 1 edges
9. `generate` - 1 edges
10. `preview` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (7 total, 1 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.29
Nodes (7): nuxt, dependencies, nuxt, vue, vue-router, vue, vue-router

### Community 1 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, generate, postinstall, preview

### Community 2 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, type

### Community 6 - "Nuxt Minimal Starter"
Cohesion: 0.40
Nodes (4): Development Server, Nuxt Minimal Starter, Production, Setup

## Knowledge Gaps
- **16 isolated node(s):** `name`, `type`, `private`, `build`, `dev` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `name`, `type`, `private` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._
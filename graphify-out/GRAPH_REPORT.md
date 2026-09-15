# Codebase Architectural Report

> **Auto-generated** by graphify knowledge graph analysis  
> **Purpose**: Dependency map, connection analysis, subsystem breakdown, and quality hotspots.

---

## 1. Executive Summary

- **Total Components**: `82`
- **Total Connections**: `89`
- **Subsystem Modules**: `1`
- **Dependency Types**: `5`

**Key Architectural Hubs:**

| # | Component | File | Type | Connections |
|---|-----------|------|------|-------------|
| 1 | `devDependencies` | `frontend/package.json` | function | 12 |
| 2 | `LandingPage.jsx` | `frontend/src/pages/LandingPage.jsx` | class | 11 |
| 3 | `package.json` | `frontend/package.json` | function | 7 |
| 4 | `storage.js` | `frontend/src/utils/storage.js` | file | 7 |
| 5 | `App.jsx` | `frontend/src/App.jsx` | class | 6 |
| 6 | `scripts` | `frontend/package.json` | function | 5 |
| 7 | `dependencies` | `frontend/package.json` | function | 5 |
| 8 | `BlogCard.jsx` | `frontend/src/components/BlogCard.jsx` | class | 5 |

---

## 2. Dependency & Connection Analysis

### Relationship Types

| Relationship | Count | Share |
|-------------|-------|-------|
| `contains` | 45 | 51% |
| `imports` | 24 | 27% |
| `imports_from` | 9 | 10% |
| `calls` | 9 | 10% |
| `references` | 2 | 2% |

### Hub Dependency Diagram

```mermaid
flowchart TD
    frontend_package_devdependencies["devDependencies"]
    frontend_src_pages_landingpage["LandingPage.jsx"]
    frontend_package["package.json"]
    frontend_src_utils_storage["storage.js"]
    frontend_src_app["App.jsx"]
    frontend_package_scripts["scripts"]
    frontend_package_dependencies["dependencies"]
    frontend_src_components_blogcard["BlogCard.jsx"]
    frontend_package <--> frontend_package_dependencies
    frontend_package <--> frontend_package_devdependencies
    frontend_package <--> frontend_package_scripts
    frontend_src_app <--> frontend_src_pages_landingpage
    frontend_src_components_blogcard <--> frontend_src_pages_landingpage
    frontend_src_pages_landingpage <--> frontend_src_utils_storage
```

### Most Connected Pairs

| Component A | Component B | Shared Connections |
|-------------|-------------|-------------------|
| `capturePageErrors()` | `discovery.spec.js` | 1 |
| `dependencies` | `package.json` | 1 |
| `devDependencies` | `package.json` | 1 |
| `name` | `package.json` | 1 |
| `package.json` | `private` | 1 |
| `package.json` | `scripts` | 1 |
| `package.json` | `type` | 1 |
| `package.json` | `version` | 1 |
| `build` | `scripts` | 1 |
| `dev` | `scripts` | 1 |

---

## 3. Subsystem & Module Breakdown

### 3.1 frontend/package.json
**Nodes**: `82`  
**Files**: `.engine/memory/decisions.md`, `frontend/e2e/discovery.spec.js`, `frontend/index.html`, `frontend/package.json`, `frontend/playwright.config.js`, `frontend/postcss.config.js` +14 more

| Component | Type | File | Connections |
|-----------|------|------|-------------|
| `devDependencies` | function | `frontend/package.json` | 12 |
| `LandingPage.jsx` | class | `frontend/src/pages/LandingPage.jsx` | 11 |
| `package.json` | function | `frontend/package.json` | 7 |
| `storage.js` | file | `frontend/src/utils/storage.js` | 7 |
| `App.jsx` | class | `frontend/src/App.jsx` | 6 |
| `scripts` | function | `frontend/package.json` | 5 |
| `dependencies` | function | `frontend/package.json` | 5 |
| `BlogCard.jsx` | class | `frontend/src/components/BlogCard.jsx` | 5 |
| `LandingPage()` | class | `frontend/src/pages/LandingPage.jsx` | 5 |
| `LandingPage.test.jsx` | class | `frontend/src/pages/LandingPage.test.jsx` | 5 |


---

## 4. API Reference

Public classes and functions by subsystem.

### frontend/package.json

| Name | Type | File | Connections |
|------|------|------|-------------|
| `devDependencies` | function | `frontend/package.json` | 12 |
| `LandingPage.jsx` | class | `frontend/src/pages/LandingPage.jsx` | 11 |
| `package.json` | function | `frontend/package.json` | 7 |
| `App.jsx` | class | `frontend/src/App.jsx` | 6 |
| `scripts` | function | `frontend/package.json` | 5 |
| `dependencies` | function | `frontend/package.json` | 5 |
| `BlogCard.jsx` | class | `frontend/src/components/BlogCard.jsx` | 5 |
| `LandingPage()` | class | `frontend/src/pages/LandingPage.jsx` | 5 |

---

## 5. Code Quality & Architectural Risk Hotspots

### Component Type Distribution

| Type | Count | Share |
|------|-------|-------|
| function | 47 | 57% |
| class | 15 | 18% |
| method | 12 | 15% |
| file | 8 | 10% |

### Dependency Cycles

**20** circular dependency loop(s) detected:

| # | Cycle Path |
|---|-----------|
| 1 | `frontend_src_utils_storage → frontend_src_utils_storage_writearray → frontend_src_utils_storage_saveusers` |
| 2 | `frontend_src_utils_storage → frontend_src_utils_storage_saveposts → frontend_src_utils_storage_writearray` |
| 3 | `frontend_src_utils_storage_getposts → frontend_src_utils_storage_readarray → frontend_src_utils_storage` |
| 4 | `frontend_src_utils_storage_getusers → frontend_src_utils_storage_readarray → frontend_src_utils_storage` |
| 5 | `frontend_src_pages_landingpage → frontend_src_utils_storage_getposts → frontend_src_utils_storage` |
| 6 | `frontend_src_pages_landingpage → frontend_src_pages_landingpage_landingpage → frontend_src_utils_storage_getposts` |
| 7 | `frontend_src_app → frontend_src_pages_landingpage_test → frontend_src_pages_landingpage_landingpage` |
| 8 | `frontend_src_pages_landingpage → frontend_src_pages_landingpage_test → frontend_src_pages_landingpage_landingpage` |
| 9 | `frontend_src_app → frontend_src_app_app → frontend_src_pages_landingpage_test` |
| 10 | `frontend_src_app → frontend_src_main → frontend_src_app_app` |

### Orphaned Components

**8** isolated node(s) with no connections:

| Component | File |
|-----------|------|
| `playwright.config.js` | `frontend/playwright.config.js` |
| `postcss.config.js` | `frontend/postcss.config.js` |
| `setup.js` | `frontend/src/test/setup.js` |
| `tailwind.config.js` | `frontend/tailwind.config.js` |
| `vite.config.js` | `frontend/vite.config.js` |
| `vitest.config.js` | `frontend/vitest.config.js` |
| `PRD-only Architecture` | `.engine/memory/decisions.md` |
| `Discovery Todo` | `todos.yaml` |

---

## 6. How to Navigate

1. **Interactive D3 Map** — open `graph.html` to explore node connections visually.
2. **Knowledge Graph Queries** — use MCP tools (`graph_query`, `graph_explain_node`, `graph_impact_radius`).

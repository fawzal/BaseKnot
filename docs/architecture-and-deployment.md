# Architecture and Production Deployment Guide: UX Logic Thread

## 1. Clean Architecture Overview

UX Logic Thread (Traceability Mapper) adheres to **Clean Architecture** and the **Dependency Inversion Principle (DIP)**. The application cleanly decouples UI representation, domain logic, data access abstractions, and persistent storage mechanisms into distinct architectural boundaries.

```mermaid
flowchart TD
    subgraph UI_Layer ["Presentation Layer (React 19 & Tailwind CSS)"]
        UI_Canvas["MindMapCanvas (React Flow Canvas)"]
        UI_Modals["AddNodeModal / EditNodeModal"]
        UI_Dock["CanvasBottomDock / CanvasTopBar"]
        UI_Drawer["AIPromptExportDrawer / DeleteConfirmDialog"]
    end

    subgraph Service_Layer ["Application & Domain Service Layer (Pure TS)"]
        ResearchSvc["ResearchService"]
        FeatureSvc["FeatureService"]
        SitemapSvc["SitemapService"]
        TokenSvc["TokenService"]
        TraceabilitySvc["TraceabilityService (Graph & Cascades)"]
        ServiceFactory["ServiceFactory (Dependency Injection)"]
    end

    subgraph Interface_Layer ["Repository Contracts (Interfaces)"]
        IResearchRepo["IResearchRepository"]
        IFeatureRepo["IFeatureRepository"]
        ISitemapRepo["ISitemapRepository"]
        ITokenRepo["ITokenRepository"]
        ITraceabilityRepo["ITraceabilityRepository"]
    end

    subgraph Adapter_Layer ["Infrastructure Adapters"]
        subgraph Supabase_Adapter ["Supabase Adapter (@supabase/supabase-js)"]
            SB_Client["SupabaseClient Singleton"]
            SB_Research["SupabaseResearchRepository"]
            SB_Feature["SupabaseFeatureRepository"]
            SB_Sitemap["SupabaseSitemapRepository"]
            SB_Token["SupabaseTokenRepository"]
            SB_Trace["SupabaseTraceabilityRepository"]
        end

        subgraph Resilient_Decorator ["Resilient Fallback Decorator"]
            ResilientRepos["Resilient*Repository\n(Primary Supabase -> Fallback Mock)"]
        end

        subgraph Mock_Adapter ["Local / Mock Adapter (LocalStorage)"]
            MockStorage["MockStorageEngine (Seed Data & Cascade Logic)"]
            Mock_Research["MockResearchRepository"]
            Mock_Feature["MockFeatureRepository"]
            Mock_Sitemap["MockSitemapRepository"]
            Mock_Token["MockTokenRepository"]
            Mock_Trace["MockTraceabilityRepository"]
        end
    end

    subgraph Persistence_Layer ["Physical Persistence"]
        PostgresDB[("PostgreSQL 15+ (Supabase Managed)\n4-Tier Relational Schema with RLS & B-Tree Indexes")]
        BrowserStorage[("Browser LocalStorage (Zero-Config Offline Prototype)")]
    end

    %% UI to Service
    UI_Canvas --> ResearchSvc & FeatureSvc & SitemapSvc & TokenSvc & TraceabilitySvc
    UI_Modals --> ResearchSvc & FeatureSvc & SitemapSvc & TokenSvc
    UI_Dock --> ResearchSvc & FeatureSvc & SitemapSvc & TokenSvc
    UI_Drawer --> TraceabilitySvc

    %% Service to Repository Interfaces
    ServiceFactory -.->|Injects Contracts| ResearchSvc & FeatureSvc & SitemapSvc & TokenSvc & TraceabilitySvc
    ResearchSvc --> IResearchRepo
    FeatureSvc --> IFeatureRepo
    SitemapSvc --> ISitemapRepo
    TokenSvc --> ITokenRepo
    TraceabilitySvc --> ITraceabilityRepo & IResearchRepo & IFeatureRepo & ISitemapRepo & ITokenRepo

    %% Interfaces to Implementations
    IResearchRepo <|.. SB_Research
    IFeatureRepo <|.. SB_Feature
    ISitemapRepo <|.. SB_Sitemap
    ITokenRepo <|.. SB_Token
    ITraceabilityRepo <|.. SB_Trace

    IResearchRepo <|.. Mock_Research
    IFeatureRepo <|.. Mock_Feature
    ISitemapRepo <|.. Mock_Sitemap
    ITokenRepo <|.. Mock_Token
    ITraceabilityRepo <|.. Mock_Trace

    IResearchRepo <|.. ResilientRepos
    ResilientRepos --> SB_Research & Mock_Research

    %% Adapters to Persistence
    SB_Client --> PostgresDB
    SB_Research & SB_Feature & SB_Sitemap & SB_Token & SB_Trace --> SB_Client
    Mock_Research & Mock_Feature & Mock_Sitemap & Mock_Token & Mock_Trace --> MockStorage
    MockStorage --> BrowserStorage
```

### Key Architectural Characteristics
1. **Zero UI Leakage:** Presentation components (`src/components/canvas/*`, `src/App.tsx`) know nothing about PostgreSQL syntax, `@supabase/supabase-js`, or `localStorage`. They depend solely on Domain Services (`researchService`, `featureService`, etc.).
2. **Dependency Inversion:** Services depend on abstract interfaces (`IResearchRepository`, `IFeatureRepository`, etc.) rather than concrete database SDKs.
3. **Resilient Fallback Strategy:** If Supabase credentials are missing or the database connection is interrupted, the `ResilientRepository` decorator transparently routes operations to the localStorage mock engine without throwing unhandled exceptions or presenting a white screen.
4. **Waterfall Elimination (70 Vercel React Best Practices):** Data operations parallelize network roundtrips using `Promise.all` across independent database tables, avoiding N+1 serial network cascades.

---

## 2. Directory Structure & File Map

```
d:\MindMap\
├── docs\
│   ├── architecture-and-deployment.md  # (This Document) Production Blueprint
│   └── frontend-architecture.md         # Component Layout & Interaction Guide
├── supabase\
│   ├── migrations\
│   │   ├── 001_initial_schema.sql       # DDL, Foreign Keys, Indexes, RLS
│   │   └── 002_canvas_edge_disconnect_support.sql # Nullable FKs for canvas restructuring
│   ├── seed.sql                         # Initial dataset for staging/local Supabase
│   └── README.md                        # Database documentation
├── src\
│   ├── services\                        # Core Architecture Layer
│   │   ├── api\                         # 1. Repository Interface Contracts
│   │   │   ├── IResearchRepository.ts
│   │   │   ├── IFeatureRepository.ts
│   │   │   ├── ISitemapRepository.ts
│   │   │   ├── ITokenRepository.ts
│   │   │   ├── ITraceabilityRepository.ts
│   │   │   └── index.ts
│   │   ├── mock\                        # 2. LocalStorage Adapter
│   │   │   ├── mockStorage.ts           # Storage engine, seeds & cascade logic
│   │   │   ├── MockResearchRepository.ts
│   │   │   ├── MockFeatureRepository.ts
│   │   │   ├── MockSitemapRepository.ts
│   │   │   ├── MockTokenRepository.ts
│   │   │   ├── MockTraceabilityRepository.ts
│   │   │   └── index.ts
│   │   ├── supabase\                    # 3. Supabase PostgreSQL Adapter
│   │   │   ├── supabaseClient.ts        # Typed client & config checks
│   │   │   ├── SupabaseResearchRepository.ts
│   │   │   ├── SupabaseFeatureRepository.ts
│   │   │   ├── SupabaseSitemapRepository.ts
│   │   │   ├── SupabaseTokenRepository.ts
│   │   │   ├── SupabaseTraceabilityRepository.ts
│   │   │   └── index.ts
│   │   ├── resilientRepositories.ts     # 4. Decorator Fallback Implementations
│   │   ├── researchService.ts           # 5. Domain Business Services
│   │   ├── featureService.ts
│   │   ├── sitemapService.ts
│   │   ├── tokenService.ts
│   │   ├── traceabilityService.ts
│   │   ├── serviceFactory.ts            # 6. Service Factory & Dependency Injection
│   │   ├── dataService.ts               # 7. Backward Compatibility Facade
│   │   └── index.ts                     # Unified Service Export Point
│   ├── types\
│   │   ├── database.ts                  # Business entity interfaces
│   │   └── database.types.ts            # Generated Supabase PostgreSQL types
│   ├── App.tsx                          # App root wired directly to Services
│   └── main.tsx                         # Entry point
```

---

## 3. Production Deployment Blueprint

### A. Frontend Deployment (Vercel / Cloudflare Pages / Netlify)

The frontend is a static Single Page Application (SPA) bundled with Vite and React 19.

#### 1. Platform Settings
| Configuration Key | Recommended Value | Note |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Standard Vite detection |
| **Build Command** | `npm run build` | Runs `tsc -b && vite build` |
| **Output Directory** | `dist` | Generated static bundle assets |
| **Node.js Version** | `20.x` or `22.x` | Modern LTS runtime |

#### 2. Environment Variables Configuration
Configure these environment variables in your deployment dashboard (e.g. Vercel Project Settings > Environment Variables):

```bash
# Production Supabase Project URL (from Supabase Dashboard -> Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Production Supabase Public Anon Key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> [!IMPORTANT]
> Never expose the `SUPABASE_SERVICE_ROLE_KEY` in the client frontend bundle. Only `VITE_SUPABASE_ANON_KEY` is designed to be shipped in client-side code, guarded by PostgreSQL Row Level Security (RLS).

#### 3. Single-Page App (SPA) URL Rewrites
To prevent 404 errors when refreshing on deep routes:

- **For Vercel (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- **For Netlify (`public/_redirects`):**
```
/*    /index.html   200
```

- **For Cloudflare Pages (`public/_routes.json` or fallback rule):**
Direct all non-asset requests to `/index.html`.

---

### B. Backend Deployment (Supabase Managed PostgreSQL)

#### 1. Provisioning
1. Create a new organization and project at [Supabase](https://supabase.com).
2. Choose a region closest to your target user base (e.g., `ap-southeast-1` for Southeast Asia).
3. Record the generated **Database Password**, **Project URL**, and **Anon Key**.

#### 2. Executing Database Migrations
Migrations are managed declaratively in `supabase/migrations/`:
- `001_initial_schema.sql`: Core 4-tier tables, triggers, B-Tree indexes on all foreign keys, and RLS policies.
- `002_canvas_edge_disconnect_support.sql`: Nullable foreign key constraints to allow canvas node disconnection without breaking relational cascades.

##### Method 1: Automated via Supabase CLI (Recommended)
```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Authenticate CLI
supabase login

# 3. Link project
supabase link --project-ref your-project-id

# 4. Push migrations to remote database
supabase db push
```

##### Method 2: Supabase Web Dashboard SQL Editor
1. Navigate to **SQL Editor** in the Supabase Dashboard.
2. Open and execute `supabase/migrations/001_initial_schema.sql`.
3. Open and execute `supabase/migrations/002_canvas_edge_disconnect_support.sql`.
4. (Optional) Run `supabase/seed.sql` to populate initial demo data.

#### 3. Row Level Security (RLS) Verification
All 4 relational tables (`ux_research`, `ux_features`, `ux_sitemap`, `ux_ui_tokens`) enforce Row Level Security:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```
Ensure all return `rowsecurity = true`.

#### 4. Connection Pooling (Supavisor)
For high concurrent traffic, connect your services via **Supavisor connection pooling**:
- **Transaction Mode (Port 6543):** Ideal for serverless API functions and ephemeral connections.
- **Session Mode (Port 5432):** Direct persistent PostgreSQL connection (used by Supabase migrations and persistent workers).

---

### C. CI/CD Workflow Best Practices (GitHub Actions)

Create `.github/workflows/deploy.yml` in your repository root:

```yaml
name: CI/CD Pipeline — UX Logic Thread

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Typecheck, Build & E2E Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Typecheck & Build
        run: npm run build

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright E2E Tests
        run: npx playwright test
        env:
          CI: true

  deploy-migrations:
    name: Deploy Database Migrations
    needs: validate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Push Database Migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

---

## 4. Verification and Health Check Runbook

To verify production readiness:

1. **Clean TypeScript Build Check:**
   ```bash
   npm run build
   ```
   Must output `✓ built in X.XXs` with exit code 0.

2. **Automated E2E Suite Check:**
   ```bash
   npx playwright test
   ```
   All 10 tests covering node creation, edge disconnection, cascade delete guards, and AI context export must pass.

3. **Backend Health & Connection Status:**
   - In the application Header / Top Bar, verify that the database status badge displays **"Supabase Connected"** in emerald green when environment variables are set.
   - If in local development without credentials, verify that the badge shows **"Local Mock Mode"** in amber, and the canvas remains fully interactive.

-- ============================================================================
-- SCRIPT DEPLOY DATABASE SUPABASE: PRODUCTION SCHEMA & SEED DATA
-- Product: UX Logic Thread (Canvas Traceability Mapper)
--
-- Instruksi Eksekusi:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Klik menu 'SQL Editor' di sidebar kiri
-- 3. Buat New Query, paste seluruh isi skrip ini, lalu klik 'Run' (atau Ctrl+Enter)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Extensions & Helper Functions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function otomatis untuk update timestamp 'updated_at'
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. Table: ux_research (Tier 1: Upstream User Research & Insights)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ux_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_research IS 'Stores raw user research insights, fieldwork findings, and pain points.';

DROP TRIGGER IF EXISTS trg_ux_research_updated_at ON ux_research;
CREATE TRIGGER trg_ux_research_updated_at
    BEFORE UPDATE ON ux_research
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. Table: ux_features (Tier 2: Feature Mapping Hub)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ux_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_name TEXT NOT NULL,
    description TEXT,
    research_id UUID REFERENCES ux_research(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_features IS 'Planned product features tagged directly to research insights (nullable for unlinked canvas nodes).';

CREATE INDEX IF NOT EXISTS idx_ux_features_research_id ON ux_features (research_id);

DROP TRIGGER IF EXISTS trg_ux_features_updated_at ON ux_features;
CREATE TRIGGER trg_ux_features_updated_at
    BEFORE UPDATE ON ux_features
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Table: ux_sitemap (Tier 3: Information Architecture & Placement)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ux_sitemap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL,
    hierarchy_level TEXT NOT NULL CHECK (
        hierarchy_level IN ('header', 'hero', 'body', 'sidebar', 'footer', 'floating', 'modal')
    ),
    feature_id UUID REFERENCES ux_features(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_sitemap IS 'Information architecture node placing features into specific pages and visual hierarchies.';

CREATE INDEX IF NOT EXISTS idx_ux_sitemap_feature_id ON ux_sitemap (feature_id);

DROP TRIGGER IF EXISTS trg_ux_sitemap_updated_at ON ux_sitemap;
CREATE TRIGGER trg_ux_sitemap_updated_at
    BEFORE UPDATE ON ux_sitemap
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Table: ux_ui_tokens (Tier 4: Downstream UI Components & Design Tokens)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ux_ui_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_type TEXT NOT NULL,
    design_token TEXT NOT NULL,
    sitemap_id UUID REFERENCES ux_sitemap(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_ui_tokens IS 'Downstream UI tokens and component specifications tied directly to sitemap nodes.';

CREATE INDEX IF NOT EXISTS idx_ux_ui_tokens_sitemap_id ON ux_ui_tokens (sitemap_id);

DROP TRIGGER IF EXISTS trg_ux_ui_tokens_updated_at ON ux_ui_tokens;
CREATE TRIGGER trg_ux_ui_tokens_updated_at
    BEFORE UPDATE ON ux_ui_tokens
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Configuration
-- ----------------------------------------------------------------------------
ALTER TABLE ux_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_sitemap ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_ui_tokens ENABLE ROW LEVEL SECURITY;

-- 5.1 Policies for ux_research
DROP POLICY IF EXISTS "Allow public read access on ux_research" ON ux_research;
CREATE POLICY "Allow public read access on ux_research"
    ON ux_research FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on ux_research" ON ux_research;
CREATE POLICY "Allow public insert on ux_research"
    ON ux_research FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on ux_research" ON ux_research;
CREATE POLICY "Allow public update on ux_research"
    ON ux_research FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on ux_research" ON ux_research;
CREATE POLICY "Allow public delete on ux_research"
    ON ux_research FOR DELETE TO anon, authenticated USING (true);

-- 5.2 Policies for ux_features
DROP POLICY IF EXISTS "Allow public read access on ux_features" ON ux_features;
CREATE POLICY "Allow public read access on ux_features"
    ON ux_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on ux_features" ON ux_features;
CREATE POLICY "Allow public insert on ux_features"
    ON ux_features FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on ux_features" ON ux_features;
CREATE POLICY "Allow public update on ux_features"
    ON ux_features FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on ux_features" ON ux_features;
CREATE POLICY "Allow public delete on ux_features"
    ON ux_features FOR DELETE TO anon, authenticated USING (true);

-- 5.3 Policies for ux_sitemap
DROP POLICY IF EXISTS "Allow public read access on ux_sitemap" ON ux_sitemap;
CREATE POLICY "Allow public read access on ux_sitemap"
    ON ux_sitemap FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on ux_sitemap" ON ux_sitemap;
CREATE POLICY "Allow public insert on ux_sitemap"
    ON ux_sitemap FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on ux_sitemap" ON ux_sitemap;
CREATE POLICY "Allow public update on ux_sitemap"
    ON ux_sitemap FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on ux_sitemap" ON ux_sitemap;
CREATE POLICY "Allow public delete on ux_sitemap"
    ON ux_sitemap FOR DELETE TO anon, authenticated USING (true);

-- 5.4 Policies for ux_ui_tokens
DROP POLICY IF EXISTS "Allow public read access on ux_ui_tokens" ON ux_ui_tokens;
CREATE POLICY "Allow public read access on ux_ui_tokens"
    ON ux_ui_tokens FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on ux_ui_tokens" ON ux_ui_tokens;
CREATE POLICY "Allow public insert on ux_ui_tokens"
    ON ux_ui_tokens FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on ux_ui_tokens" ON ux_ui_tokens;
CREATE POLICY "Allow public update on ux_ui_tokens"
    ON ux_ui_tokens FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on ux_ui_tokens" ON ux_ui_tokens;
CREATE POLICY "Allow public delete on ux_ui_tokens"
    ON ux_ui_tokens FOR DELETE TO anon, authenticated USING (true);

-- ----------------------------------------------------------------------------
-- 6. Verification Query
-- ----------------------------------------------------------------------------
SELECT 
    'ux_research' AS table_name, count(*) AS total_rows FROM ux_research
UNION ALL
SELECT 
    'ux_features' AS table_name, count(*) AS total_rows FROM ux_features
UNION ALL
SELECT 
    'ux_sitemap' AS table_name, count(*) AS total_rows FROM ux_sitemap
UNION ALL
SELECT 
    'ux_ui_tokens' AS table_name, count(*) AS total_rows FROM ux_ui_tokens;

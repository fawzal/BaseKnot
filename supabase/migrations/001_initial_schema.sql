-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Product: UX Logic Thread (Traceability Mapper)
-- Description: Core schema defining the 4-tier relational traceability chain:
--              1. ux_research  -> Hulu: User complaints & field research insights
--              2. ux_features  -> Feature mapping bound to research insights
--              3. ux_sitemap   -> Information architecture & hierarchy placement
--              4. ux_ui_tokens -> Hilir: Concrete UI component & design token definitions
--
-- Adheres to Supabase Postgres Best Practices:
--   - UUID primary keys with gen_random_uuid()
--   - TIMESTAMPTZ with now() defaults
--   - Explicit ON DELETE CASCADE for relational integrity
--   - B-Tree indexes on all foreign key columns (query-missing-indexes rule)
--   - Row Level Security (RLS) enabled on all tables with explicit policies
--   - Moddatetime trigger function for automated updated_at timestamps
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Shared Utility Functions
-- ----------------------------------------------------------------------------

-- Trigger function to automatically maintain updated_at timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. Table: ux_research (Tier 1: Upstream Research Hub)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ux_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_research IS 'Stores raw user research insights, fieldwork findings, and pain points.';
COMMENT ON COLUMN ux_research.id IS 'Unique identifier for the research insight.';
COMMENT ON COLUMN ux_research.insight_text IS 'Zero-friction raw text containing user pain point or research finding.';
COMMENT ON COLUMN ux_research.created_at IS 'Timestamp when research insight was logged.';
COMMENT ON COLUMN ux_research.updated_at IS 'Timestamp when research insight was last modified.';

-- Trigger for ux_research
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
    research_id UUID NOT NULL REFERENCES ux_research(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_features IS 'Planned product features tagged directly to a supporting research insight.';
COMMENT ON COLUMN ux_features.id IS 'Unique identifier for the feature.';
COMMENT ON COLUMN ux_features.feature_name IS 'Concise title or tag of the feature.';
COMMENT ON COLUMN ux_features.description IS 'Optional detailed rationale or functional explanation of the feature.';
COMMENT ON COLUMN ux_features.research_id IS 'Foreign key reference to supporting research insight.';

-- Foreign Key B-Tree Index (Supabase Best Practice: schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS idx_ux_features_research_id ON ux_features (research_id);

-- Trigger for ux_features
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
    feature_id UUID NOT NULL REFERENCES ux_features(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_sitemap IS 'Information architecture node placing features into specific pages and visual hierarchies.';
COMMENT ON COLUMN ux_sitemap.id IS 'Unique identifier for the sitemap hierarchy node.';
COMMENT ON COLUMN ux_sitemap.page_name IS 'Target page or screen (e.g., Cart Page, Checkout, Dashboard).';
COMMENT ON COLUMN ux_sitemap.hierarchy_level IS 'Visual or structural section level: header, hero, body, sidebar, footer, floating, modal.';
COMMENT ON COLUMN ux_sitemap.feature_id IS 'Foreign key reference to feature placed on this page node.';

-- Foreign Key B-Tree Index (Supabase Best Practice: schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS idx_ux_sitemap_feature_id ON ux_sitemap (feature_id);

-- Trigger for ux_sitemap
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
    sitemap_id UUID NOT NULL REFERENCES ux_sitemap(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ux_ui_tokens IS 'Downstream UI tokens and component specifications tied directly to sitemap nodes.';
COMMENT ON COLUMN ux_ui_tokens.id IS 'Unique identifier for the UI token record.';
COMMENT ON COLUMN ux_ui_tokens.component_type IS 'Component structure name (e.g., StickyFloatingBar, Card, PrimaryButton).';
COMMENT ON COLUMN ux_ui_tokens.design_token IS 'Design token variables or utility classes (e.g., color/bg/dark, spacing/pad-4).';
COMMENT ON COLUMN ux_ui_tokens.sitemap_id IS 'Foreign key reference to parent sitemap node.';

-- Foreign Key B-Tree Index (Supabase Best Practice: schema-foreign-key-indexes)
CREATE INDEX IF NOT EXISTS idx_ux_ui_tokens_sitemap_id ON ux_ui_tokens (sitemap_id);

-- Trigger for ux_ui_tokens
CREATE TRIGGER trg_ux_ui_tokens_updated_at
    BEFORE UPDATE ON ux_ui_tokens
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Configuration
-- ----------------------------------------------------------------------------
-- Ensure RLS is active on all public relational tables
ALTER TABLE ux_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_sitemap ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_ui_tokens ENABLE ROW LEVEL SECURITY;

-- Operational Policies: Allow read, insert, update, delete for public/anon & authenticated roles.
-- This enables seamless prototype/MVP operations while enforcing database-level boundary rules.

-- 5.1 Policies for ux_research
CREATE POLICY "Allow public read access on ux_research"
    ON ux_research FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on ux_research"
    ON ux_research FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on ux_research"
    ON ux_research FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on ux_research"
    ON ux_research FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5.2 Policies for ux_features
CREATE POLICY "Allow public read access on ux_features"
    ON ux_features FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on ux_features"
    ON ux_features FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on ux_features"
    ON ux_features FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on ux_features"
    ON ux_features FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5.3 Policies for ux_sitemap
CREATE POLICY "Allow public read access on ux_sitemap"
    ON ux_sitemap FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on ux_sitemap"
    ON ux_sitemap FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on ux_sitemap"
    ON ux_sitemap FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on ux_sitemap"
    ON ux_sitemap FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5.4 Policies for ux_ui_tokens
CREATE POLICY "Allow public read access on ux_ui_tokens"
    ON ux_ui_tokens FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on ux_ui_tokens"
    ON ux_ui_tokens FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on ux_ui_tokens"
    ON ux_ui_tokens FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on ux_ui_tokens"
    ON ux_ui_tokens FOR DELETE
    TO anon, authenticated
    USING (true);

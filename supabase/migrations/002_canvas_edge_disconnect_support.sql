-- ============================================================================
-- Migration: 002_canvas_edge_disconnect_support.sql
-- Product: UX Logic Thread (Traceability Mapper)
-- Description: Allows foreign key columns to be nullable so that nodes on
--              the interactive MindMap Canvas can be disconnected/orphaned
--              dynamically when edges are deleted, while retaining ON DELETE CASCADE
--              integrity and B-Tree indexing.
-- ============================================================================

-- 1. ux_features: Allow unlinked features during mindmap canvas restructuring
ALTER TABLE ux_features 
    ALTER COLUMN research_id DROP NOT NULL;

-- 2. ux_sitemap: Allow unlinked sitemap nodes during canvas rearrangement
ALTER TABLE ux_sitemap 
    ALTER COLUMN feature_id DROP NOT NULL;

-- 3. ux_ui_tokens: Allow unlinked UI tokens during canvas rearrangement
ALTER TABLE ux_ui_tokens 
    ALTER COLUMN sitemap_id DROP NOT NULL;

COMMENT ON COLUMN ux_features.research_id IS 'Foreign key reference to supporting research insight (nullable when unlinked in canvas).';
COMMENT ON COLUMN ux_sitemap.feature_id IS 'Foreign key reference to feature placed on this page node (nullable when unlinked in canvas).';
COMMENT ON COLUMN ux_ui_tokens.sitemap_id IS 'Foreign key reference to parent sitemap node (nullable when unlinked in canvas).';

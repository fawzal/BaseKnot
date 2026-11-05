-- ============================================================================
-- Seed Data: seed.sql
-- Product: UX Logic Thread (Traceability Mapper)
-- Description: 1 Full Relational Traceability Chain:
--              1 Research Insight -> 2 Features -> 2 Sitemap Nodes -> 3 UI Tokens
-- ============================================================================

-- Clean existing seed data if present (idempotent seed run)
DELETE FROM ux_research WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- 1. Upstream Research Insight
INSERT INTO ux_research (id, insight_text, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Pengguna mobile sering kehilangan konteks harga akhir dan membatalkan pesanan karena tombol checkout tersembunyi di bawah promosi banner yang padat.',
    '2026-11-01 08:30:00+00',
    '2026-11-01 08:30:00+00'
);

-- 2. Feature Mapping (2 Features tied to 1 Research Insight)
INSERT INTO ux_features (id, feature_name, description, research_id, created_at, updated_at)
VALUES 
(
    'b0000000-0000-0000-0000-000000000001',
    'Sticky Floating Quick-Checkout Bar',
    'Bilah checkout melayang persisten di viewport bawah mobile dengan ringkasan subtotal instan dan aksi sekali ketuk.',
    'a0000000-0000-0000-0000-000000000001',
    '2026-11-01 09:00:00+00',
    '2026-11-01 09:00:00+00'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'Distraction-Free Minimal Cart Review',
    'Tampilan ringkasan daftar belanja yang mengeliminasi banner promosi non-esensial untuk menjaga fokus konversi pesanan.',
    'a0000000-0000-0000-0000-000000000001',
    '2026-11-01 09:15:00+00',
    '2026-11-01 09:15:00+00'
);

-- 3. Sitemap Hierarchy Nodes (2 Nodes tied to Features)
INSERT INTO ux_sitemap (id, page_name, hierarchy_level, feature_id, created_at, updated_at)
VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'Cart & Checkout Review',
    'floating',
    'b0000000-0000-0000-0000-000000000001',
    '2026-11-01 10:00:00+00',
    '2026-11-01 10:00:00+00'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Cart & Checkout Review',
    'body',
    'b0000000-0000-0000-0000-000000000002',
    '2026-11-01 10:05:00+00',
    '2026-11-01 10:05:00+00'
);

-- 4. Downstream UI Design Tokens (3 Tokens tied to Sitemap Nodes)
INSERT INTO ux_ui_tokens (id, component_type, design_token, sitemap_id, created_at, updated_at)
VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    'BottomFloatingBar',
    'color/bg/surface=#0B0B0B, border/top=1px_solid_#262626, backdrop/blur=12px, elevation/shadow=0_-4px_24px_rgba(0,0,0,0.6)',
    'c0000000-0000-0000-0000-000000000001',
    '2026-11-01 11:00:00+00',
    '2026-11-01 11:00:00+00'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'PrimaryCheckoutCTA',
    'color/bg/action=#00E599, color/text=#000000, font/weight=700, font/size=14px, size/height=48px, radius=8px',
    'c0000000-0000-0000-0000-000000000001',
    '2026-11-01 11:10:00+00',
    '2026-11-01 11:10:00+00'
),
(
    'd0000000-0000-0000-0000-000000000003',
    'CartSummaryCard',
    'color/bg/card=#121212, border=1px_solid_#1E1E1E, radius=12px, spacing/padding=16px, typography/body=14px/regular',
    'c0000000-0000-0000-0000-000000000002',
    '2026-11-01 11:15:00+00',
    '2026-11-01 11:15:00+00'
);

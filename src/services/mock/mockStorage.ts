import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';

export const MOCK_STORAGE_KEYS = {
  RESEARCH: 'uxt_research',
  FEATURES: 'uxt_features',
  SITEMAP: 'uxt_sitemap',
  TOKENS: 'uxt_tokens',
} as const;

export const INITIAL_RESEARCH: UXResearch[] = [
  {
    id: 'res-1',
    insight_text: 'Pengguna sering bingung mengapa aksi bulk-delete tidak bisa di-undo saat memproses 50+ item sekaligus.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'res-2',
    insight_text: 'Stakeholder mempertanyakan penempatan floating quick-filter di atas table yang menutupi row header di mobile viewport.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_FEATURES: UXFeature[] = [
  {
    id: 'feat-1',
    feature_name: 'Soft-Delete Staging Drawer & 30-Sec Toast Undo',
    description: 'Menyediakan buffer konfirmasi non-blocking dan undo toast sebelum permanent mutation.',
    research_id: 'res-1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'feat-2',
    feature_name: 'Responsive Filter Drawer & Sticky Filter Pills',
    description: 'Quick-filter dipindahkan menjadi filter chips horizontal yang collapse ke drawer di mobile.',
    research_id: 'res-2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_SITEMAP: UXSitemap[] = [
  {
    id: 'site-1',
    page_name: 'Batch Operations Panel',
    hierarchy_level: 'Modal/Drawer',
    feature_id: 'feat-1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'site-2',
    page_name: 'Workspace Table View',
    hierarchy_level: 'Main Content',
    feature_id: 'feat-2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_TOKENS: UXUIToken[] = [
  {
    id: 'tok-1',
    component_type: 'Toast / Notification Pill',
    design_token: 'bg-surface-elevated text-amber-400 border-amber-500/30 font-mono shadow-glow-sm',
    sitemap_id: 'site-1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tok-2',
    component_type: 'Filter Chip Group',
    design_token: 'bg-surface border-border hover:border-accent text-foreground-muted rounded-full px-3 py-1 text-xs',
    sitemap_id: 'site-2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export class MockStorageEngine {
  private static instance: MockStorageEngine;

  static getInstance(): MockStorageEngine {
    if (!MockStorageEngine.instance) {
      MockStorageEngine.instance = new MockStorageEngine();
    }
    return MockStorageEngine.instance;
  }

  getItem<T>(key: string, defaultVal: T[]): T[] {
    try {
      if (typeof window === 'undefined') return defaultVal;
      const raw = localStorage.getItem(key);
      if (!raw) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(raw);
    } catch {
      return defaultVal;
    }
  }

  setItem<T>(key: string, val: T[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (e) {
      console.warn('MockStorageEngine setItem failed:', e);
    }
  }

  // --- Research Storage ---
  getResearch(): UXResearch[] {
    return this.getItem<UXResearch>(MOCK_STORAGE_KEYS.RESEARCH, INITIAL_RESEARCH);
  }

  setResearch(items: UXResearch[]): void {
    this.setItem(MOCK_STORAGE_KEYS.RESEARCH, items);
  }

  // --- Feature Storage ---
  getFeatures(): UXFeature[] {
    return this.getItem<UXFeature>(MOCK_STORAGE_KEYS.FEATURES, INITIAL_FEATURES);
  }

  setFeatures(items: UXFeature[]): void {
    this.setItem(MOCK_STORAGE_KEYS.FEATURES, items);
  }

  // --- Sitemap Storage ---
  getSitemaps(): UXSitemap[] {
    return this.getItem<UXSitemap>(MOCK_STORAGE_KEYS.SITEMAP, INITIAL_SITEMAP);
  }

  setSitemaps(items: UXSitemap[]): void {
    this.setItem(MOCK_STORAGE_KEYS.SITEMAP, items);
  }

  // --- Token Storage ---
  getTokens(): UXUIToken[] {
    return this.getItem<UXUIToken>(MOCK_STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
  }

  setTokens(items: UXUIToken[]): void {
    this.setItem(MOCK_STORAGE_KEYS.TOKENS, items);
  }

  // --- Cascading delete routines simulating ON DELETE CASCADE ---
  cascadeDeleteResearch(researchId: string): void {
    // 1. Remove research
    const researchItems = this.getResearch().filter(r => r.id !== researchId);
    this.setResearch(researchItems);

    // 2. Find and remove dependent features
    const allFeatures = this.getFeatures();
    const doomedFeatures = allFeatures.filter(f => f.research_id === researchId);
    const remainingFeatures = allFeatures.filter(f => f.research_id !== researchId);
    this.setFeatures(remainingFeatures);

    // 3. Find and remove dependent sitemaps
    const doomedFeatureIds = new Set(doomedFeatures.map(f => f.id));
    const allSitemaps = this.getSitemaps();
    const doomedSitemaps = allSitemaps.filter(s => doomedFeatureIds.has(s.feature_id));
    const remainingSitemaps = allSitemaps.filter(s => !doomedFeatureIds.has(s.feature_id));
    this.setSitemaps(remainingSitemaps);

    // 4. Find and remove dependent tokens
    const doomedSitemapIds = new Set(doomedSitemaps.map(s => s.id));
    const remainingTokens = this.getTokens().filter(t => !doomedSitemapIds.has(t.sitemap_id));
    this.setTokens(remainingTokens);
  }

  cascadeDeleteFeature(featureId: string): void {
    // 1. Remove feature
    const featureItems = this.getFeatures().filter(f => f.id !== featureId);
    this.setFeatures(featureItems);

    // 2. Find and remove dependent sitemaps
    const allSitemaps = this.getSitemaps();
    const doomedSitemaps = allSitemaps.filter(s => s.feature_id === featureId);
    const remainingSitemaps = allSitemaps.filter(s => s.feature_id !== featureId);
    this.setSitemaps(remainingSitemaps);

    // 3. Find and remove dependent tokens
    const doomedSitemapIds = new Set(doomedSitemaps.map(s => s.id));
    const remainingTokens = this.getTokens().filter(t => !doomedSitemapIds.has(t.sitemap_id));
    this.setTokens(remainingTokens);
  }

  cascadeDeleteSitemap(sitemapId: string): void {
    // 1. Remove sitemap
    const sitemapItems = this.getSitemaps().filter(s => s.id !== sitemapId);
    this.setSitemaps(sitemapItems);

    // 2. Remove dependent tokens
    const remainingTokens = this.getTokens().filter(t => t.sitemap_id !== sitemapId);
    this.setTokens(remainingTokens);
  }

  resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_STORAGE_KEYS.RESEARCH, JSON.stringify(INITIAL_RESEARCH));
      localStorage.setItem(MOCK_STORAGE_KEYS.FEATURES, JSON.stringify(INITIAL_FEATURES));
      localStorage.setItem(MOCK_STORAGE_KEYS.SITEMAP, JSON.stringify(INITIAL_SITEMAP));
      localStorage.setItem(MOCK_STORAGE_KEYS.TOKENS, JSON.stringify(INITIAL_TOKENS));
    }
  }

  getFullTraceability(): UXTraceabilityThread[] {
    const researchList = this.getResearch();
    const featuresList = this.getFeatures();
    const sitemapList = this.getSitemaps();
    const tokensList = this.getTokens();

    return researchList.map(research => {
      const relFeatures = featuresList.filter(f => f.research_id === research.id);
      return {
        research,
        features: relFeatures.map(feature => {
          const relSitemap = sitemapList.filter(s => s.feature_id === feature.id);
          return {
            feature,
            sitemapNodes: relSitemap.map(node => ({
              node,
              tokens: tokensList.filter(t => t.sitemap_id === node.id),
            })),
          };
        }),
      };
    });
  }
}

export const mockStorage = MockStorageEngine.getInstance();

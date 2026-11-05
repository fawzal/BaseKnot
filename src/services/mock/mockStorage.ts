import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';

export const MOCK_STORAGE_KEYS = {
  RESEARCH: 'uxt_research',
  FEATURES: 'uxt_features',
  SITEMAP: 'uxt_sitemap',
  TOKENS: 'uxt_tokens',
} as const;

// Default is completely empty for clean production canvas
export const INITIAL_RESEARCH: UXResearch[] = [];
export const INITIAL_FEATURES: UXFeature[] = [];
export const INITIAL_SITEMAP: UXSitemap[] = [];
export const INITIAL_TOKENS: UXUIToken[] = [];

export class MockStorageEngine {
  private static instance: MockStorageEngine;

  static getInstance(): MockStorageEngine {
    if (!MockStorageEngine.instance) {
      MockStorageEngine.instance = new MockStorageEngine();
    }
    return MockStorageEngine.instance;
  }

  constructor() {
    this.purgeLegacyDummyData();
  }

  /**
   * Purges legacy dummy data from user's localStorage so returning visitors
   * get a clean, empty canvas immediately.
   */
  private purgeLegacyDummyData(): void {
    try {
      if (typeof window === 'undefined') return;
      const rawRes = localStorage.getItem(MOCK_STORAGE_KEYS.RESEARCH);
      if (
        rawRes &&
        (rawRes.includes('"res-1"') ||
          rawRes.includes('"res-2"') ||
          rawRes.includes('bulk-delete') ||
          rawRes.includes('quick-filter') ||
          rawRes.includes('a0000000-0000-0000-0000-000000000001'))
      ) {
        localStorage.setItem(MOCK_STORAGE_KEYS.RESEARCH, JSON.stringify([]));
        localStorage.setItem(MOCK_STORAGE_KEYS.FEATURES, JSON.stringify([]));
        localStorage.setItem(MOCK_STORAGE_KEYS.SITEMAP, JSON.stringify([]));
        localStorage.setItem(MOCK_STORAGE_KEYS.TOKENS, JSON.stringify([]));
      }
    } catch {
      // Storage access might be restricted in some iframe contexts
    }
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

  // --- Relational Cascades ---
  cascadeDeleteResearch(researchId: string): void {
    // 1. Remove research
    const researchItems = this.getResearch().filter((r) => r.id !== researchId);
    this.setResearch(researchItems);

    // 2. Find and remove dependent features
    const doomedFeatures = this.getFeatures().filter((f) => f.research_id === researchId);
    const doomedFeatureIds = new Set(doomedFeatures.map((f) => f.id));
    const remainingFeatures = this.getFeatures().filter((f) => f.research_id !== researchId);
    this.setFeatures(remainingFeatures);

    // 3. Find and remove dependent sitemap nodes
    const doomedSitemaps = this.getSitemaps().filter((s) => doomedFeatureIds.has(s.feature_id));
    const doomedSitemapIds = new Set(doomedSitemaps.map((s) => s.id));
    const remainingSitemaps = this.getSitemaps().filter((s) => !doomedFeatureIds.has(s.feature_id));
    this.setSitemaps(remainingSitemaps);

    // 4. Find and remove dependent tokens
    const remainingTokens = this.getTokens().filter((t) => !doomedSitemapIds.has(t.sitemap_id));
    this.setTokens(remainingTokens);
  }

  cascadeDeleteFeature(featureId: string): void {
    // 1. Remove feature
    const featureItems = this.getFeatures().filter((f) => f.id !== featureId);
    this.setFeatures(featureItems);

    // 2. Find and remove dependent sitemaps
    const doomedSitemaps = this.getSitemaps().filter((s) => s.feature_id === featureId);
    const doomedSitemapIds = new Set(doomedSitemaps.map((s) => s.id));
    const remainingSitemaps = this.getSitemaps().filter((s) => s.feature_id !== featureId);
    this.setSitemaps(remainingSitemaps);

    // 3. Find and remove dependent tokens
    const remainingTokens = this.getTokens().filter((t) => !doomedSitemapIds.has(t.sitemap_id));
    this.setTokens(remainingTokens);
  }

  cascadeDeleteSitemap(sitemapId: string): void {
    // 1. Remove sitemap
    const sitemapItems = this.getSitemaps().filter((s) => s.id !== sitemapId);
    this.setSitemaps(sitemapItems);

    // 2. Remove dependent tokens
    const remainingTokens = this.getTokens().filter((t) => t.sitemap_id !== sitemapId);
    this.setTokens(remainingTokens);
  }

  resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_STORAGE_KEYS.RESEARCH, JSON.stringify([]));
      localStorage.setItem(MOCK_STORAGE_KEYS.FEATURES, JSON.stringify([]));
      localStorage.setItem(MOCK_STORAGE_KEYS.SITEMAP, JSON.stringify([]));
      localStorage.setItem(MOCK_STORAGE_KEYS.TOKENS, JSON.stringify([]));
    }
  }

  getFullTraceability(): UXTraceabilityThread[] {
    const researchList = this.getResearch();
    const featuresList = this.getFeatures();
    const sitemapList = this.getSitemaps();
    const tokensList = this.getTokens();

    return researchList.map((research) => {
      const relFeatures = featuresList.filter((f) => f.research_id === research.id);
      return {
        research,
        features: relFeatures.map((feature) => {
          const relSitemap = sitemapList.filter((s) => s.feature_id === feature.id);
          return {
            feature,
            sitemapNodes: relSitemap.map((node) => ({
              node,
              tokens: tokensList.filter((t) => t.sitemap_id === node.id),
            })),
          };
        }),
      };
    });
  }
}

export const mockStorage = MockStorageEngine.getInstance();

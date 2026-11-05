import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';

const STORAGE_KEYS = {
  RESEARCH: 'uxt_research',
  FEATURES: 'uxt_features',
  SITEMAP: 'uxt_sitemap',
  TOKENS: 'uxt_tokens',
};

const INITIAL_RESEARCH: UXResearch[] = [];
const INITIAL_FEATURES: UXFeature[] = [];
const INITIAL_SITEMAP: UXSitemap[] = [];
const INITIAL_TOKENS: UXUIToken[] = [];

class MockStore {
  private get<T>(key: string, defaultVal: T[]): T[] {
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

  private set<T>(key: string, val: T[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Research
  getResearch(): UXResearch[] {
    return this.get<UXResearch>(STORAGE_KEYS.RESEARCH, INITIAL_RESEARCH);
  }

  addResearch(insight_text: string): UXResearch {
    const items = this.getResearch();
    const newItem: UXResearch = {
      id: `res-${Date.now()}`,
      insight_text,
      created_at: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.RESEARCH, [newItem, ...items]);
    return newItem;
  }

  deleteResearch(id: string): void {
    const researchItems = this.getResearch().filter(i => i.id !== id);
    this.set(STORAGE_KEYS.RESEARCH, researchItems);

    // Cascade delete dependent features
    const allFeatures = this.getFeatures();
    const doomedFeatures = allFeatures.filter(f => f.research_id === id);
    const remainingFeatures = allFeatures.filter(f => f.research_id !== id);
    this.set(STORAGE_KEYS.FEATURES, remainingFeatures);

    // Cascade delete sitemaps linked to doomed features
    const doomedFeatureIds = new Set(doomedFeatures.map(f => f.id));
    const allSitemaps = this.getSitemap();
    const doomedSitemaps = allSitemaps.filter(s => doomedFeatureIds.has(s.feature_id));
    const remainingSitemaps = allSitemaps.filter(s => !doomedFeatureIds.has(s.feature_id));
    this.set(STORAGE_KEYS.SITEMAP, remainingSitemaps);

    // Cascade delete tokens linked to doomed sitemaps
    const doomedSitemapIds = new Set(doomedSitemaps.map(s => s.id));
    const remainingTokens = this.getTokens().filter(t => !doomedSitemapIds.has(t.sitemap_id));
    this.set(STORAGE_KEYS.TOKENS, remainingTokens);
  }

  updateResearch(id: string, insight_text: string): UXResearch | null {
    const items = this.getResearch();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], insight_text };
    this.set(STORAGE_KEYS.RESEARCH, items);
    return items[index];
  }

  // Features
  getFeatures(): UXFeature[] {
    return this.get<UXFeature>(STORAGE_KEYS.FEATURES, INITIAL_FEATURES);
  }

  addFeature(feature_name: string, research_id: string, description?: string): UXFeature {
    const items = this.getFeatures();
    const newItem: UXFeature = {
      id: `feat-${Date.now()}`,
      feature_name,
      description: description || null,
      research_id,
      created_at: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.FEATURES, [newItem, ...items]);
    return newItem;
  }

  deleteFeature(id: string): void {
    const featureItems = this.getFeatures().filter(i => i.id !== id);
    this.set(STORAGE_KEYS.FEATURES, featureItems);

    // Cascade delete sitemaps linked to this feature
    const allSitemaps = this.getSitemap();
    const doomedSitemaps = allSitemaps.filter(s => s.feature_id === id);
    const remainingSitemaps = allSitemaps.filter(s => s.feature_id !== id);
    this.set(STORAGE_KEYS.SITEMAP, remainingSitemaps);

    // Cascade delete tokens linked to doomed sitemaps
    const doomedSitemapIds = new Set(doomedSitemaps.map(s => s.id));
    const remainingTokens = this.getTokens().filter(t => !doomedSitemapIds.has(t.sitemap_id));
    this.set(STORAGE_KEYS.TOKENS, remainingTokens);
  }

  updateFeature(id: string, feature_name: string, description?: string): UXFeature | null {
    const items = this.getFeatures();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], feature_name, description: description !== undefined ? description : items[index].description };
    this.set(STORAGE_KEYS.FEATURES, items);
    return items[index];
  }

  updateFeatureParent(id: string, research_id: string | null): UXFeature | null {
    const items = this.getFeatures();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], research_id: research_id || '' };
    this.set(STORAGE_KEYS.FEATURES, items);
    return items[index];
  }

  // Sitemap
  getSitemap(): UXSitemap[] {
    return this.get<UXSitemap>(STORAGE_KEYS.SITEMAP, INITIAL_SITEMAP);
  }

  addSitemap(page_name: string, hierarchy_level: string, feature_id: string): UXSitemap {
    const items = this.getSitemap();
    const newItem: UXSitemap = {
      id: `site-${Date.now()}`,
      page_name,
      hierarchy_level,
      feature_id,
      created_at: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.SITEMAP, [newItem, ...items]);
    return newItem;
  }

  deleteSitemap(id: string): void {
    const sitemapItems = this.getSitemap().filter(i => i.id !== id);
    this.set(STORAGE_KEYS.SITEMAP, sitemapItems);

    // Cascade delete tokens linked to this sitemap
    const remainingTokens = this.getTokens().filter(t => t.sitemap_id !== id);
    this.set(STORAGE_KEYS.TOKENS, remainingTokens);
  }

  updateSitemap(id: string, page_name: string, hierarchy_level: string): UXSitemap | null {
    const items = this.getSitemap();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], page_name, hierarchy_level };
    this.set(STORAGE_KEYS.SITEMAP, items);
    return items[index];
  }

  updateSitemapParent(id: string, feature_id: string | null): UXSitemap | null {
    const items = this.getSitemap();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], feature_id: feature_id || '' };
    this.set(STORAGE_KEYS.SITEMAP, items);
    return items[index];
  }

  // Tokens
  getTokens(): UXUIToken[] {
    return this.get<UXUIToken>(STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
  }

  addToken(component_type: string, design_token: string, sitemap_id: string): UXUIToken {
    const items = this.getTokens();
    const newItem: UXUIToken = {
      id: `tok-${Date.now()}`,
      component_type,
      design_token,
      sitemap_id,
      created_at: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.TOKENS, [newItem, ...items]);
    return newItem;
  }

  deleteToken(id: string): void {
    const items = this.getTokens().filter(i => i.id !== id);
    this.set(STORAGE_KEYS.TOKENS, items);
  }

  updateToken(id: string, component_type: string, design_token: string): UXUIToken | null {
    const items = this.getTokens();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], component_type, design_token };
    this.set(STORAGE_KEYS.TOKENS, items);
    return items[index];
  }

  updateTokenParent(id: string, sitemap_id: string | null): UXUIToken | null {
    const items = this.getTokens();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], sitemap_id: sitemap_id || '' };
    this.set(STORAGE_KEYS.TOKENS, items);
    return items[index];
  }

  // Traceability graph query
  getFullTraceability(): UXTraceabilityThread[] {
    const researchList = this.getResearch();
    const featuresList = this.getFeatures();
    const sitemapList = this.getSitemap();
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

  resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(INITIAL_RESEARCH));
      localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(INITIAL_FEATURES));
      localStorage.setItem(STORAGE_KEYS.SITEMAP, JSON.stringify(INITIAL_SITEMAP));
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(INITIAL_TOKENS));
    }
  }
}

export const mockStore = new MockStore();

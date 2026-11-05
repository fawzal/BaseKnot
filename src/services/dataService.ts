import { services } from './serviceFactory';
import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';

/**
 * Aggregated Data Service Facade.
 * Delegates to modular domain services (`researchService`, `featureService`, etc.)
 * Provides 100% backward compatibility while using the clean decoupled architecture.
 */
export const dataService = {
  isConfigured(): boolean {
    return services.isBackendConnected;
  },

  // Research
  getResearch(): Promise<UXResearch[]> {
    return services.researchService.getAll();
  },
  addResearch(insightText: string): Promise<UXResearch> {
    return services.researchService.create(insightText);
  },
  deleteResearch(id: string): Promise<void> {
    return services.researchService.delete(id);
  },
  updateResearch(id: string, insightText: string): Promise<UXResearch | null> {
    return services.researchService.update(id, insightText);
  },

  // Features
  getFeatures(): Promise<UXFeature[]> {
    return services.featureService.getAll();
  },
  addFeature(featureName: string, researchId: string, description?: string): Promise<UXFeature> {
    return services.featureService.create(featureName, researchId, description);
  },
  deleteFeature(id: string): Promise<void> {
    return services.featureService.delete(id);
  },
  updateFeature(id: string, featureName: string, description?: string): Promise<UXFeature | null> {
    return services.featureService.update(id, featureName, description);
  },
  updateFeatureParent(id: string, researchId: string | null): Promise<UXFeature | null> {
    return services.featureService.updateParent(id, researchId);
  },

  // Sitemap
  getSitemap(): Promise<UXSitemap[]> {
    return services.sitemapService.getAll();
  },
  addSitemap(pageName: string, hierarchyLevel: string, featureId: string): Promise<UXSitemap> {
    return services.sitemapService.create(pageName, hierarchyLevel, featureId);
  },
  deleteSitemap(id: string): Promise<void> {
    return services.sitemapService.delete(id);
  },
  updateSitemap(id: string, pageName: string, hierarchyLevel: string): Promise<UXSitemap | null> {
    return services.sitemapService.update(id, pageName, hierarchyLevel);
  },
  updateSitemapParent(id: string, featureId: string | null): Promise<UXSitemap | null> {
    return services.sitemapService.updateParent(id, featureId);
  },

  // Tokens
  getTokens(): Promise<UXUIToken[]> {
    return services.tokenService.getAll();
  },
  addToken(componentType: string, designToken: string, sitemapId: string): Promise<UXUIToken> {
    return services.tokenService.create(componentType, designToken, sitemapId);
  },
  deleteToken(id: string): Promise<void> {
    return services.tokenService.delete(id);
  },
  updateToken(id: string, componentType: string, designToken: string): Promise<UXUIToken | null> {
    return services.tokenService.update(id, componentType, designToken);
  },
  updateTokenParent(id: string, sitemapId: string | null): Promise<UXUIToken | null> {
    return services.tokenService.updateParent(id, sitemapId);
  },

  // Traceability Graph
  getFullTraceability(): Promise<UXTraceabilityThread[]> {
    return services.traceabilityService.getFullTraceability();
  },

  // Reset Defaults
  resetDefaults(): void {
    services.traceabilityService.resetDefaults();
  },
};

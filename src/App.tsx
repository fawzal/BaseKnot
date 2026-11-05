import { useState, useEffect, useCallback } from 'react';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import {
  researchService,
  featureService,
  sitemapService,
  tokenService,
  traceabilityService,
  isBackendConnected,
} from '@/services';
import { UXResearch, UXFeature, UXSitemap, UXUIToken } from '@/types/database';

export function App() {
  const [researchList, setResearchList] = useState<UXResearch[]>([]);
  const [featuresList, setFeaturesList] = useState<UXFeature[]>([]);
  const [sitemapList, setSitemapList] = useState<UXSitemap[]>([]);
  const [tokenList, setTokenList] = useState<UXUIToken[]>([]);

  // Eliminate waterfalls: fetch all four domains in parallel
  const loadAllData = useCallback(async () => {
    try {
      const [res, feat, site, tok] = await Promise.all([
        researchService.getAll(),
        featureService.getAll(),
        sitemapService.getAll(),
        tokenService.getAll(),
      ]);
      setResearchList(res);
      setFeaturesList(feat);
      setSitemapList(site);
      setTokenList(tok);
    } catch (err) {
      console.error('Failed to load relational UX data:', err);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Research Actions
  const handleAddResearch = async (insightText: string): Promise<UXResearch> => {
    const newItem = await researchService.create(insightText);
    setResearchList((prev) => [newItem, ...prev]);
    return newItem;
  };

  const handleDeleteResearch = async (id: string) => {
    await researchService.delete(id);
    await loadAllData();
  };

  const handleUpdateResearch = async (id: string, text: string) => {
    await researchService.update(id, text);
    await loadAllData();
  };

  // Feature Actions
  const handleAddFeature = async (
    featureName: string,
    researchId: string,
    description?: string
  ): Promise<UXFeature> => {
    const newItem = await featureService.create(featureName, researchId, description);
    setFeaturesList((prev) => [newItem, ...prev]);
    return newItem;
  };

  const handleDeleteFeature = async (id: string) => {
    await featureService.delete(id);
    await loadAllData();
  };

  const handleUpdateFeature = async (id: string, name: string, desc?: string) => {
    await featureService.update(id, name, desc);
    await loadAllData();
  };

  // Sitemap Actions
  const handleAddSitemap = async (
    pageName: string,
    hierarchyLevel: string,
    featureId: string
  ): Promise<UXSitemap> => {
    const newItem = await sitemapService.create(pageName, hierarchyLevel, featureId);
    setSitemapList((prev) => [newItem, ...prev]);
    return newItem;
  };

  const handleDeleteSitemap = async (id: string) => {
    await sitemapService.delete(id);
    await loadAllData();
  };

  const handleUpdateSitemap = async (id: string, page: string, level: string) => {
    await sitemapService.update(id, page, level);
    await loadAllData();
  };

  // UI Token Actions
  const handleAddToken = async (
    componentType: string,
    designToken: string,
    sitemapId: string
  ): Promise<UXUIToken> => {
    const newItem = await tokenService.create(componentType, designToken, sitemapId);
    setTokenList((prev) => [newItem, ...prev]);
    return newItem;
  };

  const handleDeleteToken = async (id: string) => {
    await tokenService.delete(id);
    await loadAllData();
  };

  const handleUpdateToken = async (id: string, comp: string, token: string) => {
    await tokenService.update(id, comp, token);
    await loadAllData();
  };

  // Parent Connection / Disconnection Actions
  const handleUpdateFeatureParent = async (id: string, researchId: string | null) => {
    await featureService.updateParent(id, researchId);
    await loadAllData();
  };

  const handleUpdateSitemapParent = async (id: string, featureId: string | null) => {
    await sitemapService.updateParent(id, featureId);
    await loadAllData();
  };

  const handleUpdateTokenParent = async (id: string, sitemapId: string | null) => {
    await tokenService.updateParent(id, sitemapId);
    await loadAllData();
  };

  // Bulk Delete Action with coordinated domain execution
  const handleBulkDelete = async ({
    researchIds,
    featureIds,
    sitemapIds,
    tokenIds,
  }: {
    researchIds: string[];
    featureIds: string[];
    sitemapIds: string[];
    tokenIds: string[];
  }) => {
    await traceabilityService.bulkDelete({
      researchIds,
      featureIds,
      sitemapIds,
      tokenIds,
    });
    await loadAllData();
  };

  // Reset to seed defaults
  const handleResetDefaults = () => {
    traceabilityService.resetDefaults();
    loadAllData();
  };

  // 100% Full-Screen MindMap Canvas Murni
  return (
    <div className="w-screen h-screen overflow-hidden bg-canvas">
      <MindMapCanvas
        researchList={researchList}
        featuresList={featuresList}
        sitemapList={sitemapList}
        tokenList={tokenList}
        isSupabaseConnected={isBackendConnected()}
        onAddResearch={handleAddResearch}
        onDeleteResearch={handleDeleteResearch}
        onUpdateResearch={handleUpdateResearch}
        onAddFeature={handleAddFeature}
        onDeleteFeature={handleDeleteFeature}
        onUpdateFeature={handleUpdateFeature}
        onAddSitemap={handleAddSitemap}
        onDeleteSitemap={handleDeleteSitemap}
        onUpdateSitemap={handleUpdateSitemap}
        onAddToken={handleAddToken}
        onDeleteToken={handleDeleteToken}
        onUpdateToken={handleUpdateToken}
        onUpdateFeatureParent={handleUpdateFeatureParent}
        onUpdateSitemapParent={handleUpdateSitemapParent}
        onUpdateTokenParent={handleUpdateTokenParent}
        onBulkDelete={handleBulkDelete}
        onResetDefaults={handleResetDefaults}
        onFetchTraceability={() => traceabilityService.getFullTraceability()}
      />
    </div>
  );
}

export default App;

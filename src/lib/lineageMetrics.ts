import { UXResearch, UXFeature, UXSitemap, UXUIToken } from '@/types/database';

export interface LineageMetrics {
  completeCount: number;
  connectedCount: number;
  orphanCount: number;
  totalNodes: number;
  integrityPercentage: number;
  completeEdgeIds: Set<string>;
  completeTokenIds: Set<string>;
}

export function computeLineageMetrics(
  researchList: UXResearch[],
  featuresList: UXFeature[],
  sitemapList: UXSitemap[],
  tokenList: UXUIToken[]
): LineageMetrics {
  const researchMap = new Map(researchList.map((r) => [r.id, r]));
  const featureMap = new Map(featuresList.map((f) => [f.id, f]));
  const sitemapMap = new Map(sitemapList.map((s) => [s.id, s]));

  const completeEdgeIds = new Set<string>();
  const completeTokenIds = new Set<string>();

  // A complete 4-tier chain: Research -> Feature -> Sitemap -> Token
  tokenList.forEach((tok) => {
    if (!tok.sitemap_id || !sitemapMap.has(tok.sitemap_id)) return;
    const site = sitemapMap.get(tok.sitemap_id)!;
    if (!site.feature_id || !featureMap.has(site.feature_id)) return;
    const feat = featureMap.get(site.feature_id)!;
    if (!feat.research_id || !researchMap.has(feat.research_id)) return;
    const res = researchMap.get(feat.research_id)!;

    completeTokenIds.add(tok.id);
    completeEdgeIds.add(`edge-res-${res.id}-feat-${feat.id}`);
    completeEdgeIds.add(`edge-feat-${feat.id}-site-${site.id}`);
    completeEdgeIds.add(`edge-site-${site.id}-tok-${tok.id}`);
  });

  const unlinkedFeatures = featuresList.filter(
    (f) => !f.research_id || !researchMap.has(f.research_id)
  );
  const unlinkedSitemaps = sitemapList.filter(
    (s) => !s.feature_id || !featureMap.has(s.feature_id)
  );
  const unlinkedTokens = tokenList.filter(
    (t) => !t.sitemap_id || !sitemapMap.has(t.sitemap_id)
  );
  const unlinkedResearch = researchList.filter(
    (r) => !featuresList.some((f) => f.research_id === r.id)
  );

  const orphanCount =
    unlinkedFeatures.length +
    unlinkedSitemaps.length +
    unlinkedTokens.length +
    unlinkedResearch.length;

  const totalNodes =
    researchList.length + featuresList.length + sitemapList.length + tokenList.length;

  const connectedCount = Math.max(0, totalNodes - orphanCount);

  const integrityPercentage =
    totalNodes > 0
      ? Math.max(0, Math.min(100, Math.round((connectedCount / totalNodes) * 100)))
      : 100;

  return {
    completeCount: completeTokenIds.size,
    connectedCount,
    orphanCount,
    totalNodes,
    integrityPercentage,
    completeEdgeIds,
    completeTokenIds,
  };
}

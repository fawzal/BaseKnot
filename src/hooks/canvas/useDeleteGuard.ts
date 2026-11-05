import { useState, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { DeleteTargetInfo } from '@/components/canvas/DeleteConfirmationModal';
import { UXResearch, UXFeature, UXSitemap, UXUIToken } from '@/types/database';

interface UseDeleteGuardOptions {
  researchList: UXResearch[];
  featuresList: UXFeature[];
  sitemapList: UXSitemap[];
  tokenList: UXUIToken[];
  onDeleteResearch: (id: string) => Promise<void>;
  onDeleteFeature: (id: string) => Promise<void>;
  onDeleteSitemap: (id: string) => Promise<void>;
  onDeleteToken: (id: string) => Promise<void>;
  onBulkDelete?: (payload: {
    researchIds: string[];
    featureIds: string[];
    sitemapIds: string[];
    tokenIds: string[];
  }) => Promise<void>;
}

export function useDeleteGuard({
  researchList,
  featuresList,
  sitemapList,
  tokenList,
  onDeleteResearch,
  onDeleteFeature,
  onDeleteSitemap,
  onDeleteToken,
  onBulkDelete,
}: UseDeleteGuardOptions) {
  // Cascade Delete Confirmation Modal state (EC-6)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetInfo, setDeleteTargetInfo] = useState<DeleteTargetInfo | null>(null);
  const [pendingDeleteAction, setPendingDeleteAction] = useState<(() => Promise<void>) | null>(null);

  // Dependent calculation helpers for Cascade Deletion Guard (EC-6)
  const calculateResearchDependents = useCallback(
    (resId: string) => {
      const childFeats = featuresList.filter((f) => f.research_id === resId);
      const childFeatIds = new Set(childFeats.map((f) => f.id));
      const childSites = sitemapList.filter((s) => childFeatIds.has(s.feature_id));
      const childSiteIds = new Set(childSites.map((s) => s.id));
      const childToks = tokenList.filter((t) => childSiteIds.has(t.sitemap_id));

      return {
        features: childFeats.length,
        sitemaps: childSites.length,
        tokens: childToks.length,
        total: childFeats.length + childSites.length + childToks.length,
      };
    },
    [featuresList, sitemapList, tokenList]
  );

  const calculateFeatureDependents = useCallback(
    (featId: string) => {
      const childSites = sitemapList.filter((s) => s.feature_id === featId);
      const childSiteIds = new Set(childSites.map((s) => s.id));
      const childToks = tokenList.filter((t) => childSiteIds.has(t.sitemap_id));

      return {
        features: 0,
        sitemaps: childSites.length,
        tokens: childToks.length,
        total: childSites.length + childToks.length,
      };
    },
    [sitemapList, tokenList]
  );

  const calculateSitemapDependents = useCallback(
    (siteId: string) => {
      const childToks = tokenList.filter((t) => t.sitemap_id === siteId);

      return {
        features: 0,
        sitemaps: 0,
        tokens: childToks.length,
        total: childToks.length,
      };
    },
    [tokenList]
  );

  // Safe delete request triggers with cascade confirmation
  const requestDeleteResearch = useCallback(
    (id: string) => {
      const r = researchList.find((item) => item.id === id);
      const deps = calculateResearchDependents(id);
      if (deps.total > 0) {
        setDeleteTargetInfo({
          type: 'single',
          nodeType: 'research',
          nodeId: id,
          nodeTitle: r?.insight_text,
          dependentCounts: deps,
        });
        setPendingDeleteAction(() => async () => {
          await onDeleteResearch(id);
        });
        setDeleteConfirmOpen(true);
      } else {
        onDeleteResearch(id);
      }
    },
    [researchList, calculateResearchDependents, onDeleteResearch]
  );

  const requestDeleteFeature = useCallback(
    (id: string) => {
      const f = featuresList.find((item) => item.id === id);
      const deps = calculateFeatureDependents(id);
      if (deps.total > 0) {
        setDeleteTargetInfo({
          type: 'single',
          nodeType: 'feature',
          nodeId: id,
          nodeTitle: f?.feature_name,
          dependentCounts: deps,
        });
        setPendingDeleteAction(() => async () => {
          await onDeleteFeature(id);
        });
        setDeleteConfirmOpen(true);
      } else {
        onDeleteFeature(id);
      }
    },
    [featuresList, calculateFeatureDependents, onDeleteFeature]
  );

  const requestDeleteSitemap = useCallback(
    (id: string) => {
      const s = sitemapList.find((item) => item.id === id);
      const deps = calculateSitemapDependents(id);
      if (deps.total > 0) {
        setDeleteTargetInfo({
          type: 'single',
          nodeType: 'sitemap',
          nodeId: id,
          nodeTitle: s?.page_name,
          dependentCounts: deps,
        });
        setPendingDeleteAction(() => async () => {
          await onDeleteSitemap(id);
        });
        setDeleteConfirmOpen(true);
      } else {
        onDeleteSitemap(id);
      }
    },
    [sitemapList, calculateSitemapDependents, onDeleteSitemap]
  );

  const requestDeleteToken = useCallback(
    (id: string) => {
      onDeleteToken(id);
    },
    [onDeleteToken]
  );

  // Execute bulk delete with clean cascade
  const handleExecuteBulkDelete = useCallback(
    async (nodesToDelete: Node[]) => {
      if (nodesToDelete.length === 0) return;

      const researchIds: string[] = [];
      const featureIds: string[] = [];
      const sitemapIds: string[] = [];
      const tokenIds: string[] = [];

      for (const node of nodesToDelete) {
        const rawId = (node.data as any)?.id;
        if (!rawId) continue;
        if (node.type === 'researchNode') researchIds.push(rawId);
        else if (node.type === 'featureNode') featureIds.push(rawId);
        else if (node.type === 'sitemapNode') sitemapIds.push(rawId);
        else if (node.type === 'tokenNode') tokenIds.push(rawId);
      }

      if (onBulkDelete) {
        await onBulkDelete({
          researchIds,
          featureIds,
          sitemapIds,
          tokenIds,
        });
      } else {
        await Promise.all([
          ...researchIds.map((id) => onDeleteResearch(id)),
          ...featureIds.map((id) => onDeleteFeature(id)),
          ...sitemapIds.map((id) => onDeleteSitemap(id)),
          ...tokenIds.map((id) => onDeleteToken(id)),
        ]);
      }
    },
    [onBulkDelete, onDeleteResearch, onDeleteFeature, onDeleteSitemap, onDeleteToken]
  );

  // Request bulk delete with confirmation modal (EC-6)
  const requestBulkDelete = useCallback(
    (selectedNodes: Node[]) => {
      if (selectedNodes.length === 0) return;

      setDeleteTargetInfo({
        type: 'bulk',
        bulkCount: selectedNodes.length,
        dependentCounts: { features: 0, sitemaps: 0, tokens: 0, total: 0 },
      });
      setPendingDeleteAction(() => async () => {
        await handleExecuteBulkDelete(selectedNodes);
      });
      setDeleteConfirmOpen(true);
    },
    [handleExecuteBulkDelete]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (pendingDeleteAction) {
      await pendingDeleteAction();
      setPendingDeleteAction(null);
    }
    setDeleteConfirmOpen(false);
  }, [pendingDeleteAction]);

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setPendingDeleteAction(null);
  }, []);

  return {
    deleteConfirmOpen,
    deleteTargetInfo,
    requestDeleteResearch,
    requestDeleteFeature,
    requestDeleteSitemap,
    requestDeleteToken,
    requestBulkDelete,
    handleConfirmDelete,
    handleCloseDeleteConfirm,
  };
}

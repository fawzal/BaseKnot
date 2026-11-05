import { useEffect, useCallback, useMemo } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import {
  COL_X,
  Y_GAP,
  NODE_BASE_Y,
  THREAD_EDGE_MARKER,
  AUTO_LAYOUT_FIT_VIEW_OPTIONS,
  getSavedPositions,
  savePosition,
  clearSavedPositions,
} from '@/constants/canvas';
import { UXResearch, UXFeature, UXSitemap, UXUIToken } from '@/types/database';
import { computeLineageMetrics, LineageMetrics } from '@/lib/lineageMetrics';

interface UseCanvasLayoutOptions {
  researchList: UXResearch[];
  featuresList: UXFeature[];
  sitemapList: UXSitemap[];
  tokenList: UXUIToken[];
  onAddChild: (parentId: string, type: 'feature' | 'sitemap' | 'token') => void;
  onOpenEditResearch: (id: string) => void;
  onOpenEditFeature: (id: string) => void;
  onOpenEditSitemap: (id: string) => void;
  onOpenEditToken: (id: string) => void;
  requestDeleteResearch: (id: string) => void;
  requestDeleteFeature: (id: string) => void;
  requestDeleteSitemap: (id: string) => void;
  requestDeleteToken: (id: string) => void;
  onUpdateFeatureParent: (id: string, researchId: string | null) => Promise<void>;
  onUpdateSitemapParent: (id: string, featureId: string | null) => Promise<void>;
  onUpdateTokenParent: (id: string, sitemapId: string | null) => Promise<void>;
  onLayoutReset?: () => void;
  rfInstance: any;
}

export function useCanvasLayout({
  researchList,
  featuresList,
  sitemapList,
  tokenList,
  onAddChild,
  onOpenEditResearch,
  onOpenEditFeature,
  onOpenEditSitemap,
  onOpenEditToken,
  requestDeleteResearch,
  requestDeleteFeature,
  requestDeleteSitemap,
  requestDeleteToken,
  onUpdateFeatureParent,
  onUpdateSitemapParent,
  onUpdateTokenParent,
  onLayoutReset,
  rfInstance,
}: UseCanvasLayoutOptions) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Disconnect a single edge by unlinking the relational child FK
  const handleDisconnectEdge = useCallback(
    async (edgeId: string, sourceId: string, targetId: string) => {
      // 1. Research <-> Feature
      if (sourceId.startsWith('res-') && targetId.startsWith('feat-')) {
        const featId = targetId.replace('feat-', '');
        await onUpdateFeatureParent(featId, null);
      } else if (sourceId.startsWith('feat-') && targetId.startsWith('res-')) {
        const featId = sourceId.replace('feat-', '');
        await onUpdateFeatureParent(featId, null);
      }
      // 2. Feature <-> Sitemap
      else if (sourceId.startsWith('feat-') && targetId.startsWith('site-')) {
        const siteId = targetId.replace('site-', '');
        await onUpdateSitemapParent(siteId, null);
      } else if (sourceId.startsWith('site-') && targetId.startsWith('feat-')) {
        const siteId = sourceId.replace('site-', '');
        await onUpdateSitemapParent(siteId, null);
      }
      // 3. Sitemap <-> Token
      else if (sourceId.startsWith('site-') && targetId.startsWith('tok-')) {
        const tokId = targetId.replace('tok-', '');
        await onUpdateTokenParent(tokId, null);
      } else if (sourceId.startsWith('tok-') && targetId.startsWith('site-')) {
        const tokId = sourceId.replace('tok-', '');
        await onUpdateTokenParent(tokId, null);
      }

      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [onUpdateFeatureParent, onUpdateSitemapParent, onUpdateTokenParent, setEdges]
  );

  // Disconnect multiple selected edges
  const handleDisconnectEdges = useCallback(
    async (edgesToDisconnect: Edge[]) => {
      for (const edge of edgesToDisconnect) {
        await handleDisconnectEdge(edge.id, edge.source, edge.target);
      }
    },
    [handleDisconnectEdge]
  );

  // Compute Layout (with persistent coordinates from local storage - EC-2)
  const computeLayout = useCallback(
    (
      res: UXResearch[],
      feat: UXFeature[],
      site: UXSitemap[],
      tok: UXUIToken[]
    ) => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const savedPositions = getSavedPositions();
      const metrics = computeLineageMetrics(res, feat, site, tok);

      // 1. Research Nodes (Col 0)
      res.forEach((r, idx) => {
        const id = `res-${r.id}`;
        newNodes.push({
          id,
          type: 'researchNode',
          position: savedPositions[id] || {
            x: COL_X.research,
            y: NODE_BASE_Y.research + idx * Y_GAP,
          },
          data: {
            id: r.id,
            insight_text: r.insight_text,
            created_at: r.created_at,
            onAddChild,
            onDelete: requestDeleteResearch,
            onEdit: onOpenEditResearch,
          },
        });
      });

      // 2. Feature Nodes (Col 1)
      feat.forEach((f, idx) => {
        const id = `feat-${f.id}`;
        newNodes.push({
          id,
          type: 'featureNode',
          position: savedPositions[id] || {
            x: COL_X.feature,
            y: NODE_BASE_Y.feature + idx * Y_GAP,
          },
          data: {
            id: f.id,
            feature_name: f.feature_name,
            description: f.description,
            research_id: f.research_id,
            onAddChild,
            onDelete: requestDeleteFeature,
            onEdit: onOpenEditFeature,
          },
        });

        // Edge from Research -> Feature
        if (f.research_id) {
          const edgeId = `edge-res-${f.research_id}-feat-${f.id}`;
          const isComplete = metrics.completeEdgeIds.has(edgeId);
          newEdges.push({
            id: edgeId,
            source: `res-${f.research_id}`,
            target: `feat-${f.id}`,
            type: 'threadEdge',
            animated: true,
            data: {
              onDisconnect: handleDisconnectEdge,
              isCompleteChain: isComplete,
            },
            markerEnd: THREAD_EDGE_MARKER,
          });
        }
      });

      // 3. Sitemap Nodes (Col 2)
      site.forEach((s, idx) => {
        const id = `site-${s.id}`;
        newNodes.push({
          id,
          type: 'sitemapNode',
          position: savedPositions[id] || {
            x: COL_X.sitemap,
            y: NODE_BASE_Y.sitemap + idx * Y_GAP,
          },
          data: {
            id: s.id,
            page_name: s.page_name,
            hierarchy_level: s.hierarchy_level,
            feature_id: s.feature_id,
            onAddChild,
            onDelete: requestDeleteSitemap,
            onEdit: onOpenEditSitemap,
          },
        });

        // Edge from Feature -> Sitemap
        if (s.feature_id) {
          const edgeId = `edge-feat-${s.feature_id}-site-${s.id}`;
          const isComplete = metrics.completeEdgeIds.has(edgeId);
          newEdges.push({
            id: edgeId,
            source: `feat-${s.feature_id}`,
            target: `site-${s.id}`,
            type: 'threadEdge',
            animated: true,
            data: {
              onDisconnect: handleDisconnectEdge,
              isCompleteChain: isComplete,
            },
            markerEnd: THREAD_EDGE_MARKER,
          });
        }
      });

      // 4. Token Nodes (Col 3)
      tok.forEach((t, idx) => {
        const id = `tok-${t.id}`;
        const isComplete = metrics.completeTokenIds.has(t.id);
        newNodes.push({
          id,
          type: 'tokenNode',
          position: savedPositions[id] || {
            x: COL_X.token,
            y: NODE_BASE_Y.token + idx * Y_GAP,
          },
          data: {
            id: t.id,
            component_type: t.component_type,
            design_token: t.design_token,
            sitemap_id: t.sitemap_id,
            isCompleteChain: isComplete,
            onDelete: requestDeleteToken,
            onEdit: onOpenEditToken,
          },
        });

        // Edge from Sitemap -> Token
        if (t.sitemap_id) {
          const edgeId = `edge-site-${t.sitemap_id}-tok-${t.id}`;
          newEdges.push({
            id: edgeId,
            source: `site-${t.sitemap_id}`,
            target: `tok-${t.id}`,
            type: 'threadEdge',
            animated: true,
            data: {
              onDisconnect: handleDisconnectEdge,
              isCompleteChain: isComplete,
            },
            markerEnd: THREAD_EDGE_MARKER,
          });
        }
      });

      return { newNodes, newEdges };
    },
    [
      onAddChild,
      requestDeleteResearch,
      onOpenEditResearch,
      requestDeleteFeature,
      onOpenEditFeature,
      requestDeleteSitemap,
      onOpenEditSitemap,
      requestDeleteToken,
      onOpenEditToken,
      handleDisconnectEdge,
    ]
  );

  // Sync state to nodes whenever the database lists update
  useEffect(() => {
    const { newNodes, newEdges } = computeLayout(
      researchList,
      featuresList,
      sitemapList,
      tokenList
    );
    setNodes(newNodes);
    setEdges(newEdges);
    onLayoutReset?.();
  }, [researchList, featuresList, sitemapList, tokenList, computeLayout, setNodes, setEdges, onLayoutReset]);

  // Persist node position on drag stop (EC-2)
  const handleNodeDragStop = useCallback((_event: any, node: Node) => {
    savePosition(node.id, node.position);
  }, []);

  // Strict Connection Validation: Enforces adjacent-tier and single-parent rules (EC-3 & EC-4)
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const { source, target } = connection;
      if (!source || !target || source === target) return false;

      // 1. Tier rule: Must be strictly adjacent hulu -> hilir
      const isResToFeat = source.startsWith('res-') && target.startsWith('feat-');
      const isFeatToSite = source.startsWith('feat-') && target.startsWith('site-');
      const isSiteToTok = source.startsWith('site-') && target.startsWith('tok-');

      if (!isResToFeat && !isFeatToSite && !isSiteToTok) {
        return false;
      }

      // 2. Single-parent rule: Child cannot already have an incoming parent edge from a different node
      const alreadyHasOtherParent = edges.some(
        (e) => e.target === target && e.source !== source
      );
      if (alreadyHasOtherParent) {
        return false;
      }

      // 3. Duplicate edge rule: Cannot create duplicate edge
      const edgeExists = edges.some(
        (e) => e.source === source && e.target === target
      );
      if (edgeExists) {
        return false;
      }

      return true;
    },
    [edges]
  );

  // Handle manual edge creation by user dragging wire
  const onConnect = useCallback(
    async (connection: Connection) => {
      const { source, target } = connection;
      if (!source || !target) return;

      // 1. Research <-> Feature
      if (source.startsWith('res-') && target.startsWith('feat-')) {
        const resId = source.replace('res-', '');
        const featId = target.replace('feat-', '');
        await onUpdateFeatureParent(featId, resId);
      }
      // 2. Feature <-> Sitemap
      else if (source.startsWith('feat-') && target.startsWith('site-')) {
        const featId = source.replace('feat-', '');
        const siteId = target.replace('site-', '');
        await onUpdateSitemapParent(siteId, featId);
      }
      // 3. Sitemap <-> Token
      else if (source.startsWith('site-') && target.startsWith('tok-')) {
        const siteId = source.replace('site-', '');
        const tokId = target.replace('tok-', '');
        await onUpdateTokenParent(tokId, siteId);
      }

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'threadEdge',
            animated: true,
            data: {
              onDisconnect: handleDisconnectEdge,
              isCompleteChain: true,
            },
            markerEnd: THREAD_EDGE_MARKER,
          },
          eds.filter((e) => e.target !== target) // Replace any existing parent wire
        )
      );
    },
    [
      onUpdateFeatureParent,
      onUpdateSitemapParent,
      onUpdateTokenParent,
      handleDisconnectEdge,
      setEdges,
    ]
  );

  // Handle Auto Layout: resets custom coordinates to clean column grid (EC-2)
  const handleAutoLayout = useCallback(() => {
    clearSavedPositions();
    const { newNodes, newEdges } = computeLayout(
      researchList,
      featuresList,
      sitemapList,
      tokenList
    );
    setNodes(newNodes);
    setEdges(newEdges);
    rfInstance?.fitView(AUTO_LAYOUT_FIT_VIEW_OPTIONS);
  }, [computeLayout, researchList, featuresList, sitemapList, tokenList, setNodes, setEdges, rfInstance]);

  // Track selected nodes & edges count
  const selectedNodes = useMemo(() => nodes.filter((n) => n.selected), [nodes]);
  const selectedCount = selectedNodes.length;

  const selectedEdges = useMemo(() => edges.filter((e) => e.selected), [edges]);
  const selectedEdgesCount = selectedEdges.length;

  // Unlinked / standalone entities for AI Context Export (EC-5)
  const unlinkedFeatures = useMemo(() => {
    const resIdSet = new Set(researchList.map((r) => r.id));
    return featuresList.filter((f) => !f.research_id || !resIdSet.has(f.research_id));
  }, [researchList, featuresList]);

  const unlinkedSitemaps = useMemo(() => {
    const featIdSet = new Set(featuresList.map((f) => f.id));
    return sitemapList.filter((s) => !s.feature_id || !featIdSet.has(s.feature_id));
  }, [featuresList, sitemapList]);

  const unlinkedTokens = useMemo(() => {
    const siteIdSet = new Set(sitemapList.map((s) => s.id));
    return tokenList.filter((t) => !t.sitemap_id || !siteIdSet.has(t.sitemap_id));
  }, [sitemapList, tokenList]);

  // Lineage Health Metrics
  const lineageMetrics: LineageMetrics = useMemo(() => {
    return computeLineageMetrics(researchList, featuresList, sitemapList, tokenList);
  }, [researchList, featuresList, sitemapList, tokenList]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    selectedNodes,
    selectedCount,
    selectedEdges,
    selectedEdgesCount,
    unlinkedFeatures,
    unlinkedSitemaps,
    unlinkedTokens,
    lineageMetrics,
    handleNodeDragStop,
    handleDisconnectEdge,
    handleDisconnectEdges,
    isValidConnection,
    onConnect,
    handleAutoLayout,
    computeLayout,
  };
}

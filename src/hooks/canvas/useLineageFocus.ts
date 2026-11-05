import { useState, useMemo, useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { UXFeature, UXSitemap, UXUIToken } from '@/types/database';

interface UseLineageFocusOptions {
  featuresList: UXFeature[];
  sitemapList: UXSitemap[];
  tokenList: UXUIToken[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export function useLineageFocus({
  featuresList,
  sitemapList,
  tokenList,
  setNodes,
  setEdges,
}: UseLineageFocusOptions) {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Memoized set of node IDs & edge IDs belonging to the focused node's full lineage
  const { connectedNodeIds, activeEdgeIds } = useMemo(() => {
    if (!focusedNodeId) {
      return { connectedNodeIds: new Set<string>(), activeEdgeIds: new Set<string>() };
    }

    const nodeIds = new Set<string>([focusedNodeId]);
    const edgeIds = new Set<string>();

    if (focusedNodeId.startsWith('res-')) {
      const resId = focusedNodeId.replace('res-', '');
      const childFeats = featuresList.filter((f) => f.research_id === resId);
      for (const f of childFeats) {
        nodeIds.add(`feat-${f.id}`);
        edgeIds.add(`edge-res-${resId}-feat-${f.id}`);
        const childSites = sitemapList.filter((s) => s.feature_id === f.id);
        for (const s of childSites) {
          nodeIds.add(`site-${s.id}`);
          edgeIds.add(`edge-feat-${f.id}-site-${s.id}`);
          const childToks = tokenList.filter((t) => t.sitemap_id === s.id);
          for (const t of childToks) {
            nodeIds.add(`tok-${t.id}`);
            edgeIds.add(`edge-site-${s.id}-tok-${t.id}`);
          }
        }
      }
    } else if (focusedNodeId.startsWith('feat-')) {
      const featId = focusedNodeId.replace('feat-', '');
      const feat = featuresList.find((f) => f.id === featId);
      if (feat) {
        if (feat.research_id) {
          nodeIds.add(`res-${feat.research_id}`);
          edgeIds.add(`edge-res-${feat.research_id}-feat-${feat.id}`);
        }
        const childSites = sitemapList.filter((s) => s.feature_id === feat.id);
        for (const s of childSites) {
          nodeIds.add(`site-${s.id}`);
          edgeIds.add(`edge-feat-${feat.id}-site-${s.id}`);
          const childToks = tokenList.filter((t) => t.sitemap_id === s.id);
          for (const t of childToks) {
            nodeIds.add(`tok-${t.id}`);
            edgeIds.add(`edge-site-${s.id}-tok-${t.id}`);
          }
        }
      }
    } else if (focusedNodeId.startsWith('site-')) {
      const siteId = focusedNodeId.replace('site-', '');
      const site = sitemapList.find((s) => s.id === siteId);
      if (site) {
        const feat = featuresList.find((f) => f.id === site.feature_id);
        if (feat) {
          nodeIds.add(`feat-${feat.id}`);
          edgeIds.add(`edge-feat-${feat.id}-site-${site.id}`);
          if (feat.research_id) {
            nodeIds.add(`res-${feat.research_id}`);
            edgeIds.add(`edge-res-${feat.research_id}-feat-${feat.id}`);
          }
        }
        const childToks = tokenList.filter((t) => t.sitemap_id === site.id);
        for (const t of childToks) {
          nodeIds.add(`tok-${t.id}`);
          edgeIds.add(`edge-site-${site.id}-tok-${t.id}`);
        }
      }
    } else if (focusedNodeId.startsWith('tok-')) {
      const tokId = focusedNodeId.replace('tok-', '');
      const tok = tokenList.find((t) => t.id === tokId);
      if (tok) {
        const site = sitemapList.find((s) => s.id === tok.sitemap_id);
        if (site) {
          nodeIds.add(`site-${site.id}`);
          edgeIds.add(`edge-site-${site.id}-tok-${tok.id}`);
          const feat = featuresList.find((f) => f.id === site.feature_id);
          if (feat) {
            nodeIds.add(`feat-${feat.id}`);
            edgeIds.add(`edge-feat-${feat.id}-site-${site.id}`);
            if (feat.research_id) {
              nodeIds.add(`res-${feat.research_id}`);
              edgeIds.add(`edge-res-${feat.research_id}-feat-${feat.id}`);
            }
          }
        }
      }
    }

    return { connectedNodeIds: nodeIds, activeEdgeIds: edgeIds };
  }, [focusedNodeId, featuresList, sitemapList, tokenList]);

  // Apply Dependency Lineage Focus Mode to Nodes and Edges
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: focusedNodeId && !connectedNodeIds.has(n.id) ? 0.15 : 1,
          filter:
            focusedNodeId && !connectedNodeIds.has(n.id)
              ? 'grayscale(80%)'
              : 'none',
          transition: 'opacity 200ms ease, filter 200ms ease',
        },
      }))
    );

    setEdges((eds) =>
      eds.map((e) => {
        if (!focusedNodeId) {
          return {
            ...e,
            animated: true,
            data: {
              ...e.data,
              isFocused: false,
            },
            style: {
              ...e.style,
              opacity: 1,
              stroke: '#A1A1AA',
              strokeWidth: 1.5,
              transition: 'opacity 200ms ease, stroke 200ms ease',
            },
          };
        }
        const isActive = activeEdgeIds.has(e.id);
        return {
          ...e,
          animated: isActive,
          data: {
            ...e.data,
            isFocused: isActive,
          },
          style: {
            ...e.style,
            opacity: isActive ? 1 : 0.15,
            stroke: isActive ? '#18181B' : '#CBD5E1',
            strokeWidth: isActive ? 2 : 1,
            transition: 'opacity 200ms ease, stroke 200ms ease',
          },
        };
      })
    );
  }, [focusedNodeId, connectedNodeIds, activeEdgeIds, setNodes, setEdges]);

  // Single-click: toggle Dependency Lineage Focus Mode
  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setFocusedNodeId((prev) => (prev === node.id ? null : node.id));
  }, []);

  // Click on empty canvas area -> clear focus
  const handlePaneClick = useCallback(() => {
    setFocusedNodeId(null);
  }, []);

  // Explicit clear focus helper
  const clearFocus = useCallback(() => {
    setFocusedNodeId(null);
  }, []);

  return {
    focusedNodeId,
    setFocusedNodeId,
    connectedNodeIds,
    activeEdgeIds,
    handleNodeClick,
    handlePaneClick,
    clearFocus,
  };
}

import { MarkerType } from '@xyflow/react';
import { ResearchNode } from '@/components/canvas/nodes/ResearchNode';
import { FeatureNode } from '@/components/canvas/nodes/FeatureNode';
import { SitemapNode } from '@/components/canvas/nodes/SitemapNode';
import { TokenNode } from '@/components/canvas/nodes/TokenNode';
import { ThreadEdge } from '@/components/canvas/edges/ThreadEdge';

import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';

export interface MindMapCanvasProps {
  researchList: UXResearch[];
  featuresList: UXFeature[];
  sitemapList: UXSitemap[];
  tokenList: UXUIToken[];
  isSupabaseConnected: boolean;
  onAddResearch: (text: string) => Promise<UXResearch>;
  onDeleteResearch: (id: string) => Promise<void>;
  onUpdateResearch: (id: string, text: string) => Promise<void>;
  onAddFeature: (name: string, researchId: string, desc?: string) => Promise<UXFeature>;
  onDeleteFeature: (id: string) => Promise<void>;
  onUpdateFeature: (id: string, name: string, desc?: string) => Promise<void>;
  onAddSitemap: (page: string, hierarchy: string, featureId: string) => Promise<UXSitemap>;
  onDeleteSitemap: (id: string) => Promise<void>;
  onUpdateSitemap: (id: string, page: string, level: string) => Promise<void>;
  onAddToken: (comp: string, token: string, sitemapId: string) => Promise<UXUIToken>;
  onDeleteToken: (id: string) => Promise<void>;
  onUpdateToken: (id: string, comp: string, token: string) => Promise<void>;
  onUpdateFeatureParent: (id: string, researchId: string | null) => Promise<void>;
  onUpdateSitemapParent: (id: string, featureId: string | null) => Promise<void>;
  onUpdateTokenParent: (id: string, sitemapId: string | null) => Promise<void>;
  onBulkDelete?: (payload: {
    researchIds: string[];
    featureIds: string[];
    sitemapIds: string[];
    tokenIds: string[];
  }) => Promise<void>;
  onResetDefaults: () => void;
  onFetchTraceability: () => Promise<UXTraceabilityThread[]>;
}

/**
 * Local storage key for persistent custom node coordinates (EC-2)
 */
export const POSITIONS_STORAGE_KEY = 'uxt_node_positions';

/**
 * Canvas horizontal column positions (X coordinates in px)
 */
export const COL_X = {
  research: 60,
  feature: 460,
  sitemap: 860,
  token: 1260,
} as const;

/**
 * Vertical gap and base offsets for node layout calculation
 */
export const Y_GAP = 180;

export const NODE_BASE_Y = {
  research: 100,
  feature: 80,
  sitemap: 80,
  token: 80,
} as const;

export const NODE_HEIGHT = 120;

/**
 * ReactFlow Viewport & Animation constants
 */
export const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 } as const;
export const FIT_VIEW_OPTIONS = { padding: 0.25 } as const;
export const AUTO_LAYOUT_FIT_VIEW_OPTIONS = { padding: 0.2, duration: 600 } as const;
export const TOPBAR_FIT_VIEW_OPTIONS = { padding: 0.2, duration: 400 } as const;
export const ZOOM_DURATION = 300;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 2.5;

/**
 * Edge styling & configuration
 */
export const THREAD_EDGE_MARKER = {
  type: MarkerType.ArrowClosed,
  color: '#71717A',
  width: 12,
  height: 12,
} as const;

export const DEFAULT_EDGE_OPTIONS = {
  type: 'threadEdge',
  animated: true,
} as const;

/**
 * ReactFlow registered custom node types
 */
export const nodeTypes = {
  researchNode: ResearchNode,
  featureNode: FeatureNode,
  sitemapNode: SitemapNode,
  tokenNode: TokenNode,
};

/**
 * ReactFlow registered custom edge types
 */
export const edgeTypes = {
  threadEdge: ThreadEdge,
};

/**
 * Read custom node positions from localStorage
 */
export const getSavedPositions = (): Record<string, { x: number; y: number }> => {
  try {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(POSITIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Persist single node coordinates to localStorage
 */
export const savePosition = (nodeId: string, pos: { x: number; y: number }): void => {
  try {
    if (typeof window === 'undefined') return;
    const current = getSavedPositions();
    current[nodeId] = pos;
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save node position:', e);
  }
};

/**
 * Remove all stored node positions from localStorage
 */
export const clearSavedPositions = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(POSITIONS_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to clear node positions:', e);
  }
};

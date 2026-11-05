import React, { useState, useCallback, useRef, useEffect, ComponentProps } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  Node,
  BackgroundVariant,
  SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Trash2, Scissors, Plus, Sparkles } from 'lucide-react';

import { CanvasTopBar } from './CanvasTopBar';
import { CanvasBottomDock } from './CanvasBottomDock';
import { AddNodeModal, NodeTypeOption } from './AddNodeModal';
import { EditNodeModal, EditNodeData } from './EditNodeModal';
import { AIPromptExportDrawer } from './AIPromptExportDrawer';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

import {
  nodeTypes,
  edgeTypes,
  clearSavedPositions,
  DEFAULT_EDGE_OPTIONS,
  MIN_ZOOM,
  MAX_ZOOM,
  FIT_VIEW_OPTIONS,
  TOPBAR_FIT_VIEW_OPTIONS,
  ZOOM_DURATION,
  type MindMapCanvasProps,
} from '@/constants/canvas';

import { useCanvasLayout } from '@/hooks/canvas/useCanvasLayout';
import { useLineageFocus } from '@/hooks/canvas/useLineageFocus';
import { useDeleteGuard } from '@/hooks/canvas/useDeleteGuard';
import { useCanvasKeyboard } from '@/hooks/canvas/useCanvasKeyboard';
import { UXTraceabilityThread } from '@/types/database';

export type { MindMapCanvasProps };

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  researchList,
  featuresList,
  sitemapList,
  tokenList,
  isSupabaseConnected,
  onAddResearch,
  onDeleteResearch,
  onUpdateResearch,
  onAddFeature,
  onDeleteFeature,
  onUpdateFeature,
  onAddSitemap,
  onDeleteSitemap,
  onUpdateSitemap,
  onAddToken,
  onDeleteToken,
  onUpdateToken,
  onUpdateFeatureParent,
  onUpdateSitemapParent,
  onUpdateTokenParent,
  onBulkDelete,
  onResetDefaults,
  onFetchTraceability,
}) => {
  // UI toggles & viewport state
  const [showMinimap, setShowMinimap] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [traceabilityData, setTraceabilityData] = useState<UXTraceabilityThread[]>([]);
  const [cursorMode, setCursorMode] = useState<'select' | 'pan'>('pan');
  const [rfInstance, setRfInstance] = useState<any>(null);

  // Peak moment quiet toast state
  const [peakToast, setPeakToast] = useState<{ id: number; message: string; subtext?: string } | null>(null);
  const prevCompleteCountRef = useRef<number | null>(null);

  // Add & Edit modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalNodeType, setModalNodeType] = useState<NodeTypeOption>('research');
  const [modalParentId, setModalParentId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<EditNodeData | null>(null);

  // Modal handlers
  const handleAddChild = useCallback((parentId: string, type: 'feature' | 'sitemap' | 'token') => {
    setModalParentId(parentId);
    setModalNodeType(type);
    setAddModalOpen(true);
  }, []);

  const handleOpenEditResearch = useCallback((id: string) => {
    const r = researchList.find((item) => item.id === id);
    if (r) { setEditingNode({ type: 'research', id: r.id, insight_text: r.insight_text }); setEditModalOpen(true); }
  }, [researchList]);

  const handleOpenEditFeature = useCallback((id: string) => {
    const f = featuresList.find((item) => item.id === id);
    if (f) { setEditingNode({ type: 'feature', id: f.id, feature_name: f.feature_name, description: f.description || undefined }); setEditModalOpen(true); }
  }, [featuresList]);

  const handleOpenEditSitemap = useCallback((id: string) => {
    const s = sitemapList.find((item) => item.id === id);
    if (s) { setEditingNode({ type: 'sitemap', id: s.id, page_name: s.page_name, hierarchy_level: s.hierarchy_level as string }); setEditModalOpen(true); }
  }, [sitemapList]);

  const handleOpenEditToken = useCallback((id: string) => {
    const t = tokenList.find((item) => item.id === id);
    if (t) { setEditingNode({ type: 'token', id: t.id, component_type: t.component_type, design_token: t.design_token }); setEditModalOpen(true); }
  }, [tokenList]);

  const handleNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const rawId = (node.data as any)?.id;
    if (!rawId) return;
    if (node.type === 'researchNode') handleOpenEditResearch(rawId);
    else if (node.type === 'featureNode') handleOpenEditFeature(rawId);
    else if (node.type === 'sitemapNode') handleOpenEditSitemap(rawId);
    else if (node.type === 'tokenNode') handleOpenEditToken(rawId);
  }, [handleOpenEditResearch, handleOpenEditFeature, handleOpenEditSitemap, handleOpenEditToken]);

  // Hook 1: Cascade Delete Guard
  const {
    deleteConfirmOpen, deleteTargetInfo,
    requestDeleteResearch, requestDeleteFeature, requestDeleteSitemap, requestDeleteToken,
    requestBulkDelete, handleConfirmDelete, handleCloseDeleteConfirm,
  } = useDeleteGuard({
    researchList, featuresList, sitemapList, tokenList,
    onDeleteResearch, onDeleteFeature, onDeleteSitemap, onDeleteToken, onBulkDelete,
  });

  // Hook 2: Canvas Layout & ReactFlow node/edge graph
  const {
    nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange,
    selectedNodes, selectedCount, selectedEdges, selectedEdgesCount,
    unlinkedFeatures, unlinkedSitemaps, unlinkedTokens, lineageMetrics,
    handleNodeDragStop, handleDisconnectEdges, isValidConnection, onConnect, handleAutoLayout,
  } = useCanvasLayout({
    researchList, featuresList, sitemapList, tokenList,
    onAddChild: handleAddChild,
    onOpenEditResearch: handleOpenEditResearch,
    onOpenEditFeature: handleOpenEditFeature,
    onOpenEditSitemap: handleOpenEditSitemap,
    onOpenEditToken: handleOpenEditToken,
    requestDeleteResearch, requestDeleteFeature, requestDeleteSitemap, requestDeleteToken,
    onUpdateFeatureParent, onUpdateSitemapParent, onUpdateTokenParent, rfInstance,
  });

  // Peak Moment: Quiet Toast trigger when a complete 4-tier thread is newly formed
  useEffect(() => {
    if (prevCompleteCountRef.current !== null && lineageMetrics.completeCount > prevCompleteCountRef.current) {
      setPeakToast({
        id: Date.now(),
        message: '⚡ Silsilah Logika Terhubung Penuh — Siap dikompilasi ke AI',
        subtext: 'Rantai hulu ke hilir (Riset ➔ Fitur ➔ Sitemap ➔ Token) kini terikat utuh.',
      });
    }
    prevCompleteCountRef.current = lineageMetrics.completeCount;
  }, [lineageMetrics.completeCount]);

  // Auto-dismiss peak toast after 3.5 seconds
  useEffect(() => {
    if (!peakToast) return;
    const timer = setTimeout(() => {
      setPeakToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [peakToast]);

  // Hook 3: Lineage Focus Mode & Dimming
  const {
    focusedNodeId, setFocusedNodeId, connectedNodeIds,
    handleNodeClick, handlePaneClick, clearFocus,
  } = useLineageFocus({
    featuresList, sitemapList, tokenList, setNodes, setEdges,
  });

  // Bulk delete action trigger with selected nodes
  const handleRequestBulkDelete = useCallback(() => {
    requestBulkDelete(selectedNodes);
  }, [requestBulkDelete, selectedNodes]);

  // Open Export Drawer with traceability data
  const handleOpenExport = useCallback(async () => {
    const data = await onFetchTraceability();
    setTraceabilityData(data);
    setIsExportOpen(true);
  }, [onFetchTraceability]);

  // Hook 4: Canvas Keyboard Shortcuts
  const { isShiftDown } = useCanvasKeyboard({
    nodes, edges, focusedNodeId, setNodes, setFocusedNodeId,
    onRequestBulkDelete: handleRequestBulkDelete,
    onDisconnectEdges: handleDisconnectEdges,
    onOpenExport: handleOpenExport, setCursorMode,
  });

  // Save changes from EditNodeModal
  const handleSaveEditedNode = async (updated: EditNodeData) => {
    if (updated.type === 'research') await onUpdateResearch(updated.id, updated.insight_text);
    else if (updated.type === 'feature') await onUpdateFeature(updated.id, updated.feature_name, updated.description);
    else if (updated.type === 'sitemap') await onUpdateSitemap(updated.id, updated.page_name, updated.hierarchy_level);
    else if (updated.type === 'token') await onUpdateToken(updated.id, updated.component_type, updated.design_token);
  };

  // Submit Modal Node Creation (allows unlinked nodes - EC-1)
  const handleModalSubmit = async (f: Parameters<ComponentProps<typeof AddNodeModal>['onSubmit']>[0]) => {
    if (f.type === 'research' && f.researchText) await onAddResearch(f.researchText);
    else if (f.type === 'feature' && f.featureName) await onAddFeature(f.featureName, f.featureResearchId || '', f.featureDescription);
    else if (f.type === 'sitemap' && f.sitemapPage) await onAddSitemap(f.sitemapPage, f.sitemapHierarchy || 'Body', f.sitemapFeatureId || '');
    else if (f.type === 'token' && f.tokenComponent && f.tokenValue) await onAddToken(f.tokenComponent, f.tokenValue, f.tokenSitemapId || '');
  };

  const handleOpenAddModal = (type: NodeTypeOption) => {
    setModalNodeType(type);
    setModalParentId(null);
    setAddModalOpen(true);
  };

  const panOnDrag = cursorMode === 'pan' ? !isShiftDown : false;
  const selectionOnDrag = cursorMode === 'select' ? true : isShiftDown;

  return (
    <div className={`relative w-full h-full bg-canvas overflow-hidden select-none ${cursorMode === 'pan' ? 'canvas-mode-pan' : 'canvas-mode-select'}`}>
      {/* Floating Top Control Bar with Lineage Health Meter */}
      <CanvasTopBar
        stats={{ researchCount: researchList.length, featureCount: featuresList.length, sitemapCount: sitemapList.length, tokenCount: tokenList.length }}
        healthStats={{
          completeCount: lineageMetrics.completeCount,
          connectedCount: lineageMetrics.connectedCount,
          integrityPercentage: lineageMetrics.integrityPercentage,
        }}
        isSupabaseConnected={isSupabaseConnected}
        onAutoLayout={() => { clearFocus(); handleAutoLayout(); }}
        onResetSample={() => { clearSavedPositions(); clearFocus(); onResetDefaults(); }}
        onOpenExport={handleOpenExport}
        onFitView={() => rfInstance?.fitView(TOPBAR_FIT_VIEW_OPTIONS)}
      />

      {/* Floating Bulk Selection Action Pill */}
      {selectedCount > 1 && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 bg-white/95 backdrop-blur-md border border-zinc-200 px-3 sm:px-3.5 py-1.5 rounded-full shadow-dock animate-in fade-in slide-in-from-top-2 duration-150 max-w-[calc(100vw-2rem)]">
          <span className="text-xs font-mono text-zinc-700 font-medium whitespace-nowrap">{selectedCount} node dipilih</span>
          <span className="h-3 w-[1px] bg-zinc-200 shrink-0" />
          <button onClick={handleRequestBulkDelete} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded-md transition-colors shrink-0" title="Hapus node yang dipilih (atau tekan Backspace/Delete)">
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus Terpilih</span>
          </button>
        </div>
      )}

      {/* Floating Lineage Focus Action Pill */}
      {focusedNodeId && selectedCount <= 1 && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 bg-white/95 backdrop-blur-md border border-zinc-200 px-3 sm:px-3.5 py-1.5 rounded-full shadow-dock animate-in fade-in slide-in-from-top-2 duration-150 max-w-[calc(100vw-2rem)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-mono text-zinc-700 font-medium truncate">Fokus Silsilah ({connectedNodeIds.size} node)</span>
          <span className="h-3 w-[1px] bg-zinc-200 shrink-0" />
          <button onClick={clearFocus} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 px-1.5 py-0.5 rounded hover:bg-zinc-100 transition-colors shrink-0" title="Tekan Esc atau klik area kosong untuk keluar dari fokus silsilah">
            Batal (Esc)
          </button>
        </div>
      )}

      {/* Floating Edge Disconnection Action Pill */}
      {selectedEdgesCount > 0 && selectedCount === 0 && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 bg-white/95 backdrop-blur-md border border-zinc-200 px-3 sm:px-3.5 py-1.5 rounded-full shadow-dock animate-in fade-in slide-in-from-top-2 duration-150 max-w-[calc(100vw-2rem)]">
          <span className="text-xs font-mono text-zinc-700 font-medium whitespace-nowrap">{selectedEdgesCount} kabel dipilih</span>
          <span className="h-3 w-[1px] bg-zinc-200 shrink-0" />
          <button onClick={() => handleDisconnectEdges(selectedEdges)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded-md transition-colors shrink-0" title="Lepas hubungan koneksi kabel yang dipilih (atau tekan Backspace/Delete)">
            <Scissors className="h-3.5 w-3.5" />
            <span>Lepas Hubungan</span>
          </button>
        </div>
      )}

      {/* Main Interactive Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={handleDisconnectEdges}
        onNodeDragStop={handleNodeDragStop}
        isValidConnection={isValidConnection}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        elementsSelectable
        nodesDraggable
        edgesReconnectable
        selectionMode={SelectionMode.Partial}
        panOnDrag={panOnDrag}
        selectionOnDrag={selectionOnDrag}
        selectionKeyCode="Shift"
        multiSelectionKeyCode={['Meta', 'Control', 'Shift']}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        className="touch-none"
      >
        {showGrid && <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#D4D4D8" className="opacity-80" />}
        {showMinimap && (
          <MiniMap
            nodeColor={() => '#CBD5E1'}
            maskColor="rgba(244, 244, 245, 0.75)"
            className="!bg-white !border !border-zinc-200 !rounded-xl !overflow-hidden !shadow-sm"
          />
        )}
      </ReactFlow>

      {/* Empty Canvas Guidance: Minimal dashed watermark card */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-4">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl p-6 text-center pointer-events-auto shadow-panel animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 mb-3 border border-zinc-200 shadow-2xs">
              <Sparkles className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">
              Kanvas Mindmapping BaseKnot Siap Digunakan
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-5">
              Mulai product analisis Anda: buat diagram userflow dari temuan riset, sambungkan ke sitemap dan token UI, lalu ekspor prompt AI lewat drawer.
            </p>
            <div className="flex items-center justify-center">
              <button
                onClick={() => handleOpenAddModal('research')}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium shadow-sm active:scale-[0.98] transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tanamkan Riset Pertama</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Peak Moment Quiet Toast (Responsive for Mobile/Tablet) */}
      {peakToast && (
        <div className="absolute bottom-16 sm:bottom-20 right-3 sm:right-6 left-3 sm:left-auto z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-sm bg-zinc-900/95 text-white backdrop-blur-md border border-zinc-800 shadow-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-start gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs shrink-0 mt-0.5">
            ⚡
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-zinc-100 leading-snug">
              {peakToast.message}
            </div>
            {peakToast.subtext && (
              <div className="text-[11px] text-zinc-400 mt-0.5 leading-normal">
                {peakToast.subtext}
              </div>
            )}
          </div>
          <button
            onClick={() => setPeakToast(null)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
            title="Tutup notifikasi"
          >
            <span className="text-sm leading-none">&times;</span>
          </button>
        </div>
      )}

      {/* Floating Bottom Dock */}
      <CanvasBottomDock
        cursorMode={cursorMode}
        onCursorModeChange={setCursorMode}
        onAddNode={handleOpenAddModal}
        onZoomIn={() => rfInstance?.zoomIn({ duration: ZOOM_DURATION })}
        onZoomOut={() => rfInstance?.zoomOut({ duration: ZOOM_DURATION })}
        onToggleMinimap={() => setShowMinimap((prev) => !prev)}
        showMinimap={showMinimap}
        onToggleGrid={() => setShowGrid((prev) => !prev)}
        showGrid={showGrid}
      />

      {/* Add Node Modal (supports unlinked creation - EC-1) */}
      <AddNodeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        nodeType={modalNodeType}
        parentId={modalParentId}
        researchList={researchList}
        featuresList={featuresList}
        sitemapList={sitemapList}
        onSubmit={handleModalSubmit}
      />

      {/* Edit Node Modal */}
      <EditNodeModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} nodeData={editingNode} onSave={handleSaveEditedNode} />

      {/* Cascade Delete Confirmation Modal (EC-6) */}
      <DeleteConfirmationModal isOpen={deleteConfirmOpen} onClose={handleCloseDeleteConfirm} targetInfo={deleteTargetInfo} onConfirm={handleConfirmDelete} />

      {/* AI Context Export Drawer (includes unlinked nodes - EC-5) */}
      <AIPromptExportDrawer
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        threads={traceabilityData}
        unlinkedFeatures={unlinkedFeatures}
        unlinkedSitemaps={unlinkedSitemaps}
        unlinkedTokens={unlinkedTokens}
      />
    </div>
  );
};

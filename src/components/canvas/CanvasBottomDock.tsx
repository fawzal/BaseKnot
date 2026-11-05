import React from 'react';
import { 
  Quote, 
  Layers, 
  LayoutGrid, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  Map, 
  Grid,
  MousePointer,
  Hand
} from 'lucide-react';

interface CanvasBottomDockProps {
  cursorMode: 'select' | 'pan';
  onCursorModeChange: (mode: 'select' | 'pan') => void;
  onAddNode: (type: 'research' | 'feature' | 'sitemap' | 'token') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleMinimap: () => void;
  showMinimap: boolean;
  onToggleGrid: () => void;
  showGrid: boolean;
}

export const CanvasBottomDock: React.FC<CanvasBottomDockProps> = ({
  cursorMode,
  onCursorModeChange,
  onAddNode,
  onZoomIn,
  onZoomOut,
  onToggleMinimap,
  showMinimap,
  onToggleGrid,
  showGrid,
}) => {
  return (
    <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md border border-zinc-200 px-2 sm:px-2.5 py-1.5 rounded-xl shadow-dock max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar">
      {/* Mode Switch Tool (Pointer vs Hand) */}
      <div className="flex items-center gap-0.5 bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/80 shrink-0">
        <button
          onClick={() => onCursorModeChange('select')}
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            cursorMode === 'select'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
          title="Alat Pilih (V) — Geser kursor untuk seleksi banyak node"
        >
          <MousePointer className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Pilih</span>
          <span className="hidden md:inline text-[10px] text-zinc-400 font-mono">(V)</span>
        </button>

        <button
          onClick={() => onCursorModeChange('pan')}
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            cursorMode === 'pan'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
          title="Alat Geser (H) — Seret untuk menjelajahi kanvas"
        >
          <Hand className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Geser</span>
          <span className="hidden md:inline text-[10px] text-zinc-400 font-mono">(H)</span>
        </button>
      </div>

      <div className="h-4 w-[1px] bg-zinc-200 mx-0.5 sm:mx-1 shrink-0" />

      {/* Node Creation Tools - Crisp Editorial Monochrome with subtle tier dots */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onAddNode('research')}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-sm transition-colors whitespace-nowrap"
          title="Tambah Insight Riset"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <Quote className="h-3 w-3 text-zinc-500" />
          <span>Riset</span>
        </button>

        <button
          onClick={() => onAddNode('feature')}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-sm transition-colors whitespace-nowrap"
          title="Tambah Fitur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <Layers className="h-3 w-3 text-zinc-500" />
          <span>Fitur</span>
        </button>

        <button
          onClick={() => onAddNode('sitemap')}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-sm transition-colors whitespace-nowrap"
          title="Tambah Layar Sitemap"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          <LayoutGrid className="h-3 w-3 text-zinc-500" />
          <span>Sitemap</span>
        </button>

        <button
          onClick={() => onAddNode('token')}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-sm transition-colors whitespace-nowrap"
          title="Tambah Token UI"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <Palette className="h-3 w-3 text-zinc-500" />
          <span>Token UI</span>
        </button>
      </div>

      <div className="h-4 w-[1px] bg-zinc-200 mx-0.5 sm:mx-1 shrink-0" />

      {/* Viewport Utilities */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={onZoomIn}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          title="Perbesar Tampilan"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          title="Perkecil Tampilan"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onToggleMinimap}
          className={`hidden sm:inline-flex p-1.5 rounded-md transition-colors ${
            showMinimap
              ? 'text-zinc-900 bg-zinc-100 border border-zinc-300 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
          }`}
          title="Tampilkan/Sembunyikan Peta Mini"
        >
          <Map className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onToggleGrid}
          className={`p-1.5 rounded-md transition-colors ${
            showGrid
              ? 'text-zinc-900 bg-zinc-100 border border-zinc-300 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
          }`}
          title="Tampilkan/Sembunyikan Titik Kisi"
        >
          <Grid className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

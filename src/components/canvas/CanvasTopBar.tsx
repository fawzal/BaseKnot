import React from 'react';
import { 
  Sparkles, 
  Layout, 
  RotateCcw, 
  Maximize2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/logo.png';

interface CanvasTopBarProps {
  stats: {
    researchCount: number;
    featureCount: number;
    sitemapCount: number;
    tokenCount: number;
  };
  healthStats?: {
    completeCount: number;
    connectedCount: number;
    integrityPercentage: number;
  };
  isSupabaseConnected: boolean;
  onAutoLayout: () => void;
  onResetSample: () => void;
  onOpenExport: () => void;
  onFitView: () => void;
}

export const CanvasTopBar: React.FC<CanvasTopBarProps> = ({
  stats,
  healthStats,
  isSupabaseConnected: _isSupabaseConnected,
  onAutoLayout,
  onResetSample,
  onOpenExport,
  onFitView,
}) => {
  const completeCount = healthStats ? healthStats.completeCount : 0;
  const connectedCount = healthStats ? healthStats.connectedCount : (stats.researchCount + stats.featureCount + stats.sitemapCount + stats.tokenCount);
  const integrityPercentage = healthStats ? healthStats.integrityPercentage : 100;

  return (
    <header className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
      {/* Left: Branding Logo Only */}
      <div
        className="flex items-center justify-center bg-white/95 backdrop-blur-md border border-zinc-200 h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-panel pointer-events-auto p-1 sm:p-1.5 hover:border-zinc-300 transition-colors shrink-0"
        title="UX Logic Thread"
      >
        <img
          src={logoImg}
          alt="UX Logic Thread"
          className="h-full w-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Center: Lineage Health Meter (Responsive: Tablet & Desktop) */}
      <div className="hidden md:flex items-center gap-2 sm:gap-2.5 bg-white/95 backdrop-blur-md border border-zinc-200 px-2.5 sm:px-3.5 py-1.5 rounded-xl shadow-panel pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              completeCount > 0
                ? 'bg-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                : 'bg-zinc-400'
            }`}
          />
          <span className="text-xs font-mono font-medium text-zinc-900">
            {completeCount} <span className="hidden lg:inline">Silsilah Lengkap</span><span className="lg:hidden">Silsilah</span>
          </span>
        </div>
        <span className="hidden lg:inline text-zinc-300 font-mono text-xs">·</span>
        <div className="hidden lg:flex items-center gap-1">
          <span className="text-xs font-mono text-zinc-600">
            <strong className="text-zinc-900 font-semibold">{connectedCount}</strong> Node Terhubung
          </span>
        </div>
        <span className="text-zinc-300 font-mono text-xs">·</span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-xs font-mono text-zinc-600 hidden sm:inline">Integritas:</span>
          <span
            className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
              integrityPercentage === 100
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-zinc-100 text-zinc-800 border-zinc-200'
            }`}
          >
            {integrityPercentage}%
          </span>
        </div>
      </div>

      {/* Right: Actions & High-Contrast Solid Black AI Export Button */}
      <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto shrink-0">
        <Button
          onClick={onAutoLayout}
          variant="outline"
          size="sm"
          className="gap-1 sm:gap-1.5 bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 shadow-sm px-2 sm:px-3"
          title="Rapikan Formasi Kanvas Otomatis"
        >
          <Layout className="h-3.5 w-3.5 text-zinc-500" />
          <span className="hidden sm:inline">Tata Otomatis</span>
        </Button>

        <Button
          onClick={onFitView}
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 border-zinc-200 shadow-sm"
          title="Pusatkan Tampilan Kanvas"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>

        <Button
          onClick={onResetSample}
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 border-zinc-200 shadow-sm"
          title="Segarkan Data Kanvas"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {/* Polished High-contrast solid ink button */}
        <Button
          onClick={onOpenExport}
          size="sm"
          className="gap-1 sm:gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] font-medium px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs shadow-sm border border-zinc-900 transition-all duration-150"
          title="Kompilasi Prompt AI (Ctrl+Shift+E)"
        >
          <Sparkles className="h-3.5 w-3.5 text-zinc-200" />
          <span className="hidden sm:inline">Kompilasi Prompt AI</span>
          <span className="sm:hidden">Kompilasi</span>
        </Button>
      </div>
    </header>
  );
};

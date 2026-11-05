import { GitCommit, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  isConfigured: boolean;
  onResetDefaults?: () => void;
  stats?: {
    researchCount: number;
    featureCount: number;
    sitemapCount: number;
    tokenCount: number;
  };
}

export function Header({ isConfigured, onResetDefaults, stats }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-40 backdrop-blur-sm bg-background/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent shadow-glow-sm">
            <GitCommit className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-semibold tracking-wide text-foreground">
                UX LOGIC THREAD
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-foreground-muted border border-border">
                Traceability Mapper
              </span>
            </div>
            <p className="text-xs text-foreground-subtle hidden sm:block">
              Zero-friction relational thread: Research &rarr; Features &rarr; Sitemap &rarr; UI Tokens
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3">
          {stats && (
            <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-foreground-subtle bg-surface px-2.5 py-1 rounded border border-border">
              <span>{stats.researchCount} Res</span>
              <span className="text-border-highlight">&bull;</span>
              <span>{stats.featureCount} Feat</span>
              <span className="text-border-highlight">&bull;</span>
              <span>{stats.sitemapCount} Pages</span>
              <span className="text-border-highlight">&bull;</span>
              <span>{stats.tokenCount} Tokens</span>
            </div>
          )}

          <div
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isConfigured
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                : 'bg-surface-elevated text-amber-400 border-amber-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">
              {isConfigured ? 'Supabase Connected' : 'Local Mock Mode'}
            </span>
            {isConfigured && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </div>

          {onResetDefaults && !isConfigured && (
            <button
              onClick={onResetDefaults}
              title="Reset mock data to initial defaults"
              className="p-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-surface border border-transparent hover:border-border transition-colors text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Reset Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

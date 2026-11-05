import React, { useState } from 'react';
import { UXSitemap, UXUIToken, UXFeature } from '@/types/database';
import { Palette, Plus, Trash2, Tag, Layers } from 'lucide-react';

interface TokenDefinerProps {
  tokenList: UXUIToken[];
  sitemapList: UXSitemap[];
  featuresList: UXFeature[];
  onAddToken: (componentType: string, designToken: string, sitemapId: string) => Promise<void>;
  onDeleteToken: (id: string) => Promise<void>;
}

const COMMON_COMPONENT_PRESETS = [
  'Card / Surface Container',
  'Toast / Notification Pill',
  'Filter Chip Group',
  'Drawer / Modal Staging',
  'Floating Action Button',
  'Accordion / Disclosure',
  'Data Table Row',
  'Header Bar',
];

export function TokenDefiner({
  tokenList,
  sitemapList,
  featuresList,
  onAddToken,
  onDeleteToken,
}: TokenDefinerProps) {
  const [sitemapId, setSitemapId] = useState<string>(sitemapList[0]?.id || '');
  const [componentType, setComponentType] = useState('Card / Surface Container');
  const [designToken, setDesignToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map sitemap & feature for instant lookup
  const sitemapMap = React.useMemo(() => {
    return new Map(sitemapList.map((s) => [s.id, s]));
  }, [sitemapList]);

  const featureMap = React.useMemo(() => {
    return new Map(featuresList.map((f) => [f.id, f]));
  }, [featuresList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSitemapId = sitemapId || sitemapList[0]?.id;
    if (!componentType.trim() || !designToken.trim() || !effectiveSitemapId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddToken(componentType.trim(), designToken.trim(), effectiveSitemapId);
      setDesignToken('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">
              Modul 3: UI Component & Token Definer
            </h2>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Ikat spesifikasi komponen UI dan variabel design token secara deterministik ke halaman sitemap.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-foreground-subtle bg-surface-elevated px-3 py-1.5 rounded-lg border border-border">
          <Tag className="w-3.5 h-3.5 text-accent" />
          <span>{tokenList.length} Token Terdefinisi</span>
        </div>
      </div>

      {/* Add Token Form */}
      {sitemapList.length === 0 ? (
        <div className="p-6 bg-surface border border-dashed border-amber-900/40 rounded-xl text-amber-300 text-xs text-center">
          Belum ada node Sitemap di Modul 2. Daftarkan minimal 1 halaman pada Sitemap Console untuk mengikat token desain.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-xl border border-border p-4 space-y-4"
        >
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-accent" />
            <span>Ikat Token Desain & Struktur Komponen</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                Pilih Target Halaman / Zona (Foreign Key: <code className="text-accent font-mono">sitemap_id</code>)
              </label>
              <select
                value={sitemapId || sitemapList[0]?.id}
                onChange={(e) => setSitemapId(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              >
                {sitemapList.map((site) => {
                  const feat = featureMap.get(site.feature_id);
                  return (
                    <option key={site.id} value={site.id}>
                      [{site.page_name}] {site.hierarchy_level} — {feat?.feature_name.slice(0, 35) || 'Fitur'}...
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                Tipe Komponen UI
              </label>
              <input
                type="text"
                list="component-presets"
                required
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                placeholder="Pilih atau ketik tipe komponen..."
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              />
              <datalist id="component-presets">
                {COMMON_COMPONENT_PRESETS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                Design Token / Utility Rule
              </label>
              <input
                type="text"
                required
                value={designToken}
                onChange={(e) => setDesignToken(e.target.value)}
                placeholder="Contoh: bg-surface-elevated text-amber-400 border-border"
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!componentType.trim() || !designToken.trim() || isSubmitting}
              className="px-4 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Token Komponen</span>
            </button>
          </div>
        </form>
      )}

      {/* Token List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-foreground-muted px-1">
          <span>DAFTAR DESIGN TOKENS & KOMPONEN TERIKAT ({tokenList.length})</span>
        </div>

        {tokenList.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-surface/50 text-foreground-subtle text-xs">
            Belum ada design token yang didaftarkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tokenList.map((tok) => {
              const sitemap = sitemapMap.get(tok.sitemap_id);
              const feat = sitemap ? featureMap.get(sitemap.feature_id) : undefined;
              return (
                <div
                  key={tok.id}
                  className="bg-surface rounded-xl border border-border hover:border-border-highlight transition-all p-3.5 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-semibold text-foreground">
                          {tok.component_type}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteToken(tok.id)}
                        title="Hapus token"
                        className="p-1 text-foreground-subtle hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {sitemap && (
                      <div className="text-[11px] text-foreground-muted flex items-center gap-1.5">
                        <span className="font-mono text-accent">[{sitemap.page_name}]</span>
                        <span>&bull;</span>
                        <span className="font-mono text-foreground-subtle">{sitemap.hierarchy_level}</span>
                        {feat && (
                          <>
                            <span>&bull;</span>
                            <span className="truncate max-w-[140px]">{feat.feature_name}</span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="p-2 bg-surface-elevated rounded border border-border">
                      <div className="text-[10px] font-mono text-foreground-subtle uppercase mb-0.5">
                        Token Definition:
                      </div>
                      <code className="text-xs font-mono text-emerald-400 break-all select-all">
                        {tok.design_token}
                      </code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

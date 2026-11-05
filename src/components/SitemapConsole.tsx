import React, { useState } from 'react';
import { UXFeature, UXSitemap, SitemapHierarchyLevel } from '@/types/database';
import { Layers, Plus, Trash2, FolderTree, LayoutGrid } from 'lucide-react';

interface SitemapConsoleProps {
  sitemapList: UXSitemap[];
  featuresList: UXFeature[];
  onAddSitemap: (pageName: string, hierarchyLevel: string, featureId: string) => Promise<void>;
  onDeleteSitemap: (id: string) => Promise<void>;
}

const HIERARCHY_LEVELS: SitemapHierarchyLevel[] = [
  'Header',
  'Hero Section',
  'Main Content',
  'Sidebar',
  'Modal/Drawer',
  'Floating Action',
  'Footer',
];

export function SitemapConsole({
  sitemapList,
  featuresList,
  onAddSitemap,
  onDeleteSitemap,
}: SitemapConsoleProps) {
  const [pageName, setPageName] = useState('');
  const [hierarchyLevel, setHierarchyLevel] = useState<string>('Main Content');
  const [featureId, setFeatureId] = useState<string>(featuresList[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group by page for clean hierarchical tree visualization
  const pagesGrouped = React.useMemo(() => {
    const map = new Map<string, UXSitemap[]>();
    for (const item of sitemapList) {
      const arr = map.get(item.page_name) || [];
      arr.push(item);
      map.set(item.page_name, arr);
    }
    return Array.from(map.entries());
  }, [sitemapList]);

  // Map feature details for quick lookup
  const featureMap = React.useMemo(() => {
    return new Map(featuresList.map((f) => [f.id, f]));
  }, [featuresList]);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveFeatureId = featureId || featuresList[0]?.id;
    if (!pageName.trim() || !effectiveFeatureId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddSitemap(pageName.trim(), hierarchyLevel, effectiveFeatureId);
      setPageName('');
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
            <Layers className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">
              Modul 2: Sitemap Console & Feature Placement
            </h2>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Petakan fitur-fitur hasil riset ke dalam struktur arsitektur halaman dan zona hierarki antarmuka.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-foreground-subtle bg-surface-elevated px-3 py-1.5 rounded-lg border border-border">
          <FolderTree className="w-3.5 h-3.5 text-accent" />
          <span>{pagesGrouped.length} Halaman Terdaftar</span>
        </div>
      </div>

      {/* Feature Placement Form */}
      {featuresList.length === 0 ? (
        <div className="p-6 bg-surface border border-dashed border-amber-900/40 rounded-xl text-amber-300 text-xs text-center">
          Belum ada fitur di Modul 1. Daftarkan minimal 1 fitur di Research Hub terlebih dahulu untuk menempatkannya pada Sitemap.
        </div>
      ) : (
        <form
          onSubmit={handleAddNode}
          className="bg-surface rounded-xl border border-border p-4 space-y-3"
        >
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-accent" />
            <span>Tempatkan Fitur ke Halaman & Hierarki</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                Nama Halaman / Screen
              </label>
              <input
                type="text"
                required
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="Contoh: Dashboard, Workspace Table, Checkout"
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                Zona Hierarki UI
              </label>
              <select
                value={hierarchyLevel}
                onChange={(e) => setHierarchyLevel(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
              >
                {HIERARCHY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                Pilih Fitur Terkait (Foreign Key: <code className="text-accent font-mono">feature_id</code>)
              </label>
              <select
                value={featureId || featuresList[0]?.id}
                onChange={(e) => setFeatureId(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
              >
                {featuresList.map((feat) => (
                  <option key={feat.id} value={feat.id}>
                    {feat.feature_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!pageName.trim() || isSubmitting}
              className="px-4 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Penempatan Sitemap</span>
            </button>
          </div>
        </form>
      )}

      {/* Hierarchical View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-medium text-foreground-muted px-1">
          <span>ARSITEKTUR INFORMASI & PENEMPATAN KOMPONEN</span>
          <span className="font-mono text-[11px] text-foreground-subtle">
            {sitemapList.length} penempatan node
          </span>
        </div>

        {pagesGrouped.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-surface/50 text-foreground-subtle text-xs">
            Belum ada penempatan halaman sitemap. Masukkan nama halaman di atas untuk memetakan arsitektur sitemap.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagesGrouped.map(([page, nodes]) => (
              <div
                key={page}
                className="bg-surface rounded-xl border border-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {page}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-foreground-muted border border-border">
                    {nodes.length} zonasi
                  </span>
                </div>

                <div className="space-y-2">
                  {nodes.map((node) => {
                    const feature = featureMap.get(node.feature_id);
                    return (
                      <div
                        key={node.id}
                        className="bg-surface-elevated rounded-lg p-2.5 border border-border/80 flex items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/20">
                              {node.hierarchy_level}
                            </span>
                            <span className="text-xs font-medium text-foreground">
                              {feature?.feature_name || 'Fitur tidak ditemukan'}
                            </span>
                          </div>
                          {feature?.description && (
                            <p className="text-[11px] text-foreground-subtle leading-snug">
                              {feature.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => onDeleteSitemap(node.id)}
                          title="Hapus node ini"
                          className="p-1 text-foreground-subtle hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

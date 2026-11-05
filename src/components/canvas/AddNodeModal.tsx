import React, { useState, useEffect } from 'react';
import { Quote, Layers, LayoutGrid, Palette, ArrowRight } from 'lucide-react';
import { UXFeature, UXResearch, UXSitemap } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type NodeTypeOption = 'research' | 'feature' | 'sitemap' | 'token';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: NodeTypeOption;
  parentId?: string | null;
  researchList: UXResearch[];
  featuresList: UXFeature[];
  sitemapList: UXSitemap[];
  onSubmit: (data: {
    type: NodeTypeOption;
    researchText?: string;
    featureName?: string;
    featureDescription?: string;
    featureResearchId?: string;
    sitemapPage?: string;
    sitemapHierarchy?: string;
    sitemapFeatureId?: string;
    tokenComponent?: string;
    tokenValue?: string;
    tokenSitemapId?: string;
  }) => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  onClose,
  nodeType,
  parentId,
  researchList,
  featuresList,
  sitemapList,
  onSubmit,
}) => {
  // Form fields
  const [researchText, setResearchText] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [featureResearchId, setFeatureResearchId] = useState(parentId || researchList[0]?.id || '');

  const [sitemapPage, setSitemapPage] = useState('');
  const [sitemapHierarchy, setSitemapHierarchy] = useState('Body');
  const [sitemapFeatureId, setSitemapFeatureId] = useState(parentId || featuresList[0]?.id || '');

  const [tokenComponent, setTokenComponent] = useState('PrimaryCTA');
  const [tokenValue, setTokenValue] = useState('bg-white text-zinc-900 px-4 py-2 rounded-xl border border-zinc-200');
  const [tokenSitemapId, setTokenSitemapId] = useState(parentId || sitemapList[0]?.id || '');

  useEffect(() => {
    if (parentId) {
      if (nodeType === 'feature') setFeatureResearchId(parentId);
      if (nodeType === 'sitemap') setSitemapFeatureId(parentId);
      if (nodeType === 'token') setTokenSitemapId(parentId);
    } else {
      if (nodeType === 'feature') setFeatureResearchId(researchList[0]?.id || '');
      if (nodeType === 'sitemap') setSitemapFeatureId(featuresList[0]?.id || '');
      if (nodeType === 'token') setTokenSitemapId(sitemapList[0]?.id || '');
    }
  }, [parentId, nodeType, researchList, featuresList, sitemapList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: nodeType,
      researchText,
      featureName,
      featureDescription: featureDesc,
      featureResearchId,
      sitemapPage,
      sitemapHierarchy,
      sitemapFeatureId,
      tokenComponent,
      tokenValue,
      tokenSitemapId,
    });
    // Reset fields
    setResearchText('');
    setFeatureName('');
    setFeatureDesc('');
    setSitemapPage('');
    onClose();
  };

  const getHeaderInfo = () => {
    switch (nodeType) {
      case 'research':
        return {
          label: '01 / RISET',
          title: 'Tambah Insight Riset Baru',
          desc: 'Dasari arsitektur produk Anda dari observasi nyata atau kendala utama pengguna.',
          icon: Quote,
          colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        };
      case 'feature':
        return {
          label: '02 / FITUR',
          title: 'Petakan Fitur Baru',
          desc: 'Definisikan solusi fitur yang dirancang untuk menjawab insight riset terkait.',
          icon: Layers,
          colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        };
      case 'sitemap':
        return {
          label: '03 / SITEMAP',
          title: 'Tempatkan Layar Sitemap',
          desc: 'Tentukan penempatan fitur ke dalam halaman dan zona hierarki antarmuka.',
          icon: LayoutGrid,
          colorClass: 'text-purple-600 bg-purple-50 border-purple-100',
        };
      case 'token':
        return {
          label: '04 / TOKEN UI',
          title: 'Tautkan Komponen & Token UI',
          desc: 'Tentukan aturan styling desain dan struktur komponen untuk pembuatan kode presisi tinggi.',
          icon: Palette,
          colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
        };
    }
  };

  const header = getHeaderInfo();
  const Icon = header.icon;

  // Derive selected parent entities for Upstream Context Echo
  const selectedResearch = researchList.find((r) => r.id === featureResearchId);
  const selectedFeature = featuresList.find((f) => f.id === sitemapFeatureId);
  const selectedSitemap = sitemapList.find((s) => s.id === tokenSitemapId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-zinc-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${header.colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-sm font-semibold text-zinc-900">
                    {header.title}
                  </DialogTitle>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {header.label}
                  </span>
                </div>
                <DialogDescription className="text-[11px] text-zinc-500 mt-0.5">
                  {header.desc}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {nodeType === 'research' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Kutipan Pengguna / Temuan Riset
              </label>
              <Textarea
                autoFocus
                required
                rows={3}
                value={researchText}
                onChange={(e) => setResearchText(e.target.value)}
                placeholder="Contoh: 'Pengguna sering bingung mengapa aksi bulk-delete tidak bisa di-undo saat memproses 50+ item sekaligus.'"
              />
            </div>
          )}

          {nodeType === 'feature' && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Tautkan ke Insight Riset (Akar Silsilah)
                </label>
                <select
                  value={featureResearchId}
                  onChange={(e) => setFeatureResearchId(e.target.value)}
                  className="w-full rounded-lg bg-white border border-zinc-200 p-2.5 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 shadow-sm"
                >
                  <option value="">(Opsional) Tanpa Induk — Buat Kartu Mandiri</option>
                  {researchList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.insight_text.slice(0, 70)}...
                    </option>
                  ))}
                </select>

                {/* Upstream Context Echo: Research */}
                {selectedResearch && (
                  <div className="mt-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 text-xs text-zinc-700 leading-relaxed shadow-sm">
                    <span className="text-[10px] font-mono font-semibold uppercase text-indigo-700 block mb-1">
                      Menjawab Akar Riset:
                    </span>
                    <span className="italic font-sans">&ldquo;{selectedResearch.insight_text}&rdquo;</span>
                  </div>
                )}

                {researchList.length === 0 && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                    <span>💡</span>
                    <span>Belum ada node Riset. Fitur ini akan dibuat sebagai kartu mandiri dan dapat dihubungkan nanti via penarikan kabel.</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Nama Fitur
                </label>
                <Input
                  autoFocus
                  required
                  type="text"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  placeholder="Contoh: Soft-Delete Staging Drawer & 30-Sec Toast Undo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Alasan & Justifikasi UX (Opsional)
                </label>
                <Textarea
                  rows={2}
                  value={featureDesc}
                  onChange={(e) => setFeatureDesc(e.target.value)}
                  placeholder="Mengapa fitur ini dibuat untuk menjawab temuan riset di atas?"
                  className="min-h-[60px]"
                />
              </div>
            </>
          )}

          {nodeType === 'sitemap' && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Fitur Induk
                </label>
                <select
                  value={sitemapFeatureId}
                  onChange={(e) => setSitemapFeatureId(e.target.value)}
                  className="w-full rounded-lg bg-white border border-zinc-200 p-2.5 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 shadow-sm"
                >
                  <option value="">(Opsional) Tanpa Induk — Buat Kartu Mandiri</option>
                  {featuresList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.feature_name}
                    </option>
                  ))}
                </select>

                {/* Upstream Context Echo: Feature */}
                {selectedFeature && (
                  <div className="mt-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 p-3 text-xs text-zinc-700 leading-relaxed shadow-sm">
                    <span className="text-[10px] font-mono font-semibold uppercase text-emerald-700 block mb-1">
                      Menopang Solusi Fitur:
                    </span>
                    <div className="font-semibold text-zinc-900">{selectedFeature.feature_name}</div>
                    {selectedFeature.description && (
                      <div className="text-[11px] text-zinc-600 mt-1 italic font-sans leading-relaxed">
                        {selectedFeature.description}
                      </div>
                    )}
                  </div>
                )}

                {featuresList.length === 0 && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                    <span>💡</span>
                    <span>Belum ada node Fitur. Layar sitemap ini akan dibuat sebagai kartu mandiri dan dapat dihubungkan nanti via penarikan kabel.</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Nama Layar / Halaman
                  </label>
                  <Input
                    autoFocus
                    required
                    type="text"
                    value={sitemapPage}
                    onChange={(e) => setSitemapPage(e.target.value)}
                    placeholder="Contoh: Panel Operasi Massal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Zona Hierarki Tata Letak
                  </label>
                  <select
                    value={sitemapHierarchy}
                    onChange={(e) => setSitemapHierarchy(e.target.value)}
                    className="w-full rounded-lg bg-white border border-zinc-200 p-2.5 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 shadow-sm"
                  >
                    <option value="Header">Header (Atas)</option>
                    <option value="Hero Section">Hero Section (Sorotan Utama)</option>
                    <option value="Body">Konten Utama (Body)</option>
                    <option value="Sidebar">Bilah Samping (Sidebar)</option>
                    <option value="Floating Action">Aksi Mengambang (Floating)</option>
                    <option value="Modal/Drawer">Jendela Pop-up / Drawer</option>
                    <option value="Footer">Footer (Bawah)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {nodeType === 'token' && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Layar Sitemap Terkait
                </label>
                <select
                  value={tokenSitemapId}
                  onChange={(e) => setTokenSitemapId(e.target.value)}
                  className="w-full rounded-lg bg-white border border-zinc-200 p-2.5 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 shadow-sm"
                >
                  <option value="">(Opsional) Tanpa Induk — Buat Kartu Mandiri</option>
                  {sitemapList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.page_name} ({s.hierarchy_level})
                    </option>
                  ))}
                </select>

                {/* Upstream Context Echo: Sitemap */}
                {selectedSitemap && (
                  <div className="mt-2.5 rounded-lg bg-purple-50/60 border border-purple-100 p-3 text-xs text-zinc-700 leading-relaxed shadow-sm">
                    <span className="text-[10px] font-mono font-semibold uppercase text-purple-700 block mb-1">
                      Mengisi Layar Sitemap:
                    </span>
                    <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                      <span>{selectedSitemap.page_name}</span>
                      <span className="font-mono text-[10px] text-zinc-500 font-normal">
                        ({selectedSitemap.hierarchy_level})
                      </span>
                    </div>
                  </div>
                )}

                {sitemapList.length === 0 && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                    <span>💡</span>
                    <span>Belum ada node Sitemap. Token ini akan dibuat sebagai kartu mandiri dan dapat dihubungkan nanti via penarikan kabel.</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Tipe Komponen
                </label>
                <Input
                  autoFocus
                  required
                  type="text"
                  value={tokenComponent}
                  onChange={(e) => setTokenComponent(e.target.value)}
                  placeholder="Contoh: ToastNotification, ActionPill"
                  className="font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Spesifikasi Token Desain / Class CSS
                </label>
                <Input
                  required
                  type="text"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                  placeholder="Contoh: bg-white text-zinc-900 p-4 border border-zinc-200"
                  className="font-mono"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            >
              Batal
            </Button>
            <button
              type="submit"
              className="bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <span>Tambah ke Kanvas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

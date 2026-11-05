import React, { useState, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';
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

export type EditNodeData =
  | { type: 'research'; id: string; insight_text: string }
  | { type: 'feature'; id: string; feature_name: string; description?: string }
  | { type: 'sitemap'; id: string; page_name: string; hierarchy_level: string }
  | { type: 'token'; id: string; component_type: string; design_token: string };

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: EditNodeData | null;
  onSave: (updated: EditNodeData) => Promise<void>;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  isOpen,
  onClose,
  nodeData,
  onSave,
}) => {
  const [researchText, setResearchText] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [sitemapPage, setSitemapPage] = useState('');
  const [sitemapHierarchy, setSitemapHierarchy] = useState('Main Content');
  const [tokenComponent, setTokenComponent] = useState('');
  const [tokenValue, setTokenValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!nodeData) return;
    if (nodeData.type === 'research') {
      setResearchText(nodeData.insight_text);
    } else if (nodeData.type === 'feature') {
      setFeatureName(nodeData.feature_name);
      setFeatureDesc(nodeData.description || '');
    } else if (nodeData.type === 'sitemap') {
      setSitemapPage(nodeData.page_name);
      setSitemapHierarchy(nodeData.hierarchy_level);
    } else if (nodeData.type === 'token') {
      setTokenComponent(nodeData.component_type);
      setTokenValue(nodeData.design_token);
    }
  }, [nodeData]);

  if (!nodeData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      if (nodeData.type === 'research') {
        await onSave({
          type: 'research',
          id: nodeData.id,
          insight_text: researchText.trim(),
        });
      } else if (nodeData.type === 'feature') {
        await onSave({
          type: 'feature',
          id: nodeData.id,
          feature_name: featureName.trim(),
          description: featureDesc.trim() || undefined,
        });
      } else if (nodeData.type === 'sitemap') {
        await onSave({
          type: 'sitemap',
          id: nodeData.id,
          page_name: sitemapPage.trim(),
          hierarchy_level: sitemapHierarchy,
        });
      } else if (nodeData.type === 'token') {
        await onSave({
          type: 'token',
          id: nodeData.id,
          component_type: tokenComponent.trim(),
          design_token: tokenValue.trim(),
        });
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const getNodeHeader = () => {
    switch (nodeData.type) {
      case 'research':
        return {
          label: '01 / RISET',
          title: 'Ubah Insight Riset',
          desc: 'Perbarui kutipan pengguna atau temuan riset observasi.',
          colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        };
      case 'feature':
        return {
          label: '02 / FITUR',
          title: 'Ubah Spesifikasi Fitur',
          desc: 'Sesuaikan nama fitur dan justifikasi arsitektur UX.',
          colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        };
      case 'sitemap':
        return {
          label: '03 / SITEMAP',
          title: 'Ubah Penempatan Sitemap',
          desc: 'Perbarui nama halaman atau zona hierarki penempatan.',
          colorClass: 'text-purple-600 bg-purple-50 border-purple-100',
        };
      case 'token':
        return {
          label: '04 / TOKEN UI',
          title: 'Ubah Komponen & Token UI',
          desc: 'Perbarui definisi komponen atau aturan token styling.',
          colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
        };
    }
  };

  const header = getNodeHeader();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-zinc-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${header.colorClass}`}>
                <Pencil className="h-4 w-4" />
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
          {nodeData.type === 'research' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Kutipan Pengguna / Temuan Riset
              </label>
              <Textarea
                autoFocus
                required
                rows={4}
                value={researchText}
                onChange={(e) => setResearchText(e.target.value)}
                placeholder="Tuliskan temuan riset pengguna..."
              />
            </div>
          )}

          {nodeData.type === 'feature' && (
            <>
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
                  placeholder="Masukkan nama fitur..."
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
                  placeholder="Mengapa fitur ini penting bagi pengguna?"
                  className="min-h-[60px]"
                />
              </div>
            </>
          )}

          {nodeData.type === 'sitemap' && (
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
                  placeholder="Nama halaman..."
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
                  <option value="Main Content">Konten Utama (Body)</option>
                  <option value="Body">Body</option>
                  <option value="Sidebar">Bilah Samping (Sidebar)</option>
                  <option value="Floating Action">Aksi Mengambang (Floating)</option>
                  <option value="Modal/Drawer">Jendela Pop-up / Drawer</option>
                  <option value="Footer">Footer (Bawah)</option>
                </select>
              </div>
            </div>
          )}

          {nodeData.type === 'token' && (
            <>
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
                  placeholder="Contoh: FloatingCheckoutBar"
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
              disabled={isSaving}
              className="bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

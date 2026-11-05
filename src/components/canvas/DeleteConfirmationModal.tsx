import React from 'react';
import { AlertTriangle, Trash2, Layers, LayoutGrid, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DeleteTargetInfo {
  type: 'single' | 'bulk';
  nodeType?: 'research' | 'feature' | 'sitemap' | 'token';
  nodeId?: string;
  nodeTitle?: string;
  dependentCounts: {
    features: number;
    sitemaps: number;
    tokens: number;
    total: number;
  };
  bulkCount?: number;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetInfo: DeleteTargetInfo | null;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  targetInfo,
  onConfirm,
}) => {
  if (!targetInfo) return null;

  const isBulk = targetInfo.type === 'bulk';
  const hasDependents = targetInfo.dependentCounts.total > 0;

  const getNodeTypeName = (type?: string) => {
    switch (type) {
      case 'research':
        return 'Insight Riset';
      case 'feature':
        return 'Fitur';
      case 'sitemap':
        return 'Layar Sitemap';
      case 'token':
        return 'Token UI';
      default:
        return 'Node';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-zinc-200">
        {/* Header with warning styling */}
        <div className="px-6 py-4 border-b border-zinc-100 bg-red-50/40">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 border border-red-200 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold text-zinc-900">
                  {isBulk
                    ? `Hapus ${targetInfo.bulkCount || 0} Node Terpilih?`
                    : hasDependents
                    ? 'Hapus Node & Silsilah Turunannya?'
                    : `Hapus ${getNodeTypeName(targetInfo.nodeType)}?`}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Tindakan ini permanen dan tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {!isBulk && targetInfo.nodeTitle && (
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                {getNodeTypeName(targetInfo.nodeType)}:
              </span>
              <p className="text-xs text-zinc-800 font-medium line-clamp-2">
                &ldquo;{targetInfo.nodeTitle}&rdquo;
              </p>
            </div>
          )}

          {/* Breakdown of cascade-deleted items */}
          {hasDependents && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-700 font-medium">
                Kartu turunan berikut akan ikut terhapus secara berantai:
              </p>
              <div className="space-y-1.5 p-3 rounded-lg bg-red-50/60 border border-red-100 text-xs text-zinc-700 font-sans">
                {targetInfo.dependentCounts.features > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <Layers className="h-3.5 w-3.5 text-emerald-600" />
                      Fitur Solusi
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {targetInfo.dependentCounts.features} kartu
                    </span>
                  </div>
                )}
                {targetInfo.dependentCounts.sitemaps > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-purple-800">
                      <LayoutGrid className="h-3.5 w-3.5 text-purple-600" />
                      Layar Sitemap
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {targetInfo.dependentCounts.sitemaps} kartu
                    </span>
                  </div>
                )}
                {targetInfo.dependentCounts.tokens > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <Palette className="h-3.5 w-3.5 text-amber-600" />
                      Token UI & Komponen
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {targetInfo.dependentCounts.tokens} kartu
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-red-200/70 flex items-center justify-between text-xs font-semibold text-red-900">
                  <span>Total yang akan dihapus:</span>
                  <span className="font-mono">
                    {targetInfo.dependentCounts.total + 1} kartu
                  </span>
                </div>
              </div>
            </div>
          )}

          {isBulk && (
            <p className="text-xs text-zinc-600 leading-relaxed">
              Anda sedang menghapus {targetInfo.bulkCount} node secara bersamaan. Seluruh
              koneksi dan relasi hilir yang terikat pada node-node ini akan diputuskan atau dihapus.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-100"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus Permanen</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

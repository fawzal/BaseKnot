import React, { useState } from 'react';
import { UXResearch, UXFeature } from '@/types/database';
import { Plus, Trash2, Link as LinkIcon, Sparkles } from 'lucide-react';

interface ResearchHubProps {
  researchList: UXResearch[];
  featuresList: UXFeature[];
  onAddResearch: (insightText: string) => Promise<void>;
  onDeleteResearch: (id: string) => Promise<void>;
  onAddFeature: (featureName: string, researchId: string, description?: string) => Promise<void>;
  onDeleteFeature: (id: string) => Promise<void>;
}

// Separate instant input component to avoid parent re-renders on keystroke (Vercel rule: rerender-defer-reads)
function InstantResearchInput({ onAdd }: { onAdd: (text: string) => Promise<void> }) {
  const [insightText, setInsightText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = insightText.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setInsightText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-surface border border-border focus-within:border-accent rounded-lg p-1.5 transition-all">
        <span className="pl-2.5 text-xs font-mono text-accent uppercase tracking-wider font-semibold select-none">
          INSIGHT &gt;
        </span>
        <input
          type="text"
          value={insightText}
          onChange={(e) => setInsightText(e.target.value)}
          placeholder="Input keluhan pengguna / temuan riset instan (tekan Enter untuk simpan)..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none px-2 py-1.5"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!insightText.trim() || isSubmitting}
          className="px-3 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 select-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>
      <p className="text-[11px] text-foreground-subtle mt-1.5 pl-1">
        Formulir satu baris tanpa distorsi styling untuk kecepatan input maksimal (&lt; 15 detik).
      </p>
    </form>
  );
}

// Inline Feature Registration
function AddFeatureModal({
  researchList,
  defaultResearchId,
  onAdd,
  onClose,
}: {
  researchList: UXResearch[];
  defaultResearchId?: string;
  onAdd: (name: string, researchId: string, desc?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [selectedResearchId, setSelectedResearchId] = useState(defaultResearchId || researchList[0]?.id || '');
  const [featureName, setFeatureName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureName.trim() || !selectedResearchId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(featureName.trim(), selectedResearchId, description.trim() || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-surface-elevated border border-border rounded-xl p-5 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">Relasikan Fitur Baru ke Riset</h3>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-subtle hover:text-foreground text-sm font-mono px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1.5">
              Pilih Sumber Insight Riset (Foreign Key: <code className="text-accent font-mono">research_id</code>)
            </label>
            <select
              value={selectedResearchId}
              onChange={(e) => setSelectedResearchId(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
            >
              {researchList.map((res) => (
                <option key={res.id} value={res.id}>
                  [{res.id.slice(-6)}] {res.insight_text.slice(0, 70)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1.5">
              Nama Fitur / Solusi UX
            </label>
            <input
              type="text"
              required
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              placeholder="Contoh: Undo Action Staging Drawer, Sticky Filter Chips"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1.5">
              Rasionalisasi & Deskripsi Solusi (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Justifikasi mengapa fitur ini menyelesaikan keluhan pengguna di atas..."
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-foreground-muted hover:text-foreground hover:bg-surface"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!featureName.trim() || !selectedResearchId || isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium disabled:opacity-50"
            >
              Simpan Relasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ResearchHub({
  researchList,
  featuresList,
  onAddResearch,
  onDeleteResearch,
  onAddFeature,
  onDeleteFeature,
}: ResearchHubProps) {
  const [modalResearchId, setModalResearchId] = useState<string | null>(null);

  // Group features by research_id for fast O(1) lookup
  const featuresByResearch = React.useMemo(() => {
    const map = new Map<string, UXFeature[]>();
    for (const feat of featuresList) {
      const existing = map.get(feat.research_id) || [];
      existing.push(feat);
      map.set(feat.research_id, existing);
    }
    return map;
  }, [featuresList]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">
              Modul 1: Research Hub & Feature Mapper
            </h2>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Tangkap insight riset secara instan dan ikat langsung dengan perencanaan fitur. Setiap fitur wajib memiliki dasar hukum riset.
          </p>
        </div>
        <button
          onClick={() => setModalResearchId(researchList[0]?.id || '')}
          disabled={researchList.length === 0}
          className="px-3.5 py-2 bg-surface-elevated hover:bg-surface-hover border border-border text-foreground text-xs rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto disabled:opacity-40"
        >
          <LinkIcon className="w-3.5 h-3.5 text-accent" />
          <span>Hubungkan Fitur Baru</span>
        </button>
      </div>

      {/* Instant Input */}
      <InstantResearchInput onAdd={onAddResearch} />

      {/* Research and Relational Features Thread */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-foreground-muted px-1">
          <span>DAFTAR LOGIKA RISET & FITUR TERIKAT ({researchList.length})</span>
          <span className="font-mono text-[11px] text-foreground-subtle">
            {featuresList.length} total fitur terikat
          </span>
        </div>

        {researchList.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-surface/50 text-foreground-subtle text-xs">
            Belum ada data riset. Masukkan keluhan pengguna pertama Anda pada formulir instan di atas.
          </div>
        ) : (
          researchList.map((res) => {
            const boundFeatures = featuresByResearch.get(res.id) || [];
            return (
              <div
                key={res.id}
                className="bg-surface rounded-xl border border-border hover:border-border-highlight transition-all p-4 space-y-3"
              >
                {/* Research Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-surface-elevated text-accent border border-accent/20">
                      RESEARCH #{res.id.slice(-4)}
                    </span>
                    <div>
                      <p className="text-sm text-foreground font-medium leading-relaxed">
                        &ldquo;{res.insight_text}&rdquo;
                      </p>
                      <span className="text-[10px] font-mono text-foreground-subtle">
                        {new Date(res.created_at).toLocaleDateString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setModalResearchId(res.id)}
                      className="px-2.5 py-1 text-[11px] rounded bg-surface-elevated hover:bg-surface-hover text-foreground-muted hover:text-foreground border border-border flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-accent" />
                      <span>+ Fitur</span>
                    </button>
                    <button
                      onClick={() => onDeleteResearch(res.id)}
                      title="Hapus insight ini"
                      className="p-1 rounded text-foreground-subtle hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bound Features Section */}
                <div className="pl-6 border-l-2 border-border/80 ml-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase text-foreground-subtle tracking-wider">
                      Solusi Fitur Terikat ({boundFeatures.length})
                    </span>
                  </div>

                  {boundFeatures.length === 0 ? (
                    <p className="text-xs text-amber-500/80 italic font-mono">
                      Belum ada fitur terikat. Klik &quot;+ Fitur&quot; untuk mengikat solusi UX pada temuan ini.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {boundFeatures.map((feat) => (
                        <div
                          key={feat.id}
                          className="bg-surface-elevated/80 border border-border rounded-lg p-2.5 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              <span className="text-xs font-medium text-foreground">
                                {feat.feature_name}
                              </span>
                            </div>
                            {feat.description && (
                              <p className="text-[11px] text-foreground-muted mt-1 leading-snug">
                                {feat.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteFeature(feat.id)}
                            title="Hapus relasi fitur ini"
                            className="p-1 text-foreground-subtle hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalResearchId && (
        <AddFeatureModal
          researchList={researchList}
          defaultResearchId={modalResearchId}
          onAdd={onAddFeature}
          onClose={() => setModalResearchId(null)}
        />
      )}
    </div>
  );
}

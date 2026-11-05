import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Plus, Trash2, MapPin, Pencil } from 'lucide-react';

export interface SitemapNodeData {
  id: string;
  page_name: string;
  hierarchy_level: string;
  feature_id: string;
  onAddChild?: (parentId: string, type: 'token') => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  [key: string]: unknown;
}

export const SitemapNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as SitemapNodeData;

  return (
    <div
      className={`group relative min-w-[280px] max-w-[340px] rounded-xl bg-surface border transition-all duration-150 shadow-node hover:shadow-node-hover ${
        selected
          ? 'border-zinc-900 ring-2 ring-zinc-900/10'
          : 'border-border hover:border-border-hover'
      }`}
    >
      {/* Input Handle from Feature */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-white hover:!bg-zinc-900 !transition-colors"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 bg-zinc-50/70 rounded-t-xl">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100/80">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-purple-700">
            03 / SITEMAP
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {nodeData.onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nodeData.onEdit?.(nodeData.id);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
              title="Ubah Sitemap (atau klik ganda)"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}
          {nodeData.onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nodeData.onDelete?.(nodeData.id);
              }}
              className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Hapus Layar Sitemap"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
          <MapPin className="h-3 w-3 text-zinc-400" />
          <span>Layar / Halaman:</span>
        </div>
        <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
          {nodeData.page_name}
        </h4>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-400 font-mono">Zona:</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {nodeData.hierarchy_level}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-3.5 py-2 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl flex items-center justify-between">
        {nodeData.feature_id ? (
          <span className="text-[10px] font-mono text-zinc-400">
            Target Tampilan
          </span>
        ) : (
          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            Draf Mandiri (Tautkan ke Fitur)
          </span>
        )}
        {nodeData.onAddChild && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onAddChild?.(nodeData.id, 'token');
            }}
            className="flex items-center gap-1 text-[10px] font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 shadow-sm transition-colors"
          >
            <Plus className="h-3 w-3 text-zinc-500" />
            <span>Tautkan Token UI</span>
          </button>
        )}
      </div>

      {/* Connection Handle (Output -> Token) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-white hover:!bg-zinc-900 !transition-colors"
      />
    </div>
  );
});

SitemapNode.displayName = 'SitemapNode';

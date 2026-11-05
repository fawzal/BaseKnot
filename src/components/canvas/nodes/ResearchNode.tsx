import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Plus, Trash2, Pencil } from 'lucide-react';

export interface ResearchNodeData {
  id: string;
  insight_text: string;
  source?: string;
  created_at?: string;
  onAddChild?: (parentId: string, type: 'feature') => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  [key: string]: unknown;
}

export const ResearchNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ResearchNodeData;

  return (
    <div
      className={`group relative min-w-[280px] max-w-[340px] rounded-xl bg-surface border transition-all duration-150 shadow-node hover:shadow-node-hover ${
        selected
          ? 'border-zinc-900 ring-2 ring-zinc-900/10'
          : 'border-border hover:border-border-hover'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 bg-zinc-50/70 rounded-t-xl">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100/80">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-indigo-700">
            01 / RISET
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
              title="Ubah Insight (atau klik ganda)"
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
              title="Hapus Insight"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-xs text-zinc-800 leading-relaxed font-sans line-clamp-4">
          &ldquo;{nodeData.insight_text}&rdquo;
        </p>

        {nodeData.source && (
          <div className="mt-2.5 text-[10px] font-mono text-zinc-400 flex items-center gap-1">
            <span>sumber:</span>
            <span className="text-zinc-600 font-medium">{nodeData.source}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-3.5 py-2 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 font-medium">
          01 Akar Masalah (Ground Truth)
        </span>
        {nodeData.onAddChild && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onAddChild?.(nodeData.id, 'feature');
            }}
            className="flex items-center gap-1 text-[10px] font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 shadow-sm transition-colors"
          >
            <Plus className="h-3 w-3 text-zinc-500" />
            <span>Petakan Fitur</span>
          </button>
        )}
      </div>

      {/* Connection Handle (Output -> Feature) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-white hover:!bg-zinc-900 !transition-colors"
      />
    </div>
  );
});

ResearchNode.displayName = 'ResearchNode';

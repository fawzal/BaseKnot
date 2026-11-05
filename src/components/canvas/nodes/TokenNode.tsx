import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, Box, Pencil } from 'lucide-react';

export interface TokenNodeData {
  id: string;
  component_type: string;
  design_token: string;
  sitemap_id: string;
  isCompleteChain?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  [key: string]: unknown;
}

export const TokenNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as TokenNodeData;
  const isConnected = Boolean(nodeData.sitemap_id);

  return (
    <div
      className={`group relative min-w-[280px] max-w-[340px] rounded-xl bg-surface border transition-all duration-150 shadow-node hover:shadow-node-hover ${
        selected
          ? 'border-zinc-900 ring-2 ring-zinc-900/10'
          : isConnected
          ? 'border-zinc-300 hover:border-zinc-400'
          : 'border-border hover:border-border-hover'
      }`}
    >
      {/* Input Handle from Sitemap */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-white hover:!bg-zinc-900 !transition-colors"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 bg-zinc-50/70 rounded-t-xl">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-amber-700">
            04 / TOKEN UI
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
              title="Ubah Token (atau klik ganda)"
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
              title="Hapus Token"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Box className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Komponen:
          </span>
          <span className="text-xs font-semibold text-zinc-900 font-mono">
            &lt;{nodeData.component_type} /&gt;
          </span>
        </div>

        <div className="mt-2 rounded-lg bg-zinc-50 border border-zinc-200/90 p-2.5 font-mono text-[11px] text-zinc-800 break-all leading-relaxed shadow-inner shadow-zinc-200/30">
          {nodeData.design_token}
        </div>
      </div>

      {/* Terminal Node Indicator (Complete 4-Tier State vs Unlinked Draft) */}
      <div className="px-3.5 py-2 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl flex items-center justify-between">
        {isConnected ? (
          <>
            <span className="text-[9px] font-mono font-medium text-emerald-700">
              ✓ Silsilah Utuh (Siap Koding)
            </span>
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
              title="Silsilah 4-tingkat lengkap hulu ke hilir"
            />
          </>
        ) : (
          <>
            <span className="text-[9px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
              Draf Mandiri (Tautkan ke Layar)
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          </>
        )}
      </div>
    </div>
  );
});

TokenNode.displayName = 'TokenNode';

import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { X } from 'lucide-react';

export const ThreadEdge = memo(({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onDisconnect = (data as any)?.onDisconnect;
  const isCompleteChain = Boolean((data as any)?.isCompleteChain);
  const isFocused = Boolean((data as any)?.isFocused);
  const shouldPulse = isCompleteChain || isFocused;

  return (
    <>
      {/* Base Thread Edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={24}
        style={{
          strokeWidth: selected || shouldPulse ? 2 : 1.5,
          stroke: selected || shouldPulse ? '#18181B' : '#A1A1AA',
          transition: 'stroke 0.2s ease, opacity 0.2s ease, stroke-width 0.2s ease',
          ...style,
        }}
      />

      {/* Circuit Ignition Luminous Flow: Monochromatic pulse representing upstream-to-downstream energy */}
      {shouldPulse && (
        <path
          d={edgePath}
          fill="none"
          stroke="#18181B"
          strokeWidth={selected ? 2.5 : 2}
          strokeDasharray="5 10"
          strokeLinecap="round"
          className="circuit-flow-pulse pointer-events-none"
          style={{
            opacity: 0.9,
          }}
        />
      )}

      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan z-50 pointer-events-auto select-none"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDisconnect?.(id, source, target);
              }}
              data-testid={`disconnect-edge-${id}`}
              className="group flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-red-50 text-zinc-700 hover:text-red-700 border border-zinc-200 hover:border-red-300 rounded-full text-[11px] font-medium shadow-md transition-all duration-150 cursor-pointer active:scale-95"
              title="Lepas Hubungan koneksi kabel ini (atau tekan Delete/Backspace)"
            >
              <X className="w-3 h-3 text-red-500 group-hover:rotate-90 transition-transform duration-150" />
              <span>Lepas Hubungan</span>
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

ThreadEdge.displayName = 'ThreadEdge';

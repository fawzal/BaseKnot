import { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';

interface UseCanvasKeyboardOptions {
  nodes: Node[];
  edges: Edge[];
  focusedNodeId: string | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setFocusedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  onRequestBulkDelete: () => void;
  onDisconnectEdges: (edges: Edge[]) => Promise<void>;
  onOpenExport: () => void;
  setCursorMode: React.Dispatch<React.SetStateAction<'select' | 'pan'>>;
}

export function useCanvasKeyboard({
  nodes,
  edges,
  focusedNodeId,
  setNodes,
  setFocusedNodeId,
  onRequestBulkDelete,
  onDisconnectEdges,
  onOpenExport,
  setCursorMode,
}: UseCanvasKeyboardOptions) {
  const [isShiftDown, setIsShiftDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftDown(true);
      }

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Escape -> Clear Lineage Focus
      if (e.key === 'Escape') {
        setFocusedNodeId(null);
      }

      // Ctrl+Shift+E / Cmd+Shift+E -> Open Export Drawer
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        onOpenExport();
        return;
      }

      // Keyboard Traversal for Lineage Focus Mode
      if (focusedNodeId) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          const downstream = edges.find((edge) => edge.source === focusedNodeId);
          if (downstream) {
            e.preventDefault();
            setFocusedNodeId(downstream.target);
            return;
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          const upstream = edges.find((edge) => edge.target === focusedNodeId);
          if (upstream) {
            e.preventDefault();
            setFocusedNodeId(upstream.source);
            return;
          }
        }
      }

      // Cursor Mode Shortcuts: V for Select, H for Hand
      if (e.key === 'v' || e.key === 'V') {
        setCursorMode('select');
      } else if (e.key === 'h' || e.key === 'H') {
        setCursorMode('pan');
      }

      // Ctrl+A / Cmd+A -> Select all nodes
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
      }

      // Backspace / Delete -> Bulk delete selected nodes OR disconnect selected edges
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const hasSelectedNodes = nodes.some((n) => n.selected);
        const selectedEdgesToDisconnect = edges.filter((ed) => ed.selected);

        if (hasSelectedNodes) {
          e.preventDefault();
          onRequestBulkDelete();
        } else if (selectedEdgesToDisconnect.length > 0) {
          e.preventDefault();
          onDisconnectEdges(selectedEdgesToDisconnect);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    nodes,
    edges,
    focusedNodeId,
    setNodes,
    setFocusedNodeId,
    onRequestBulkDelete,
    onOpenExport,
    onDisconnectEdges,
    setCursorMode,
  ]);

  return { isShiftDown };
}

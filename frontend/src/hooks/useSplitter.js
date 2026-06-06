import { useState, useCallback, useRef } from 'react';

/**
 * useSplitter — shared hook for draggable left/right panel splitter.
 *
 * @param {object} options
 * @param {number} [options.minPct=20]  Minimum left-panel width (%)
 * @param {number} [options.maxPct=60]  Maximum left-panel width (%)
 * @param {number} [options.defaultPct=38]  Default left-panel width (%)
 * @returns {{ leftRatio, rightPlotKey, rowRef, onResizeStart }}
 */
export function useSplitter({ minPct = 20, maxPct = 60, defaultPct = 38 } = {}) {
  const [leftRatio, setLeftRatio] = useState(defaultPct);
  const [rightPlotKey, setRightPlotKey] = useState(0);
  const rowRef = useRef(null);
  const dragging = useRef(false);

  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev) => {
      if (!dragging.current || !rowRef.current) return;
      const rect = rowRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftRatio(Math.max(minPct, Math.min(maxPct, pct)));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setRightPlotKey(k => k + 1);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [minPct, maxPct]);

  return { leftRatio, rightPlotKey, rowRef, onResizeStart };
}

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getPlotLayout, getTracePalette } from '../../constants/plotThemeConfig';

/**
 * SummationPlotter — 求和/积分可视化绘图器
 *
 * 接受已计算好的 traces 数组并渲染 2D Plotly 图。
 * 支持矩形近似面积的可视化（半透明填充 + 边框）。
 */
const SummationPlotter = ({
  data = [],
  xRange = [-5, 5],
  yRange,
  title = '',
  showExportButton = true,
  plotStyle = 'medium',
  aspectRatio = 'auto',
  legendPosition = 'top-right',
  annotations = [],
  children
}) => {
  const plotRef = useRef(null);
  const outerRef = useRef(null);
  const hasInit = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const styleConfig = useMemo(() => {
    switch (plotStyle) {
      case 'thin': return { lineWidth: 1, pointSize: 4, fontSize: 10 };
      case 'thick': return { lineWidth: 4, pointSize: 12, fontSize: 16 };
      case 'extra-thick': return { lineWidth: 6, pointSize: 16, fontSize: 18 };
      default: return { lineWidth: 2.5, pointSize: 8, fontSize: 13 };
    }
  }, [plotStyle]);

  const plotLayout = getPlotLayout(themeMode);

  // ── Apply plot style to trace data ──────────────────────
  const styledData = useMemo(() => {
    if (!data || data.length === 0) return data;
    return data.map(trace => {
      const newTrace = { ...trace };
      if (newTrace.line && typeof newTrace.line.width === 'number') {
        newTrace.line = { ...newTrace.line, width: styleConfig.lineWidth };
      }
      if (newTrace.marker && typeof newTrace.marker.size === 'number') {
        newTrace.marker = { ...newTrace.marker, size: styleConfig.pointSize };
      }
      return newTrace;
    });
  }, [data, styleConfig]);

  // Auto y range
  const autoYRange = useMemo(() => {
    if (yRange) return yRange;
    let minY = Infinity, maxY = -Infinity;
    for (const trace of styledData) {
      if (trace.y) {
        for (const v of trace.y) {
          if (v < minY) minY = v;
          if (v > maxY) maxY = v;
        }
      }
    }
    if (!isFinite(minY)) return [-0.1, 1];
    const pad = (maxY - minY) * 0.1 || 0.5;
    return [Math.min(minY - pad, 0), maxY + pad];
  }, [styledData, yRange]);

  const legX = legendPosition === 'top-right' || legendPosition === 'bottom-right' ? 0.98 : 0.02;
  const legY = legendPosition === 'top-right' || legendPosition === 'top-left' ? 0.98 : 0.02;
  const legXa = legendPosition === 'top-right' || legendPosition === 'bottom-right' ? 'right' : 'left';
  const legYa = legendPosition === 'top-right' || legendPosition === 'top-left' ? 'top' : 'bottom';

  const config = {
    displayModeBar: true, displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'sendDataToCloud'],
    toImageButtonOptions: { format: 'png', filename: `summation_${Date.now()}`, height: 600, width: 800, scale: 2 }
  };

  const layout = useMemo(() => ({
    title: { text: title, font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 2 } },
    xaxis: {
      title: 'x', range: xRange,
      gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
      tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
      titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
      showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
    },
    yaxis: {
      title: 'y', range: autoYRange,
      gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
      tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
      titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
      showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
    },
    plot_bgcolor: plotLayout.plot_bgcolor,
    paper_bgcolor: plotLayout.paper_bgcolor,
    margin: { l: 60, r: 20, t: 60, b: 60 },
    showlegend: legendPosition !== 'None',
    legend: legendPosition !== 'None' ? {
      font: { color: plotLayout.legend.fontColor, size: styleConfig.fontSize },
      bgcolor: plotLayout.legend.bgcolor, bordercolor: plotLayout.legend.bordercolor,
      borderwidth: 1, x: legX, y: legY, xanchor: legXa, yanchor: legYa
    } : undefined,
    hovermode: 'closest',
    annotations: annotations.length > 0
      ? annotations.map(a => ({
          ...a,
          font: a.font ? { ...a.font, size: Math.round((a.font.size || 12) * styleConfig.fontSize / 12) } : undefined
        }))
      : undefined
  }), [title, xRange, autoYRange, plotLayout, styleConfig, legendPosition, annotations]);

  useEffect(() => {
    if (!plotRef.current) return;
    const gd = plotRef.current;
    if (!hasInit.current) {
      Plotly.newPlot(gd, styledData, layout, config).then(() => { hasInit.current = true; });
    } else {
      Plotly.react(gd, styledData, layout, config);
    }
    return () => { if (plotRef.current) Plotly.purge(plotRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styledData, layout, config]);

  useEffect(() => {
    const handleResize = () => { if (plotRef.current) Plotly.Plots.resize(plotRef.current); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      if (outerRef.current) {
        outerRef.current.requestFullscreen().catch(err => {
          console.log(`Fullscreen error: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const onFS = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFS);
    return () => document.removeEventListener('fullscreenchange', onFS);
  }, []);

  const fullscreenBtnStyle = {
    position: 'absolute',
    top: '12px',
    right: '55px',
    zIndex: 10,
    background: palette.mainTraces.primary,
    border: 'none',
    borderRadius: '4px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const containerStyle = {
    width: '100%',
    height: aspectRatio === 'auto' ? '550px' : 'auto',
    aspectRatio: aspectRatio === 'auto' ? 'unset' : aspectRatio.replace(':', '/'),
    background: plotLayout.paper_bgcolor,
    borderRadius: '8px',
    padding: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  return (
    <div ref={outerRef} style={containerStyle}>
      <button
        onClick={handleFullscreenToggle}
        style={fullscreenBtnStyle}
        title="Toggle Fullscreen"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
      <div ref={plotRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
      {isFullscreen && children && (
        <div style={{
          position: 'absolute', top: 20, left: 20, zIndex: 10,
          background: themeMode === 'dark' ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)',
          border: themeMode === 'dark' ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(148,163,184,0.4)',
          borderRadius: 8, padding: '8px 12px'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SummationPlotter;

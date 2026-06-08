import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getPlotLayout, getTracePalette } from '../../constants/plotThemeConfig';

/**
 * Plotter3D — Pure 3D scene plotter.
 *
 * Reusable foundation for all 3D visualization pages.
 * Renders a Plotly 3D scene with support for surface, scatter3d, mesh3d, etc.
 *
 * Props:
 *   data            — Plotly trace array (surface, scatter3d, mesh3d, …)
 *   scene           — { xRange, yRange, zRange, dtick, camera?, aspectratio? }  (REQUIRED)
 *   title           — chart title
 *   showExportButton — show PNG export button (default true)
 *   plotStyle       — thin | medium | thick | extra-thick
 *   legendPosition  — None | top-right | top-left | bottom-left | bottom-right
 *   children        — 浮动控制面板，渲染在容器顶部（全屏时仍可见）
 *   crossSection    — { x0, y0, fn, range, colorX, colorY } 二元函数截面线
 *                     f(x) at y₀ + f(y) at x₀，自动生成 2 条 scatter3d 高亮曲线
 */
const Plotter3D = ({
  data,
  scene: propScene,
  title,
  showExportButton = true,
  plotStyle = 'medium',
  legendPosition = 'top-right',
  height = '600px',
  children,
  crossSection
}) => {
  const plotRef = useRef(null);
  const hasInitialized = useRef(false);
  const outerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const themeMode = useThemeMode();
  const plotLayout = useMemo(() => getPlotLayout(themeMode), [themeMode]);
  const palette = getTracePalette(themeMode);

  const styleConfig = useMemo(() => {
    switch (plotStyle) {
      case 'thin':        return { lineWidth: 1, pointSize: 4, fontSize: 10, tickFontSize: 9 };
      case 'thick':       return { lineWidth: 4, pointSize: 12, fontSize: 16, tickFontSize: 12 };
      case 'extra-thick': return { lineWidth: 6, pointSize: 16, fontSize: 18, tickFontSize: 13 };
      default:            return { lineWidth: 2, pointSize: 8, fontSize: 12, tickFontSize: 10 };
    }
  }, [plotStyle]);

  // ── Layout ──────────────────────────────────────────────
  const layout = useMemo(() => {
    const legX = legendPosition === 'top-right' || legendPosition === 'bottom-right' ? 0.98 : 0.02;
    const legY = legendPosition === 'top-right' || legendPosition === 'top-left' ? 0.98 : 0.02;
    const legXanchor = legendPosition === 'top-right' || legendPosition === 'bottom-right' ? 'right' : 'left';
    const legYanchor = legendPosition === 'top-right' || legendPosition === 'top-left' ? 'top' : 'bottom';

    const legendBase = {
      font: { color: plotLayout.legend.fontColor, size: 11 },
      bgcolor: plotLayout.legend.bgcolor,
      bordercolor: plotLayout.legend.bordercolor,
      borderwidth: 1,
      x: legX, y: legY, xanchor: legXanchor, yanchor: legYanchor
    };

    const axisBase = {
      gridcolor: plotLayout.gridcolor, gridwidth: 0.5,
      zerolinecolor: plotLayout.zerolinecolor, zerolinewidth: 1.5,
      tickfont: { color: plotLayout.tickFontColor, size: styleConfig.tickFontSize },
      showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
    };

    const sceneConfig = {
      xaxis: {
        title: { text: 'x', font: { color: plotLayout.axisLabelColor, size: 14 } },
        range: propScene.xRange, dtick: propScene.dtick || 0.5,
        ...axisBase
      },
      yaxis: {
        title: { text: 'y', font: { color: plotLayout.axisLabelColor, size: 14 } },
        range: propScene.yRange, dtick: propScene.dtick || 0.5,
        ...axisBase
      },
      zaxis: {
        title: { text: 'z', font: { color: plotLayout.axisLabelColor, size: 14 } },
        range: propScene.zRange, dtick: (propScene.dtick || 0.5) * 6,
        ...axisBase
      },
      bgcolor: plotLayout.plot_bgcolor
    };

    // aspectmode + aspectratio 从 scene 透传
    if (propScene.aspectmode) sceneConfig.aspectmode = propScene.aspectmode;
    if (propScene.aspectratio) sceneConfig.aspectratio = propScene.aspectratio;

    return {
      scene: sceneConfig,
      paper_bgcolor: plotLayout.paper_bgcolor,
      margin: { l: 0, r: 0, t: 30, b: 0 },
      showlegend: legendPosition !== 'None',
      title: title ? { text: title, font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 6 } } : undefined,
      legend: legendPosition !== 'None' ? legendBase : undefined
    };
  }, [propScene, title, styleConfig, plotLayout, legendPosition]);

  // ── Cross-section curves (二元函数截面线) ──────────────
  // 生成 f(x) at y₀ 和 f(y) at x₀ 两条高亮 scatter3d
  const crossData = useMemo(() => {
    if (!crossSection) return [];
    const { x0, y0, fn, range, colorX, colorY } = crossSection;
    const [rMin, rMax] = range;
    const N = 50;
    const step = (rMax - rMin) / N;

    const xs = Array.from({ length: N + 1 }, (_, i) => rMin + i * step);
    const fx = xs.map(x => ({ x, y: y0, z: fn(x, y0) }));
    const fy = xs.map(y => ({ x: x0, y, z: fn(x0, y) }));

    return [
      {
        type: 'scatter3d', mode: 'lines',
        x: fx.map(p => p.x), y: fx.map(p => p.y), z: fx.map(p => p.z),
        line: { color: colorX || '#ffffff', width: 8 },
        name: `f(x) at y₀ = ${y0.toFixed(1)}`,
        showlegend: true
      },
      {
        type: 'scatter3d', mode: 'lines',
        x: fy.map(p => p.x), y: fy.map(p => p.y), z: fy.map(p => p.z),
        line: { color: colorY || '#facc15', width: 8 },
        name: `f(y) at x₀ = ${x0.toFixed(1)}`,
        showlegend: true
      }
    ];
  }, [crossSection]);

  // ── Style traces (包含 cross-section) ──────────────────
  const styledData = useMemo(() => {
    const all = [...(data || []), ...crossData];
    return all.map(trace => {
      const t = { ...trace };
      if (t.line)   t.line   = { ...t.line,   width: t.line.width || styleConfig.lineWidth };
      if (t.marker) t.marker = { ...t.marker, size: t.marker.size ?? styleConfig.pointSize };
      if (t.textfont) t.textfont = { ...t.textfont, size: styleConfig.fontSize };
      return t;
    });
  }, [data, crossData, styleConfig]);

  // ── Config ──────────────────────────────────────────────
  const mergedConfig = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToAdd: [],
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'sendDataToCloud'],
    toImageButtonOptions: { format: 'png', filename: `${(title || 'plot').replace(/\s+/g, '_')}_${Date.now()}`, height: 800, width: 1200, scale: 2 }
  };

  // ── Render ──────────────────────────────────────────────
  useEffect(() => {
    if (!plotRef.current) return;
    const gd = plotRef.current;

    if (!hasInitialized.current) {
      Plotly.newPlot(gd, styledData, layout, mergedConfig).then(() => {
        // 等一帧确保容器布局稳定后再 resize + 设 camera
        requestAnimationFrame(() => {
          Plotly.Plots.resize(gd);
          hasInitialized.current = true;
          if (propScene?.camera) {
            Plotly.relayout(gd, { 'scene.camera': propScene.camera });
          }
        });
      });
    } else {
      Plotly.react(gd, styledData, layout, mergedConfig);
    }
    return () => { if (plotRef.current) Plotly.purge(plotRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styledData, layout, mergedConfig]);

  useEffect(() => {
    const handleResize = () => { if (plotRef.current) Plotly.Plots.resize(plotRef.current); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Export ──────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    try {
      if (plotRef.current) {
        const imageData = await Plotly.toImage(plotRef.current, { format: 'png', width: 1200, height: 800, scale: 2 });
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${(title || 'plot').replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [title]);

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      if (outerRef.current) {
        outerRef.current.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        height,
        background: `var(--theme-card-bg, ${themeMode === 'dark' ? '#1e293b' : '#ffffff'})`,
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem',
        position: 'relative'
      }}
    >
      <button
        onClick={handleFullscreenToggle}
        style={{
          position: 'absolute', top: '20px', right: '10px', zIndex: 10,
          background: palette.mainTraces.primary,
          border: 'none', borderRadius: '4px',
          width: '18px', height: '18px',
          cursor: 'pointer', color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="Toggle Fullscreen"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
      <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
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
      {showExportButton && (
        <button
          onClick={handleExport}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            background: `linear-gradient(135deg, ${palette.mainTraces.primary}, ${palette.auxTraces?.tangent || palette.mainTraces.secondary})`,
            color: 'white',
            border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontSize: '14px', fontWeight: '500'
          }}
        >
          Export Image (PNG)
        </button>
      )}
    </div>
  );
};

export default Plotter3D;

import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getPlotLayout, getTracePalette } from '../../constants/plotThemeConfig';

/**
 * PartialDerivativePlotter — Theme-aware plotter for the Partial Derivative module.
 *
 * API + visual rendering EXACTLY matches FunctionPlotter.
 */
const PartialDerivativePlotter = ({
  data,
  xRange: propXRange = [-10, 10],
  yRange: propYRange,
  title,
  showExportButton = true,
  plotStyle = 'medium',
  aspectRatio = 'auto',
  legendPosition = 'top-right',
  annotations,
  scene: propScene
}) => {
  const plotRef = useRef(null);
  const themeMode = useThemeMode();
  const plotLayout = useMemo(() => getPlotLayout(themeMode), [themeMode]);
  const palette = getTracePalette(themeMode);

  const styleConfig = useMemo(() => {
    switch (plotStyle) {
      case 'thin':        return { lineWidth: 1, pointSize: 4, fontSize: 10 };
      case 'thick':       return { lineWidth: 4, pointSize: 12, fontSize: 16 };
      case 'extra-thick': return { lineWidth: 6, pointSize: 16, fontSize: 18 };
      default:            return { lineWidth: 2, pointSize: 8, fontSize: 12 };
    }
  }, [plotStyle]);

  // Auto 2D Y range
  const autoYRange = useMemo(() => {
    if (propYRange) return propYRange;
    if (propScene) return undefined;
    let minY = Infinity, maxY = -Infinity;
    (data || []).forEach(trace => {
      if (trace.y && Array.isArray(trace.y)) {
        trace.y.forEach(y => {
          if (y !== null && !isNaN(y) && isFinite(y) && Math.abs(y) < 10000) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        });
      }
    });
    if (minY === Infinity || maxY === -Infinity) return [-10, 10];
    const range = maxY - minY;
    const padding = Math.max(range * 0.1, 1);
    if (range < 2) {
      const center = (minY + maxY) / 2;
      return [center - 1, center + 1];
    }
    return [minY - padding, maxY + padding];
  }, [data, propYRange, propScene]);

  // Build layout
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

    if (propScene) {
      const axisBase = {
        gridcolor: plotLayout.gridcolor, gridwidth: 0.5,
        zerolinecolor: plotLayout.zerolinecolor, zerolinewidth: 1.5,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
      };
      return {
        scene: {
          xaxis: { title: { text: 'x', font: { color: plotLayout.axisLabelColor, size: 14 } }, range: propScene.xRange || [0, 3], dtick: propScene.dtick || 0.5, ...axisBase },
          yaxis: { title: { text: 'y', font: { color: plotLayout.axisLabelColor, size: 14 } }, range: propScene.yRange || [0, 3], dtick: propScene.dtick || 0.5, ...axisBase },
          zaxis: { title: { text: 'z', font: { color: plotLayout.axisLabelColor, size: 14 } }, range: propScene.zRange || [0, 18], dtick: (propScene.dtick || 0.5) * 6, ...axisBase },
          bgcolor: plotLayout.plot_bgcolor,
          camera: propScene.camera || { eye: { x: 2.8, y: -2.8, z: 1.5 }, center: { x: 0, y: 0, z: 0 }, up: { x: 0, y: 0, z: 1 } },
          aspectmode: 'manual',
          aspectratio: propScene.aspectratio || { x: 1, y: 1, z: 1 }
        },
        paper_bgcolor: plotLayout.paper_bgcolor, margin: { l: 0, r: 0, t: 30, b: 0 },
        showlegend: legendPosition !== 'None',
        title: title ? { text: title, font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 6 } } : undefined,
        legend: legendPosition !== 'None' ? legendBase : undefined
      };
    }

    return {
      annotations: annotations || [],
      title: title ? { text: title, font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 6 } } : undefined,
      xaxis: {
        title: 'x',
        range: propXRange, gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
        showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
      },
      yaxis: {
        title: 'y',
        range: autoYRange, gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
        showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
      },
      plot_bgcolor: plotLayout.plot_bgcolor, paper_bgcolor: plotLayout.paper_bgcolor,
      margin: { l: 60, r: 20, t: 60, b: 60 },
      showlegend: legendPosition !== 'None',
      legend: legendPosition !== 'None'
        ? { font: { color: plotLayout.legend.fontColor, size: styleConfig.fontSize }, bgcolor: plotLayout.legend.bgcolor, bordercolor: plotLayout.legend.bordercolor, borderwidth: 1, x: legX, y: legY, xanchor: legXanchor, yanchor: legYanchor }
        : undefined,
      hovermode: 'closest'
    };
  }, [propScene, propXRange, autoYRange, title, styleConfig, plotLayout, legendPosition, annotations]);

  // Apply style to traces
  const styledData = useMemo(() => {
    if (!data) return [];
    return data.map(trace => {
      const t = { ...trace };
      if (t.line)   t.line   = { ...t.line,   width: styleConfig.lineWidth };
      if (t.marker) t.marker = { ...t.marker, size: styleConfig.pointSize };
      if (t.textfont) t.textfont = { ...t.textfont, size: styleConfig.fontSize };
      return t;
    });
  }, [data, styleConfig]);

  // Config — modebar ALWAYS on (showExportButton only controls custom PNG button below)
  const mergedConfig = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToAdd: [],
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'sendDataToCloud'],
    toImageButtonOptions: { format: 'png', filename: `${(title || 'plot').replace(/\s+/g, '_')}_${Date.now()}`, height: 800, width: 1200, scale: 2 }
  };

  useEffect(() => {
    if (!plotRef.current) return;
    Plotly.newPlot(plotRef.current, styledData, layout, mergedConfig);
    return () => { if (plotRef.current) Plotly.purge(plotRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styledData, layout, mergedConfig]);

  useEffect(() => {
    const handleResize = () => { if (plotRef.current) Plotly.Plots.resize(plotRef.current); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      if (plotRef.current) {
        plotRef.current.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const containerStyle = {
    width: '100%',
    height: aspectRatio === 'auto' ? '600px' : 'auto',
    background: `var(--theme-card-bg, ${themeMode === 'dark' ? '#1e293b' : '#ffffff'})`,
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
    aspectRatio: aspectRatio === 'auto' ? 'unset' : aspectRatio.replace(':', '/'),
    position: 'relative'
  };

  const fullscreenButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '10px',
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

  return (
    <div style={containerStyle}>
      <button
        onClick={handleFullscreenToggle}
        style={fullscreenButtonStyle}
        title="Toggle Fullscreen"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
      <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
      {showExportButton && (
        <button
          onClick={handleExport}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            background: `linear-gradient(135deg, ${palette.mainTraces.primary}, ${palette.auxTraces.tangent})`,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Export Image (PNG)
        </button>
      )}
    </div>
  );
};

export default PartialDerivativePlotter;

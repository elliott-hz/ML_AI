import React, { useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Plotly from 'plotly.js/dist/plotly.min.js';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getPlotLayout } from '../../constants/plotThemeConfig';

const PlotBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 480px;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  overflow: hidden;
`;

/**
 * PartialDerivativePlotter — Theme-aware plotter for the Partial Derivative module.
 *
 * API aligns with FunctionPlotter: page passes data + display preferences,
 * plotter handles ALL theming internally via getPlotLayout.
 *
 * Props:
 *   data              — Plotly trace array
 *   xRange            — [min, max] for 2D plots (default [-10, 10])
 *   yRange            — optional override for 2D y-axis
 *   title             — plot title string
 *   showExportButton  — show/hide the modebar (default true)
 *   plotStyle         — 'thin' | 'medium' | 'thick' | 'extra-thick' (default 'medium')
 *   aspectRatio       — 'auto' | '16:9' | '4:3' | '1:1' (default 'auto', 2D only)
 *   legendPosition    — 'None' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
 *   annotations       — Plotly annotation array (2D only)
 *   scene             — if present, renders 3D scene; shape:
 *       { xRange, yRange, zRange, camera, aspectratio, dtick }
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

  const isDark = themeMode === 'dark';

  const styleConfig = useMemo(() => {
    switch (plotStyle) {
      case 'thin':
        return { lineWidth: 1, pointSize: 4, fontSize: 10 };
      case 'thick':
        return { lineWidth: 4, pointSize: 12, fontSize: 16 };
      case 'extra-thick':
        return { lineWidth: 6, pointSize: 16, fontSize: 18 };
      default:
        return { lineWidth: 2, pointSize: 8, fontSize: 12 };
    }
  }, [plotStyle]);

  // Auto 2D Y range
  const autoYRange = useMemo(() => {
    if (propYRange) return propYRange;
    if (propScene) return undefined; // 3D — not needed
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
    const padding = Math.max(range * 0.08, 0.1);
    if (range < 1.5) {
      const center = (minY + maxY) / 2;
      return [center - 1.3, center + 1.3];
    }
    return [minY - padding, maxY + padding];
  }, [data, propYRange, propScene]);

  // Build layout
  const layout = useMemo(() => {
    if (propScene) {
      // ── 3D scene layout ──
      const axisBase = {
        gridcolor: plotLayout.gridColor,
        gridwidth: 0.5,
        zerolinecolor: plotLayout.axisColor,
        zerolinewidth: 1.5,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize }
      };
      return {
        scene: {
          xaxis: { title: { text: 'x', font: { color: plotLayout.titleFontColor, size: 14 } }, range: propScene.xRange || [0, 3], dtick: propScene.dtick || 0.5, ...axisBase },
          yaxis: { title: { text: 'y', font: { color: plotLayout.titleFontColor, size: 14 } }, range: propScene.yRange || [0, 3], dtick: propScene.dtick || 0.5, ...axisBase },
          zaxis: { title: { text: 'z', font: { color: plotLayout.titleFontColor, size: 14 } }, range: propScene.zRange || [0, 18], dtick: (propScene.dtick || 0.5) * 6, ...axisBase },
          bgcolor: plotLayout.plotBgColor,
          camera: propScene.camera || { eye: { x: 2.8, y: -2.8, z: 1.5 }, center: { x: 0, y: 0, z: 0 }, up: { x: 0, y: 0, z: 1 } },
          aspectmode: 'manual',
          aspectratio: propScene.aspectratio || { x: 1, y: 1, z: 1.1 }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: plotLayout.plotBgColor,
        margin: { l: 0, r: 0, t: 30, b: 0 },
        autosize: true,
        title: title ? { text: title, font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 4 } } : undefined,
        legend: legendPosition !== 'None' ? {
          x: 1.05, y: 1,
          font: { color: plotLayout.legendFontColor, size: styleConfig.fontSize - 1 },
          bgcolor: plotLayout.legendBgColor,
          bordercolor: plotLayout.gridColor,
          borderwidth: 1
        } : undefined
      };
    }

    // ── 2D layout ──
    let xaxisExtra = {};
    if (aspectRatio !== 'auto') {
      const [w, h] = aspectRatio.split(':').map(Number);
      if (w && h) xaxisExtra = { scaleanchor: 'y', scaleratio: h / w };
    }

    return {
      annotations: annotations || [],
      title: title ? { text: title, font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 4 } } : undefined,
      xaxis: {
        range: propXRange,
        ...xaxisExtra,
        gridcolor: plotLayout.gridColor,
        gridwidth: 0.5,
        zerolinecolor: plotLayout.axisColor,
        zerolinewidth: 1.5,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        title: { font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 2 } }
      },
      yaxis: {
        range: autoYRange,
        gridcolor: plotLayout.gridColor,
        gridwidth: 0.5,
        zerolinecolor: plotLayout.axisColor,
        zerolinewidth: 1.5,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        title: { font: { color: plotLayout.titleFontColor, size: styleConfig.fontSize + 2 } }
      },
      margin: { l: 50, r: 20, t: 40, b: 50 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: plotLayout.plotBgColor,
      hovermode: 'closest',
      legend: legendPosition !== 'None' ? {
        x: legendPosition.includes('left') ? 0 : 1,
        y: legendPosition.includes('bottom') ? 0 : 1,
        xanchor: legendPosition.includes('left') ? 'left' : 'right',
        yanchor: legendPosition.includes('bottom') ? 'bottom' : 'top',
        font: { color: plotLayout.legendFontColor, size: styleConfig.fontSize - 1 },
        bgcolor: plotLayout.legendBgColor,
        bordercolor: plotLayout.gridColor,
        borderwidth: 1
      } : undefined
    };
  }, [propScene, propXRange, autoYRange, title, styleConfig, plotLayout, aspectRatio, legendPosition, annotations, isDark]);

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

  const mergedConfig = useMemo(() => ({
    displayModeBar: showExportButton,
    displaylogo: false,
    modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d', 'select2d'],
    toImageButtonOptions: { format: 'png', filename: 'plot', scale: 2 },
    responsive: true
  }), [showExportButton]);

  useEffect(() => {
    if (!plotRef.current) return;
    Plotly.newPlot(plotRef.current, styledData, layout, mergedConfig);
    return () => { if (plotRef.current) Plotly.purge(plotRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styledData, layout, mergedConfig]);

  return <PlotBox ref={plotRef} />;
};

export default PartialDerivativePlotter;

import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getPlotLayout, getAuxiliaryColor } from '../../constants/plotThemeConfig';

export const ASPECT_RATIO_OPTIONS = ['auto', '16:9', '4:3', '1:1'];

/**
 * Derivative Plotter - Specialized for derivative visualization
 * Receives pre-computed Plotly traces and handles theme-aware rendering
 */
const DerivativePlotter = ({
  data,
  xRange: propXRange = [-10, 10],
  yRange: propYRange,
  title,
  showExportButton = true,
  plotStyle = 'medium',
  aspectRatio = 'auto',
  legendPosition = 'top-right',
  xTickMode = 'auto', // 'auto' | 'pi'
  yTickMode = 'auto'  // 'auto' | 'pi'
}) => {
  const plotRef = useRef(null);
  const themeMode = useThemeMode();

  const styleConfig = useMemo(() => {
    switch (plotStyle) {
      case 'thin':
        return { lineWidth: 1, pointSize: 4, fontSize: 10, dash: 'dot' };
      case 'thick':
        return { lineWidth: 4, pointSize: 12, fontSize: 16, dash: 'solid' };
      case 'extra-thick':
        return { lineWidth: 6, pointSize: 16, fontSize: 18, dash: 'solid' };
      default:
        return { lineWidth: 2, pointSize: 8, fontSize: 12, dash: 'dash' };
    }
  }, [plotStyle]);

  const autoYRange = useMemo(() => {
    if (propYRange) return propYRange;
    let minY = Infinity;
    let maxY = -Infinity;
    data.forEach(trace => {
      if (trace.y && Array.isArray(trace.y)) {
        trace.y.forEach(y => {
          if (y !== null && !isNaN(y) && isFinite(y) && Math.abs(y) < 10000) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        });
      }
    });
    if (minY === Infinity || maxY === -Infinity) {
      return [-10, 10];
    }
    const range = maxY - minY;
    const padding = Math.max(range * 0.08, 0.1);
    if (range < 1.5) {
      const center = (minY + maxY) / 2;
      return [center - 1.3, center + 1.3];
    }
    if (range <= 2) {
      const p = range * 0.15;
      return [minY - p, maxY + p];
    }
    return [minY - padding, maxY + padding];
  }, [data, propYRange]);

  // Apply styles AND replace auxiliary element colors with theme-aware ones
  const styledData = useMemo(() => {
    if (!data || data.length === 0) return data;

    const auxColor = getAuxiliaryColor(themeMode);

    return data.map(trace => {
      const newTrace = { ...trace };

      const isAuxiliaryElement =
        trace.name && (
          trace.name.includes('Peak') ||
          trace.name.includes('Break Point') ||
          trace.name.includes('Vertical Line') ||
          trace.name.includes('Horizontal Line') ||
          trace.name.includes('Connection Line') ||
          trace.name.includes('Axis of Symmetry') ||
          trace.name.includes('symmetry axis') ||
          trace.name.includes('P(') ||
          trace.name.includes("P'") ||
          trace.name.includes('P₁') ||
          trace.name.includes('P₂') ||
          trace.name.includes('Δx') ||
          trace.name.includes('Δy') ||
          trace.name.includes('gap') ||
          trace.name.includes('jump') ||
          trace.name.includes('Hole') ||
          trace.name.includes('x₀') ||
          trace.name.startsWith('x=') ||
          trace.name.startsWith('y=') ||
          trace.name.startsWith('lim') ||
          trace.name.startsWith('f(x₀)')
        );

      if (isAuxiliaryElement) {
        if (newTrace.line) {
          newTrace.line = { ...newTrace.line, color: auxColor };
        }
        if (newTrace.marker) {
          newTrace.marker = { ...newTrace.marker, color: auxColor };
        }
        if (newTrace.textfont) {
          newTrace.textfont = { ...newTrace.textfont, color: auxColor };
        }
      }

      if (newTrace.line) {
        newTrace.line = {
          ...newTrace.line,
          width: styleConfig.lineWidth
        };
      }

      if (newTrace.marker) {
        newTrace.marker = {
          ...newTrace.marker,
          size: styleConfig.pointSize
        };
      }

      if (newTrace.textfont) {
        newTrace.textfont = {
          ...newTrace.textfont,
          size: styleConfig.fontSize
        };
      }

      return newTrace;
    });
  }, [data, styleConfig, themeMode]);

  const layout = useMemo(() => {
    const plotLayout = getPlotLayout(themeMode);

    // Shared helper: generate π-format tick config for a given axis range
    const buildPiTickExtra = (range) => {
      const [rMin, rMax] = range;
      const halfPi = Math.PI / 2;
      const startK = Math.ceil(rMin / halfPi);
      const endK = Math.floor(rMax / halfPi);
      const PI_TICKS = [];
      for (let k = startK; k <= endK; k++) {
        const val = k * halfPi;
        const neg = k < 0 ? '−' : '';
        const absK = Math.abs(k);
        let label;
        if (absK === 0) {
          label = '0';
        } else if (absK % 2 === 0) {
          const coeff = absK / 2;
          label = `${neg}${coeff === 1 ? '' : coeff}π`;
        } else if (absK === 1) {
          label = `${neg}π/2`;
        } else {
          label = `${neg}${absK}π/2`;
        }
        PI_TICKS.push([val, label]);
      }
      return {
        tickmode: 'array',
        tickvals: PI_TICKS.map(([v]) => v),
        ticktext: PI_TICKS.map(([, label]) => label)
      };
    };

    let xaxisExtra = {};
    if (xTickMode === 'pi') {
      xaxisExtra = buildPiTickExtra(propXRange);
    }
    let yaxisExtra = {};
    if (yTickMode === 'pi') {
      yaxisExtra = buildPiTickExtra(autoYRange);
    }

    return {
      title: {
        text: title,
        font: {
          size: styleConfig.fontSize + 6,
          color: plotLayout.titleFontColor
        }
      },
      xaxis: {
        title: 'x',
        range: propXRange,
        gridcolor: plotLayout.gridcolor,
        zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
        showline: true,
        linewidth: 1,
        linecolor: plotLayout.axisColor,
        mirror: true,
        ...xaxisExtra
      },
      yaxis: {
        title: 'y',
        range: autoYRange,
        gridcolor: plotLayout.gridcolor,
        zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
        showline: true,
        linewidth: 1,
        linecolor: plotLayout.axisColor,
        mirror: true,
        ...yaxisExtra
      },
      plot_bgcolor: plotLayout.plot_bgcolor,
      paper_bgcolor: plotLayout.paper_bgcolor,
      margin: { l: 60, r: 20, t: 60, b: 60 },
      showlegend: legendPosition !== 'None',
      legend: {
        font: { color: plotLayout.legend.fontColor, size: styleConfig.fontSize },
        bgcolor: plotLayout.legend.bgcolor,
        bordercolor: plotLayout.legend.bordercolor,
        borderwidth: 1,
        x: legendPosition === 'top-right' || legendPosition === 'bottom-right' ? 0.98 : 0.02,
        y: legendPosition === 'top-right' || legendPosition === 'top-left' ? 0.98 : 0.02,
        xanchor: legendPosition === 'top-right' || legendPosition === 'bottom-right' ? 'right' : 'left',
        yanchor: legendPosition === 'top-right' || legendPosition === 'top-left' ? 'top' : 'bottom'
      }
    };
  }, [title, propXRange, autoYRange, themeMode, styleConfig, legendPosition, xTickMode, yTickMode]);

  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'zoom2d', 'pan2d', 'select2d', 'lasso2d',
      'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d',
      'sendDataToCloud'
    ],
    toImageButtonOptions: {
      format: 'png',
      filename: `${title.replace(/\s+/g, '_')}_${Date.now()}`,
      height: 800,
      width: 1200,
      scale: 2
    }
  };

  useEffect(() => {
    if (plotRef.current && styledData && styledData.length > 0) {
      Plotly.newPlot(plotRef.current, styledData, layout, config);
    }
  }, [styledData, layout, config]);

  useEffect(() => {
    const handleResize = () => {
      if (plotRef.current) {
        Plotly.Plots.resize(plotRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      if (plotRef.current) {
        const imageData = await Plotly.toImage(plotRef.current, {
          format: 'png',
          width: 1200,
          height: 800,
          scale: 2
        });
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [title]);

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

  const buttonStyle = {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const fullscreenButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '10px',
    zIndex: 10,
    background: '#6366f1',
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
        <button onClick={handleExport} style={buttonStyle}>
           Export Image (PNG)
        </button>
      )}
    </div>
  );
};

export default DerivativePlotter;

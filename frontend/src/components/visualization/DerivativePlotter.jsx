import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

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
  aspectRatio = 'auto'
}) => {
  const plotRef = useRef(null);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });

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

  useEffect(() => {
    const handleThemeChange = () => {
      const newMode = localStorage.getItem('themeMode') || 'dark';
      setThemeMode(newMode);
    };
    const intervalId = setInterval(handleThemeChange, 100);
    return () => clearInterval(intervalId);
  }, []);

  const getAuxiliaryColor = useCallback(() => {
    return themeMode === 'dark' ? '#ffd700' : '#dc2626'; // Dark: yellow, Light: red
  }, [themeMode]);

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
    const padding = Math.max(range * 0.1, 1);
    if (range < 2) {
      const center = (minY + maxY) / 2;
      return [center - 1, center + 1];
    }
    return [minY - padding, maxY + padding];
  }, [data, propYRange]);

  // Apply styles AND replace auxiliary element colors with theme-aware ones
  const styledData = useMemo(() => {
    if (!data || data.length === 0) return data;

    const auxColor = getAuxiliaryColor();

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
          trace.name.startsWith('f(x₀)') ||
          trace.name.startsWith("f'(") ||
          trace.name.startsWith('secant') ||
          trace.name.startsWith('tangent') ||
          trace.name.startsWith('Secant') ||
          trace.name.startsWith('Tangent')
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
  }, [data, styleConfig, getAuxiliaryColor]);

  const layout = useMemo(() => {
    const isDark = themeMode === 'dark';
    const axisColor = isDark ? '#475569' : '#cbd5e1';

    return {
      title: {
        text: title,
        font: {
          size: styleConfig.fontSize + 6,
          color: isDark ? '#e0e0e0' : '#0f172a'
        }
      },
      xaxis: {
        title: 'x',
        range: propXRange,
        gridcolor: isDark ? '#334155' : '#cbd5e1',
        zerolinecolor: isDark ? '#475569' : '#94a3b8',
        tickfont: { color: isDark ? '#94a3b8' : '#475569', size: styleConfig.fontSize },
        titlefont: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize + 2 },
        showline: true,
        linewidth: 2,
        linecolor: axisColor,
        mirror: true
      },
      yaxis: {
        title: 'y',
        range: autoYRange,
        gridcolor: isDark ? '#334155' : '#cbd5e1',
        zerolinecolor: isDark ? '#475569' : '#94a3b8',
        tickfont: { color: isDark ? '#94a3b8' : '#475569', size: styleConfig.fontSize },
        titlefont: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize + 2 },
        showline: true,
        linewidth: 2,
        linecolor: axisColor,
        mirror: true
      },
      plot_bgcolor: isDark ? '#1e293b' : '#ffffff',
      paper_bgcolor: isDark ? '#1e293b' : '#ffffff',
      margin: { l: 60, r: 20, t: 60, b: 60 },
      showlegend: true,
      legend: {
        font: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize },
        bgcolor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.85)',
        bordercolor: isDark ? '#334155' : '#cbd5e1',
        borderwidth: 1,
        // Position inside the plot at top-right corner
        x: 0.98,
        y: 0.98,
        xanchor: 'right',
        yanchor: 'top'
      }
    };
  }, [title, propXRange, autoYRange, themeMode, styleConfig]);

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
    background: 'var(--theme-card-bg, #1e293b)',
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

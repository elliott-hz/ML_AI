import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getPlotLayout } from '../../constants/plotThemeConfig';



/**
 * Limit Plotter 组件 - 支持极限函数可视化的展示
 *
 * 新架构：纯渲染引擎，接收预计算的 data prop
 * 所有业务逻辑已迁移到子页面层
 */
const LimitPlotter = ({
  xRange: propXRange,
  yRange: propYRange,
  title,
  plotStyle = 'medium',
  aspectRatio = 'auto',
  data,
  legendPosition = 'top-right',
  yTickMode = 'auto',
  children
}) => {
  const plotRef = useRef(null);
  const outerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const themeMode = useThemeMode();

  // 样式映射配置
  const styleConfig = useMemo(() => {
    switch (plotStyle) {
      case 'thin':
        return { lineWidth: 1, pointSize: 4, fontSize: 10, dash: 'dot' };
      case 'thick':
        return { lineWidth: 4, pointSize: 12, fontSize: 16, dash: 'solid' };
      case 'extra-thick':
        return { lineWidth: 6, pointSize: 16, fontSize: 18, dash: 'solid' };
      default: // medium
        return { lineWidth: 2, pointSize: 8, fontSize: 12, dash: 'dash' };
    }
  }, [plotStyle]);

  // ✅ 新增：如果外部传入了 data，直接使用（新接口）
  const plotData = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data;
    }
    return [];
  }, [data]);

  // ✅ 根据 plotStyle 应用样式到所有 traces（不覆盖颜色 — 颜色由页面通过 palette 控制）
  const styledData = useMemo(() => {
    if (!plotData || plotData.length === 0) return plotData;

    return plotData.map(trace => {
      const newTrace = { ...trace };

      // 应用线宽样式
      if (newTrace.line) {
        newTrace.line = {
          ...newTrace.line,
          width: styleConfig.lineWidth
        };
      }

      // 应用点大小样式（如果有 markers）
      if (newTrace.marker) {
        newTrace.marker = {
          ...newTrace.marker,
          size: styleConfig.pointSize
        };
      }

      // 应用字体大小样式（如果有 text）
      if (newTrace.textfont) {
        newTrace.textfont = {
          ...newTrace.textfont,
          size: styleConfig.fontSize
        };
      }

      return newTrace;
    });
  }, [data, plotStyle, styleConfig]);

  // 自动计算 Y 轴范围 - 仅考虑可见的 traces
  const autoYRange = useMemo(() => {
    if (propYRange) return propYRange;

    if (data && Array.isArray(data)) {
      let minVal = Infinity;
      let maxVal = -Infinity;

      data.forEach(trace => {
        if (trace.visible === false) return;

        if (trace.y && Array.isArray(trace.y)) {
          trace.y.forEach(val => {
            if (!isNaN(val) && isFinite(val) && Math.abs(val) < 10000) {
              if (val < minVal) minVal = val;
              if (val > maxVal) maxVal = val;
            }
          });
        }
      });

      if (minVal === Infinity || maxVal === -Infinity) {
        return [-10, 10];
      }

      const range = maxVal - minVal;

      if (range < 1.2) {
        const center = (minVal + maxVal) / 2;
        return [center - 0.6, center + 0.6];
      }

      const topPadding = range * 0.08;
      const bottomPadding = range * 0.03;

      return [minVal - bottomPadding, maxVal + topPadding];
    }

    return [-10, 10];
  }, [data, propYRange]);

  // 配置 Plotly 布局 - 根据主题模式动态设置颜色
  const layout = useMemo(() => {
    const plotLayout = getPlotLayout(themeMode);

    // Pi tick formatter for y-axis
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
        title: 'n',
        range: propXRange || (data && data.length > 0 && data[0].x ? [Math.min(...data[0].x), Math.max(...data[0].x)] : [0, 50]),
        gridcolor: plotLayout.gridcolor,
        zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: styleConfig.fontSize },
        titlefont: { color: plotLayout.axisLabelColor, size: styleConfig.fontSize + 2 },
        showline: true,
        linewidth: 1,
        linecolor: plotLayout.axisColor,
        mirror: true
      },
      yaxis: {
        title: 'Value',
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
  }, [title, propXRange, autoYRange, themeMode, styleConfig, data, legendPosition, yTickMode]);

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToAdd: [],
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
    if (plotRef.current) {
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
    const onFS = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFS);
    return () => document.removeEventListener('fullscreenchange', onFS);
  }, []);

  return (
    <div ref={outerRef} style={containerStyle}>
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

export default LimitPlotter;

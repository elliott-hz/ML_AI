import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

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
  aspectRatio = 'auto', // 显示比例 (auto, 16:9, 4:3)
  data, // 直接传入 Plotly traces 数组（唯一数据源）
}) => {
  const plotRef = useRef(null);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });

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

  // 监听主题变化
  useEffect(() => {
    const handleThemeChange = () => {
      const newMode = localStorage.getItem('themeMode') || 'dark';
      setThemeMode(newMode);
    };

    // 每 100ms 检查一次主题是否变化
    const intervalId = setInterval(handleThemeChange, 100);

    return () => clearInterval(intervalId);
  }, []);

  // 根据主题获取辅助线颜色
  const getAuxiliaryColor = useCallback(() => {
    return themeMode === 'dark' ? '#ffd700' : '#b45309'; // Dark: 亮黄, Light: 琥珀色（更醒目）
  }, [themeMode]);

  // ✅ 新增：如果外部传入了 data，直接使用（新接口）
  const plotData = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data;
    }
    
    // 如果没有传入 data，返回空数组（所有业务逻辑已迁移到子页面）
    return [];
  }, [data]);

  // ✅ 新增：根据 plotStyle 应用样式到所有 traces（参考 FunctionPlotter.jsx）
  const styledData = useMemo(() => {
    if (!plotData || plotData.length === 0) return plotData;
    
    return plotData.map(trace => {
      const newTrace = { ...trace };
      
      // ✅ 检测是否为辅助元素（通过 name 判断）
      const isAuxiliaryElement = 
        trace.name && (
          trace.name.includes('lim:') ||
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
          trace.name.startsWith('x=') ||  // ✅ 新增：垂直辅助线
          trace.name.startsWith('y=')     // ✅ 新增：水平辅助线
        );
      
      // ✅ 如果是辅助元素，替换为主题感知的颜色
      if (isAuxiliaryElement) {
        if (newTrace.line) {
          newTrace.line = {
            ...newTrace.line,
            color: getAuxiliaryColor()
          };
        }
        
        if (newTrace.marker) {
          newTrace.marker = {
            ...newTrace.marker,
            color: getAuxiliaryColor()
          };
        }
        
        if (newTrace.textfont) {
          newTrace.textfont = {
            ...newTrace.textfont,
            color: getAuxiliaryColor()
          };
        }
      }
      
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
  }, [data, plotStyle, styleConfig, getAuxiliaryColor, themeMode]);

  // 自动计算 Y 轴范围 - 仅考虑可见的 traces
  const autoYRange = useMemo(() => {
    // 如果外部传入了 yRange，优先使用它
    if (propYRange) return propYRange;
    
    // 从 data 中提取 Y 范围 - 只考虑可见的 traces
    if (data && Array.isArray(data)) {
      let minVal = Infinity;
      let maxVal = -Infinity;
      
      // 遍历所有 traces，提取 Y 值的范围（仅考虑 visible !== false 的 traces）
      data.forEach(trace => {
        // ✅ 跳过隐藏的 traces（visible === false）
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
      
      // 如果没有找到有效值，返回默认范围
      if (minVal === Infinity || maxVal === -Infinity) {
        return [-10, 10];
      }
      
      // 添加非对称边距（上部多留，下部少留）- 进一步减小边距
      const range = maxVal - minVal;
      
      // 对于极小范围的函数，强制最小显示范围为 1.2（上部留 0.6，下部留 0.6）
      if (range < 1.2) {
        const center = (minVal + maxVal) / 2;
        return [center - 0.6, center + 0.6];
      }
      
      // 正常情况：上部留 8%，下部留 3%
      const topPadding = range * 0.08;
      const bottomPadding = range * 0.03;
      
      return [minVal - bottomPadding, maxVal + topPadding];
    }
    
    // 默认返回范围
    return [-10, 10];
  }, [data, propYRange]);

  // 配置 Plotly 布局 - 根据主题模式动态设置颜色
  const layout = useMemo(() => {
    const isDark = themeMode === 'dark';
    const axisColor = isDark ? '#475569' : '#cbd5e1'; // 边框颜色
    
    return {
      title: {
        text: title,
        font: {
          size: styleConfig.fontSize + 6, // 标题字体稍大
          color: isDark ? '#e0e0e0' : '#0f172a'
        }
      },
      xaxis: {
        title: 'n',
        range: propXRange || (data && data.length > 0 && data[0].x ? [Math.min(...data[0].x), Math.max(...data[0].x)] : [0, 50]),
        gridcolor: isDark ? '#334155' : '#cbd5e1',
        zerolinecolor: isDark ? '#475569' : '#94a3b8',
        tickfont: { color: isDark ? '#94a3b8' : '#475569', size: styleConfig.fontSize },
        titlefont: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize + 2 },
        // 添加四面边框
        showline: true,
        linewidth: 2,
        linecolor: axisColor,
        mirror: true // 让轴线在两侧都显示，形成闭合框
      },
      yaxis: {
        title: 'Value',
        range: autoYRange,
        gridcolor: isDark ? '#334155' : '#cbd5e1',
        zerolinecolor: isDark ? '#475569' : '#94a3b8',
        tickfont: { color: isDark ? '#94a3b8' : '#475569', size: styleConfig.fontSize },
        titlefont: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize + 2 },
        // 添加四面边框
        showline: true,
        linewidth: 2,
        linecolor: axisColor,
        mirror: true // 让轴线在两侧都显示，形成闭合框
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
  }, [title, propXRange, autoYRange, themeMode, styleConfig, data]);

  // 配置 Plotly 工具栏
  const config = {
    displayModeBar: true,
    modeBarButtonsToAdd: [],
    modeBarButtonsToRemove: [
      'zoom2d', 'pan2d', 'select2d', 'lasso2d',
      'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d',
      'sendDataToCloud' // 移除 Plotly 链接按钮
    ],
    toImageButtonOptions: {
      format: 'png',
      filename: `${title.replace(/\s+/g, '_')}_${Date.now()}`,
      height: 800,
      width: 1200,
      scale: 2
    }
  };

  // 使用 useEffect 渲染图表
  useEffect(() => {
    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, styledData, layout, config);
    }
  }, [styledData, layout, config]);

  // 添加窗口resize监听器，实现自动响应式调整
  useEffect(() => {
    const handleResize = () => {
      if (plotRef.current) {
        Plotly.Plots.resize(plotRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 简单的内联样式 - 使用 CSS 变量支持主题切换
  const containerStyle = {
    width: '100%',
    height: aspectRatio === 'auto' ? '600px' : 'auto', // Auto 模式使用固定高度，其他模式由 aspect-ratio 决定
    background: 'var(--theme-card-bg, #1e293b)',
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
      // Enter fullscreen
      if (plotRef.current) {
        plotRef.current.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      // Exit fullscreen
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
    </div>
  );
};

export default LimitPlotter;

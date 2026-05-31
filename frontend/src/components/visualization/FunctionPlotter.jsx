import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

/**
 * 通用函数绘图组件 - 纯渲染引擎
 * 接收已计算好的 Plotly traces 数据并渲染
 */
const FunctionPlotter = ({
  data,              // ✅ 新增：直接接收已计算好的 Plotly traces 数组
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

    const intervalId = setInterval(handleThemeChange, 100);
    return () => clearInterval(intervalId);
  }, []);

  // 根据主题获取辅助线颜色
  const getAuxiliaryColor = useCallback(() => {
    return themeMode === 'dark' ? '#ffd700' : '#f59e0b';
  }, [themeMode]);

  // 自动计算 Y 轴范围（基于传入的数据）
  const autoYRange = useMemo(() => {
    if (propYRange) return propYRange;
    
    let minY = Infinity;
    let maxY = -Infinity;
    
    // 遍历所有 traces，找到最小和最大值
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

  // ✅ 新增：根据 plotStyle 应用样式到所有 traces
  const styledData = useMemo(() => {
    if (!data || data.length === 0) return data;
    
    // ✅ 获取当前主题的辅助元素颜色
    const auxiliaryColor = themeMode === 'dark' ? '#ffd700' : '#f59e0b';
    
    return data.map(trace => {
      const newTrace = { ...trace };
      
      // ✅ 检测是否为辅助元素（通过 name 判断）
      // 包括：辅助线、辅助点、辅助文本等
      const isAuxiliaryElement = 
        trace.name && (
          // 辅助线
          trace.name.includes('Peak') ||
          trace.name.includes('Break Point') ||
          trace.name.includes('Vertical Line') ||
          trace.name.includes('Horizontal Line') ||
          trace.name.includes('Connection Line') ||
          trace.name.includes('Axis of Symmetry') ||
          trace.name.includes('symmetry axis') ||
          // 辅助点（示例点、关键点等）
          trace.name.includes('P(') ||           // P(x, y) 格式的点
          trace.name.includes("P'") ||           // P'(x, y) 格式的点
          trace.name.includes('P₁') ||           // P₁(x, y) 格式的点
          trace.name.includes('P₂')              // P₂(x, y) 格式的点
        );
      
      // ✅ 如果是辅助元素，替换为主题感知的颜色
      if (isAuxiliaryElement) {
        // 更新线条颜色
        if (newTrace.line) {
          newTrace.line = {
            ...newTrace.line,
            color: auxiliaryColor
          };
        }
        
        // 更新标记点颜色
        if (newTrace.marker) {
          newTrace.marker = {
            ...newTrace.marker,
            color: auxiliaryColor
          };
        }
        
        // 更新文本颜色
        if (newTrace.textfont) {
          newTrace.textfont = {
            ...newTrace.textfont,
            color: auxiliaryColor
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
  }, [data, styleConfig, themeMode]);

  // 配置 Plotly 布局 - 根据主题模式动态设置颜色
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
      margin: { l: 60, r: 40, t: 60, b: 60 },
      showlegend: true,
      legend: {
        font: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize },
        bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
        bordercolor: isDark ? '#334155' : '#cbd5e1',
        borderwidth: 1
      }
    };
  }, [title, propXRange, autoYRange, themeMode, styleConfig]);

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
    if (plotRef.current && styledData && styledData.length > 0) {
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

  // 处理导出按钮点击
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

  // 简单的内联样式 - 使用 CSS 变量支持主题切换
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
      {showExportButton && (
        <button onClick={handleExport} style={buttonStyle}>
           Export Image (PNG)
        </button>
      )}
    </div>
  );
};

export default FunctionPlotter;

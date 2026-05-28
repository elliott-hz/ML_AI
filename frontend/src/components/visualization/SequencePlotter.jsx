import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

/**
 * 序列可视化组件 - 支持收敛和发散数列的展示
 */
const SequencePlotter = ({
  sequenceType,
  parameters,
  xRange: propXRange,
  yRange: propYRange,
  title,
  showLimitLine = false,
  limitValue,
  showOriginalFunction = false  // 是否显示原函数
}) => {
  const plotRef = useRef(null);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });

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

  // 根据数列类型和参数计算数列值
  const calculateSequenceValues = useCallback((n) => {
    const base = parameters.base || 3;
    
    switch (sequenceType) {
      case 'convergent1':
        // u_n = 1/base^n
        return 1 / Math.pow(base, n);
      
      case 'convergent2':
        // u_n = n/(n+1)
        return n / (n + 1);
      
      case 'divergent1':
        // u_n = n²
        return n * n;
      
      case 'divergent2':
        // u_n = sin(n)
        return Math.sin(n);
      
      case 'original_function':
        // 原函数连续曲线（用于对比显示）
        if (parameters.funcName === 'exponential_decay') {
          const base = parameters.base || 3;
          return 1 / Math.pow(base, n);
        } else if (parameters.funcName === 'rational') {
          return n / (n + 1);
        } else if (parameters.funcName === 'quadratic') {
          return n * n;
        } else if (parameters.funcName === 'sin') {
          return Math.sin(n);
        }
        return 0;
      
      default:
        return 0;
    }
  }, [sequenceType, parameters]);

  // 生成数列数据点
  const plotData = useMemo(() => {
    const maxN = parameters.maxN || 50;
    const traces = [];
    
    if (sequenceType === 'original_function') {
      // 原函数：使用连续曲线（更密集的采样点）
      const numPoints = 200;
      const xValues = [];
      const yValues = [];
      
      for (let i = 0; i <= numPoints; i++) {
        const x = (maxN * i) / numPoints;
        xValues.push(x);
        yValues.push(calculateSequenceValues(x));
      }
      
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { 
          color: '#10b981', 
          width: 2.5
        }
      });
    } else {
      // 序列：使用离散点
      const nValues = [];
      const uValues = [];
      
      for (let n = 0; n <= maxN; n++) {
        nValues.push(n);
        uValues.push(calculateSequenceValues(n));
      }
      
      // 主数列散点图
      traces.push({
        x: nValues,
        y: uValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'u<sub>n</sub>',
        line: { 
          color: '#6366f1', 
          width: 2,
          shape: 'spline'
        },
        marker: { 
          size: 6, 
          color: '#6366f1',
          symbol: 'circle'
        }
      });
      
      // 如果是收敛数列，添加极限线
      if (showLimitLine && limitValue !== undefined) {
        traces.push({
          x: [0, maxN],
          y: [limitValue, limitValue],
          type: 'scatter',
          mode: 'lines',
          name: `lim: ${limitValue}`,
          line: { 
            color: '#ffd700', 
            width: 2, 
            dash: 'dash' 
          }
        });
      }
    }
    
    return traces;
  }, [sequenceType, parameters, calculateSequenceValues, showLimitLine, limitValue]);

  // 自动计算 Y 轴范围
  const autoYRange = useMemo(() => {
    if (propYRange) return propYRange;
    
    const maxN = parameters.maxN || 50;
    let minVal = Infinity;
    let maxVal = -Infinity;
    
    for (let n = 0; n <= maxN; n++) {
      const val = calculateSequenceValues(n);
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
    
    // 添加一些边距
    const padding = (maxVal - minVal) * 0.1 || 1;
    return [minVal - padding, maxVal + padding];
  }, [sequenceType, parameters, calculateSequenceValues, propYRange]);

  // 配置 Plotly 布局 - 使用 CSS 变量支持主题切换
  const layout = useMemo(() => ({
    title: {
      text: title,
      font: {
        size: 18,
        color: 'var(--theme-text-primary, #e0e0e0)'
      }
    },
    xaxis: {
      title: 'n',
      range: propXRange || [0, parameters.maxN || 50],
      gridcolor: 'var(--theme-border, #333)',
      zerolinecolor: 'var(--theme-divider, #666)',
      tickfont: { color: 'var(--theme-text-secondary, #b0b0b0)' },
      titlefont: { color: 'var(--theme-text-primary, #e0e0e0)' }
    },
    yaxis: {
      title: sequenceType === 'original_function' ? 'f(x)' : 'u<sub>n</sub>',
      range: autoYRange,
      gridcolor: 'var(--theme-border, #333)',
      zerolinecolor: 'var(--theme-divider, #666)',
      tickfont: { color: 'var(--theme-text-secondary, #b0b0b0)' },
      titlefont: { color: 'var(--theme-text-primary, #e0e0e0)' }
    },
    plot_bgcolor: 'var(--theme-card-bg, #1a1a2e)',
    paper_bgcolor: 'var(--theme-surface, #1a1a2e)',
    margin: { l: 60, r: 40, t: 60, b: 60 },
    showlegend: true,
    legend: {
      font: { color: 'var(--theme-text-primary, #e0e0e0)' },
      bgcolor: 'rgba(0,0,0,0.1)',
      bordercolor: 'var(--theme-border, #333)',
      borderwidth: 1
    }
  }), [title, propXRange, parameters.maxN, autoYRange, sequenceType]);

  // 配置 Plotly 工具栏
  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'zoom2d', 'pan2d', 'select2d', 'lasso2d',
      'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'
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
      Plotly.newPlot(plotRef.current, plotData, layout, config);
    }
  }, [plotData, layout, config]);

  // 简单的内联样式 - 使用 CSS 变量支持主题切换
  const containerStyle = {
    width: '100%',
    height: '600px',
    background: 'var(--theme-card-bg, #1e293b)',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: showOriginalFunction ? '0.5rem' : '1rem'
  };

  return (
    <div style={containerStyle}>
      <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default SequencePlotter;

import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

/**
 * Limit Plotter 组件 - 支持极限函数可视化的展示
 */
const LimitPlotter = ({
  sequenceType,
  parameters,
  xRange: propXRange,
  yRange: propYRange,
  title,
  showLimitLine = false,
  limitValue,
  plotStyle = 'medium',
  aspectRatio = 'auto', // 新增：显示比例 (auto, 16:9, 4:3)
  showOriginalFunction = false, // 新增：是否显示原函数（用于 Limit 页面的第二个图）
  showAuxiliaryLines = false, // 新增：是否显示辅助线（垂直线和水平极限线）
  auxiliaryX = null, // 新增：辅助线 X 位置
  auxiliaryY = null, // 新增：辅助线 Y 位置（极限值）
  showPoints = [], // 新增：要显示的点数组 [{x, y, label}]
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
    return themeMode === 'dark' ? '#ffd700' : '#f59e0b'; // Dark: 亮黄, Light: 琥珀色（更醒目）
  }, [themeMode]);

  // 根据主题获取函数线颜色
  const getFunctionLineColor = useCallback(() => {
    return themeMode === 'dark' ? '#6366f1' : '#4f46e5'; // Dark: Indigo 500, Light: Indigo 600
  }, [themeMode]);

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
        const a = parameters.coefficient || 1;
        
        if (parameters.funcName === 'exponential' || parameters.funcName === 'exponential_decay') {
          const base = parameters.base || Math.E;
          return 1 / Math.pow(base, n);
        } else if (parameters.funcName === 'rational') {
          // 反比例函数: f(x) = a/x
          if (n === 0) return 0; // 避免除以零
          return a / n;
        } else if (parameters.funcName === 'arctan') {
          // 反正切函数: f(x) = a·arctan(x)
          return a * Math.atan(n);
        } else if (parameters.funcName === 'quadratic') {
          return n * n;
        } else if (parameters.funcName === 'sin') {
          return Math.sin(n);
        } else if (parameters.funcName === 'logarithmic') {
          const base = parameters.base || 2;
          return 1 / Math.log(n + 1) / Math.log(base);
        } else if (parameters.funcName === 'piecewise_onesided') {
          // 单侧极限分段函数: f(x) = { x-1, x < 0; 0, x = 0; x+1, x > 0 }
          if (n < 0) {
            return n - 1;
          } else if (n === 0) {
            return 0;
          } else {
            return n + 1;
          }
        } else if (parameters.funcName === 'rational_twosided') {
          // 双侧极限有理函数: f(x) = (x²-1)/(x-1) = x+1 (for x ≠ 1)
          // 在 x=1 处有洞，但极限存在
          if (Math.abs(n - 1) < 0.001) {
            // 接近 x=1 时返回极限值 2
            return 2;
          }
          return (n * n - 1) / (n - 1);
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
      // 如果传入了 xRange，使用它；否则使用默认的 [0, maxN]
      const xMin = propXRange ? propXRange[0] : 0;
      const xMax = propXRange ? propXRange[1] : maxN;
      
      const numPoints = 200;
      
      // 对于不连续函数（如 rational a/x 或 piecewise_onesided），需要分成多个 trace 避免连接渐近线
      const isDiscontinuous = parameters.funcName === 'rational' || parameters.funcName === 'piecewise_onesided';
      
      if (isDiscontinuous && xMin < 0 && xMax > 0) {
        // 不连续函数跨越 x=0，分成两个独立的 trace
        
        // 左侧分支：x < 0
        const leftNumPoints = Math.floor(numPoints / 2);
        const leftXValues = [];
        const leftYValues = [];
        
        for (let i = 0; i <= leftNumPoints; i++) {
          const x = xMin + ((0 - xMin) * i) / leftNumPoints;
          // 避免太接近 0 导致数值溢出或跳过间断点
          if (Math.abs(x) > 0.001) {
            leftXValues.push(x);
            leftYValues.push(calculateSequenceValues(x));
          }
        }
        
        if (leftXValues.length > 0) {
          traces.push({
            x: leftXValues,
            y: leftYValues,
            type: 'scatter',
            mode: 'lines',
            name: 'f(x)',
            line: { 
              color: getFunctionLineColor(), 
              width: styleConfig.lineWidth * 1.25
            },
            showlegend: false  // 只显示一个图例
          });
        }
        
        // 右侧分支：x > 0
        const rightNumPoints = numPoints - leftNumPoints;
        const rightXValues = [];
        const rightYValues = [];
        
        for (let i = 0; i <= rightNumPoints; i++) {
          const x = 0 + ((xMax - 0) * i) / rightNumPoints;
          // 避免太接近 0 导致数值溢出或跳过间断点
          if (Math.abs(x) > 0.001) {
            rightXValues.push(x);
            rightYValues.push(calculateSequenceValues(x));
          }
        }
        
        if (rightXValues.length > 0) {
          traces.push({
            x: rightXValues,
            y: rightYValues,
            type: 'scatter',
            mode: 'lines',
            name: 'f(x)',
            line: { 
              color: getFunctionLineColor(), 
              width: styleConfig.lineWidth * 1.25
            },
            showlegend: true  // 只在最后一个 trace 显示图例
          });
        }
      } else {
        // 连续函数或单侧区间，正常绘制
        const xValues = [];
        const yValues = [];
        
        for (let i = 0; i <= numPoints; i++) {
          const x = xMin + ((xMax - xMin) * i) / numPoints;
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
            color: getFunctionLineColor(), 
            width: styleConfig.lineWidth * 1.25
          }
        });
      }
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
          color: getFunctionLineColor(), 
          width: styleConfig.lineWidth,
          shape: 'spline',
          dash: styleConfig.dash
        },
        marker: { 
          size: styleConfig.pointSize, 
          color: getFunctionLineColor(),
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
            color: getAuxiliaryColor(), 
            width: styleConfig.lineWidth, 
            dash: styleConfig.dash 
          }
        });
      }
    }
    
    // 添加辅助线（垂直线和水平极限线）
    if (showAuxiliaryLines && propXRange) {
      const xMin = propXRange[0];
      const xMax = propXRange[1];
      
      // 垂直辅助线（在 critical point 处）
      if (auxiliaryX !== null && auxiliaryX >= xMin && auxiliaryX <= xMax) {
        traces.push({
          x: [auxiliaryX, auxiliaryX],
          y: [-10000, 10000], // 使用很大的范围确保覆盖整个 Y 轴
          type: 'scatter',
          mode: 'lines',
          name: `x = ${auxiliaryX}`,
          line: { 
            color: getAuxiliaryColor(), 
            width: styleConfig.lineWidth * 0.8, 
            dash: 'dot' 
          },
          showlegend: false
        });
      }
      
      // 水平极限线
      if (auxiliaryY !== null) {
        traces.push({
          x: [xMin, xMax],
          y: [auxiliaryY, auxiliaryY],
          type: 'scatter',
          mode: 'lines',
          name: `y = ${auxiliaryY} (limit)`,
          line: { 
            color: getAuxiliaryColor(), 
            width: styleConfig.lineWidth, 
            dash: 'dash' 
          }
        });
      }
    }
    
    // 添加关键点标记
    if (showPoints && showPoints.length > 0) {
      showPoints.forEach((point, index) => {
        traces.push({
          x: [point.x],
          y: [point.y],
          type: 'scatter',
          mode: 'markers+text',
          name: point.label || `Point ${index + 1}`,
          marker: { 
            size: styleConfig.pointSize * 1.5, 
            color: '#ef4444', // Red color for key points
            symbol: 'circle',
            line: {
              color: '#ffffff',
              width: 2
            }
          },
          text: [point.label || ''],
          textposition: 'top center',
          textfont: {
            color: themeMode === 'dark' ? '#f8fafc' : '#0f172a',
            size: styleConfig.fontSize + 2,
            family: 'Arial, sans-serif'
          }
        });
      });
    }
    
    return traces;
  }, [sequenceType, parameters, calculateSequenceValues, showLimitLine, limitValue, styleConfig, getFunctionLineColor, getAuxiliaryColor, showAuxiliaryLines, auxiliaryX, auxiliaryY, showPoints, themeMode]);

  // 自动计算 Y 轴范围
  const autoYRange = useMemo(() => {
    // 如果外部传入了 yRange，优先使用它
    if (propYRange) return propYRange;
    
    // 对于原函数类型，需要根据 xRange 计算
    if (sequenceType === 'original_function' && propXRange) {
      const numPoints = 150; // 使用较少的采样点进行性能优化
      const step = (propXRange[1] - propXRange[0]) / numPoints;
      let minVal = Infinity;
      let maxVal = -Infinity;
      
      for (let i = 0; i <= numPoints; i++) {
        const x = propXRange[0] + i * step;
        const val = calculateSequenceValues(x);
        
        // 过滤异常值
        if (!isNaN(val) && isFinite(val) && Math.abs(val) < 10000) {
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        }
      }
      
      // 如果没有找到有效值，返回默认范围
      if (minVal === Infinity || maxVal === -Infinity) {
        return [-10, 10];
      }
      
      // 添加边距（10%），并确保最小范围为 2
      const range = maxVal - minVal;
      const padding = Math.max(range * 0.1, 1);
      
      // 对于极小范围的函数，强制最小显示范围
      if (range < 2) {
        const center = (minVal + maxVal) / 2;
        return [center - 1, center + 1];
      }
      
      return [minVal - padding, maxVal + padding];
    }
    
    // 对于序列类型，根据 maxN 计算
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
  }, [sequenceType, parameters, calculateSequenceValues, propYRange, propXRange]);

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
        range: propXRange || [0, parameters.maxN || 50],
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
        title: sequenceType === 'original_function' ? 'f(x)' : 'u<sub>n</sub>',
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
      margin: { l: 60, r: 40, t: 60, b: 60 },
      showlegend: true,
      legend: {
        font: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize },
        bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
        bordercolor: isDark ? '#334155' : '#cbd5e1',
        borderwidth: 1
      }
    };
  }, [title, propXRange, parameters.maxN, autoYRange, sequenceType, themeMode, styleConfig]);

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
    marginBottom: showOriginalFunction ? '0.5rem' : '1rem',
    aspectRatio: aspectRatio === 'auto' ? 'unset' : aspectRatio.replace(':', '/')
  };

  return (
    <div style={containerStyle}>
      <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LimitPlotter;

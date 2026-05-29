import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

/**
 * 通用函数绘图组件 - 支持 2D/3D 函数可视化
 */
const FunctionPlotter = ({
  functionType,
  parameters,
  xRange: propXRange = [-10, 10],
  yRange = [-10, 10],
  title,
  showExportButton = true,
  plotStyle = 'medium', // 新增：全局样式档位 (thin, medium, thick)
  aspectRatio = 'auto' // 新增：显示比例 (auto, 16:9, 4:3)
}) => {
  const plotRef = useRef(null);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });
  
  // 使用 parameters.xRange 如果存在，否则使用 props 的 xRange
  const xRange = parameters.xRange || propXRange;

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

  // 根据函数类型和参数计算函数值
  const calculateFunctionValues = useCallback((x, type = 'original') => {
    // 兼容旧参数名和新参数名
    const a = parameters.a || parameters.coefficient || 1;
    const b = parameters.b !== undefined ? parameters.b : (parameters.frequency || 0);
    const c = parameters.c || parameters.phase || 0;
    
    switch (functionType) {
      case 'odd':
        // 奇函数: f(x) = ax³ + b（b 为偏置项）
        return a * Math.pow(x, 3) + b;
      
      case 'even':
        // 偶函数: f(x) = ax² + b（b 为偏置项）
        return a * Math.pow(x, 2) + b;
      
      case 'periodic':
        // 周期函数: f(x) = a·sin(bx + c)
        return a * Math.sin(b * x + c);
      
      case 'increasing':
        // 单调递增: f(x) = ax + b
        return a * x + b;
      
      case 'decreasing':
        // 单调递减: f(x) = -ax + b
        return -a * x + b;
      
      case 'piecewise':
        // 分段函数: f(x) = { a·√x, x ≥ 0; -a·x, x < 0 }
        if (x >= 0) {
          return a * Math.sqrt(x);
        } else {
          return -a * x;
        }
      
      case 'inverse':
        // 反函数示例: h = a·t² 和 t = √(h/a)
        if (type === 'original') {
          // 原函数: h = a·t²
          return a * Math.pow(x, 2);
        } else if (type === 'inverse') {
          // 反函数: t = √(h/a)，这里交换 x 和 y 轴
          // 如果 x >= 0，返回 √(x/a)
          if (x >= 0) {
            return Math.sqrt(x / a);
          }
          return null;
        }
        return 0;
      
      default:
        return 0;
    }
  }, [functionType, parameters]);

  // 生成函数数据点和辅助线
  const plotData = useMemo(() => {
    const numPoints = 500; // 采样点数
    const traces = [];
    
    if (functionType === 'inverse') {
      // 反函数需要同时绘制原函数和反函数两条曲线
      const step = (xRange[1] - xRange[0]) / numPoints;
      
      // 原函数: h = a·t²
      const originalX = [];
      const originalY = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x, 'original');
        originalX.push(x);
        originalY.push(y);
      }
      
      // 反函数: t = √(h/a)
      const inverseX = [];
      const inverseY = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x, 'inverse');
        if (y !== null) {
          inverseX.push(x);
          inverseY.push(y);
        }
      }
      
      // 添加 y=x 对称线
      const lineX = [xRange[0], xRange[1]];
      const lineY = [xRange[0], xRange[1]];
      
      traces.push({
        x: originalX,
        y: originalY,
        type: 'scatter',
        mode: 'lines',
        name: 'Original: h = at²',
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
      
      traces.push({
        x: inverseX,
        y: inverseY,
        type: 'scatter',
        mode: 'lines',
        name: 'Inverse: t = √(h/a)',
        line: { color: '#06b6d4', width: styleConfig.lineWidth, dash: styleConfig.dash }
      });
      
      traces.push({
        x: lineX,
        y: lineY,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x',
        line: { color: '#888', width: styleConfig.lineWidth * 0.5, dash: styleConfig.dash }
      });
      
    } else if (functionType === 'odd') {
      // 奇函数：主曲线 + 对称点标记
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];
      
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }
      
      // 主曲线
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
      
      // 示例点标记
      const sampleX = parameters.samplePoint || 2;
      const sampleY = calculateFunctionValues(sampleX);
      const oppositeX = -sampleX;
      const oppositeY = calculateFunctionValues(oppositeX);
      const pointSize = parameters.pointSize || styleConfig.pointSize;
      
      // P点
      traces.push({
        x: [sampleX],
        y: [sampleY],
        type: 'scatter',
        mode: 'markers',
        name: `P(${sampleX.toFixed(1)}, ${sampleY.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: getAuxiliaryColor(), 
          symbol: 'circle',
          line: { color: '#fff', width: styleConfig.lineWidth * 0.5 }
        }
      });
      
      // P'点
      traces.push({
        x: [oppositeX],
        y: [oppositeY],
        type: 'scatter',
        mode: 'markers',
        name: `P'(${oppositeX.toFixed(1)}, ${oppositeY.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: getAuxiliaryColor(), 
          symbol: 'circle',
          line: { color: '#fff', width: styleConfig.lineWidth * 0.5 }
        }
      });
      
      // 连接线
      traces.push({
        x: [sampleX, oppositeX],
        y: [sampleY, oppositeY],
        type: 'scatter',
        mode: 'lines',
        name: 'Connection Line',
        line: { color: getAuxiliaryColor(), width: styleConfig.lineWidth * 0.5, dash: styleConfig.dash }
      });

    } else if (functionType === 'even') {
      // 偶函数：主曲线 + 对称轴
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];
      
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }
      
      // 主曲线
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
      
      // 对称轴
      traces.push({
        x: [0, 0],
        y: [yRange[0], yRange[1]],
        type: 'scatter',
        mode: 'lines',
        name: 'Axis of Symmetry (x=0)',
        line: { 
          color: getAuxiliaryColor(), 
          width: styleConfig.lineWidth, 
          dash: styleConfig.dash
        }
      });
      
    } else if (functionType === 'periodic') {
      // 周期函数：主曲线 + 周期标记线
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];
      
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }
      
      // 主曲线
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
      
      // 周期标记线
      const { a: amplitude = 1, b: frequency = 1, c: phase = 0 } = parameters;
      const period = 2 * Math.PI / frequency; // 周期长度
      const lineStyle = parameters.lineStyle || 'dashed'; // solid 或 dashed
      
      // 找到距离原点最近的第一个波峰位置
      // sin(bx + c) 的最大值出现在 bx + c = π/2 + 2πn
      // 所以 x = (π/2 - c + 2πn) / b
      // 我们需要找到使 |x| 最小的 n
      
      const basePeakX = (Math.PI / 2 - phase) / frequency;
      
      // 找到最接近原点的波峰
      let firstPeakX = basePeakX;
      if (Math.abs(basePeakX) > period / 2) {
        // 如果基础波峰太远，调整到最近的周期
        const n = Math.round(-basePeakX / period);
        firstPeakX = basePeakX + n * period;
      }
      
      // 从第一个波峰开始，向左右扩展周期标记线
      // 向左扩展
      let x = firstPeakX;
      while (x >= xRange[0] - period) {
        if (x >= xRange[0] && x <= xRange[1]) {
          traces.push({
            x: [x, x],
            y: [yRange[0], yRange[1]],
            type: 'scatter',
            mode: 'lines',
            name: `Peak at x=${x.toFixed(2)}`,
            line: { 
              color: getAuxiliaryColor(), 
              width: styleConfig.lineWidth * 0.75, 
              dash: styleConfig.dash 
            },
            showlegend: false
          });
        }
        x -= period;
      }
      
      // 向右扩展
      x = firstPeakX + period;
      while (x <= xRange[1] + period) {
        if (x >= xRange[0] && x <= xRange[1]) {
          traces.push({
            x: [x, x],
            y: [yRange[0], yRange[1]],
            type: 'scatter',
            mode: 'lines',
            name: `Peak at x=${x.toFixed(2)}`,
            line: { 
              color: getAuxiliaryColor(), 
              width: styleConfig.lineWidth * 0.75, 
              dash: styleConfig.dash 
            },
            showlegend: false
          });
        }
        x += period;
      }

    } else if (functionType === 'increasing' || functionType === 'decreasing') {
      // 单调函数：主曲线 + 两点及垂线段
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];
      
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }
      
      // 主曲线
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
      
      // 选取两个点
      const x1 = parameters.x1 !== undefined ? parameters.x1 : -3;
      const x2 = parameters.x2 !== undefined ? parameters.x2 : 3;
      const y1 = calculateFunctionValues(x1);
      const y2 = calculateFunctionValues(x2);
      const pointSize = parameters.pointSize || styleConfig.pointSize;
      
      // P1点
      traces.push({
        x: [x1],
        y: [y1],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₁(${x1.toFixed(1)}, ${y1.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: getAuxiliaryColor(), 
          symbol: 'circle',
          line: { color: '#fff', width: styleConfig.lineWidth * 0.5 }
        },
        text: [`P₁`],
        textposition: 'top center',
        textfont: { color: getAuxiliaryColor(), size: styleConfig.fontSize }
      });
      
      // P2点
      traces.push({
        x: [x2],
        y: [y2],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₂(${x2.toFixed(1)}, ${y2.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: getAuxiliaryColor(), 
          symbol: 'circle',
          line: { color: '#fff', width: styleConfig.lineWidth * 0.5 }
        },
        text: [`P₂`],
        textposition: 'top center',
        textfont: { color: getAuxiliaryColor(), size: styleConfig.fontSize }
      });
      
      // 垂线段
      traces.push({
        x: [x1, x1],
        y: [0, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₁',
        line: { color: getAuxiliaryColor(), width: styleConfig.lineWidth * 0.5, dash: styleConfig.dash },
        showlegend: false
      });
      
      traces.push({
        x: [0, x1],
        y: [y1, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₁',
        line: { color: getAuxiliaryColor(), width: styleConfig.lineWidth * 0.5, dash: styleConfig.dash },
        showlegend: false
      });
      
      traces.push({
        x: [x2, x2],
        y: [0, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₂',
        line: { color: getAuxiliaryColor(), width: styleConfig.lineWidth * 0.5, dash: styleConfig.dash },
        showlegend: false
      });
      
      traces.push({
        x: [0, x2],
        y: [y2, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₂',
        line: { color: getAuxiliaryColor(), width: styleConfig.lineWidth * 0.5, dash: styleConfig.dash },
        showlegend: false
      });
      
    } else if (functionType === 'piecewise') {
      // 分段函数：主曲线 + 分段点标记线（固定在 x=0）
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];
      
      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }
      
      // 主曲线
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
      
      // 分段点标记线
      traces.push({
        x: [0, 0],
        y: [yRange[0], yRange[1]],
        type: 'scatter',
        mode: 'lines',
        name: 'Break Point (x=0)',
        line: { 
          color: getAuxiliaryColor(), 
          width: styleConfig.lineWidth, 
          dash: styleConfig.dash 
        }
      });
      
    } else {
      // 其他函数类型：只绘制主曲线
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];

      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }

      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: { color: getFunctionLineColor(), width: styleConfig.lineWidth }
      });
    }
    
    return traces;
  }, [functionType, parameters, xRange, yRange, title, styleConfig, getFunctionLineColor, getAuxiliaryColor]);

  // 配置 Plotly 布局 - 根据主题模式动态设置颜色
  const layout = useMemo(() => {
    const isDark = themeMode === 'dark';
    const axisColor = isDark ? '#475569' : '#cbd5e1'; // 边框颜色
    
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
        range: xRange,
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
        title: functionType === 'inverse' ? 'h (height)' : 'y',
        range: yRange,
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
      showlegend: functionType === 'inverse' ? true : false,
      legend: {
        font: { color: isDark ? '#e0e0e0' : '#0f172a', size: styleConfig.fontSize },
        bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
        bordercolor: isDark ? '#334155' : '#cbd5e1',
        borderwidth: 1
      }
    };
  }, [title, xRange, yRange, functionType, themeMode, styleConfig]);

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
    height: aspectRatio === 'auto' ? '600px' : 'auto', // Auto 模式使用固定高度，其他模式由 aspect-ratio 决定
    background: 'var(--theme-card-bg, #1e293b)',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
    aspectRatio: aspectRatio === 'auto' ? 'unset' : aspectRatio.replace(':', '/')
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

  return (
    <div style={containerStyle}>
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

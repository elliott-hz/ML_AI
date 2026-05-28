import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

/**
 * 通用函数绘图组件 - 支持 2D/3D 函数可视化
 */
const FunctionPlotter = ({
  functionType,
  parameters,
  xRange: propXRange = [-10, 10],  // 从 props 传入的 xRange
  yRange = [-10, 10],
  title,
  showExportButton = true
}) => {
  const plotRef = useRef(null);
  
  // 使用 parameters.xRange 如果存在，否则使用 props 的 xRange
  const xRange = parameters.xRange || propXRange;

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
        line: { color: '#6366f1', width: 2 }
      });
      
      traces.push({
        x: inverseX,
        y: inverseY,
        type: 'scatter',
        mode: 'lines',
        name: 'Inverse: t = √(h/a)',
        line: { color: '#06b6d4', width: 2, dash: 'dash' }
      });
      
      traces.push({
        x: lineX,
        y: lineY,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x',
        line: { color: '#888', width: 1, dash: 'dot' }
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
        line: { color: '#6366f1', width: 2 }
      });
      
      // 示例点标记（展示 f(x) 和 f(-x) 的关系）
      const sampleX = parameters.samplePoint || 2; // 可调整采样点位置
      const sampleY = calculateFunctionValues(sampleX);
      const oppositeX = -sampleX;
      const oppositeY = calculateFunctionValues(oppositeX);
      const pointSize = parameters.pointSize || 10; // 可调整点大小
      
      // P点 (x, f(x))
      traces.push({
        x: [sampleX],
        y: [sampleY],
        type: 'scatter',
        mode: 'markers',
        name: `P(${sampleX.toFixed(1)}, ${sampleY.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 2 }
        }
      });
      
      // P'点 (-x, f(-x))
      traces.push({
        x: [oppositeX],
        y: [oppositeY],
        type: 'scatter',
        mode: 'markers',
        name: `P'(${oppositeX.toFixed(1)}, ${oppositeY.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 2 }
        }
      });
      
      // 连接线（从 P 到 P'）
      traces.push({
        x: [sampleX, oppositeX],
        y: [sampleY, oppositeY],
        type: 'scatter',
        mode: 'lines',
        name: 'Connection Line',
        line: { color: '#ffd700', width: 1, dash: 'dash' }
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
        line: { color: '#6366f1', width: 2 }
      });
      
      // 对称轴（y轴）
      const axisStyle = parameters.axisStyle || 'solid'; // solid 或 dashed
      const axisWidth = parameters.axisWidth || 2; // 线宽
      
      traces.push({
        x: [0, 0],
        y: [yRange[0], yRange[1]],
        type: 'scatter',
        mode: 'lines',
        name: 'Axis of Symmetry (x=0)',
        line: { 
          color: '#ffd700', 
          width: axisWidth, 
          dash: axisStyle === 'dashed' ? 'dash' : 'solid' 
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
        line: { color: '#6366f1', width: 2 }
      });
      
      // 周期标记线 - 基于第一个波峰位置
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
              color: '#ffd700', 
              width: 1.5, 
              dash: lineStyle === 'dashed' ? 'dash' : 'solid' 
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
              color: '#ffd700', 
              width: 1.5, 
              dash: lineStyle === 'dashed' ? 'dash' : 'solid' 
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
        line: { color: '#6366f1', width: 2 }
      });
      
      // 选取两个点（可调整位置）
      const x1 = parameters.x1 !== undefined ? parameters.x1 : -3;
      const x2 = parameters.x2 !== undefined ? parameters.x2 : 3;
      const y1 = calculateFunctionValues(x1);
      const y2 = calculateFunctionValues(x2);
      const pointSize = parameters.pointSize || 10;
      
      // P1点
      traces.push({
        x: [x1],
        y: [y1],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₁(${x1.toFixed(1)}, ${y1.toFixed(1)})`,
        marker: { 
          size: pointSize, 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 2 }
        },
        text: [`P₁`],
        textposition: 'top center',
        textfont: { color: '#ffd700', size: 12 }
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
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 2 }
        },
        text: [`P₂`],
        textposition: 'top center',
        textfont: { color: '#ffd700', size: 12 }
      });
      
      // P1到x轴的垂线
      traces.push({
        x: [x1, x1],
        y: [0, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₁',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      });
      
      // P1到y轴的垂线
      traces.push({
        x: [0, x1],
        y: [y1, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₁',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      });
      
      // P2到x轴的垂线
      traces.push({
        x: [x2, x2],
        y: [0, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₂',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      });
      
      // P2到y轴的垂线
      traces.push({
        x: [0, x2],
        y: [y2, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₂',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
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
        line: { color: '#6366f1', width: 2 }
      });
      
      // 分段点标记线（固定在 x=0）
      traces.push({
        x: [0, 0],
        y: [yRange[0], yRange[1]],
        type: 'scatter',
        mode: 'lines',
        name: 'Break Point (x=0)',
        line: { 
          color: '#ffd700', 
          width: 2, 
          dash: 'dash' 
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
        line: { color: '#6366f1', width: 2 }
      });
    }
    
    return traces;
  }, [functionType, parameters, xRange, yRange, title]);

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
      title: 'x',
      range: xRange,
      gridcolor: 'var(--theme-border, #333)',
      zerolinecolor: 'var(--theme-divider, #666)',
      tickfont: { color: 'var(--theme-text-secondary, #b0b0b0)' },
      titlefont: { color: 'var(--theme-text-primary, #e0e0e0)' }
    },
    yaxis: {
      title: functionType === 'inverse' ? 'h (height)' : 'y',
      range: yRange,
      gridcolor: 'var(--theme-border, #333)',
      zerolinecolor: 'var(--theme-divider, #666)',
      tickfont: { color: 'var(--theme-text-secondary, #b0b0b0)' },
      titlefont: { color: 'var(--theme-text-primary, #e0e0e0)' }
    },
    plot_bgcolor: 'var(--theme-card-bg, #1a1a2e)',
    paper_bgcolor: 'var(--theme-background, #1a1a2e)',
    margin: { l: 60, r: 40, t: 60, b: 60 },
    showlegend: functionType === 'inverse' ? true : false,
    legend: {
      font: { color: 'var(--theme-text-primary, #e0e0e0)' },
      bgcolor: 'rgba(0,0,0,0.1)',
      bordercolor: 'var(--theme-border, #333)',
      borderwidth: 1
    }
  }), [title, xRange, yRange, functionType]);

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

  // 简单的内联样式
  const containerStyle = {
    width: '100%',
    height: '600px',  // 从 400px 增加到 600px（增加 50%）
    background: '#1e293b',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem'
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

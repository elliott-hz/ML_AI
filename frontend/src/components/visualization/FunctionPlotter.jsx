import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';

/**
 * 通用函数绘图组件 - 支持 2D/3D 函数可视化
 */
const FunctionPlotter = ({
  functionType,
  parameters,
  xRange = [-10, 10],
  yRange = [-10, 10],
  title,
  showExportButton = true
}) => {
  const plotRef = useRef(null);
  // 根据函数类型和参数计算函数值
  const calculateFunctionValues = useCallback((x, type = 'original') => {
    // 兼容旧参数名和新参数名
    const a = parameters.a || parameters.coefficient || 1;
    const b = parameters.b || parameters.frequency || 0;
    const c = parameters.c || parameters.phase || 0;
    
    switch (functionType) {
      case 'odd':
        // 奇函数: f(x) = ax³
        return a * Math.pow(x, 3);
      
      case 'even':
        // 偶函数: f(x) = ax²
        return a * Math.pow(x, 2);
      
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

  // 生成函数数据点
  const plotData = useMemo(() => {
    const numPoints = 500; // 采样点数
    
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
      
      return [
        {
          x: originalX,
          y: originalY,
          type: 'scatter',
          mode: 'lines',
          name: 'Original: h = at²',
          line: {
            color: '#6366f1',
            width: 2
          }
        },
        {
          x: inverseX,
          y: inverseY,
          type: 'scatter',
          mode: 'lines',
          name: 'Inverse: t = √(h/a)',
          line: {
            color: '#06b6d4',
            width: 2,
            dash: 'dash'
          }
        },
        {
          x: lineX,
          y: lineY,
          type: 'scatter',
          mode: 'lines',
          name: 'y = x',
          line: {
            color: '#888',
            width: 1,
            dash: 'dot'
          }
        }
      ];
    } else {
      // 其他函数类型：单条曲线
      const step = (xRange[1] - xRange[0]) / numPoints;
      const xValues = [];
      const yValues = [];

      for (let i = 0; i <= numPoints; i++) {
        const x = xRange[0] + i * step;
        const y = calculateFunctionValues(x);
        xValues.push(x);
        yValues.push(y);
      }

      return [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: title,
        line: {
          color: '#6366f1',
          width: 2
        }
      }];
    }
  }, [functionType, parameters, xRange, title]);

  // 配置 Plotly 布局
  const layout = useMemo(() => ({
    title: {
      text: title,
      font: {
        size: 18,
        color: '#e0e0e0'
      }
    },
    xaxis: {
      title: 'x',
      range: xRange,
      gridcolor: '#333',
      zerolinecolor: '#666',
      tickfont: { color: '#b0b0b0' },
      titlefont: { color: '#e0e0e0' }
    },
    yaxis: {
      title: 'y',
      range: yRange,
      gridcolor: '#333',
      zerolinecolor: '#666',
      tickfont: { color: '#b0b0b0' },
      titlefont: { color: '#e0e0e0' }
    },
    plot_bgcolor: '#1a1a2e',
    paper_bgcolor: '#1a1a2e',
    margin: { l: 60, r: 40, t: 60, b: 60 },
    showlegend: functionType === 'inverse' ? true : false,
    legend: {
      font: { color: '#e0e0e0' },
      bgcolor: 'rgba(0,0,0,0.3)',
      bordercolor: '#333',
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
    height: '400px',
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

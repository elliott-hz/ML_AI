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
  const calculateFunctionValues = useCallback((x) => {
    const { a = 1, b = 0, c = 0 } = parameters;
    
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
      
      default:
        return 0;
    }
  }, [functionType, parameters]);

  // 生成函数数据点
  const plotData = useMemo(() => {
    const numPoints = 500; // 采样点数
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
  }, [calculateFunctionValues, xRange, title]);

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
    showlegend: false
  }), [title, xRange, yRange]);

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

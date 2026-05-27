import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Slider, InputNumber, Button, Space, Typography, Card, Divider } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import './FunctionPlotter.css';

const { Title, Text } = Typography;

interface FunctionConfig {
  function_type: string;
  name: string;
  description: string;
  default_params: Record<string, number>;
  param_ranges: Record<string, { min: number; max: number; step: number }>;
}

interface FunctionPlotterProps {
  functionType?: string; // 'even', 'odd', 'symmetry', 'increasing', 'decreasing'
}

const FunctionPlotter: React.FC<FunctionPlotterProps> = ({ functionType = 'even' }) => {
  const [config, setConfig] = useState<FunctionConfig | null>(null);
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [xRange, setXRange] = useState<[number, number]>([-10, 10]);
  const [loading, setLoading] = useState(false);

  // 加载函数配置
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/visualizations/function/config/${functionType}`);
        const data = await response.json();
        setConfig(data);
        setParameters(data.default_params);
      } catch (error) {
        console.error('Failed to load function config:', error);
      }
    };
    fetchConfig();
  }, [functionType]);

  // 计算函数值
  const calculateFunctionValues = (xValues: number[]): number[] => {
    if (!config) return [];
    
    const { function_type } = config;
    const { a = 1, b = 0, c = 0, h = 0, k = 0 } = parameters;
    
    switch (function_type) {
      case 'even':
        // f(x) = ax² + bx + c (even function when b=0)
        return xValues.map(x => a * Math.pow(x, 2) + c);
      
      case 'odd':
        // f(x) = ax³ + bx
        return xValues.map(x => a * Math.pow(x, 3) + b * x);
      
      case 'symmetry':
        // f(x) = a|x - h| + k (symmetric about x=h)
        return xValues.map(x => a * Math.abs(x - h) + k);
      
      case 'increasing':
        // f(x) = ae^(bx) (monotonically increasing when a>0, b>0)
        return xValues.map(x => a * Math.exp(b * x));
      
      case 'decreasing':
        // f(x) = ae^(-bx) (monotonically decreasing when a>0, b>0)
        return xValues.map(x => a * Math.exp(-b * x));
      
      default:
        return [];
    }
  };

  // 生成数据点
  const generateData = () => {
    const numPoints = 1000;
    const [xMin, xMax] = xRange;
    const step = (xMax - xMin) / (numPoints - 1);
    const xValues = Array.from({ length: numPoints }, (_, i) => xMin + i * step);
    const yValues = calculateFunctionValues(xValues);
    
    return {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#667eea', width: 2 },
      name: config?.name || 'f(x)'
    };
  };

  // 添加对称线（针对奇偶函数）
  const getLayoutShapes = () => {
    const shapes: any[] = [
      // X轴
      {
        type: 'line',
        x0: xRange[0],
        y0: 0,
        x1: xRange[1],
        y1: 0,
        line: { color: 'black', width: 1 },
      },
      // Y轴
      {
        type: 'line',
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0, // Will be auto-scaled
        line: { color: 'black', width: 1 },
      }
    ];

    // 对于偶函数，添加y轴对称线
    if (functionType === 'even') {
      shapes.push({
        type: 'line',
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 1,
        yref: 'paper',
        line: { color: 'red', width: 2, dash: 'dash' },
        name: 'Axis of symmetry (y-axis)'
      });
    }

    return shapes;
  };

  // 处理参数变化
  const handleParamChange = (paramName: string, value: number | null) => {
    if (value !== null) {
      setParameters(prev => ({ ...prev, [paramName]: value }));
    }
  };

  // 重置参数到默认值
  const handleReset = () => {
    if (config) {
      setParameters(config.default_params);
      setXRange([-10, 10]);
    }
  };

  // 导出图片
  const handleExportImage = () => {
    const plotElement = document.querySelector('.function-plot');
    if (plotElement) {
      Plotly.toImage(plotElement as any, { format: 'png', width: 800, height: 600 })
        .then((dataUrl: string) => {
          const link = document.createElement('a');
          link.download = `${functionType}_function_${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(error => {
          console.error('Failed to export image:', error);
        });
    }
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  const plotData = [generateData()];
  
  const layout = {
    title: {
      text: config.name,
      font: { size: 18, color: '#333' }
    },
    xaxis: {
      title: 'x',
      range: xRange,
      zeroline: true,
      zerolinecolor: 'black',
      gridcolor: '#e0e0e0'
    },
    yaxis: {
      title: 'f(x)',
      zeroline: true,
      zerolinecolor: 'black',
      gridcolor: '#e0e0e0'
    },
    showlegend: true,
    legend: { x: 0, y: 1 },
    hovermode: 'closest',
    shapes: getLayoutShapes(),
    margin: { l: 50, r: 50, t: 80, b: 50 }
  };

  const config_options = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['downloadImage'],
    displaylogo: false
  };

  return (
    <div className="function-plotter">
      <Card title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{config.name}</span>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              size="small"
            >
              Reset
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={handleExportImage}
              size="small"
            >
              Export Image
            </Button>
          </Space>
        </div>
      }>
        <Text type="secondary">{config.description}</Text>
        
        <Divider orientation="left">Parameters</Divider>
        
        {/* 参数控制面板 */}
        <div className="parameter-controls">
          {Object.entries(config.param_ranges).map(([paramName, range]) => (
            <div key={paramName} className="param-item">
              <div className="param-label">
                <Text strong>{paramName}:</Text>
              </div>
              <div className="param-inputs">
                <Slider
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={parameters[paramName] || 0}
                  onChange={(value) => handleParamChange(paramName, value as number)}
                  style={{ flex: 1, marginRight: 16 }}
                />
                <InputNumber
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={parameters[paramName] || 0}
                  onChange={(value) => handleParamChange(paramName, value)}
                  style={{ width: 100 }}
                />
              </div>
            </div>
          ))}
          
          {/* X轴范围控制 */}
          <div className="param-item">
            <div className="param-label">
              <Text strong>X Range:</Text>
            </div>
            <div className="param-inputs">
              <InputNumber
                value={xRange[0]}
                onChange={(value) => setXRange([value || -10, xRange[1]])}
                style={{ width: 100 }}
                placeholder="Min"
              />
              <span style={{ margin: '0 8px' }}>to</span>
              <InputNumber
                value={xRange[1]}
                onChange={(value) => setXRange([xRange[0], value || 10])}
                style={{ width: 100 }}
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* Plotly图表 */}
        <div className="plot-container">
          <Plot
            data={plotData}
            layout={layout}
            config={config_options}
            className="function-plot"
            style={{ width: '100%', height: 500 }}
            useResizeHandler={true}
          />
        </div>
      </Card>
    </div>
  );
};

export default FunctionPlotter;

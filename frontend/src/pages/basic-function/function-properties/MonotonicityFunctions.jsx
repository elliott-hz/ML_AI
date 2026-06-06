// UI Pattern: MultiSectionPlot — multiple function sections (increasing/decreasing), each with its own content layout and controls
import React, { useState, useMemo, useCallback } from 'react';
import FunctionPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/FunctionPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FunctionSection
} from '../../../components/common/LayoutStyled';

/**
 * 单调性函数子页面 - 展示单调递增和单调递减函数的特性
 */
const MonotonicityFunctions = () => {

  // 单调递增函数参数状态
  const [increasingParams, setIncreasingParams] = useState({ 
    a: 1,        // 斜率
    b: 0,        // 截距
    x1: -3,      // 第一个点的x坐标
    x2: 3,       // 第二个点的x坐标
    xRange: [-8, 8], // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 单调递减函数参数状态
  const [decreasingParams, setDecreasingParams] = useState({
    a: 1,        // 斜率
    b: 0,        // 截距
    x1: -3,      // 第一个点的x坐标
    x2: 3,       // 第二个点的x坐标
    xRange: [-8, 8], // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 单调递增函数参数配置 - 分组版本
  const increasingCoefficientConfig = [
    { name: 'a', label: 'Slope (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Intercept (b)', min: -10, max: 10, step: 0.5 }
  ];

  const increasingAuxiliaryConfig = [
    { name: 'x1', label: 'Point P₁ (x₁)', min: -8, max: 8, step: 0.5 },
    { name: 'x2', label: 'Point P₂ (x₂)', min: -8, max: 8, step: 0.5 }
  ];

  const increasingPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const increasingViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-8, 8] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const increasingLegendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const increasingCommonConfig = [
    ...increasingLegendPositionConfig,
    ...increasingPlotStyleConfig,
    ...increasingViewRangeConfig
  ];

  // 单调递减函数参数配置 - 分组版本
  const decreasingCoefficientConfig = [
    { name: 'a', label: 'Slope (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Intercept (b)', min: -10, max: 10, step: 0.5 }
  ];

  const decreasingAuxiliaryConfig = [
    { name: 'x1', label: 'Point P₁ (x₁)', min: -8, max: 8, step: 0.5 },
    { name: 'x2', label: 'Point P₂ (x₂)', min: -8, max: 8, step: 0.5 }
  ];

  const decreasingPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const decreasingViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-8, 8] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const decreasingLegendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const decreasingCommonConfig = [
    ...decreasingLegendPositionConfig,
    ...decreasingPlotStyleConfig,
    ...decreasingViewRangeConfig
  ];

  // ✅ 新增：单调递增函数数据生成逻辑
  const generateIncreasingData = useCallback(() => {
    const { a, b, x1, x2 } = increasingParams;
    const xMin = increasingParams.xRange[0];
    const xMax = increasingParams.xRange[1];
    const numPoints = 500;
    
    // ✅ 新增：格式化数值显示（1位小数）
    const formatNum = (num) => Number(num).toFixed(1);
    
    // 生成主曲线：f(x) = ax + b
    const xValues = [];
    const yValues = [];
    const step = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = a * x + b;
      xValues.push(x);
      yValues.push(y);
    }
    
    // 计算两个点的坐标
    const y1 = a * x1 + b;
    const y2 = a * x2 + b;
    
    return [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${formatNum(a)}x + ${formatNum(b)}`,
        line: { color: '#6366f1', width: 2 }
      },
      {
        x: [x1],
        y: [y1],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₁(${formatNum(x1)}, ${formatNum(y1)})`,
        marker: { 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 1 }
        },
        text: [`P₁`],
        textposition: 'top center',
        textfont: { color: '#ffd700', size: 12 }
      },
      {
        x: [x2],
        y: [y2],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₂(${formatNum(x2)}, ${formatNum(y2)})`,
        marker: { 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 1 }
        },
        text: [`P₂`],
        textposition: 'top center',
        textfont: { color: '#ffd700', size: 12 }
      },
      // 垂线段
      {
        x: [x1, x1],
        y: [0, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₁',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      },
      {
        x: [0, x1],
        y: [y1, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₁',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      },
      {
        x: [x2, x2],
        y: [0, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₂',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      },
      {
        x: [0, x2],
        y: [y2, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₂',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      }
    ];
  }, [increasingParams.a, increasingParams.b, increasingParams.x1, increasingParams.x2, increasingParams.xRange]);
  
  // ✅ 新增：单调递减函数数据生成逻辑
  const generateDecreasingData = useCallback(() => {
    const { a, b, x1, x2 } = decreasingParams;
    const xMin = decreasingParams.xRange[0];
    const xMax = decreasingParams.xRange[1];
    const numPoints = 500;
    
    // ✅ 新增：格式化数值显示（1位小数）
    const formatNum = (num) => Number(num).toFixed(1);
    
    // 生成主曲线：f(x) = -ax + b
    const xValues = [];
    const yValues = [];
    const step = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = -a * x + b;
      xValues.push(x);
      yValues.push(y);
    }
    
    // 计算两个点的坐标
    const y1 = -a * x1 + b;
    const y2 = -a * x2 + b;
    
    return [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = -${formatNum(a)}x + ${formatNum(b)}`,
        line: { color: '#ef4444', width: 2 }
      },
      {
        x: [x1],
        y: [y1],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₁(${formatNum(x1)}, ${formatNum(y1)})`,
        marker: { 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 1 }
        },
        text: [`P₁`],
        textposition: 'top center',
        textfont: { color: '#ffd700', size: 12 }
      },
      {
        x: [x2],
        y: [y2],
        type: 'scatter',
        mode: 'markers+text',
        name: `P₂(${formatNum(x2)}, ${formatNum(y2)})`,
        marker: { 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 1 }
        },
        text: [`P₂`],
        textposition: 'top center',
        textfont: { color: '#ffd700', size: 12 }
      },
      // 垂线段
      {
        x: [x1, x1],
        y: [0, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₁',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      },
      {
        x: [0, x1],
        y: [y1, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₁',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      },
      {
        x: [x2, x2],
        y: [0, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Vertical Line P₂',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      },
      {
        x: [0, x2],
        y: [y2, y2],
        type: 'scatter',
        mode: 'lines',
        name: 'Horizontal Line P₂',
        line: { color: '#ffd700', width: 1, dash: 'dash' },
        showlegend: false
      }
    ];
  }, [decreasingParams.a, decreasingParams.b, decreasingParams.x1, decreasingParams.x2, decreasingParams.xRange]);
  
  // ✅ 使用 useMemo 缓存数据
  const increasingTraces = useMemo(() => generateIncreasingData(), [generateIncreasingData]);
  const decreasingTraces = useMemo(() => generateDecreasingData(), [generateDecreasingData]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitle>Monotonicity</SectionTitle>
      </Header>
      
      <SectionDescription>
        Study the monotonic behavior of functions. A function is monotonically increasing if it never decreases as x increases, 
        and monotonically decreasing if it never increases as x increases.
      </SectionDescription>

      {/* 单调递增部分 */}
      <SectionTitle> Monotonically Increasing: f(x) = ax + b</SectionTitle>
      <SectionDescription>
        As x increases, y always increases. The slope (a) must be positive. Adjust the slope and y-intercept to see different linear functions.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 单调递增参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={increasingParams}
              onChange={setIncreasingParams}
              config={increasingCoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="Auxiliary Lines">
            <ParameterControls
              parameters={increasingParams}
              onChange={setIncreasingParams}
              config={increasingAuxiliaryConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={increasingParams}
              onChange={setIncreasingParams}
              config={increasingCommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={increasingTraces}
            xRange={increasingParams.xRange}
            title={`Monotonically Increasing: f(x) = ${increasingParams.a.toFixed(1)}x + ${increasingParams.b.toFixed(1)}`}
            showExportButton={false}
            plotStyle={increasingParams.plotStyle}
            aspectRatio={increasingParams.aspectRatio}
            legendPosition={increasingParams.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>

      {/* 单调递减部分 */}
      <SectionTitle style={{ marginTop: '2rem' }}> Monotonically Decreasing: f(x) = -ax + b</SectionTitle>
      <SectionDescription>
        As x increases, y always decreases. The slope (-a) is negative. Adjust the magnitude of slope and y-intercept.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 单调递减参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={decreasingParams}
              onChange={setDecreasingParams}
              config={decreasingCoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="Auxiliary Lines">
            <ParameterControls
              parameters={decreasingParams}
              onChange={setDecreasingParams}
              config={decreasingAuxiliaryConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={decreasingParams}
              onChange={setDecreasingParams}
              config={decreasingCommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={decreasingTraces}
            xRange={decreasingParams.xRange}
            title={`Monotonically Decreasing: f(x) = -${decreasingParams.a.toFixed(1)}x + ${decreasingParams.b.toFixed(1)}`}
            showExportButton={false}
            plotStyle={decreasingParams.plotStyle}
            aspectRatio={decreasingParams.aspectRatio}
            legendPosition={decreasingParams.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default MonotonicityFunctions;

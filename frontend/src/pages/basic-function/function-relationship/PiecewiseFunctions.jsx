// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import FunctionPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/FunctionPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const FormulaTitle = styled.h3`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 16px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ControlsPanel = styled.div`
  flex: 0 0 350px;
  min-width: 300px;
`;

const PlotPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

/**
 * Piecewise Functions 页面 - 分段函数可视化
 */
const PiecewiseFunctions = () => {
  const [params, setParams] = useState({
    coefficient: 1,
    xRange: [-10, 10],
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 参数配置 - 分组版本
  const coefficientConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.1,
      max: 5,
      step: 0.1
    }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -20,
      max: 20,
      step: 1,
      default: [-10, 10]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  // Merge all common controls into one config array
  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  // ✅ 新增：在页面中定义分段函数的数据生成逻辑
  const generatePiecewiseData = useCallback(() => {
    const a = params.coefficient;
    const xMin = params.xRange[0];
    const xMax = params.xRange[1];
    const numPoints = 500;
    
    // ✅ 新增：格式化数值显示（1位小数）
    const formatNum = (num) => Number(num).toFixed(1);
    
    // 生成分段函数数据：f(x) = { a·x, x ≥ 0; 0, x < 0 }
    // 需要分成两个独立的 trace 避免在 x=0 处连接
    const step = (xMax - xMin) / numPoints;
    
    // 左侧分支：x < 0, f(x) = 0
    const leftX = [];
    const leftY = [];
    for (let i = 0; i <= numPoints / 2; i++) {
      const x = xMin + ((0 - xMin) * i) / (numPoints / 2);
      if (x < 0) {
        leftX.push(x);
        leftY.push(0);
      }
    }
    
    // 右侧分支：x ≥ 0, f(x) = a·x
    const rightX = [];
    const rightY = [];
    for (let i = 0; i <= numPoints / 2; i++) {
      const x = 0 + ((xMax - 0) * i) / (numPoints / 2);
      rightX.push(x);
      rightY.push(a * x);
    }
    
    // 分段点标记线（x=0）
    const breakLineY = [-Math.abs(a * xMax), Math.abs(a * xMax)];
    
    return [
      {
        x: leftX,
        y: leftY,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = 0 (x < 0)`,
        line: { color: '#6366f1', width: 2 },
        showlegend: false
      },
      {
        x: rightX,
        y: rightY,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${formatNum(a)}x (x ≥ 0)`,
        line: { color: '#6366f1', width: 2 }
      },
      {
        x: [0, 0],
        y: breakLineY,
        type: 'scatter',
        mode: 'lines',
        name: 'Break Point (x=0)',
        line: { 
          color: '#ffd700', 
          width: 1, 
          dash: 'dash' 
        }
      }
    ];
  }, [params.coefficient, params.xRange]);
  
  // ✅ 使用 useMemo 缓存数据
  const traces = useMemo(() => generatePiecewiseData(), [generatePiecewiseData]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <Title>Piecewise Function</Title>
      </Header>

      <Description>
        A piecewise function is defined by different expressions on different intervals of the domain. 
        Adjust the coefficient to see how it affects the shape of each piece.
      </Description>

      <FormulaBox>
        <FormulaTitle>Example Function:</FormulaTitle>
        <Formula>
          f(x) = {'{'}<br/>
          &nbsp;&nbsp;a·x, &nbsp;&nbsp;x ≥ 0<br/>
          &nbsp;&nbsp;0, &nbsp;&nbsp;&nbsp;&nbsp;x &lt; 0<br/>
          {'}'}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={coefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={traces}
            xRange={params.xRange}
            title={`Piecewise Function: f(x) (a = ${params.coefficient.toFixed(1)})`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default PiecewiseFunctions;

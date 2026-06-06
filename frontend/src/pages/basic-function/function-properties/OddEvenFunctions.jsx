// UI Pattern: MultiSectionPlot — multiple function sections (odd/even), each with its own content layout and controls
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
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FunctionSection = styled.div`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  box-shadow: ${({ theme }) => theme?.shadows?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
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
 * 奇偶性函数子页面 - 展示奇函数和偶函数的特性
 */
const OddEvenFunctions = () => {
  // 奇函数参数状态
  const [oddParams, setOddParams] = useState({ 
    a: 1,              // 系数
    b: 0,              // 偏置项
    samplePoint: 2,    // 采样点位置
    xRange: [-5, 5],   // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 偶函数参数状态
  const [evenParams, setEvenParams] = useState({
    a: 1,              // 系数
    b: 0,              // 偏置项
    xRange: [-5, 5],   // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 奇函数参数配置 - 分组版本
  const oddCoefficientConfig = [
    { name: 'a', label: 'Coefficient (a)', min: -5, max: 5, step: 0.1 },
    { name: 'b', label: 'Offset (b)', min: -10, max: 10, step: 0.5 }
  ];

  const oddAuxiliaryConfig = [
    { name: 'samplePoint', label: 'Sample Point (x)', min: 0.5, max: 4, step: 0.1 }
  ];

  const oddPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const oddViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 0.5, default: [-5, 5] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const oddLegendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const oddCommonConfig = [
    ...oddLegendPositionConfig,
    ...oddPlotStyleConfig,
    ...oddViewRangeConfig
  ];

  // 偶函数参数配置 - 分组版本
  const evenCoefficientConfig = [
    { name: 'a', label: 'Coefficient (a)', min: -5, max: 5, step: 0.1 },
    { name: 'b', label: 'Offset (b)', min: -10, max: 10, step: 0.5 }
  ];

  const evenPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const evenViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 0.5, default: [-5, 5] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const evenLegendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const evenCommonConfig = [
    ...evenLegendPositionConfig,
    ...evenPlotStyleConfig,
    ...evenViewRangeConfig
  ];

  // ✅ 新增：奇函数数据生成逻辑
  const generateOddData = useCallback(() => {
    const { a, b, samplePoint } = oddParams;
    const xMin = oddParams.xRange[0];
    const xMax = oddParams.xRange[1];
    const numPoints = 500;
    
    // ✅ 新增：格式化数值显示（1位小数）
    const formatNum = (num) => Number(num).toFixed(1);
    
    // 生成主曲线：f(x) = ax³ + b
    const xValues = [];
    const yValues = [];
    const step = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = a * Math.pow(x, 3) + b;
      xValues.push(x);
      yValues.push(y);
    }
    
    // 计算示例点
    const sampleY = a * Math.pow(samplePoint, 3) + b;
    const oppositeX = -samplePoint;
    const oppositeY = a * Math.pow(oppositeX, 3) + b;
    
    return [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${formatNum(a)}x³ + ${formatNum(b)}`,
        line: { color: '#6366f1', width: 2 }
      },
      {
        x: [samplePoint],
        y: [sampleY],
        type: 'scatter',
        mode: 'markers',
        name: `P(${formatNum(samplePoint)}, ${formatNum(sampleY)})`,
        marker: { 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 1 }
        }
      },
      {
        x: [oppositeX],
        y: [oppositeY],
        type: 'scatter',
        mode: 'markers',
        name: `P'(${formatNum(oppositeX)}, ${formatNum(oppositeY)})`,
        marker: { 
          color: '#ffd700', 
          symbol: 'circle',
          line: { color: '#fff', width: 1 }
        }
      },
      {
        x: [samplePoint, oppositeX],
        y: [sampleY, oppositeY],
        type: 'scatter',
        mode: 'lines',
        name: 'Connection Line',
        line: { color: '#ffd700', width: 1, dash: 'dash' }
      }
    ];
  }, [oddParams.a, oddParams.b, oddParams.samplePoint, oddParams.xRange]);
  
  // ✅ 新增：偶函数数据生成逻辑
  const generateEvenData = useCallback(() => {
    const { a, b } = evenParams;
    const xMin = evenParams.xRange[0];
    const xMax = evenParams.xRange[1];
    const numPoints = 500;
    
    // ✅ 新增：格式化数值显示（1位小数）
    const formatNum = (num) => Number(num).toFixed(1);
    
    // 生成主曲线：f(x) = ax² + b
    const xValues = [];
    const yValues = [];
    const step = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = a * Math.pow(x, 2) + b;
      xValues.push(x);
      yValues.push(y);
    }
    
    // 对称轴（y轴）
    const maxY = Math.max(...yValues);
    const minY = Math.min(...yValues);
    
    return [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${formatNum(a)}x² + ${formatNum(b)}`,
        line: { color: '#8b5cf6', width: 2 }
      },
      {
        x: [0, 0],
        y: [minY - 1, maxY + 1],
        type: 'scatter',
        mode: 'lines',
        name: 'Axis of Symmetry (x=0)',
        line: { 
          color: '#ffd700', 
          width: 1, 
          dash: 'dash'
        }
      }
    ];
  }, [evenParams.a, evenParams.b, evenParams.xRange]);
  
  // ✅ 使用 useMemo 缓存数据
  const oddTraces = useMemo(() => generateOddData(), [generateOddData]);
  const evenTraces = useMemo(() => generateEvenData(), [generateEvenData]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitle>Odd & Even Functions</SectionTitle>
      </Header>
      
      <SectionDescription>
        Explore the symmetry properties of functions. An odd function satisfies f(-x) = -f(x) and is symmetric about the origin. 
        An even function satisfies f(-x) = f(x) and is symmetric about the y-axis.
      </SectionDescription>

      {/* 奇函数部分 */}
      <SectionTitle> Odd Function: f(x) = ax³</SectionTitle>
      <SectionDescription>
        Odd functions are symmetric about the origin. When you rotate the graph 180° around the origin, it looks the same.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 奇函数参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={oddParams}
              onChange={setOddParams}
              config={oddCoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="Auxiliary Lines">
            <ParameterControls
              parameters={oddParams}
              onChange={setOddParams}
              config={oddAuxiliaryConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={oddParams}
              onChange={setOddParams}
              config={oddCommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={oddTraces}
            xRange={oddParams.xRange}
            title={`Odd Function: f(x) = ${oddParams.a.toFixed(1)}x³ + ${oddParams.b.toFixed(1)}`}
            showExportButton={false}
            plotStyle={oddParams.plotStyle}
            aspectRatio={oddParams.aspectRatio}
            legendPosition={oddParams.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>

      {/* 偶函数部分 */}
      <SectionTitle style={{ marginTop: '2rem' }}>🟣 Even Function: f(x) = ax²</SectionTitle>
      <SectionDescription>
        Even functions are symmetric about the y-axis. The left side is a mirror image of the right side.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 偶函数参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={evenParams}
              onChange={setEvenParams}
              config={evenCoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={evenParams}
              onChange={setEvenParams}
              config={evenCommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={evenTraces}
            xRange={evenParams.xRange}
            title={`Even Function: f(x) = ${evenParams.a.toFixed(1)}x² + ${evenParams.b.toFixed(1)}`}
            showExportButton={false}
            plotStyle={evenParams.plotStyle}
            aspectRatio={evenParams.aspectRatio}
            legendPosition={evenParams.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default OddEvenFunctions;

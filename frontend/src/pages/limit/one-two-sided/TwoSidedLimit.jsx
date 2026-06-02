import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';

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

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '0.25rem'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    color: white;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
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

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.inputBg || '#334155'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 18px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
  font-weight: bold;
`;

/**
 * Two-Sided Limit - Continuous function showing left and right limits are equal
 * f(x) = (x²-1)/(x-1), which simplifies to x+1 for x ≠ 1
 */
const TwoSidedLimit = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    xRange: [-1, 3],     // X轴范围（围绕x=1）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成连续函数数据（有理函数，在 x=1 处有可去间断点）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-1, 3];
    const numPoints = 200;
    
    const traces = [];
    
    // ✅ 先计算函数的 Y 范围，用于确定垂直辅助线的长度
    let minY = Infinity;
    let maxY = -Infinity;
    
    // 遍历 X 范围，计算函数的最小和最大值
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      if (Math.abs(x - 1) > 0.01) { // 避免接近 1
        const y = (x * x - 1) / (x - 1); // f(x) = x+1
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    
    // 添加一些边距，确保辅助线稍微超出函数范围
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;
    
    // ✅ 将数据分为两部分：x < 1 和 x > 1（避免在 x=1 处连接）
    // 第一部分：x < 1
    if (xMin < 1) {
      const xValuesLeft = [];
      const yValuesLeft = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((Math.min(1, xMax) - xMin) * i) / (numPoints / 2);
        if (Math.abs(x - 1) > 0.01) { // 避免接近 1
          xValuesLeft.push(x);
          // f(x) = (x²-1)/(x-1) = x+1 (for x ≠ 1)
          yValuesLeft.push((x * x - 1) / (x - 1));
        }
      }
      
      if (xValuesLeft.length > 0) {
        traces.push({
          x: xValuesLeft,
          y: yValuesLeft,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x)',
          line: { 
            color: '#6366f1', 
            width: 2.5
          }
        });
      }
    }
    
    // 第二部分：x > 1
    if (xMax > 1) {
      const xValuesRight = [];
      const yValuesRight = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = Math.max(1, xMin) + ((xMax - Math.max(1, xMin)) * i) / (numPoints / 2);
        if (Math.abs(x - 1) > 0.01) { // 避免接近 1
          xValuesRight.push(x);
          // f(x) = (x²-1)/(x-1) = x+1 (for x ≠ 1)
          yValuesRight.push((x * x - 1) / (x - 1));
        }
      }
      
      if (xValuesRight.length > 0) {
        traces.push({
          x: xValuesRight,
          y: yValuesRight,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x)',
          line: { 
            color: '#6366f1', 
            width: 2.5
          }
        });
      }
    }
    
    // ✅ 添加垂直辅助线（x=1，可去间断点）- 使用动态计算的 Y 范围
    traces.push({
      x: [1, 1],
      y: [auxYMin, auxYMax],
      type: 'scatter',
      mode: 'lines',
      name: 'x=1',
      line: { 
        color: '#ffd700', // 金黄色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    // ✅ 添加水平辅助线（y=2，极限值）
    traces.push({
      x: [xMin, xMax],
      y: [2, 2],
      type: 'scatter',
      mode: 'lines',
      name: 'lim: 2',
      line: { 
        color: '#ffd700', // 金黄色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    // ✅ 添加可去间断点 (1, 2) - 空心点
    traces.push({
      x: [1],
      y: [2],
      type: 'scatter',
      mode: 'markers+text',
      name: 'Hole',
      marker: { 
        size: 12, 
        color: '#ef4444', // 红色
        symbol: 'circle-open',
        line: {
          color: '#ef4444',
          width: 2
        }
      },
      text: ['Hole at (1, 2)'],
      textposition: 'top center',
      textfont: {
        size: 12,
        color: '#ef4444'
      }
    });
    
    return traces;
  }, [params]);

  // 参数配置
  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -2,
      max: 4,
      step: 0.5,
      default: [-1, 3]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Two-Sided Limit</SectionTitle>
      </Header>
      
      <SectionDescription>
        Explore two-sided limits using a continuous rational function. 
        Observe how the left-hand limit and right-hand limit approach the same value as x → 1.
      </SectionDescription>

      <SectionTitle>Rational Function Example</SectionTitle>
      
      <FormulaBox>
        <Formula>
          f(x) = (x² - 1) / (x - 1)<br/><br/>
          Simplifies to: f(x) = x + 1, &nbsp;&nbsp;x ≠ 1
        </Formula>
      </FormulaBox>
      
      <SectionDescription>
        <strong>Left-hand limit:</strong> lim<sub>x→1⁻</sub> f(x) = 2<br/>
        <strong>Right-hand limit:</strong> lim<sub>x→1⁺</sub> f(x) = 2<br/><br/>
        Since both limits are <strong>equal</strong>, the two-sided limit exists:<br/>
        <strong>lim<sub>x→1</sub> f(x) = 2</strong>
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          {/* 显示原函数图，带辅助线和关键点 */}
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Rational Function: Left = Right Limit`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default TwoSidedLimit;

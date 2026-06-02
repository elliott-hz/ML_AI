import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../components/visualization/LimitPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';

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
 * Reciprocal Function Limit - y = a/x, lim(x→∞) = 0
 */
const ReciprocalFunctionLimit = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,      // 系数，用于调整函数缩放
    xRange: [-10, 10],   // X轴范围（根据参考图调整）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成连续函数数据（注意：需要处理 x=0 的不连续点）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-10, 10];
    const coefficient = params.coefficient || 1;
    const numPoints = 200;
    
    const traces = [];
    
    // ✅ 将数据分为两部分：负半轴和正半轴（避免在 x=0 处连接）
    // 第一部分：负半轴
    if (xMin < 0) {
      const xValuesNeg = [];
      const yValuesNeg = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((Math.min(0, xMax) - xMin) * i) / (numPoints / 2);
        if (Math.abs(x) > 0.01) { // 避免接近 0
          xValuesNeg.push(x);
          yValuesNeg.push(coefficient / x);
        }
      }
      
      if (xValuesNeg.length > 0) {
        traces.push({
          x: xValuesNeg,
          y: yValuesNeg,
          type: 'scatter',
          mode: 'lines',
          name: `${coefficient.toFixed(1)}/x`,
          line: { 
            color: '#6366f1', 
            width: 2.5
          }
        });
      }
    }
    
    // 第二部分：正半轴
    if (xMax > 0) {
      const xValuesPos = [];
      const yValuesPos = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = Math.max(0, xMin) + ((xMax - Math.max(0, xMin)) * i) / (numPoints / 2);
        if (Math.abs(x) > 0.01) { // 避免接近 0
          xValuesPos.push(x);
          yValuesPos.push(coefficient / x);
        }
      }
      
      if (xValuesPos.length > 0) {
        traces.push({
          x: xValuesPos,
          y: yValuesPos,
          type: 'scatter',
          mode: 'lines',
          name: `${coefficient.toFixed(1)}/x`,
          line: { 
            color: '#6366f1', 
            width: 2.5
          }
        });
      }
    }
    
    // ✅ 添加收敛辅助线（y=0）
    traces.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'lim: 0',
      line: { 
        color: '#ffd700', // 金黄色，会被 styledData 自动调整为主题色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    return traces;
  }, [params]);

  // 参数配置
  const coefficientConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.5,
      max: 5,
      step: 0.1,
      type: 'slider'
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
        <SectionTitle>Elementary Function: Reciprocal</SectionTitle>
      </Header>

      <SectionDescription>
        Observe how the reciprocal function behaves as x approaches different values.
        Notice the vertical asymptote at x = 0 and how the function approaches 0 as x → ±∞.
      </SectionDescription>

      <SectionTitle>Function: y = a/x</SectionTitle>

      <FormulaBox>
        <Formula>
          f(x) = a/x<br/>
          As x → ±∞, f(x) → 0
        </Formula>
      </FormulaBox>

      <SectionDescription>
        Adjust the coefficient (a) and X range to explore both branches of the function.
        Observe the behavior near the vertical asymptote and at infinity.
      </SectionDescription>

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
          {/* 只显示原函数图 */}
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = ${params.coefficient.toFixed(1)}/x`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ReciprocalFunctionLimit;

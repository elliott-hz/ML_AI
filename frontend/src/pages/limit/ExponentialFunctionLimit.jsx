import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter from '../../components/visualization/LimitPlotter';
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
 * Exponential Function Limit - y = a·e^(-x), lim(x→+∞) = 0
 */
const ExponentialFunctionLimit = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    base: Math.E,        // 底数，默认使用自然常数 e ≈ 2.71828
    xRange: [-5, 5],     // X轴范围（根据参考图调整）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 生成连续函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-5, 5];
    const base = params.base || Math.E;
    const numPoints = 200;
    
    const xValues = [];
    const yValues = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValues.push(x);
      yValues.push(base * Math.exp(-x));
    }
    
    const traces = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)',
      line: { 
        color: '#6366f1', 
        width: 2.5
      }
    }];
    
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
  const baseConfig = [
    {
      name: 'base',
      label: 'Base (a)',
      min: 1.5,
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
      min: -10,
      max: 10,
      step: 1,
      default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Elementary Function: Exponential Decay</SectionTitle>
      </Header>
      
      <SectionDescription>
        Observe how the exponential decay function behaves as x approaches different values. 
        By examining the graph, you can see that as x → +, the function value approaches 0.
      </SectionDescription>

      <SectionTitle>Function: y = a·e<sup>-x</sup></SectionTitle>
      
      <FormulaBox>
        <Formula>
          f(x) = a·e<sup>-x</sup><br/>
          As x → +∞, f(x) → 0
        </Formula>
      </FormulaBox>
      
      <SectionDescription>
        Adjust the coefficient (a) and X range to explore how the function behaves near different points. 
        Notice how the curve approaches the horizontal asymptote at y = 0.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={baseConfig}
            />
          </ParameterSection>

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={plotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={viewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          {/* 只显示原函数图 */}
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = a·e⁻ˣ`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ExponentialFunctionLimit;

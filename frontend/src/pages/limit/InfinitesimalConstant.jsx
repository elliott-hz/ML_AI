import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter from '../../components/visualization/LimitPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';

// Styled Components
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

const BackButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => `${theme?.spacing?.sm || '0.5rem'} ${theme?.spacing?.md || '1rem'}`};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateX(-2px);
  }
`;

const SectionTitle = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
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
 * Infinitesimal Property 3: Constant × Infinitesimal
 * Shows that c·x → 0 as x → 0 for any constant c
 */
const InfinitesimalConstant = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    constant: 5,         // 常数 c ∈ [1, 10]
    xRange: [-2, 2],     // X轴范围（围绕x=0）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 参数配置
  const paramConfig = [
    {
      name: 'constant',
      label: 'Constant c',
      type: 'slider',
      min: 1,
      max: 10,
      step: 0.5,
      default: 5
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
      min: -5,
      max: 5,
      step: 0.5,
      default: [-2, 2]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
          ← Back to Limit
        </BackButton>
        <SectionTitle>Infinitesimal Property 3: Constant × Infinitesimal</SectionTitle>
      </Header>
      
      <SectionDescription>
        A constant multiple of an infinitesimal is still an infinitesimal. 
        Adjust the constant c to see how scaling affects the slope, but the limit remains 0.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          If α(x) = x is infinitesimal: lim<sub>x→0</sub> x = 0<br/>
          And c is a constant: c ∈ ℝ<br/><br/>
          Then g(x) = c·α(x) = c·x<br/><br/>
          lim<sub>x→0</sub> g(x) = lim<sub>x→0</sub>(c·x) = c·0 = 0
        </Formula>
      </FormulaBox>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Parameters">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={paramConfig}
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
          <LimitPlotter
            sequenceType="original_function"
            parameters={{ ...params, funcName: 'infinitesimal_constant' }}
            xRange={params.xRange}
            title={`Constant × Infinitesimal: ${params.constant}·x`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            showAuxiliaryLines={true}
            auxiliaryX={0}
            auxiliaryY={0}
            showPoints={[
              { x: 0, y: 0, label: 'lim = 0' }
            ]}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfinitesimalConstant;

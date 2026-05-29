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
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ControlsPanel = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  height: fit-content;
`;

const PlotPanel = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

/**
 * Infinitesimal Property 1: Sum of Finite Infinitesimals
 * Shows that x + x² + x³ → 0 as x → 0
 */
const InfinitesimalSum = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    xRange: [-2, 2],     // X轴范围（围绕x=0）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 参数配置
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
        <SectionTitle>Infinitesimal Property 1: Sum</SectionTitle>
      </Header>
      
      <SectionDescription>
        The sum of a finite number of infinitesimals is still an infinitesimal. 
        Observe how each individual term (x, x², x³) approaches 0 as x → 0, 
        and their sum also approaches 0.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          If α₁(x) = x, α₂(x) = x², α₃(x) = x³ are infinitesimals:<br/><br/>
          Then β(x) = α₁ + α₂ + α₃ = x + x² + x³<br/><br/>
          lim<sub>x→0</sub> β(x) = lim<sub>x→0</sub>(x + x² + x³) = 0
        </Formula>
      </FormulaBox>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
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
            parameters={{ ...params, funcName: 'infinitesimal_sum' }}
            xRange={params.xRange}
            title={`Sum of Infinitesimals: x + x² + x³`}
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

export default InfinitesimalSum;

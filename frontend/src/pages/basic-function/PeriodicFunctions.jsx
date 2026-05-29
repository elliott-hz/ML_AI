import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter from '../../components/visualization/FunctionPlotter';
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
 * 周期性函数子页面 - 展示正弦函数的周期性特性
 */
const PeriodicFunctions = () => {
  const navigate = useNavigate();
  
  // 周期函数参数状态
  const [periodicParams, setPeriodicParams] = useState({ 
    a: 1,              // 振幅
    b: 1,              // 频率
    c: 0,              // 相位
    xRange: [-10, 10], // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 周期函数参数配置 - 分组版本
  const periodicCoefficientConfig = [
    { name: 'a', label: 'Amplitude (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Frequency (b)', min: 0.1, max: 5, step: 0.1 },
    { name: 'c', label: 'Phase (c)', min: -Math.PI, max: Math.PI, step: 0.1 }
  ];

  const periodicPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const periodicViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-10, 10] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
          ← Back to Basic Function
        </BackButton>
        <SectionTitle>Periodic Functions</SectionTitle>
      </Header>
      
      <SectionDescription>
        Explore periodic behavior in functions. A periodic function repeats its values at regular intervals called the period. 
        The sine function f(x) = a·sin(bx + c) is a classic example of a periodic function.
      </SectionDescription>

      {/* 周期函数部分 */}
      <SectionTitle> Periodic Function: f(x) = a·sin(bx + c)</SectionTitle>
      <SectionDescription>
        Adjust the amplitude (a), frequency (b), and phase (c) to see how they affect the wave pattern. 
        The period T = 2π/b determines how often the function repeats.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 周期函数参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={periodicParams}
              onChange={setPeriodicParams}
              config={periodicCoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={periodicParams}
              onChange={setPeriodicParams}
              config={periodicPlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={periodicParams}
              onChange={setPeriodicParams}
              config={periodicViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <FunctionPlotter
            functionType="periodic"
            parameters={periodicParams}
            title="Periodic Function: f(x) = a·sin(bx + c)"
            showExportButton={false}
            plotStyle={periodicParams.plotStyle}
            aspectRatio={periodicParams.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default PeriodicFunctions;

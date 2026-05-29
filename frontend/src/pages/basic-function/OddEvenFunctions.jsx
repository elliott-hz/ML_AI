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
  const navigate = useNavigate();
  
  // 奇函数参数状态
  const [oddParams, setOddParams] = useState({ 
    a: 1,              // 系数
    b: 0,              // 偏置项
    samplePoint: 2,    // 采样点位置
    pointSize: 10,     // 点大小
    xRange: [-5, 5],   // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });
  
  // 偶函数参数状态
  const [evenParams, setEvenParams] = useState({ 
    a: 1,              // 系数
    b: 0,              // 偏置项
    xRange: [-5, 5],   // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 奇函数参数配置 - 分组版本
  const oddCoefficientConfig = [
    { name: 'a', label: 'Coefficient (a)', min: -5, max: 5, step: 0.1 },
    { name: 'b', label: 'Offset (b)', min: -10, max: 10, step: 0.5 }
  ];

  const oddAuxiliaryConfig = [
    { name: 'samplePoint', label: 'Sample Point (x)', min: 0.5, max: 4, step: 0.1 },
    { name: 'pointSize', label: 'Point Size', min: 5, max: 20, step: 1 }
  ];

  const oddPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const oddViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 0.5, default: [-5, 5] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
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
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
          ← Back to Basic Function
        </BackButton>
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

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={oddParams}
              onChange={setOddParams}
              config={oddPlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={oddParams}
              onChange={setOddParams}
              config={oddViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <FunctionPlotter
            functionType="odd"
            parameters={oddParams}
            title="Odd Function: f(x) = ax³"
            showExportButton={false}
            plotStyle={oddParams.plotStyle}
            aspectRatio={oddParams.aspectRatio}
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

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={evenParams}
              onChange={setEvenParams}
              config={evenPlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={evenParams}
              onChange={setEvenParams}
              config={evenViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <FunctionPlotter
            functionType="even"
            parameters={evenParams}
            title="Even Function: f(x) = ax²"
            showExportButton={false}
            plotStyle={evenParams.plotStyle}
            aspectRatio={evenParams.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default OddEvenFunctions;

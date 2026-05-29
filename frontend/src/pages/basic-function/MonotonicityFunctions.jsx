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
 * 单调性函数子页面 - 展示单调递增和单调递减函数的特性
 */
const MonotonicityFunctions = () => {
  const navigate = useNavigate();
  
  // 单调递增函数参数状态
  const [increasingParams, setIncreasingParams] = useState({ 
    a: 1,        // 斜率
    b: 0,        // 截距
    x1: -3,      // 第一个点的x坐标
    x2: 3,       // 第二个点的x坐标
    pointSize: 10, // 点大小
    xRange: [-8, 8], // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });
  
  // 单调递减函数参数状态
  const [decreasingParams, setDecreasingParams] = useState({ 
    a: 1,        // 斜率
    b: 0,        // 截距
    x1: -3,      // 第一个点的x坐标
    x2: 3,       // 第二个点的x坐标
    pointSize: 10, // 点大小
    xRange: [-8, 8], // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 单调递增函数参数配置 - 分组版本
  const increasingCoefficientConfig = [
    { name: 'a', label: 'Slope (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Intercept (b)', min: -10, max: 10, step: 0.5 }
  ];

  const increasingAuxiliaryConfig = [
    { name: 'x1', label: 'Point P₁ (x₁)', min: -8, max: 8, step: 0.5 },
    { name: 'x2', label: 'Point P₂ (x₂)', min: -8, max: 8, step: 0.5 },
    { name: 'pointSize', label: 'Point Size', min: 5, max: 20, step: 1 }
  ];

  const increasingPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const increasingViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-8, 8] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  // 单调递减函数参数配置 - 分组版本
  const decreasingCoefficientConfig = [
    { name: 'a', label: 'Slope (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Intercept (b)', min: -10, max: 10, step: 0.5 }
  ];

  const decreasingAuxiliaryConfig = [
    { name: 'x1', label: 'Point P₁ (x₁)', min: -8, max: 8, step: 0.5 },
    { name: 'x2', label: 'Point P₂ (x₂)', min: -8, max: 8, step: 0.5 },
    { name: 'pointSize', label: 'Point Size', min: 5, max: 20, step: 1 }
  ];

  const decreasingPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const decreasingViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-8, 8] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
          ← Back to Basic Function
        </BackButton>
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

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={increasingParams}
              onChange={setIncreasingParams}
              config={increasingPlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={increasingParams}
              onChange={setIncreasingParams}
              config={increasingViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <FunctionPlotter
            functionType="increasing"
            parameters={increasingParams}
            title="Monotonically Increasing: f(x) = ax + b"
            showExportButton={false}
            plotStyle={increasingParams.plotStyle}
            aspectRatio={increasingParams.aspectRatio}
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

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={decreasingParams}
              onChange={setDecreasingParams}
              config={decreasingPlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={decreasingParams}
              onChange={setDecreasingParams}
              config={decreasingViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <FunctionPlotter
            functionType="decreasing"
            parameters={decreasingParams}
            title="Monotonically Decreasing: f(x) = -ax + b"
            showExportButton={false}
            plotStyle={decreasingParams.plotStyle}
            aspectRatio={decreasingParams.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default MonotonicityFunctions;

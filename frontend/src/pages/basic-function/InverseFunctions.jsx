import React, { useState, useMemo, useCallback } from 'react';
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
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
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
 * Inverse Functions 页面 - 反函数可视化
 */
const InverseFunctions = () => {
  const navigate = useNavigate();
  
  const [params, setParams] = useState({
    coefficient: 1,
    xRange: [-5, 5],
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
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
      default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  // ✅ 新增：在页面中定义反函数的数据生成逻辑
  const generateInverseData = useCallback(() => {
    const a = params.coefficient;
    const xMin = params.xRange[0];
    const xMax = params.xRange[1];
    const numPoints = 200;
    
    // 原函数: h(t) = a·t²（t ≥ 0）
    const originalT = [];
    const originalH = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = 0 + ((xMax - 0) * i) / numPoints;
      originalT.push(t);
      originalH.push(a * t * t);
    }
    
    // 反函数: t(h) = √(h/a)（h ≥ 0）
    const inverseH = [];
    const inverseT = [];
    for (let i = 0; i <= numPoints; i++) {
      const h = 0 + ((xMax - 0) * i) / numPoints;
      inverseH.push(h);
      inverseT.push(Math.sqrt(h / a));
    }
    
    // 对称轴 y = x
    const lineX = [xMin, xMax];
    const lineY = [xMin, xMax];
    
    return [
      {
        x: originalT,
        y: originalH,
        type: 'scatter',
        mode: 'lines',
        name: 'Original: h(t) = at²',
        line: { color: '#6366f1', width: 2 }
      },
      {
        x: inverseH,
        y: inverseT,
        type: 'scatter',
        mode: 'lines',
        name: 'Inverse: t(h) = √(h/a)',
        line: { color: '#06b6d4', width: 2 }
      },
      {
        x: lineX,
        y: lineY,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x (symmetry axis)',
        line: { 
          color: '#94a3b8', 
          width: 1, 
          dash: 'dash' 
        }
      }
    ];
  }, [params.coefficient, params.xRange]);
  
  // ✅ 使用 useMemo 缓存数据
  const traces = useMemo(() => generateInverseData(), [generateInverseData]);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
           Back to Basic Function
        </BackButton>
        <Title>Inverse Function</Title>
      </Header>

      <Description>
        An inverse function reverses the operation of the original function. 
        If f(x) maps x to y, then f⁻¹(y) maps y back to x. The graphs are symmetric about the line y = x.
      </Description>

      <FormulaBox>
        <FormulaTitle>Example: Physics Free Fall</FormulaTitle>
        <Formula>
          Original: h = a·t²<br/>
          Inverse: t = √(h/a)
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
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={traces}
            xRange={params.xRange}
            title="Inverse Function: h(t) and t(h)"
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InverseFunctions;

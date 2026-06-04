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

const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const ToggleBtn = styled.button`
  padding: 8px ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ $active, theme }) => ($active ? (theme?.colors?.primary || '#6366f1') : 'transparent')};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? (theme?.colors?.primary || '#6366f1') : (theme?.colors?.inputBg || '#334155')};
  }
`;

/**
 * Trigonometric Function Limit - classic finite limits of trig functions
 *
 *   lim(x→0) sin(kx)/(kx) = 1
 *   lim(x→0) tan(kx)/(kx) = 1
 *   lim(x→0) (1 - cos(kx))/x = 0
 */
const TrigonometricFunctionLimit = () => {
  const navigate = useNavigate();

  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,        // 缩放系数 k
    xRange: [-8, 8],       // X轴范围
    plotStyle: 'medium',   // Plot 样式档位
    aspectRatio: 'auto',   // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('sin');

  // 生成函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-8, 8];
    const k = params.coefficient || 1;
    const numPoints = 400;

    const fnLabel = activeFunction === 'sin' ? `sin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                    activeFunction === 'tan' ? `tan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                    activeFunction === 'cos1' ? `(1-cos(${k.toFixed(1)}x)) / x` :
                    `(1-cos(${k.toFixed(1)}x)) / (${k.toFixed(1)}x)²`;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      let y;

      if (activeFunction === 'sin') {
        y = Math.abs(k * x) > 1e-10 ? Math.sin(k * x) / (k * x) : 1;
      } else if (activeFunction === 'tan') {
        y = Math.abs(k * x) > 1e-10 ? Math.tan(k * x) / (k * x) : 1;
      } else if (activeFunction === 'cos1') {
        y = Math.abs(k * x) > 1e-10 ? (1 - Math.cos(k * x)) / x : 0;
      } else {
        // (1 - cos(kx)) / (kx)²  →  1/2
        y = Math.abs(k * x) > 1e-10 ? (1 - Math.cos(k * x)) / (k * k * x * x) : 0.5;
      }

      xValues.push(x);
      yValues.push(y);
    }

    const traces = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: fnLabel,
      line: {
        color: '#6366f1',
        width: 2.5
      }
    }];

    // 极限参考线
    let limitValue;
    if (activeFunction === 'sin' || activeFunction === 'tan') {
      limitValue = 1;
    } else if (activeFunction === 'cos1') {
      limitValue = 0;
    } else {
      limitValue = 0.5;
    }

    traces.push({
      x: [xMin, xMax],
      y: [limitValue, limitValue],
      type: 'scatter',
      mode: 'lines',
      name: `lim: ${limitValue}`,
      line: {
        color: '#ffd700',
        width: 2,
        dash: 'dash'
      }
    });

    // 垂直参考线 x = 0
    traces.push({
      x: [0, 0],
      y: [limitValue - 2, limitValue + 2],
      type: 'scatter',
      mode: 'lines',
      name: 'x = 0',
      line: {
        color: '#ef4444',
        width: 1,
        dash: 'dot'
      }
    });

    return traces;
  }, [params, activeFunction]);

  // 参数配置
  const coefficientConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (k)',
      min: 0.5,
      max: 3,
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
      default: [-8, 8]
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

  const limitValue = (activeFunction === 'sin' || activeFunction === 'tan') ? 1 :
                     activeFunction === 'cos1' ? 0 : 0.5;
  const k = params.coefficient;

  const functionTitle = activeFunction === 'sin' ? `sin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        activeFunction === 'tan' ? `tan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        activeFunction === 'cos1' ? `(1 - cos(${k.toFixed(1)}x)) / x` :
                        `(1 - cos(${k.toFixed(1)}x)) / (${k.toFixed(1)}x)²`;

  const fnLatex = activeFunction === 'sin' ? `sin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  activeFunction === 'tan' ? `tan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  activeFunction === 'cos1' ? `(1 - cos(${k.toFixed(1)}x)) / x` :
                  `(1 - cos(${k.toFixed(1)}x)) / (${k.toFixed(1)}x)²`;

  const limitLatex = limitValue === 1 ? '1' : limitValue === 0.5 ? '1/2' : '0';

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Trigonometric — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Explore the classic finite limits of trigonometric functions. These limits are foundational
        for deriving derivatives of trigonometric functions in calculus.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'sin'} onClick={() => setActiveFunction('sin')}>
          sin(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'tan'} onClick={() => setActiveFunction('tan')}>
          tan(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'cos1'} onClick={() => setActiveFunction('cos1')}>
          (1 - cos(kx)) / x
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'cos2'} onClick={() => setActiveFunction('cos2')}>
          (1 - cos(kx)) / (kx)²
        </ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          f(x) = {fnLatex}<br/>
          As x → 0, f(x) → {limitLatex}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {activeFunction === 'sin' && 'This is the most important limit in trigonometry. The function sin(x)/x has a removable discontinuity at x = 0 with limit 1.'}
        {activeFunction === 'tan' && 'Similarly to sin(x)/x, this limit follows from tan(x) = sin(x)/cos(x) and the fact that cos(x) → 1 as x → 0.'}
        {activeFunction === 'cos1' && 'The function (1 - cos(x))/x approaches 0 as x → 0, which is essential for deriving the derivative of cos(x).'}
        {activeFunction === 'cos2' && 'This second-order limit (1-cos(x))/x² → 1/2 follows from the Taylor expansion cos(x) = 1 − x²/2 + ... It is foundational for understanding second-order approximations.'}
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
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
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = ${functionTitle}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default TrigonometricFunctionLimit;

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

const QuickSetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
`;

const QuickBtn = styled.button`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  cursor: pointer;
  font-size: 13px;
  font-family: monospace;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    color: #fff;
  }
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
 * Exponential Function Limit — f(x) = a·bˣ
 *
 *   b > 1:  lim(x→-∞) a·bˣ = 0  (horizontal asymptote on the left)
 *   0 < b < 1:  lim(x→+∞) a·bˣ = 0  (horizontal asymptote on the right)
 *   b = 1:  f(x) = a (constant)
 */
const ExponentialFunctionLimit = () => {
  const navigate = useNavigate();

  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,       // 系数 a
    base: 2,              // 底数 b
    xRange: [-5, 5],      // X轴范围
    plotStyle: 'medium',  // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例
    legendPosition: 'top-right'
  });

  // 生成连续函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-5, 5];
    const a = params.coefficient || 1;
    const b = params.base || 2;
    const numPoints = 300;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValues.push(x);
      yValues.push(a * Math.pow(b, x));
    }

    // 底数显示名
    const baseLabel = Math.abs(b - Math.E) < 1e-9 ? 'e' : b.toFixed(1);

    const traces = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: `${a.toFixed(1)}·${baseLabel}ˣ`,
      line: {
        color: '#6366f1',
        width: 2.5
      }
    }];

    // ✅ 水平渐近线 y = 0
    traces.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'lim: 0',
      line: {
        color: '#ffd700',
        width: 2,
        dash: 'dash'
      }
    });

    return traces;
  }, [params]);

  // 参数配置
  const functionConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.1,
      max: 5,
      step: 0.1,
      type: 'slider'
    },
    {
      name: 'base',
      label: 'Base (b)',
      min: 0.1,
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

  const a = params.coefficient;
  const b = params.base;
  const baseLabel = Math.abs(b - Math.E) < 1e-9 ? 'e' : b.toFixed(1);

  // 极限描述
  let limitDesc;
  if (b > 1) {
    limitDesc = `As x → −∞, f(x) → 0  (horizontal asymptote on the left)`;
  } else if (b < 1) {
    limitDesc = `As x → +∞, f(x) → 0  (horizontal asymptote on the right)`;
  } else {
    limitDesc = `f(x) = ${a.toFixed(1)} (constant) — limit everywhere = ${a.toFixed(1)}`;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Exponential — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Observe how the exponential function a·bˣ behaves at its limits.
        The base b determines which side approaches the horizontal asymptote y = 0.
      </SectionDescription>

      <SectionTitle>Function: y = a·b<sup>x</sup></SectionTitle>

      <FormulaBox>
        <Formula>
          f(x) = {a.toFixed(1)}·{baseLabel}<sup>x</sup><br/>
          {limitDesc}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {b > 1
          ? `With b = ${b.toFixed(1)} > 1, the function grows exponentially as x → +∞ and approaches 0 as x → −∞.`
          : b < 1
            ? `With b = ${b.toFixed(1)} < 1, the function decays toward 0 as x → +∞ and grows unbounded as x → −∞.`
            : 'The base is 1, making this a constant function with no interesting limit behavior.'}
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={functionConfig}
            />
          </ParameterSection>

          <QuickSetRow>
            <span>Quick set:</span>
            <QuickBtn onClick={() => setParams(p => ({ ...p, base: Math.E }))}>
              b = e ({Math.E.toFixed(3)})
            </QuickBtn>
          </QuickSetRow>

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
            title={`Function: f(x) = ${a.toFixed(1)}·${baseLabel}ˣ`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ExponentialFunctionLimit;

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
 * Inverse Trigonometric Limit — classic limits of inverse trig functions at x = 0
 *
 *   arcsin(kx)/(kx) → 1   (arcsin x ~ x)
 *   arctan(kx)/(kx) → 1   (arctan x ~ x)
 *   (arccos(kx) − π/2)/(kx) → -1   (arccos x = π/2 − x + o(x))
 */
const InverseTrigonometricLimit = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    coefficient: 1,        // 缩放系数 k
    xRange: [-2, 2],       // X轴范围
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('arcsin');

  // 生成函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-2, 2];
    const k = params.coefficient || 1;
    const numPoints = 400;

    const fnLabel = activeFunction === 'arcsin' ? `arcsin(${k.toFixed(1)}x)` :
                    activeFunction === 'arctan' ? `arctan(${k.toFixed(1)}x)` :
                    `arccos(${k.toFixed(1)}x)-π/2`;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      let y;

      if (activeFunction === 'arcsin') {
        // arcsin(kx)/(kx) — domain: x ∈ [-1/k, 1/k], limit at 0 → 1
        const denom = k * x;
        const arg = k * x;
        y = Math.abs(denom) > 1e-10 && Math.abs(arg) <= 1
          ? Math.asin(arg) / denom
          : Math.abs(arg) <= 1 ? 1 : NaN;
      } else if (activeFunction === 'arctan') {
        // arctan(kx)/(kx) — limit at 0 → 1
        const denom = k * x;
        y = Math.abs(denom) > 1e-10 ? Math.atan(k * x) / denom : 1;
      } else {
        // (arccos(kx) - π/2)/(kx) — limit at 0 → -1
        const denom = k * x;
        const arg = k * x;
        y = Math.abs(denom) > 1e-10 && Math.abs(arg) <= 1
          ? (Math.acos(arg) - Math.PI / 2) / denom
          : Math.abs(arg) <= 1 ? -1 : NaN;
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
    if (activeFunction === 'arcsin' || activeFunction === 'arctan') {
      limitValue = 1;
    } else {
      limitValue = -1;
    }

    // Domain boundary lines for arcsin/arccos
    if (activeFunction !== 'arctan') {
      const bound = 1 / Math.abs(k || 1);
      traces.push({
        x: [bound, bound],
        y: [limitValue - 5, limitValue + 5],
        type: 'scatter',
        mode: 'lines',
        name: `x = ${bound.toFixed(2)}`,
        line: { color: 'rgba(148,163,184,0.4)', width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
      traces.push({
        x: [-bound, -bound],
        y: [limitValue - 5, limitValue + 5],
        type: 'scatter',
        mode: 'lines',
        name: `x = ${(-bound).toFixed(2)}`,
        line: { color: 'rgba(148,163,184,0.4)', width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
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

    // x = 0 reference line
    traces.push({
      x: [0, 0],
      y: [limitValue - 3, limitValue + 3],
      type: 'scatter',
      mode: 'lines',
      name: 'x = 0',
      line: { color: '#ef4444', width: 1, dash: 'dot' },
      hoverinfo: 'skip', showlegend: false
    });

    return traces;
  }, [params, activeFunction]);

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
      default: [-2, 2]
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

  const limitValue = (activeFunction === 'arcsin' || activeFunction === 'arctan') ? 1 : -1;
  const k = params.coefficient;

  const functionTitle = activeFunction === 'arcsin' ? `arcsin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        activeFunction === 'arctan' ? `arctan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        `(arccos(${k.toFixed(1)}x) - π/2) / (${k.toFixed(1)}x)`;

  const fnLatex = activeFunction === 'arcsin' ? `arcsin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  activeFunction === 'arctan' ? `arctan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  `(arccos(${k.toFixed(1)}x) - π/2) / (${k.toFixed(1)}x)`;

  const limitLatex = limitValue === 1 ? '1' : '-1';

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Inverse Trig. — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Explore the classic limits of inverse trigonometric functions at x = 0.
        Like their trigonometric counterparts, these functions satisfy simple asymptotic relations:
        arcsin(x) ~ x, arctan(x) ~ x, and arccos(x) = π/2 − x + o(x) as x → 0.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'arcsin'} onClick={() => setActiveFunction('arcsin')}>
          arcsin(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arctan'} onClick={() => setActiveFunction('arctan')}>
          arctan(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arccos'} onClick={() => setActiveFunction('arccos')}>
          (arccos(kx) − π/2) / (kx)
        </ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          f(x) = {fnLatex}<br/>
          As x → 0, f(x) → {limitLatex}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {activeFunction === 'arcsin' && 'arcsin(x) ~ x as x → 0, so arcsin(kx)/(kx) → 1. This is the inverse counterpart of sin(x)/x → 1, and is used in deriving the derivative (arcsin x)′ = 1/√(1−x²).'}
        {activeFunction === 'arctan' && 'arctan(x) ~ x as x → 0, so arctan(kx)/(kx) → 1. This is equivalent to tan(x)/x → 1 via the inverse relationship, and gives the derivative (arctan x)′ = 1/(1+x²).'}
        {activeFunction === 'arccos' && 'arccos(x) = π/2 − arcsin(x), so its first-order expansion is arccos(x) = π/2 − x + o(x). Hence (arccos(kx)−π/2)/(kx) → −1, consistent with (arccos x)′ = −1/√(1−x²).'}
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
            yTickMode="pi"
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InverseTrigonometricLimit;

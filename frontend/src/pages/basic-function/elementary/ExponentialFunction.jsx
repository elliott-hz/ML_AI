import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/FunctionPlotter';
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
 * Exponential Function 页面 - 指数函数可视化
 * y = a · bˣ
 * Core concept: each unit step in x multiplies the output by the base b.
 */
const ExponentialFunction = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 1.0,
    b: 2.0,
    xRange: [-2, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-left'
  });

  const coefficientConfig = [
    { name: 'a', label: 'Coefficient (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Base (b)', min: 0.1, max: 5, step: 0.1 }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -20, max: 20, step: 1, default: [-2, 5]
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

  const generateData = useCallback(() => {
    const a = params.a;
    const b = params.b;
    const [xMin, xMax] = params.xRange;
    const numPoints = 300;

    // 1. Continuous curve y = a · bˣ
    const xVals = [];
    const yVals = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (xMax - xMin) * i / numPoints;
      xVals.push(x);
      yVals.push(a * Math.pow(b, x));
    }

    const traces = [];

    traces.push({
      x: xVals, y: yVals,
      type: 'scatter', mode: 'lines',
      name: `y = ${a.toFixed(1)} · ${b.toFixed(1)}ˣ`,
      line: { color: '#6366f1', width: 2 }
    });

    // 2. Integer points with y-value labels
    const intStart = Math.ceil(xMin);
    const intEnd = Math.floor(xMax);
    const intX = [];
    const intY = [];
    const intLabels = [];

    for (let x = intStart; x <= intEnd; x++) {
      const y = a * Math.pow(b, x);
      intX.push(x);
      intY.push(y);
      intLabels.push(y.toFixed(2));
    }

    traces.push({
      x: intX, y: intY,
      type: 'scatter', mode: 'markers+text',
      name: 'Integer points',
      text: intLabels,
      textposition: 'top center',
      textfont: { color: '#f59e0b', size: 11, family: 'monospace' },
      marker: { color: '#06b6d4', size: 8, symbol: 'circle' },
      showlegend: false
    });

    // 3. "×b" factor annotations between consecutive integer points
    if (intStart < intEnd) {
      const midX = [];
      const midY = [];
      const factorLabels = [];

      for (let x = intStart; x < intEnd; x++) {
        const y1 = a * Math.pow(b, x);
        const y2 = a * Math.pow(b, x + 1);
        midX.push(x + 0.5);
        midY.push(Math.max(y1, y2) * 1.15);  // place above the higher point
        factorLabels.push(`×${b.toFixed(1)}`);
      }

      traces.push({
        x: midX, y: midY,
        type: 'scatter', mode: 'text',
        name: 'factor',
        text: factorLabels,
        textposition: 'middle center',
        textfont: { color: '#22c55e', size: 13, family: 'monospace', weight: 700 },
        showlegend: false
      });
    }

    return traces;
  }, [params.a, params.b, params.xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const growthDesc = params.b > 1
    ? 'Exponential Growth — each step multiplies by b > 1'
    : params.b < 1
      ? 'Exponential Decay — each step multiplies by b < 1'
      : 'Constant — b = 1, output stays the same';

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
           Back to Basic Function
        </BackButton>
        <Title>Exponential Function</Title>
      </Header>

      <Description>
        The exponential function y = a·bˣ grows by a constant factor at each unit step.
        The base b determines whether the function grows (b &gt; 1), decays (0 &lt; b &lt; 1),
        or stays constant (b = 1). Watch how each integer increment multiplies the output by b.
      </Description>

      <FormulaBox>
        <FormulaTitle>Exponential Growth &amp; Decay</FormulaTitle>
        <Formula>
          y = a · bˣ<br/><br/>
          b &gt; 1 → exponential growth (e.g. 2ˣ: 1 → 2 → 4 → 8 → 16 → ...)<br/>
          b = 1 → constant (e.g. 1ˣ = 1)<br/>
          0 &lt; b &lt; 1 → exponential decay (e.g. 0.5ˣ: 1 → 0.5 → 0.25 → ...)<br/><br/>
          {growthDesc}
        </Formula>
      </FormulaBox>

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
          <FunctionPlotter
            data={traces}
            xRange={params.xRange}
            title={`Exponential: y = ${params.a.toFixed(1)} · ${params.b.toFixed(1)}ˣ`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ExponentialFunction;

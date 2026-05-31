import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DerivativePlotter from '../../components/visualization/DerivativePlotter';
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
 * Derivative of Constants: (C)' = 0
 * Shows f(x) = C as a horizontal line and f'(x) = 0 along the x-axis
 */
const DerivativeConstants = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    C: 5,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto'
  });

  const formatNum = (num) => Number(num).toFixed(1);

  const generateData = useCallback(() => {
    const C = params.C;
    const [xMin, xMax] = params.xRange;
    const numPoints = 200;
    const step = (xMax - xMin) / numPoints;

    // Main function: f(x) = C
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(C);
    }

    // Derivative: f'(x) = 0
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(0);
    }

    const traces = [];

    // 1. Main function f(x) = C
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: `f(x) = ${C.toFixed(1)}`,
      line: { color: '#6366f1', width: 2.5 }
    });

    // 2. Derivative f'(x) = 0
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: "f'(x) = 0",
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    // 3. Annotation: (C)' = 0
    traces.push({
      x: [xMax - (xMax - xMin) * 0.15],
      y: [C - Math.abs(C) * 0.5 - 0.3],
      type: 'scatter', mode: 'text',
      name: 'annotation',
      text: [`(${C.toFixed(1)})' = 0`],
      textfont: { color: '#ef4444', size: 14 },
      showlegend: false
    });

    return traces;
  }, [params]);

  const traces = useMemo(() => generateData(), [generateData]);

  const constantConfig = [
    { name: 'C', label: 'C (constant value)', min: -5, max: 5, step: 0.5 }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -10, max: 10, step: 0.5, default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
           Back to Derivative
        </BackButton>
        <Title>Derivative of a Constant</Title>
      </Header>

      <Description>
        The derivative of any constant function is always zero.
        Since a constant function has no change — its slope is flat everywhere —
        the rate of change at every point is zero.
      </Description>

      <FormulaBox>
        <FormulaTitle>Rule:</FormulaTitle>
        <Formula>
          f(x) = C &nbsp; (C is any constant)<br/><br/>
          f'(x) = (C)' = 0
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Constant Value">
            <ParameterControls parameters={params} onChange={setParams} config={constantConfig} />
          </ParameterSection>

          <ParameterSection title="Plot Style">
            <ParameterControls parameters={params} onChange={setParams} config={plotStyleConfig} />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls parameters={params} onChange={setParams} config={viewRangeConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={traces}
            xRange={params.xRange}
            title={`Derivative of Constant: C = ${params.C.toFixed(1)}`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DerivativeConstants;

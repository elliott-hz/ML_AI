import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../components/visualization/DerivativePlotter';
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
 * Derivative of arccos x: (arccos x)' = -1 / √(1 - x²)
 * Domain: [-1, 1], Range: [0, π]
 * Note: x-axis is numeric (input to arccos), y-axis is in radians (output of arccos)
 */
const DerivativeArccos = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    xRange: [-1.5, 1.5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    const traces = [];

    // f(x) = arccos(x) — defined only on [-1, 1]
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x >= -1 && x <= 1) {
        mainX.push(x);
        mainY.push(Math.acos(x));
      }
    }
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'arccos x',
      line: { color: '#6366f1', width: 2.5 }
    });

    // f'(x) = -1 / √(1 - x²)
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x > -1 && x < 1) {
        derivX.push(x);
        derivY.push(-1 / Math.sqrt(1 - x * x));
      }
    }
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: "-1 / \u221A(1 - x\u00B2) (derivative)",
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params.xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = "(arccos x)' = -1 / \u221A(1 - x\u00B2)";

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -2, max: 2, step: 0.1, default: [-1.5, 1.5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
          Back to Derivative
        </BackButton>
        <Title>Arccosine Function</Title>
      </Header>

      <Description>
        The derivative of arccos x is -1/√(1 - x²). The negative sign makes arccos x strictly decreasing
        over its domain. Near x = ±1, the derivative blows up to -∞, matching the vertical tangents.
      </Description>

      <FormulaBox>
        <FormulaTitle>Derivative of Arccosine:</FormulaTitle>
        <Formula>
          f(x) = arccos x &nbsp;&nbsp;x ∈ [-1, 1]<br/><br/>
          f'(x) = -1 / √(1 - x²)
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={traces}
            xRange={params.xRange}
            title={formulaInTitle}
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

export default DerivativeArccos;

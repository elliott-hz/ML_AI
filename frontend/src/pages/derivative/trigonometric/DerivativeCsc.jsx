import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
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

const ASYMPTOTE_EPS = 0.05;
const Y_CLAMP = 500;

/**
 * Derivative of csc x: (csc x)' = -csc x · cot x
 */
const DerivativeCsc = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    piXRange: [-2, 2],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const xRange = [params.piXRange[0] * Math.PI, params.piXRange[1] * Math.PI];
  const yRange = [-10, 10];

  const generateData = useCallback(() => {
    const [xMin, xMax] = xRange;
    const numPoints = 800;
    const step = (xMax - xMin) / numPoints;

    // f(x) = csc x = 1/sin x, asymptotes at x = kπ
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const shifted = (x % Math.PI + Math.PI) % Math.PI;
      const minDist = Math.min(shifted, Math.PI - shifted);
      if (minDist < ASYMPTOTE_EPS) {
        mainX.push(null);
        mainY.push(null);
      } else {
        const y = 1 / Math.sin(x);
        if (Math.abs(y) > Y_CLAMP) {
          mainX.push(null);
          mainY.push(null);
        } else {
          mainX.push(x);
          mainY.push(y);
        }
      }
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'csc x',
      line: { color: '#6366f1', width: 2.5 }
    });

    // f'(x) = -csc x · cot x
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const shifted = (x % Math.PI + Math.PI) % Math.PI;
      const minDist = Math.min(shifted, Math.PI - shifted);
      if (minDist < ASYMPTOTE_EPS) {
        derivX.push(null);
        derivY.push(null);
      } else {
        const y = -(1 / Math.sin(x)) * (Math.cos(x) / Math.sin(x));
        if (Math.abs(y) > Y_CLAMP) {
          derivX.push(null);
          derivY.push(null);
        } else {
          derivX.push(x);
          derivY.push(y);
        }
      }
    }

    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: '-csc x·cot x (derivative)',
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params, xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = '(csc x)\' = -csc x·cot x';

  const viewRangeConfig = [
    {
      name: 'piXRange', label: 'X (π)', type: 'range',
      min: -4, max: 4, step: 0.25, default: [-2, 2]
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
        <Title>Cosecant Function</Title>
      </Header>

      <Description>
        The derivative of csc x is −csc x · cot x. The negative sign flips the slope pattern compared to sec.
        Vertical asymptotes occur at x = kπ, shared by both the function and its derivative.
      </Description>

      <FormulaBox>
        <FormulaTitle>Derivative of Cosecant:</FormulaTitle>
        <Formula>
          f(x) = csc x = 1 / sin x<br/><br/>
          f'(x) = −csc x · cot x = −cos x / sin²x
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
            xRange={xRange}
            yRange={yRange}
            title={formulaInTitle}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            xTickMode="pi"
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DerivativeCsc;

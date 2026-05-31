import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter from '../../components/visualization/LimitPlotter';
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

/**
 * Jump Discontinuity — limit does not exist at x₀
 * Piecewise: f(x) = L when x < x₀, f(x) = R when x ≥ x₀
 */
const DiscontinuityJump = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    L: 1.0,
    R: 0.5,
    x0: 0.0,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto'
  });

  const generateData = useCallback(() => {
    const { L, R, x0, xRange } = params;
    const [xMin, xMax] = xRange;
    const numPoints = 200;
    const traces = [];

    // Left branch: x < x0, y = L
    if (xMin < x0) {
      const leftX = [];
      const leftY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((x0 - xMin) * i) / (numPoints / 2);
        if (x < x0 - 0.01) {
          leftX.push(x);
          leftY.push(L);
        }
      }
      if (leftX.length > 0) {
        traces.push({
          x: leftX, y: leftY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${L.toFixed(1)} (x < x₀)`,
          line: { color: '#3b82f6', width: 2.5 }
        });
      }
    }

    // Right branch: x ≥ x0, y = R
    if (xMax > x0) {
      const rightX = [];
      const rightY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = x0 + ((xMax - x0) * i) / (numPoints / 2);
        rightX.push(x);
        rightY.push(R);
      }
      if (rightX.length > 0) {
        traces.push({
          x: rightX, y: rightY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${R.toFixed(1)} (x ≥ x₀)`,
          line: { color: '#22c55e', width: 2.5 }
        });
      }
    }

    // Vertical line at x0 connecting L and R
    const auxYMin = Math.min(L, R) - 0.5;
    const auxYMax = Math.max(L, R) + 0.5;
    traces.push({
      x: [x0, x0], y: [L, R],
      type: 'scatter', mode: 'lines',
      name: `jump: ${(L - R).toFixed(1)}`,
      line: { color: '#b45309', width: 2, dash: 'dash' }
    });

    // Hollow circle at (x0, L) — the left limit value (not the actual point)
    traces.push({
      x: [x0], y: [L],
      type: 'scatter', mode: 'markers',
      name: `lim(x→x₀⁻) = ${L.toFixed(1)}`,
      marker: {
        size: 12, color: '#3b82f6',
        symbol: 'circle-open',
        line: { color: '#3b82f6', width: 2 }
      }
    });

    // Filled circle at (x0, R) — the actual function value
    traces.push({
      x: [x0], y: [R],
      type: 'scatter', mode: 'markers+text',
      name: `f(x₀) = ${R.toFixed(1)}`,
      marker: {
        size: 12, color: '#22c55e',
        symbol: 'circle',
        line: { color: '#22c55e', width: 2 }
      },
      text: [`f(x₀) = ${R.toFixed(1)}`],
      textposition: 'bottom center',
      textfont: { size: 12, color: '#22c55e' }
    });

    return traces;
  }, [params]);

  const paramConfig = [
    { name: 'L', label: 'L (left)', min: -3.0, max: 3.0, step: 0.1 },
    { name: 'R', label: 'R (right)', min: -3.0, max: 3.0, step: 0.1 },
    { name: 'x0', label: 'x₀', min: -2.0, max: 2.0, step: 0.1 }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -5, max: 5, step: 0.5, default: [-3, 3]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  const jumpSize = params.L - params.R;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/continuity')}>
           Back to Continuity
        </BackButton>
        <SectionTitle>Discontinuity: Limit Does Not Exist at x₀</SectionTitle>
      </Header>

      <SectionDescription>
        The left-hand limit and right-hand limit at x₀ are <strong>different</strong>,
        so the two-sided limit does not exist. This is called a <strong>jump discontinuity</strong>.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          f(x) = {'{'}<br/>
          &nbsp;&nbsp;L = {params.L.toFixed(1)}, &nbsp;&nbsp;x &lt; x₀ = {params.x0.toFixed(1)}<br/>
          &nbsp;&nbsp;R = {params.R.toFixed(1)}, &nbsp;&nbsp;x ≥ x₀ = {params.x0.toFixed(1)}<br/>
          {'}'}<br/><br/>
          lim(x→x₀⁻) f(x) = {params.L.toFixed(1)}<br/>
          lim(x→x₀⁺) f(x) = {params.R.toFixed(1)}<br/>
          lim(x→x₀) f(x) <strong>does not exist</strong> ✗<br/>
          Jump size = |L - R| = {Math.abs(jumpSize).toFixed(1)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Parameters">
            <ParameterControls parameters={params} onChange={setParams} config={paramConfig} />
          </ParameterSection>
          <ParameterSection title="Plot Style">
            <ParameterControls parameters={params} onChange={setParams} config={plotStyleConfig} />
          </ParameterSection>
          <ParameterSection title="View Range">
            <ParameterControls parameters={params} onChange={setParams} config={viewRangeConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={generateData()}
            xRange={params.xRange}
            title={`Jump Discontinuity at x₀ = ${params.x0.toFixed(1)}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DiscontinuityJump;

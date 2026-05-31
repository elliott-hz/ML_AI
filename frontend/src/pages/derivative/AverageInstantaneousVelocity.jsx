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
 * Average Velocity → Instantaneous Velocity
 * Demonstrates how the derivative arises from the limit of average velocity
 * s(t) = a·t² + b·t + c, v̄ = Δs/Δt, v(t₀) = lim(Δt→0) Δs/Δt = 2at₀ + b
 */
const AverageInstantaneousVelocity = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 0.5,
    b: 1.0,
    c: 0.0,
    t0: 1.0,
    dt: 1.0,
    xRange: [0, 4],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const formatNum = (num) => Number(num).toFixed(2);

  // Position function
  const s = useCallback((t) => params.a * t * t + params.b * t + params.c, [params.a, params.b, params.c]);
  // True instantaneous velocity (derivative)
  const vInstant = useCallback((t) => 2 * params.a * t + params.b, [params.a, params.b]);

  const generateData = useCallback(() => {
    const a = params.a;
    const b = params.b;
    const c = params.c;
    const t0 = params.t0;
    const dt = params.dt;
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;

    const sFunc = (t) => a * t * t + b * t + c;
    const vFunc = (t) => 2 * a * t + b;

    // Main curve: s(t)
    const step = (xMax - xMin) / numPoints;
    const curveX = [];
    const curveY = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = xMin + i * step;
      curveX.push(t);
      curveY.push(sFunc(t));
    }

    const s0 = sFunc(t0);
    const s1 = sFunc(t0 + dt);
    const ds = s1 - s0;
    const vAvg = ds / dt;
    const vInst = vFunc(t0);

    const traces = [];

    // 1. Main curve s(t)
    traces.push({
      x: curveX, y: curveY,
      type: 'scatter', mode: 'lines',
      name: `s(t) = ${a.toFixed(1)}t² + ${b.toFixed(1)}t + ${c.toFixed(1)}`,
      line: { color: '#6366f1', width: 2.5 }
    });

    // 2. Secant line (average velocity) — green dashed
    const secantExtend = 2;
    traces.push({
      x: [t0 - secantExtend, t0 + dt + secantExtend],
      y: [s0 - secantExtend * vAvg, s1 + secantExtend * vAvg],
      type: 'scatter', mode: 'lines',
      name: `Secant (v̄ = ${vAvg.toFixed(2)})`,
      line: { color: '#22c55e', width: 2, dash: 'dash' }
    });

    // 3. Tangent line (instantaneous velocity) — cyan dashed
    traces.push({
      x: [t0 - secantExtend, t0 + secantExtend],
      y: [s0 - secantExtend * vInst, s0 + secantExtend * vInst],
      type: 'scatter', mode: 'lines',
      name: `Tangent (v = ${vInst.toFixed(2)})`,
      line: { color: '#06b6d4', width: 2, dash: 'dash' }
    });

    // 4. Horizontal auxiliary line (Δt)
    traces.push({
      x: [t0, t0 + dt],
      y: [s0, s0],
      type: 'scatter', mode: 'lines',
      name: 'Δt',
      line: { color: '#ffd700', width: 1.5, dash: 'dash' }
    });

    // 5. Vertical auxiliary line (Δs)
    traces.push({
      x: [t0 + dt, t0 + dt],
      y: [s0, s1],
      type: 'scatter', mode: 'lines',
      name: 'Δs',
      line: { color: '#ffd700', width: 1.5, dash: 'dash' }
    });

    // 6. Δt label
    traces.push({
      x: [(t0 + t0 + dt) / 2],
      y: [s0 - Math.abs(ds) * 0.1 - 0.15],
      type: 'scatter', mode: 'text',
      name: 'Δt Label',
      text: [`Δt = ${dt.toFixed(2)}`],
      textfont: { color: '#3b82f6', size: 13 },
      showlegend: false
    });

    // 7. Δs label
    traces.push({
      x: [t0 + dt + (dt >= 0 ? 0.1 : -0.1)],
      y: [(s0 + s1) / 2],
      type: 'scatter', mode: 'text',
      name: 'Δs Label',
      text: [`Δs = ${ds.toFixed(2)}`],
      textfont: { color: '#22c55e', size: 13 },
      showlegend: false
    });

    // 8. Point A at (t₀, s(t₀))
    traces.push({
      x: [t0], y: [s0],
      type: 'scatter', mode: 'markers+text',
      name: 'A (t₀, s(t₀))',
      marker: { color: '#3b82f6', size: 10, symbol: 'circle' },
      text: ['A'],
      textposition: 'top right',
      textfont: { color: '#3b82f6', size: 14 }
    });

    // 9. Point B at (t₀+Δt, s(t₀+Δt))
    traces.push({
      x: [t0 + dt], y: [s1],
      type: 'scatter', mode: 'markers+text',
      name: 'B (t₀+Δt, s(t₀+Δt))',
      marker: { color: '#ef4444', size: 10, symbol: 'circle' },
      text: ['B'],
      textposition: 'top right',
      textfont: { color: '#ef4444', size: 14 }
    });

    // 10. t₀ label on x-axis
    traces.push({
      x: [t0],
      y: [Math.min(s0, s1, vInst * t0) - Math.max(Math.abs(ds), 1) * 0.4],
      type: 'scatter', mode: 'text',
      name: 't₀ Label',
      text: ['t₀'],
      textfont: { color: '#ffd700', size: 14 },
      showlegend: false
    });

    return traces;
  }, [params]);

  const traces = useMemo(() => generateData(), [generateData]);

  // Computed values for display
  const s0 = s(params.t0);
  const s1 = s(params.t0 + params.dt);
  const ds = s1 - s0;
  const vAvg = ds / params.dt;
  const vInst = vInstant(params.t0);

  const positionConfig = [
    { name: 'a', label: 'a (t²)', min: 0.1, max: 2.0, step: 0.1 },
    { name: 'b', label: 'b (t)', min: -2.0, max: 2.0, step: 0.1 },
    { name: 'c', label: 'c (const)', min: -1.0, max: 1.0, step: 0.1 }
  ];

  const intervalConfig = [
    { name: 't0', label: 't₀', min: params.xRange[0] + 0.1, max: params.xRange[1] - 0.1, step: 0.05 },
    { name: 'dt', label: 'Δt', min: -2.0, max: 2.0, step: 0.01 }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -1, max: 10, step: 0.5, default: [0, 4]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
           Back to Derivative
        </BackButton>
        <Title>Average Velocity → Instantaneous Velocity</Title>
      </Header>

      <Description>
        The derivative arises from the idea of instantaneous velocity.
        Start with average velocity over an interval, then shrink the interval to zero —
        the limit gives the instantaneous velocity at a single point.
      </Description>

      <FormulaBox>
        <FormulaTitle>From Average to Instantaneous:</FormulaTitle>
        <Formula>
          s(t) = a·t² + b·t + c &nbsp; (position function)<br/><br/>
          Average velocity: v̄ = Δs/Δt = [s(t₀+Δt) − s(t₀)] / Δt<br/><br/>
          Instantaneous velocity: v(t₀) = lim(Δt→0) Δs/Δt = ds/dt = 2a·t₀ + b<br/><br/>
          Drag Δt → 0 and watch the secant (green) converge to the tangent (cyan)!
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Position Function">
            <ParameterControls parameters={params} onChange={setParams} config={positionConfig} />
          </ParameterSection>

          <ParameterSection title="Interval">
            <ParameterControls parameters={params} onChange={setParams} config={intervalConfig} />
          </ParameterSection>

          <ParameterSection title="Legend Position">
            <ParameterControls parameters={params} onChange={setParams} config={legendPositionConfig} />
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
            title="Derivative: Average vs Instantaneous Velocity"
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

export default AverageInstantaneousVelocity;

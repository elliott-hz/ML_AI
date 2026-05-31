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
 * Removable Discontinuity — lim f(x) ≠ f(x₀)
 * f(x) = ax + b for x ≠ x₀, but f(x₀) = c (a different value)
 */
const DiscontinuityRemovable = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 1.0,
    b: 0.0,
    x0: 0.0,
    c: 2.0,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto'
  });

  const generateData = useCallback(() => {
    const { a, b, x0, c, xRange } = params;
    const [xMin, xMax] = xRange;
    const numPoints = 500;
    const traces = [];

    // f(x) = ax + b
    const f = (x) => a * x + b;
    const limitValue = f(x0);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      const y = f(x);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    // Also account for the isolated point c
    if (c < minY) minY = c;
    if (c > maxY) maxY = c;

    const padding = Math.max((maxY - minY) * 0.1, 0.3);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;

    // Draw the line in two parts to leave a gap at x0
    // Left part: x < x0
    if (xMin < x0) {
      const leftX = [];
      const leftY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((x0 - xMin) * i) / (numPoints / 2);
        if (x < x0 - 0.01) {
          leftX.push(x);
          leftY.push(f(x));
        }
      }
      if (leftX.length > 0) {
        traces.push({
          x: leftX, y: leftY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${a.toFixed(1)}x + ${b.toFixed(1)} (x < x₀)`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // Right part: x > x0
    if (xMax > x0) {
      const rightX = [];
      const rightY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = x0 + ((xMax - x0) * i) / (numPoints / 2);
        if (x > x0 + 0.01) {
          rightX.push(x);
          rightY.push(f(x));
        }
      }
      if (rightX.length > 0) {
        traces.push({
          x: rightX, y: rightY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${a.toFixed(1)}x + ${b.toFixed(1)} (x > x₀)`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // Vertical auxiliary line connecting limit value and f(x0)
    traces.push({
      x: [x0, x0],
      y: [Math.min(limitValue, c), Math.max(limitValue, c)],
      type: 'scatter', mode: 'lines',
      name: `gap: ${Math.abs(limitValue - c).toFixed(1)}`,
      line: { color: '#ffd700', width: 2, dash: 'dash' }
    });

    // Hollow circle at (x0, limitValue) — the "true" limit point
    traces.push({
      x: [x0], y: [limitValue],
      type: 'scatter', mode: 'markers+text',
      name: `lim: ${limitValue.toFixed(1)}`,
      marker: {
        size: 12, color: '#3b82f6',
        symbol: 'circle-open',
        line: { color: '#3b82f6', width: 2 }
      },
      text: [`lim = ${limitValue.toFixed(1)}`],
      textposition: 'left center',
      textfont: { size: 12, color: '#3b82f6' }
    });

    // Filled circle at (x0, c) — the actual function value
    traces.push({
      x: [x0], y: [c],
      type: 'scatter', mode: 'markers+text',
      name: `f(x₀) = ${c.toFixed(1)}`,
      marker: {
        size: 12, color: '#ef4444',
        symbol: 'circle',
        line: { color: '#ef4444', width: 2 }
      },
      text: [`f(x₀) = ${c.toFixed(1)}`],
      textposition: 'right center',
      textfont: { size: 12, color: '#ef4444' }
    });

    return traces;
  }, [params]);

  const paramConfig = [
    { name: 'a', label: 'a (slope)', min: 0.1, max: 3.0, step: 0.1 },
    { name: 'b', label: 'b (intercept)', min: -2.0, max: 2.0, step: 0.1 },
    { name: 'x0', label: 'x₀', min: -2.0, max: 2.0, step: 0.1 },
    { name: 'c', label: 'f(x₀)', min: -3.0, max: 3.0, step: 0.1 }
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

  const limitValue = params.a * params.x0 + params.b;
  const gap = Math.abs(limitValue - params.c);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/continuity')}>
           Back to Continuity
        </BackButton>
        <SectionTitle>Discontinuity: lim f(x) ≠ f(x₀)</SectionTitle>
      </Header>

      <SectionDescription>
        The limit exists and f(x₀) is defined, but they are <strong>not equal</strong>.
        The function has a "hole" at x₀ with the value re-assigned elsewhere — another
        form of <strong>removable discontinuity</strong>.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          f(x) = {'{'}<br/>
          &nbsp;&nbsp;ax + b, &nbsp;&nbsp;x ≠ x₀ = {params.x0.toFixed(1)}<br/>
          &nbsp;&nbsp;c = {params.c.toFixed(1)}, &nbsp;&nbsp;&nbsp;&nbsp;x = x₀ = {params.x0.toFixed(1)}<br/>
          {'}'}<br/><br/>
          lim(x→x₀) f(x) = a·x₀ + b = {limitValue.toFixed(1)}<br/>
          f(x₀) = c = {params.c.toFixed(1)}<br/>
          lim ≠ f(x₀) &nbsp; → &nbsp; <strong>not continuous</strong> ✗<br/>
          Gap = |{limitValue.toFixed(1)} - {params.c.toFixed(1)}| = {gap.toFixed(1)}
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
            title={`lim f(x) ≠ f(x₀) at x₀ = ${params.x0.toFixed(1)}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DiscontinuityRemovable;

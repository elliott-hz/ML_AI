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
 * Removable Discontinuity — f(x) not defined at x₀
 * f(x) = (x² - a²)/(x - a), undefined at x = a, limit = 2a
 */
const DiscontinuityUndefined = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 1.0,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto'
  });

  const generateData = useCallback(() => {
    const a = params.a;
    const [xMin, xMax] = params.xRange;
    const numPoints = 200;
    const holeX = a;
    const holeY = 2 * a;

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      if (Math.abs(x - holeX) > 0.02) {
        const y = (x * x - a * a) / (x - a);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;

    const traces = [];

    // Left branch: x < a
    if (xMin < holeX) {
      const leftX = [];
      const leftY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((holeX - xMin) * i) / (numPoints / 2);
        if (Math.abs(x - holeX) > 0.02) {
          leftX.push(x);
          leftY.push((x * x - a * a) / (x - a));
        }
      }
      if (leftX.length > 0) {
        traces.push({
          x: leftX, y: leftY, type: 'scatter', mode: 'lines',
          name: `f(x) = (x²-${(a*a).toFixed(1)})/(x-${a.toFixed(1)}) (x < x₀)`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // Right branch: x > a
    if (xMax > holeX) {
      const rightX = [];
      const rightY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = holeX + ((xMax - holeX) * i) / (numPoints / 2);
        if (Math.abs(x - holeX) > 0.02) {
          rightX.push(x);
          rightY.push((x * x - a * a) / (x - a));
        }
      }
      if (rightX.length > 0) {
        traces.push({
          x: rightX, y: rightY, type: 'scatter', mode: 'lines',
          name: `f(x) = (x²-${(a*a).toFixed(1)})/(x-${a.toFixed(1)}) (x > x₀)`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // Vertical auxiliary line at x = a
    traces.push({
      x: [holeX, holeX],
      y: [auxYMin, auxYMax],
      type: 'scatter', mode: 'lines',
      name: `x=${holeX.toFixed(1)}`,
      line: { color: '#ffd700', width: 2, dash: 'dash' }
    });

    // Horizontal auxiliary line at y = 2a (the limit value)
    traces.push({
      x: [xMin, xMax],
      y: [holeY, holeY],
      type: 'scatter', mode: 'lines',
      name: `lim: ${holeY.toFixed(1)}`,
      line: { color: '#ffd700', width: 2, dash: 'dash' }
    });

    // Hollow circle at the hole (a, 2a)
    traces.push({
      x: [holeX], y: [holeY],
      type: 'scatter', mode: 'markers+text',
      name: 'Hole',
      marker: {
        size: 12, color: '#ef4444',
        symbol: 'circle-open',
        line: { color: '#ef4444', width: 2 }
      },
      text: [`f(${holeX.toFixed(1)}) undefined`],
      textposition: 'top center',
      textfont: { size: 12, color: '#ef4444' }
    });

    return traces;
  }, [params]);

  const coefficientConfig = [
    { name: 'a', label: 'a (hole at x=a)', min: -2.0, max: 2.0, step: 0.1 }
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

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/continuity')}>
           Back to Continuity
        </BackButton>
        <SectionTitle>Discontinuity: f(x) Not Defined at x₀</SectionTitle>
      </Header>

      <SectionDescription>
        The function is not defined at x₀ = a. The limit exists as x approaches a,
        but f(a) does not exist — this is called a <strong>removable discontinuity</strong>.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          f(x) = (x² - a²) / (x - a)<br/><br/>
          Simplifies to: f(x) = x + a, &nbsp;&nbsp;x ≠ a<br/>
          lim(x→a) f(x) = 2a<br/><br/>
          f(a) is <strong>undefined</strong> ✗
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Parameter">
            <ParameterControls parameters={params} onChange={setParams} config={coefficientConfig} />
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
            title={`Removable Discontinuity at x = ${params.a.toFixed(1)}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DiscontinuityUndefined;

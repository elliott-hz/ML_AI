import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContinuityPlotter from '../../components/visualization/ContinuityPlotter';
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
 * Continuity of a Function - Interactive visualization
 * Shows f(x) = ax + b with adjustable x₀ and Δx to demonstrate
 * that as Δx → 0, Δy → 0
 */
const ContinuityOfFunction = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    coefficientA: 1.0,
    coefficientB: 0.0,
    x0: 1.0,
    dx: 0.5,
    xRange: [-1, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  // Get theme color for auxiliary elements
  const getThemeColor = () => {
    const themeMode = localStorage.getItem('themeMode') || 'dark';
    return themeMode === 'dark' ? '#ffd700' : '#f59e0b';
  };

  const coefficientConfig = [
    {
      name: 'coefficientA',
      label: 'a (slope)',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      name: 'coefficientB',
      label: 'b (intercept)',
      min: -2.0,
      max: 2.0,
      step: 0.1
    }
  ];

  const pointConfig = [
    {
      name: 'x0',
      label: 'x₀',
      min: params.xRange[0],
      max: params.xRange[1],
      step: 0.05
    },
    {
      name: 'dx',
      label: 'Δx',
      min: -2.0,
      max: 2.0,
      step: 0.01
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
      min: -5,
      max: 5,
      step: 0.5,
      default: [-1, 3]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  const generateContinuityData = useCallback(() => {
    const a = params.coefficientA;
    const b = params.coefficientB;
    const xMin = params.xRange[0];
    const xMax = params.xRange[1];
    const x0 = params.x0;
    const dx = params.dx;
    const numPoints = 500;
    const auxiliaryColor = getThemeColor();

    const formatNum = (num) => Number(num).toFixed(2);

    // f(x) = ax + b
    const f = (x) => a * x + b;

    // Generate function curve data
    const step = (xMax - xMin) / numPoints;
    const curveX = [];
    const curveY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      curveX.push(x);
      curveY.push(f(x));
    }

    const x1 = x0 + dx;
    const y0 = f(x0);
    const y1 = f(x1);
    const deltaY = y1 - y0;

    return [
      // Main function curve
      {
        x: curveX,
        y: curveY,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${formatNum(a)}x + ${formatNum(b)}`,
        line: { color: '#6366f1', width: 2 }
      },
      // Horizontal auxiliary line (Δx) from (x0, y0) to (x1, y0)
      {
        x: [x0, x1],
        y: [y0, y0],
        type: 'scatter',
        mode: 'lines',
        name: 'Δx',
        line: {
          color: auxiliaryColor,
          width: 1.5,
          dash: 'dash'
        },
        showlegend: false
      },
      // Vertical auxiliary line (Δy) from (x1, y0) to (x1, y1)
      {
        x: [x1, x1],
        y: [y0, y1],
        type: 'scatter',
        mode: 'lines',
        name: 'Δy',
        line: {
          color: auxiliaryColor,
          width: 1.5,
          dash: 'dash'
        },
        showlegend: false
      },
      // Δx label below the horizontal line
      {
        x: [(x0 + x1) / 2],
        y: [y0 - Math.abs(deltaY) * 0.15 - 0.05],
        type: 'scatter',
        mode: 'text',
        name: 'Δx Label',
        text: [`Δx = ${formatNum(dx)}`],
        textfont: { color: '#3b82f6', size: 13 },
        showlegend: false
      },
      // Δy label beside the vertical line
      {
        x: [x1 + (deltaY >= 0 ? 0.08 : -0.08)],
        y: [(y0 + y1) / 2],
        type: 'scatter',
        mode: 'text',
        name: 'Δy Label',
        text: [`Δy = ${formatNum(deltaY)}`],
        textfont: { color: '#22c55e', size: 13 },
        showlegend: false
      },
      // Point at x₀: (x0, y0)
      {
        x: [x0],
        y: [y0],
        type: 'scatter',
        mode: 'markers',
        name: `P(x₀, y₀)`,
        marker: {
          color: '#3b82f6',
          size: 10,
          symbol: 'circle'
        },
        showlegend: false
      },
      // Point at x₀ + Δx: (x1, y1)
      {
        x: [x1],
        y: [y1],
        type: 'scatter',
        mode: 'markers',
        name: `P(x₀+Δx, y₀+Δy)`,
        marker: {
          color: '#ef4444',
          size: 10,
          symbol: 'circle'
        },
        showlegend: false
      },
      // x₀ label on x-axis
      {
        x: [x0],
        y: [Math.min(y0, y1) - Math.abs(deltaY) * 0.3 - 0.1],
        type: 'scatter',
        mode: 'text',
        name: 'x₀ Label',
        text: ['x₀'],
        textfont: { color: auxiliaryColor, size: 14 },
        showlegend: false
      },
      // x₀+Δx label on x-axis
      {
        x: [x1],
        y: [Math.min(y0, y1) - Math.abs(deltaY) * 0.3 - 0.1],
        type: 'scatter',
        mode: 'text',
        name: 'x Label',
        text: ['x'],
        textfont: { color: auxiliaryColor, size: 14 },
        showlegend: false
      }
    ];
  }, [params.coefficientA, params.coefficientB, params.x0, params.dx, params.xRange]);

  const traces = useMemo(() => generateContinuityData(), [generateContinuityData]);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/continuity')}>
           Back to Continuity
        </BackButton>
        <Title>Continuity of a Function</Title>
      </Header>

      <Description>
        A function is continuous at a point x₀ if, as the change in x (Δx) approaches zero,
        the change in y (Δy) also approaches zero. This visualization shows how adjusting Δx
        affects Δy for a linear function f(x) = ax + b.
      </Description>

      <FormulaBox>
        <FormulaTitle>Definition:</FormulaTitle>
        <Formula>
          f(x) = ax + b<br />
          At x = x₀: y₀ = f(x₀)<br />
          At x = x₀ + Δx: y = f(x₀ + Δx)<br />
          Δy = f(x₀ + Δx) - f(x₀)<br />
          <br />
          When Δx → 0, Δy → 0 ✓
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

          <ParameterSection title="Reference Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={pointConfig}
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
          <ContinuityPlotter
            data={traces}
            xRange={params.xRange}
            title="Continuity: f(x) = ax + b"
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

export default ContinuityOfFunction;

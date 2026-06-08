// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useMemo, useCallback } from 'react';
import ContinuityPlotter from '../../../components/visualization/ContinuityPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../components/common/LayoutStyled';
import { commonParamsConfig } from '../../../constants/continuityConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Continuity of a Function - Interactive visualization
 * Shows f(x) = ax + b with adjustable x₀ and Δx to demonstrate
 * that as Δx → 0, Δy → 0
 */
const ContinuityOfFunction = () => {
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

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

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

  const generateContinuityData = useCallback(() => {
    const a = params.coefficientA;
    const b = params.coefficientB;
    const xMin = params.xRange[0];
    const xMax = params.xRange[1];
    const x0 = params.x0;
    const dx = params.dx;
    const numPoints = 500;

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
        line: { color: palette.mainTraces.primary, width: 2 }
      },
      // Horizontal auxiliary line (Δx) from (x0, y0) to (x1, y0)
      {
        x: [x0, x1],
        y: [y0, y0],
        type: 'scatter',
        mode: 'lines',
        name: 'Δx',
        line: {
          color: palette.limit.limitLine,
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
          color: palette.limit.limitLine,
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
        textfont: { color: palette.markers.pointA, size: 13 },
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
        textfont: { color: palette.mainTraces.secondary, size: 13 },
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
          color: palette.markers.pointA,
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
          color: palette.limit.hole,
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
        textfont: { color: palette.limit.limitLine, size: 14 },
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
        textfont: { color: palette.limit.limitLine, size: 14 },
        showlegend: false
      }
    ];
  }, [params.coefficientA, params.coefficientB, params.x0, params.dx, params.xRange, themeMode]);

  const traces = useMemo(() => generateContinuityData(), [generateContinuityData]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/continuity">
           Back to Continuity
        </BackButton>
        <SectionTitleH1>Continuity of a Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        A function is continuous at a point x₀ if, as the change in x (Δx) approaches zero,
        the change in y (Δy) also approaches zero. This visualization shows how adjusting Δx
        affects Δy for a linear function f(x) = ax + b.
      </SectionDescription>

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
            title={`Continuity: f(x) = ${params.coefficientA.toFixed(1)}x + ${params.coefficientB.toFixed(1)}`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[
              { name: 'x0', label: 'x₀', min: -1, max: 3, step: 0.05 },
              { name: 'dx', label: 'Δx', min: -2.0, max: 2.0, step: 0.01 }
            ]} />
          </ContinuityPlotter>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ContinuityOfFunction;

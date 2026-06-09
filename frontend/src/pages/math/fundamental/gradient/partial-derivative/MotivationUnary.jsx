// UI Pattern: StandardSinglePlot — single plot with controls panel and content layout
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';
import GradientPlotter from '../../../../../components/visualization/GradientPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../../components/common/LayoutStyled';
import { plotStyleConfig, legendPositionConfig } from '../../../../../constants/gradientConfig';

/**
 * MotivationUnary — Unary Single-Variable Function
 *
 * y = f(x) = x²
 * Demonstrates that a unary function has exactly one input:
 * y changes ONLY when x changes.
 */
const MotivationUnary = () => {
  const [params, setParams] = useState({
    x0: 1.5,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const x0 = params.x0;
  const y0 = x0 * x0;
  const deriv = 2 * x0;

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;

    const xs = [];
    const ys = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      xs.push(x);
      ys.push(x * x);
    }

    const traces = [];

    // 1. f(x) = x² curve
    traces.push({
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: 'y = x²',
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });

    // 2. Tangent line at x₀
    const tanSpan = (xMax - xMin) * 0.25;
    const tx = [Math.max(xMin, x0 - tanSpan), Math.min(xMax, x0 + tanSpan)];
    const ty = tx.map(x => y0 + deriv * (x - x0));
    traces.push({
      x: tx, y: ty,
      type: 'scatter', mode: 'lines',
      name: `f'(x₀) = ${deriv.toFixed(2)}`,
      line: { color: palette.mainTraces.secondary, width: 2, dash: 'dash' }
    });

    // 3. Point A
    traces.push({
      x: [x0], y: [y0],
      type: 'scatter', mode: 'markers',
      name: `A = (${x0.toFixed(1)}, ${y0.toFixed(2)})`,
      marker: { color: palette.markers.evalX0, size: 12, symbol: 'circle', line: { color: '#fff', width: 2 } }
    });

    // 4. Vertical projection
    traces.push({
      x: [x0, x0], y: [0, y0],
      type: 'scatter', mode: 'lines',
      line: { color: palette.markers.evalX0, width: 2, dash: 'dot' },
      showlegend: false
    });

    // 5. Horizontal projection
    traces.push({
      x: [0, x0], y: [y0, y0],
      type: 'scatter', mode: 'lines',
      line: { color: palette.markers.evalX0, width: 2, dash: 'dot' },
      showlegend: false
    });

    return traces;
  }, [params.xRange, x0, y0, deriv, palette]);

  const plotData = useMemo(() => generateData(), [generateData]);

  const annotationOffset = 18;
  const annotations = useMemo(() => [
    {
      x: x0, y: 0,
      xref: 'x', yref: 'y',
      text: 'x₀',
      showarrow: false,
      xanchor: 'center', yanchor: 'top',
      yshift: -annotationOffset,
      font: { color: palette.markers.evalX0, size: 13, weight: 700 }
    },
    {
      x: 0, y: y0,
      xref: 'x', yref: 'y',
      text: 'f(x₀)',
      showarrow: false,
      xanchor: x0 >= 0 ? 'right' : 'left', yanchor: 'middle',
      xshift: x0 >= 0 ? -annotationOffset : annotationOffset,
      font: { color: palette.markers.evalX0, size: 13, weight: 700 }
    }
  ], [x0, y0, palette]);

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -5, max: 5, step: 1, default: [-3, 3]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/gradient">
          ← Back to Gradient
        </BackButton>
        <SectionTitleH1>Unary Function: y = f(x)</SectionTitleH1>
      </Header>

      <SectionDescription>
        A <strong>unary (single-variable) function</strong> has exactly one input.
        Here <strong>y = x²</strong> — when <em>x</em> changes, <em>y</em> changes.
        The vertical dashed line from point A down to the x-axis shows the single
        dependency path: there is no other variable to affect y.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Single-Variable Function:</FormulaTitle>
        <Formula>
          y = f(x) = x²<br/><br/>
          Ordinary derivative: &nbsp; <strong>f'(x) = 2x</strong><br/><br/>
          At x₀ = {x0.toFixed(1)}:<br/>
          y₀ = f(x₀) = {y0.toFixed(3)} &nbsp; f'(x₀) = {deriv.toFixed(3)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Evaluation Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -2.9, max: 2.9, step: 0.1 }
              ]}
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
          <GradientPlotter
            data={plotData}
            xRange={params.xRange}
            title="y = x² — One Input, One Output"
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            annotations={annotations}
          >
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -2.9, max: 2.9, step: 0.1 }
              ]}
            />
          </GradientPlotter>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default MotivationUnary;

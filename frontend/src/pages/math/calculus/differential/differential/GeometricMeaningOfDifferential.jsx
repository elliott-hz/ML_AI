// UI Pattern: StandardSinglePlot — geometric meaning of differential
// Normal distribution curve as the base function
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';
import DifferentialPlotter from '../../../../../components/visualization/DifferentialPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel
} from '../../../../../components/common/LayoutStyled';
import { legendPositionConfig } from '../../../../../constants/differentialConfig';

function normalPDF(x, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

function normalPDFDerivative(x, mu = 0, sigma = 1) {
  return normalPDF(x, mu, sigma) * (-(x - mu) / (sigma * sigma));
}

const GeometricMeaningOfDifferential = () => {
  const [params, setParams] = useState({
    mu: 1.0,
    sigma: 0.5,
    x0: 0.5,
    dx: 0.45,
    xRange: [-1, 2],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { mu, sigma, x0, dx, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const x1 = x0 + dx;

  const fn = useCallback((x) => normalPDF(x, mu, sigma), [mu, sigma]);

  // ── Curve data ───────────────────────────────────────────
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ys = xs.map(fn);
    const t = [{
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: `f(x) = N(${mu.toFixed(1)}, ${sigma.toFixed(1)})`,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    }];

    // Vertical dashed lines from x-axis to curve at x0 and x1
    const y0 = fn(x0);
    const y1 = fn(x1);
    const combinedColor = palette.auxTraces.combined;

    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x0], y: [0, y0],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x1, x1], y: [0, y1],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // Marker points on the curve — A (at x₀) and B (at x₁)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x0], y: [y0],
      marker: { color: palette.mainTraces.secondary, size: 10, symbol: 'circle' },
      name: 'A', showlegend: false,
      hovertemplate: 'A: (%{x:.2f}, %{y:.4f})<extra></extra>'
    });
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x1], y: [y1],
      marker: { color: palette.mainTraces.secondary, size: 10, symbol: 'circle' },
      name: 'B', showlegend: false,
      hovertemplate: 'B: (%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    // Horizontal dashed line from A to the right, intersecting x₁ vertical at C
    const yA = y0;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x1], y: [yA, yA],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // Marker C at intersection (x₁, y₀)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x1], y: [yA],
      marker: { color: palette.mainTraces.tertiary, size: 9, symbol: 'circle' },
      name: 'C', showlegend: false,
      hovertemplate: 'C: (%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    // Tangent line at point A (dashed, same color as AC)
    const slope = normalPDFDerivative(x0, mu, sigma);
    const tanExtent = 1.5;
    const tanXs = [x0 - tanExtent, x0 + tanExtent];
    const tanYs = tanXs.map(x => slope * (x - x0) + yA);
    t.push({
      type: 'scatter', mode: 'lines',
      x: tanXs, y: tanYs,
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // Vertical dashed line from D (tangent line) up through C to B (same color)
    const yD = slope * dx + yA;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x1, x1], y: [yD, y1],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // Marker D at intersection of tangent line and x₁ vertical
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x1], y: [yD],
      marker: { color: palette.mainTraces.tertiary, size: 9, symbol: 'circle' },
      name: 'D', showlegend: false,
      hovertemplate: 'D: (%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    // dx bracket (dashed horizontal line with tick marks on x-axis)
    const tickOff = (xMax - xMin) * 0.004;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x1], y: [0, 0],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    // Left tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x0], y: [-tickOff, tickOff],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });
    // Right tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x1, x1], y: [-tickOff, tickOff],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });

    // dy bracket (vertical dashed line on the right side of CD, with tick marks)
    const bracketXOffset = (xMax - xMin) * 0.035;
    const bracketX = x1 + bracketXOffset;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX, bracketX], y: [yA, yD],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    // Top tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX - tickOff, bracketX + tickOff], y: [yD, yD],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });
    // Bottom tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX - tickOff, bracketX + tickOff], y: [yA, yA],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });

    // o(Δx) bracket (same vertical line as dy, from D to B — the remainder)
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX, bracketX], y: [yD, y1],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    // Top tick at B
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX - tickOff, bracketX + tickOff], y: [y1, y1],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });

    // Δy bracket (vertical dashed line further right, from C to B — actual change)
    const bracketXOffset2 = (xMax - xMin) * 0.10;
    const bracketX2 = x1 + bracketXOffset2;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX2, bracketX2], y: [yA, y1],
      line: { color: combinedColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    // Top tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX2 - tickOff, bracketX2 + tickOff], y: [y1, y1],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });
    // Bottom tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bracketX2 - tickOff, bracketX2 + tickOff], y: [yA, yA],
      line: { color: combinedColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });

    return t;
  }, [mu, sigma, x0, dx, xRange, fn, curveStep, palette, xMin, xMax]);

  // ── Annotations ──────────────────────────────────────────
  const annotations = useMemo(() => {
    const y0 = fn(x0);
    const y1 = fn(x1);
    const slope = normalPDFDerivative(x0, mu, sigma);
    const yD = slope * dx + y0;
    const bracketXOffset = (xMax - xMin) * 0.035;
    const bracketX = x1 + bracketXOffset;
    const bracketXOffset2 = (xMax - xMin) * 0.10;
    const bracketX2 = x1 + bracketXOffset2;
    return [
      { x: x0, y: 0, text: 'x₀', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.tangent, size: 14, weight: 700 } },
      { x: x1, y: 0, text: 'x₁', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.tangent, size: 14, weight: 700 } },
      { x: (x0 + x1) / 2, y: 0, text: 'dx = Δx', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.combined, size: 14, weight: 700 } },
      // Point labels on the curve
      { x: x0, y: y0, text: 'A', showarrow: false, xanchor: 'center', yanchor: 'bottom', yshift: 8, font: { color: palette.mainTraces.secondary, size: 15, weight: 700 } },
      { x: x1, y: y1, text: 'B', showarrow: false, xanchor: 'left', yanchor: 'top', xshift: 6, yshift: -6, font: { color: palette.mainTraces.secondary, size: 15, weight: 700 } },
      // C and D labels (right side of the points)
      { x: x1, y: y0, text: 'C', showarrow: false, xanchor: 'left', yanchor: 'middle', xshift: 8, font: { color: palette.mainTraces.tertiary, size: 15, weight: 700 } },
      { x: x1, y: yD, text: 'D', showarrow: false, xanchor: 'left', yanchor: 'middle', xshift: 8, font: { color: palette.mainTraces.tertiary, size: 15, weight: 700 } },
      // dy label to the right of the dy bracket
      { x: bracketX, y: (y0 + yD) / 2, text: 'dy', showarrow: false, xanchor: 'left', yanchor: 'middle', xshift: 16, font: { color: palette.auxTraces.combined, size: 14, weight: 700 } },
      // o(Δx) label on the same line as dy, at BD midpoint
      { x: bracketX, y: (yD + y1) / 2, text: 'o(Δx)', showarrow: false, xanchor: 'left', yanchor: 'middle', xshift: 16, font: { color: palette.auxTraces.combined, size: 14, weight: 700 } },
      // Δy label to the right of the Δy bracket
      { x: bracketX2, y: (y0 + y1) / 2, text: 'Δy', showarrow: false, xanchor: 'left', yanchor: 'middle', xshift: 16, font: { color: palette.auxTraces.combined, size: 14, weight: 700 } }
    ];
  }, [x0, x1, dx, mu, sigma, fn, palette, xRange, xMin, xMax]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/differential">
          ← Back to Differential
        </BackButton>
        <SectionTitleH1>Geometric Meaning of Differential</SectionTitleH1>
      </Header>

      <SectionDescription>
        The differential of a function describes the linear approximation of the function
        at a point. For a function <strong>y = f(x)</strong>, the differential <strong>dy</strong>
        is defined as <strong>dy = f'(x) · dx</strong>, where <strong>dx</strong> is an
        infinitesimal change in <strong>x</strong>. Geometrically, this corresponds to
        the change along the tangent line.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Differential">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -4, max: 4, step: 0.1 },
                { name: 'dx', label: 'dx = Δx', min: 0.05, max: 1.0, step: 0.05 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Normal Distribution">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'mu', label: 'μ (mean)', min: -3, max: 3, step: 0.1 },
                { name: 'sigma', label: 'σ (std dev)', min: 0.3, max: 3, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -8, max: 8, step: 0.5, default: [-4, 4] }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                ...legendPositionConfig,
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DifferentialPlotter
            data={traces}
            xRange={xRange}
            title="Geometric Meaning of Differential"
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            annotations={annotations}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default GeometricMeaningOfDifferential;

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

const GeometricMeaningOfDifferential = () => {
  const [params, setParams] = useState({
    mu: 1.0,
    sigma: 0.5,
    x0: 0.5,
    dx: 0.35,
    xRange: [-4, 4],
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
    const auxColor = palette.auxTraces.tangent;

    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x0], y: [0, y0],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x1, x1], y: [0, y1],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // Marker points on the curve
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x0], y: [y0],
      marker: { color: palette.mainTraces.secondary, size: 10, symbol: 'circle' },
      name: `P(x₀, f(x₀))`, showlegend: false,
      hovertemplate: 'x₀: %{x:.2f}<br>f(x₀): %{y:.4f}<extra></extra>'
    });
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x1], y: [y1],
      marker: { color: palette.mainTraces.secondary, size: 10, symbol: 'circle' },
      name: `Q(x₁, f(x₁))`, showlegend: false,
      hovertemplate: 'x₁: %{x:.2f}<br>f(x₁): %{y:.4f}<extra></extra>'
    });

    // dx bracket (dashed horizontal line with tick marks on x-axis)
    const tickOff = (xMax - xMin) * 0.008;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x1], y: [0, 0],
      line: { color: palette.auxTraces.combined, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    // Left tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x0, x0], y: [-tickOff, tickOff],
      line: { color: palette.auxTraces.combined, width: 2 },
      showlegend: false, hovertemplate: ''
    });
    // Right tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [x1, x1], y: [-tickOff, tickOff],
      line: { color: palette.auxTraces.combined, width: 2 },
      showlegend: false, hovertemplate: ''
    });

    return t;
  }, [mu, sigma, x0, dx, xRange, fn, curveStep, palette, xMin, xMax]);

  // ── Annotations ──────────────────────────────────────────
  const annotations = useMemo(() => {
    return [
      { x: x0, y: 0, text: 'x₀', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.tangent, size: 14, weight: 700 } },
      { x: x1, y: 0, text: 'x₁', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.tangent, size: 14, weight: 700 } },
      { x: (x0 + x1) / 2, y: 0, text: 'dx', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.combined, size: 14, weight: 700 } }
    ];
  }, [x0, x1, palette]);

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
                { name: 'dx', label: 'dx (increment)', min: 0.05, max: 1.0, step: 0.05 }
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

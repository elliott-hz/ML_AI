// UI Pattern: StandardSinglePlot — Errors of First Order Approximation
// Plot 1: Shows the linear approximation error dy vs Δy as dx grows
// Plot 2: Multiple functions sharing the same tangent but different curvatures
import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { getTracePalette, ASPECT_RATIO_OPTIONS } from '../../../../constants/plotThemeConfig';
import DerivativeLocalApproximationPlotter from '../../../../components/visualization/DerivativeLocalApproximationPlotter';
import ParameterControls from '../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../components/visualization/ParameterSection';
import BackButton from '../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  FormulaBox, FormulaTitle, Formula,
  FunctionSection
} from '../../../../components/common/LayoutStyled';

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;

  & > * {
    flex: 1 1 200px;
    min-width: 0;
  }
`;

const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

/**
 * ErrorsOfFirstOrderApproximation — visualize limitations of linear approximation
 */
const ErrorsOfFirstOrderApproximation = () => {
  const [params, setParams] = useState({
    dx: 0.5,
    xRange: [-2, 3],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { dx, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];

  // Shared: eˣ at x₀ = 0
  const fn = useCallback((x) => Math.exp(x), []);
  const tangent = useCallback((x) => 1 + x, []);
  const x0 = 0;

  // Functions for Plot 2 — all pass through (0,1) with tangent slope 1
  const f2_2 = useCallback((x) => Math.exp(x), []);            // bowl up: f''(0) = 1 > 0
  const f2_3 = useCallback((x) => 1 + x - 0.5 * x * x, []);   // bowl down: f''(0) = -1 < 0
  const f2_4 = useCallback((x) => 1 + x + x * x, []);         // stronger bowl up: f''(0) = 2 > 0
  const f2_5 = useCallback((x) => 1 + Math.sin(x), []);       // trig: f''(0) = 0 (inflection at origin)

  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;
  const xs = useMemo(
    () => Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep),
    [xMin, xMax, curvePts, curveStep]
  );

  // Clamp dx to a positive value within range
  const dxClamp = Math.max(0.05, Math.min(dx, xMax - x0));

  // ── Plot 1: Error1 — Linear approximation error ──────────
  const leftTraces = useMemo(() => {
    const t = [];
    const primaryColor = palette.mainTraces.primary;
    const tangentColor = palette.auxTraces.tangent;
    const markerA = palette.markers.pointA;     // blue
    const markerB = palette.markers.pointB;     // red

    const fYs = xs.map(fn);
    const tanYs = xs.map(tangent);

    // f(x) curve
    t.push({
      x: xs, y: fYs,
      type: 'scatter', mode: 'lines',
      line: { color: primaryColor, width: 3 },
      name: 'f(x) = eˣ',
      hovertemplate: 'x: %{x:.2f}<br>eˣ: %{y:.4f}<extra></extra>'
    });

    // Tangent line
    t.push({
      x: xs, y: tanYs,
      type: 'scatter', mode: 'lines',
      line: { color: tangentColor, width: 3, dash: 'dash' },
      name: 'y = 1 + x (tangent)',
      hovertemplate: 'x: %{x:.2f}<br>1+x: %{y:.4f}<extra></extra>'
    });

    // P: (x₀, f(x₀))
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x0], y: [fn(x0)],
      marker: { color: primaryColor, size: 14, symbol: 'circle', line: { color: '#ffffff', width: 2.5 } },
      name: 'P',
      hovertemplate: 'P(%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    // Q: point on tangent at dx
    const qY = tangent(dxClamp);
    t.push({
      type: 'scatter', mode: 'markers',
      x: [dxClamp], y: [qY],
      marker: { color: markerA, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      name: 'Q (linear predict)',
      hovertemplate: 'Q(%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    // R: point on function at dx
    const rY = fn(dxClamp);
    t.push({
      type: 'scatter', mode: 'markers',
      x: [dxClamp], y: [rY],
      marker: { color: markerB, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      name: 'R (actual)',
      hovertemplate: 'R(%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    // QR vertical dashed line (error gap)
    t.push({
      type: 'scatter', mode: 'lines',
      x: [dxClamp, dxClamp], y: [qY, rY],
      line: { color: markerB, width: 2.5, dash: 'dot' },
      showlegend: false,
      hovertemplate: ''
    });

    return t;
  }, [xs, fn, tangent, dxClamp, x0, palette, themeMode]);

  const leftAnnotations = useMemo(() => {
    const primaryColor = palette.mainTraces.primary;
    const markerA = palette.markers.pointA;
    const markerB = palette.markers.pointB;
    const fs = 11;

    const qY = tangent(dxClamp);
    const rY = fn(dxClamp);
    const error = Math.abs(rY - qY);

    return [
      // P label — left of point, no arrow
      { x: x0, y: fn(x0), text: 'P', showarrow: false, xanchor: 'right', xshift: -8, font: { color: primaryColor, size: fs + 2, weight: 700 } },
      // Q label — left of point, no arrow
      { x: dxClamp, y: qY, text: 'Q', showarrow: false, xanchor: 'right', xshift: -8, font: { color: markerA, size: fs + 2, weight: 700 } },
      // R label — left of point, no arrow
      { x: dxClamp, y: rY, text: 'R', showarrow: false, xanchor: 'right', xshift: -8, font: { color: markerB, size: fs + 2, weight: 700 } },
      // Error label
      {
        x: dxClamp, y: (qY + rY) / 2,
        text: `error = ${fmt(error)}`, showarrow: false,
        xanchor: 'left', xshift: 50,
        font: { color: markerB, size: fs + 1, weight: 700 }
      }
    ];
  }, [dxClamp, x0, fn, tangent, palette]);

  // ── Plot 2: Error2 — Same tangent, different shapes ──────
  const rightTraces = useMemo(() => {
    const t = [];
    const primaryColor = palette.mainTraces.primary;
    const secondaryColor = palette.mainTraces.secondary;
    const auxColor = getAuxColor(themeMode);
    const amberColor = palette.markers.evalX0;
    const blueColor = palette.markers.pointA;

    const f2_1Ys = xs.map(tangent);   // f₁ = 1 + x (the tangent itself)
    const f2_2Ys = xs.map(f2_2);      // f₂ = eˣ
    const f2_3Ys = xs.map(f2_3);      // f₃ = 1 + x - x²/2
    const f2_4Ys = xs.map(f2_4);      // f₄ = 1 + x + x²
    const f2_5Ys = xs.map(f2_5);      // f₅ = 1 + sin(x)

    // f₁ — the tangent line (dashed, same as shared tangent)
    t.push({
      x: xs, y: f2_1Ys,
      type: 'scatter', mode: 'lines',
      line: { color: auxColor, width: 2.5, dash: 'dash' },
      name: 'f₁(x) = 1 + x',
      hovertemplate: 'x: %{x:.2f}<br>f₁: %{y:.4f}<extra></extra>'
    });

    // f₂ — bowl up
    t.push({
      x: xs, y: f2_2Ys,
      type: 'scatter', mode: 'lines',
      line: { color: primaryColor, width: 3 },
      name: 'f₂(x) = eˣ (f" > 0)',
      hovertemplate: 'x: %{x:.2f}<br>eˣ: %{y:.4f}<extra></extra>'
    });

    // f₃ — bowl down
    t.push({
      x: xs, y: f2_3Ys,
      type: 'scatter', mode: 'lines',
      line: { color: secondaryColor, width: 3 },
      name: 'f₃(x) = 1 + x − ½x² (f" < 0)',
      hovertemplate: 'x: %{x:.2f}<br>f₃: %{y:.4f}<extra></extra>'
    });

    // f₄ — stronger bowl up
    t.push({
      x: xs, y: f2_4Ys,
      type: 'scatter', mode: 'lines',
      line: { color: amberColor, width: 3, dash: 'dot' },
      name: 'f₄(x) = 1 + x + x² (f" = 2)',
      hovertemplate: 'x: %{x:.2f}<br>f₄: %{y:.4f}<extra></extra>'
    });

    // f₅ — trigonometric (inflection at origin)
    t.push({
      x: xs, y: f2_5Ys,
      type: 'scatter', mode: 'lines',
      line: { color: blueColor, width: 3, dash: 'dot' },
      name: 'f₅(x) = 1 + sin(x) (f" = 0)',
      hovertemplate: 'x: %{x:.2f}<br>f₅: %{y:.4f}<extra></extra>'
    });

    // Common point P(0, 1)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x0], y: [tangent(x0)],
      marker: { color: primaryColor, size: 14, symbol: 'circle', line: { color: '#ffffff', width: 2.5 } },
      name: 'P(0, 1)',
      showlegend: false,
      hovertemplate: 'P(0, 1)<extra></extra>'
    });

    return t;
  }, [xs, tangent, f2_2, f2_3, f2_4, f2_5, x0, palette]);

  const rightAnnotations = useMemo(() => {
    const primaryColor = palette.mainTraces.primary;
    const fs = 11;

    return [
      // P label — left of point, no arrow
      { x: x0, y: tangent(x0), text: 'P(0, 1)', showarrow: false, xanchor: 'right', xshift: -8, font: { color: primaryColor, size: fs + 2, weight: 700 } }
    ];
  }, [x0, tangent, palette]);

  const qY = tangent(dxClamp);
  const rY = fn(dxClamp);
  const error = Math.abs(rY - qY);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/3-taylor-formula/derivative-local-approximation">
          ← Back to Derivative Local Approximation
        </BackButton>
        <SectionTitleH1>Errors of First Order Approximation</SectionTitleH1>
      </Header>

      <SectionDescription>
        A linear (first-order) approximation using the tangent line is only accurate very close to the point of tangency.
        As we move further away, the error grows. Moreover, different functions can share the same tangent line at a point
        yet behave very differently — revealing that the first derivative alone is insufficient to capture a function's shape.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Linear Approximation Error:</FormulaTitle>
        <Formula>
          f(x₀ + dx) = f(x₀) + f'(x₀)·dx + ε(dx) &nbsp; where &nbsp; ε(dx) → 0 as dx → 0<br/><br/>
          As dx increases, the error |ε(dx)| = |f(x₀ + dx) − [f(x₀) + f'(x₀)·dx]| grows.<br/>
          This shows that a first-order (linear) approximation is only reliable very close to x₀.
        </Formula>
      </FormulaBox>

      <FunctionSection>
        <ControlsRow>
          <ParameterSection title="Error Parameters">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'dx', label: 'dx (distance from x₀)', min: 0.05, max: 1.5, step: 0.05 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Display">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 0.5 },
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', ...ASPECT_RATIO_OPTIONS.filter(o => o !== 'auto')] },
                { name: 'legendPosition', label: 'Legend Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
              ]}
            />
          </ParameterSection>
        </ControlsRow>
      </FunctionSection>

      <PlotGrid2>
        <div>
          <DerivativeLocalApproximationPlotter
            data={leftTraces}
            xRange={xRange}
            title="Error: Linear Approximation at x₀ = 0"
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            annotations={leftAnnotations}
          />
        </div>
        <div>
          <DerivativeLocalApproximationPlotter
            data={rightTraces}
            xRange={xRange}
            title="Same Tangent, Different Shapes"
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            annotations={rightAnnotations}
          />
        </div>
      </PlotGrid2>
    </PageContainer>
  );
};

function getAuxColor(themeMode) {
  return themeMode === 'dark' ? '#ffd700' : '#b45309';
}

export default ErrorsOfFirstOrderApproximation;

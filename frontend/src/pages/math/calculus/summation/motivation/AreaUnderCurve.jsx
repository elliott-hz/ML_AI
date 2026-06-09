// UI Pattern: StandardSinglePlot — normal distribution with rectangle area approximation
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';
import SummationPlotter from '../../../../../components/visualization/SummationPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../../components/common/LayoutStyled';
import { legendPositionConfig } from '../../../../../constants/summationConfig';

/**
 * Normal CDF via error function approximation (Abramowitz & Stegun 7.1.26)
 * Used for computing the exact area under the normal curve.
 */
function normalCDF(x, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma;
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(z) / Math.SQRT2);
  const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z / 2);
  return 0.5 * (1 + sign * erf);
}

/**
 * AreaUnderCurve — approximate area under normal curve with n rectangles
 *
 * f(x) = (1/(σ√(2π)))·exp(-(x-μ)²/(2σ²))
 * Approx area = Σ f(xᵢ)·Δx  for i = 0..n-1, Δx = (b-a)/n
 * Exact area = Φ(b) - Φ(a)  (normal CDF)
 */
const AreaUnderCurve = () => {
  const [params, setParams] = useState({
    mu: 0,
    sigma: 1,
    a: 0.5,
    b: 2.5,
    n: 5,
    xRange: [-4, 4],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { mu, sigma, a, b, n, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];

  // Normal PDF
  const normalPDF = useCallback((x) => {
    const z = (x - mu) / sigma;
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  }, [mu, sigma]);

  // ── Curve data (full range) ──────────────────────────────
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];

    // 1. Normal distribution curve
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ys = xs.map(normalPDF);
    t.push({
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: `N(${mu.toFixed(1)}, ${sigma.toFixed(1)})`,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    // Clamp a, b to view range
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp >= bClamp) return t;

    const deltaX = (bClamp - aClamp) / n;
    const rectColor = palette.fills.primary;

    // 2. n rectangles (filled + border)
    const rectPts = [];
    for (let i = 0; i < n; i++) {
      const xLeft = aClamp + i * deltaX;
      const xRight = xLeft + deltaX;
      const xMid = (xLeft + xRight) / 2;
      const h = normalPDF(xMid);
      // Closed polygon: bottom-left → bottom-right → top-right → top-left → close
      rectPts.push({ x: xLeft, y: 0 });
      rectPts.push({ x: xRight, y: 0 });
      rectPts.push({ x: xRight, y: h });
      rectPts.push({ x: xLeft, y: h });
      rectPts.push({ x: xLeft, y: 0 });
    }

    t.push({
      x: rectPts.map(p => p.x),
      y: rectPts.map(p => p.y),
      type: 'scatter', mode: 'lines',
      name: `n = ${n} rectangles`,
      line: { color: palette.mainTraces.secondary, width: 1.5 },
      fill: 'toself',
      fillcolor: rectColor,
      hovertemplate: ''
    });

    // 3. Vertical dashed lines at x=a, x=b (full plot height)
    const yPeak = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const yMax = yPeak * 1.15;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [aClamp, aClamp], y: [-yMax * 0.05, yMax],
      line: { color: palette.auxTraces.tangent, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bClamp, bClamp], y: [-yMax * 0.05, yMax],
      line: { color: palette.auxTraces.combined, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    return t;
  }, [mu, sigma, a, b, n, xRange, normalPDF, curveStep, palette, xMin, xMax]);

  // ── Annotations (a, b labels) ────────────────────────────
  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const aY = normalPDF(aClamp);
    const bY = normalPDF(bClamp);
    return [
      {
        x: aClamp, y: 0,
        text: 'a', showarrow: false,
        xanchor: 'center', yanchor: 'top',
        yshift: -10,
        font: { color: palette.auxTraces.tangent, size: 14, weight: 700 }
      },
      {
        x: bClamp, y: 0,
        text: 'b', showarrow: false,
        xanchor: 'center', yanchor: 'top',
        yshift: -10,
        font: { color: palette.auxTraces.secant, size: 14, weight: 700 }
      },
      {
        x: aClamp, y: aY,
        text: '(a, f(a))', showarrow: true,
        arrowhead: 2, arrowcolor: palette.auxTraces.tangent,
        ax: -30, ay: -30,
        font: { color: palette.auxTraces.tangent, size: 11 }
      },
      {
        x: bClamp, y: bY,
        text: '(b, f(b))', showarrow: true,
        arrowhead: 2, arrowcolor: palette.auxTraces.secant,
        ax: 30, ay: -30,
        font: { color: palette.auxTraces.secant, size: 11 }
      }
    ];
  }, [mu, sigma, a, b, xRange, normalPDF, xMin, xMax, palette]);

  // ── Computed values ──────────────────────────────────────
  const aClamp = Math.max(xMin, Math.min(xMax, a));
  const bClamp = Math.max(xMin, Math.min(xMax, b));
  const deltaX = aClamp < bClamp ? (bClamp - aClamp) / n : 0;

  let approxArea = 0;
  if (deltaX > 0) {
    for (let i = 0; i < n; i++) {
      const xMid = aClamp + (i + 0.5) * deltaX;
      approxArea += normalPDF(xMid) * deltaX;
    }
  }

  // Exact area via normal CDF
  const exactArea = normalCDF(bClamp, mu, sigma) - normalCDF(aClamp, mu, sigma);
  const error = Math.abs(approxArea - exactArea);
  const errorPct = exactArea > 1e-10 ? (error / exactArea) * 100 : 0;

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/summation">
          ← Back to Summation
        </BackButton>
        <SectionTitleH1>Area under the curve</SectionTitleH1>
      </Header>

      <SectionDescription>
        Approximate the area under a <strong>normal distribution</strong> curve
        N(μ, σ²) over the interval <strong>[a, b]</strong> using <strong>n</strong>
        rectangles of equal width. Each rectangle's height is evaluated at its
        midpoint (midpoint rule). As n increases, the approximation converges to
        the exact area given by the normal CDF: <strong>Φ(b) − Φ(a)</strong>.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Normal Distribution &amp; Rectangle Approximation:</FormulaTitle>
        <Formula>
          f(x) = (1/({fmt(sigma)}·√(2π))) · e<sup>−½((x−{fmt(mu)})/{fmt(sigma)})²</sup><br/><br/>
          a = {fmt(aClamp)} &nbsp; b = {fmt(bClamp)} &nbsp; n = {n}<br/>
          Δx = (b − a) / n = {fmt(deltaX)}<br/><br/>
          Approx Area = Σ f(xᵢ)·Δx = <strong>{fmt(approxArea)}</strong><br/>
          Exact Area = Φ(b) − Φ(a) = <strong>{fmt(exactArea)}</strong><br/>
          Error = <strong>{fmt(error)}</strong> ({fmt(errorPct, 2)}%)
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
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

          <ParameterSection title="Interval &amp; Rectangles">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (left)', min: -4, max: 4, step: 0.1 },
                { name: 'b', label: 'b (right)', min: -4, max: 4, step: 0.1 },
                { name: 'n', label: 'n (rectangles)', min: 1, max: 50, step: 1 }
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
          <SummationPlotter
            data={traces}
            xRange={xRange}
            title={`N(${fmt(mu)}, ${fmt(sigma)}²) — Area ≈ ${fmt(approxArea)}`}
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

export default AreaUnderCurve;

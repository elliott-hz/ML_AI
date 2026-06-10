// UI Pattern: StandardSinglePlot — normal distribution with rectangle area approximation
// Highlights one middle rectangle to show Δx_i and f(ξ_i)
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

function normalPDF(x, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

/**
 * RiemannSum — finite partition approximation with highlighted single rectangle
 *
 * A_i = f(ξ_i)·Δx_i
 * A ≈ Σ_{i=1}^{n} f(ξ_i)·Δx_i
 *
 * Highlights the middle rectangle to show Δx_i as a horizontal bracket
 * and f(ξ_i) as a vertical guide.
 */
const RiemannSum = () => {
  const [params, setParams] = useState({
    mu: 1.4,
    sigma: 3.0,
    a: 1.3,
    b: 7.7,
    n: 22,
    xRange: [1, 8],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { mu, sigma, a, b, n, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];

  // Normal PDF
  const fn = useCallback((x) => normalPDF(x, mu, sigma), [mu, sigma]);

  // ── Curve data ───────────────────────────────────────────
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];

    // 1. Normal curve
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ys = xs.map(fn);
    t.push({
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: `f(x) = N(${mu.toFixed(1)}, ${sigma.toFixed(1)})`,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp >= bClamp) return t;

    // ── Exact area fill ──
    const fillStep = (bClamp - aClamp) / 100;
    const fillXs = Array.from({ length: 101 }, (_, i) => aClamp + i * fillStep);
    const fillYs = fillXs.map(fn);
    t.push({
      x: fillXs, y: fillYs,
      type: 'scatter', mode: 'lines',
      fill: 'tozeroy', fillcolor: palette.fills.highlight,
      line: { width: 0 },
      showlegend: false, hoverinfo: 'none'
    });

    const deltaX = (bClamp - aClamp) / n;

    // 2. All rectangles
    const rectPts = [];
    const rectData = [];
    for (let i = 0; i < n; i++) {
      const xLeft = aClamp + i * deltaX;
      const xRight = xLeft + deltaX;
      const xMid = (xLeft + xRight) / 2;
      const h = fn(xMid);
      rectData.push({ xLeft, xRight, xMid, h });
      rectPts.push({ x: xLeft, y: 0 }, { x: xRight, y: 0 }, { x: xRight, y: h }, { x: xLeft, y: h }, { x: xLeft, y: 0 });
    }
    t.push({
      x: rectPts.map(p => p.x), y: rectPts.map(p => p.y),
      type: 'scatter', mode: 'lines',
      name: `n = ${n} rectangles`,
      line: { color: palette.mainTraces.secondary, width: 1.5 },
      fill: 'toself', fillcolor: palette.fills.primary,
      hovertemplate: ''
    });

    // ── Highlight middle rectangle ─────────────────────────
    const midIdx = Math.min(Math.floor(n / 2), rectData.length - 1);
    const { xLeft, xRight, xMid, h } = rectData[midIdx];
    const highlightColor = palette.auxTraces.combined;
    const yPeak = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const yMax = yPeak * 1.15;

    // Δx_i bracket (dashed horizontal line below x-axis, same level as a/b labels)
    const bracketY = -yMax * 0.03;
    const tickHalf = deltaX * 0.008;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [xLeft, xRight], y: [bracketY, bracketY],
      line: { color: highlightColor, width: 2.5, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    // Left tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [xLeft, xLeft], y: [bracketY - tickHalf, bracketY + tickHalf],
      line: { color: highlightColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });
    // Right tick
    t.push({
      type: 'scatter', mode: 'lines',
      x: [xRight, xRight], y: [bracketY - tickHalf, bracketY + tickHalf],
      line: { color: highlightColor, width: 2 },
      showlegend: false, hovertemplate: ''
    });

    // f(ξ_i) vertical guide (dashed, from x-axis to rectangle height)
    t.push({
      type: 'scatter', mode: 'lines',
      x: [xMid, xMid], y: [0, h],
      line: { color: highlightColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // 3. Vertical lines at a, b
    const auxColor = palette.auxTraces.tangent;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [aClamp, aClamp], y: [-yMax * 0.05, yMax],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bClamp, bClamp], y: [-yMax * 0.05, yMax],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    return t;
  }, [mu, sigma, a, b, n, xRange, fn, curveStep, palette, xMin, xMax]);

  // ── Annotations ──────────────────────────────────────────
  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp >= bClamp) return [];

    const deltaX = (bClamp - aClamp) / n;
    const midIdx = Math.min(Math.floor(n / 2), n - 1);
    const xLeft = aClamp + midIdx * deltaX;
    const xRight = xLeft + deltaX;
    const highlightColor = palette.auxTraces.combined;
    const yPeak = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const yMax = yPeak * 1.15;
    const xMid = (xLeft + xRight) / 2;
    const h = fn(xMid);

    return [
      // a label
      { x: aClamp, y: 0, text: 'a', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.tangent, size: 14, weight: 700 } },
      // b label
      { x: bClamp, y: 0, text: 'b', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: palette.auxTraces.tangent, size: 14, weight: 700 } },
      // Δx_i label below the bracket (same level as a/b)
      { x: (xLeft + xRight) / 2, y: -yMax * 0.03, text: 'Δxᵢ', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: highlightColor, size: 14, weight: 700 } },
      // f(ξ_i) label at top of vertical guide
      { x: xMid, y: h, text: 'f(ξᵢ)', showarrow: true, arrowhead: 2, arrowcolor: highlightColor, ax: 35, ay: -30, font: { color: highlightColor, size: 13, weight: 700 } }
    ];
  }, [mu, sigma, a, b, n, xRange, fn, xMin, xMax, palette]);

  // ── Computed values ──────────────────────────────────────
  const aClamp = Math.max(xMin, Math.min(xMax, a));
  const bClamp = Math.max(xMin, Math.min(xMax, b));
  const deltaX = aClamp < bClamp ? (bClamp - aClamp) / n : 0;

  let approxArea = 0;
  if (deltaX > 0) {
    for (let i = 0; i < n; i++) {
      const xMid = aClamp + (i + 0.5) * deltaX;
      approxArea += fn(xMid) * deltaX;
    }
  }

  const midIdx = Math.min(Math.floor(n / 2), Math.max(0, n - 1));
  const sampleLeft = aClamp + midIdx * deltaX;
  const sampleRight = sampleLeft + deltaX;
  const sampleMid = (sampleLeft + sampleRight) / 2;
  const sampleHeight = deltaX > 0 ? fn(sampleMid) : 0;
  const sampleArea = sampleHeight * deltaX;

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/summation">
          ← Back to Summation
        </BackButton>
        <SectionTitleH1>Riemann Sum</SectionTitleH1>
      </Header>

      <SectionDescription>
        Partition the interval <strong>[a, b]</strong> into <strong>n</strong> subintervals
        of equal width Δx = (b − a)/n. For each subinterval, pick a sample point ξᵢ
        (midpoint) and approximate the area under the curve by a rectangle of height
        f(ξᵢ) and width Δx.<br/><br/>
        The area of each small rectangle is:<br/>
        <strong>Aᵢ = f(ξᵢ) · Δx</strong><br/><br/>
        The approximate total area is:<br/>
        <strong>A ≈ Σᵢ₌₁ⁿ f(ξᵢ) · Δx</strong><br/><br/>
        The middle rectangle is highlighted to show Δxᵢ (horizontal bracket)
        and f(ξᵢ) (vertical dashed guide).
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Riemann Sum Approximation:</FormulaTitle>
        <Formula>
          f(x) = (1/({fmt(sigma)}·√(2π))) · e<sup>−½((x−{fmt(mu)})/{fmt(sigma)})²</sup><br/><br/>
          a = {fmt(aClamp)} &nbsp; b = {fmt(bClamp)} &nbsp; n = {n}<br/>
          Δx = (b − a) / n = {fmt(deltaX)}<br/><br/>
          <em>Middle rectangle (i = {midIdx + 1}):</em><br/>
          ξ = {fmt(sampleMid)} &nbsp; f(ξ) = {fmt(sampleHeight)}<br/>
          A<sub>i</sub> = f(ξ) · Δx = <strong>{fmt(sampleArea)}</strong><br/><br/>
          Total: A ≈ Σ f(ξᵢ)·Δx = <strong>{fmt(approxArea)}</strong>
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

          <ParameterSection title="Partition">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (left)', min: -8, max: 8, step: 0.1 },
                { name: 'b', label: 'b (right)', min: -8, max: 8, step: 0.1 },
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
            title={`A ≈ Σ f(ξᵢ)·Δx = ${fmt(approxArea)}`}
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

export default RiemannSum;

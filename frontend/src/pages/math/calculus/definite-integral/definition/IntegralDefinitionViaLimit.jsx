// UI Pattern: StandardSinglePlot — Riemann sum converges to definite integral as λ→0
// Shows left / right / midpoint sums converging to the exact integral value
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';
import DefiniteIntegralPlotter from '../../../../../components/visualization/DefiniteIntegralPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../../components/common/LayoutStyled';
import { legendPositionConfig } from '../../../../../constants/definiteIntegralConfig';

// ── Function definitions ──────────────────────────────────
// Keys are descriptive strings used directly as select option values
const FUNCTIONS = {
  'f(x) = x²/4 + 1': {
    fn: (x) => x * x / 4 + 1,
    antiderivative: (x) => x * x * x / 12 + x,  // F(x) = x³/12 + x
    exactLabel: (a, b, fmt) => {
      const val = (b * b * b / 12 + b) - (a * a * a / 12 + a);
      return `∫ₐᵇ (x²/4 + 1) dx = [x³/12 + x]ₐᵇ = ${fmt(val)}`;
    }
  },
  'f(x) = sin(x)': {
    fn: (x) => Math.sin(x),
    antiderivative: (x) => -Math.cos(x),  // F(x) = -cos(x)
    exactLabel: (a, b, fmt) => {
      const val = Math.cos(a) - Math.cos(b);
      return `∫ₐᵇ sin(x) dx = [-cos(x)]ₐᵇ = ${fmt(val)}`;
    }
  }
};

/**
 * IntegralDefinitionViaLimit — 定积分的极限定义
 *
 * ∫ₐᵇ f(x) dx = lim_{λ→0} Σ_{i=1}^{n} f(ξᵢ) · Δxᵢ
 *
 * Shows left / right / midpoint Riemann sums all converging
 * to the same definite integral value as n → ∞ (λ → 0).
 */
const IntegralDefinitionViaLimit = () => {
  const [params, setParams] = useState({
    funcKey: 'f(x) = x²/4 + 1',
    a: 0.2,
    b: 4.8,
    n: 5,
    rectType: 'midpoint',
    showError: true,
    xRange: [-0.5, 5.5],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { funcKey, a, b, n, rectType, showError, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const funcDef = FUNCTIONS[funcKey];
  const fn = funcDef.fn;
  const antiderivative = funcDef.antiderivative;

  // ── Exact integral ──────────────────────────────────────
  const exactIntegral = useMemo(() => {
    return antiderivative(b) - antiderivative(a);
  }, [antiderivative, a, b]);

  // ── Riemann sum calculation ─────────────────────────────
  const calcRiemannSum = useCallback((aVal, bVal, nVal, type) => {
    if (aVal >= bVal || nVal <= 0) return { sum: 0, points: [] };
    const deltaX = (bVal - aVal) / nVal;
    let sum = 0;
    const rects = [];
    for (let i = 0; i < nVal; i++) {
      let xi;
      if (type === 'left') xi = aVal + i * deltaX;
      else if (type === 'right') xi = aVal + (i + 1) * deltaX;
      else xi = aVal + (i + 0.5) * deltaX; // midpoint
      const h = fn(xi);
      sum += h * deltaX;
      rects.push({ xLeft: aVal + i * deltaX, xRight: aVal + (i + 1) * deltaX, height: h, sampleX: xi });
    }
    return { sum, deltaX, rects };
  }, [fn]);

  const riemann = useMemo(() => calcRiemannSum(a, b, n, rectType), [calcRiemannSum, a, b, n, rectType]);

  // Also compute left & right for reference display
  const riemannLeft = useMemo(() => calcRiemannSum(a, b, n, 'left'), [calcRiemannSum, a, b, n]);
  const riemannRight = useMemo(() => calcRiemannSum(a, b, n, 'right'), [calcRiemannSum, a, b, n]);
  const riemannMid = useMemo(() => calcRiemannSum(a, b, n, 'midpoint'), [calcRiemannSum, a, b, n]);

  const aClamp = Math.max(xMin, Math.min(xMax, a));
  const bClamp = Math.max(xMin, Math.min(xMax, b));
  const lambda = aClamp < bClamp ? (bClamp - aClamp) / n : 0;
  const error = Math.abs(riemann.sum - exactIntegral);
  const errorPct = Math.abs(exactIntegral) > 1e-10 ? (error / Math.abs(exactIntegral)) * 100 : 0;

  // ── Curve data ──────────────────────────────────────────
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];

    // 1. Function curve
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ys = xs.map(fn);
    t.push({
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: funcKey,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp >= bClamp) return t;

    // 2. Exact area fill under curve [a, b]
    const fillStep = (bClamp - aClamp) / 100;
    const fillXs = Array.from({ length: 101 }, (_, i) => aClamp + i * fillStep);
    const fillYs = fillXs.map(fn);
    t.push({
      x: fillXs, y: fillYs,
      type: 'scatter', mode: 'lines',
      fill: 'tozeroy',
      fillcolor: palette.fills.highlight,
      line: { width: 0 },
      name: 'Exact area',
      hovertemplate: ''
    });

    const deltaX = (bClamp - aClamp) / n;

    // 3. Rectangle polygon
    const rectPts = [];
    for (let i = 0; i < n; i++) {
      const { xLeft, xRight, height } = riemann.rects[i];
      rectPts.push({ x: xLeft, y: 0 });
      rectPts.push({ x: xRight, y: 0 });
      rectPts.push({ x: xRight, y: height });
      rectPts.push({ x: xLeft, y: height });
      rectPts.push({ x: xLeft, y: 0 });
    }
    t.push({
      x: rectPts.map(p => p.x), y: rectPts.map(p => p.y),
      type: 'scatter', mode: 'lines',
      name: `n = ${n} (${rectType})`,
      line: { color: palette.mainTraces.secondary, width: 1.5 },
      fill: 'toself',
      fillcolor: palette.fills.primary,
      hovertemplate: ''
    });

    // 4. Error regions (one per rectangle — handles crossing correctly)
    if (showError) {
      for (let i = 0; i < n; i++) {
        const { xLeft, xRight, height } = riemann.rects[i];
        // Fine-sample the curve within this rectangle
        const samples = 50;
        const polyPts = [];
        // Rectangle top (left → right)
        polyPts.push({ x: xLeft, y: height });
        polyPts.push({ x: xRight, y: height });
        // Curve back (right → left)
        for (let j = samples; j >= 0; j--) {
          const xi = xLeft + (xRight - xLeft) * j / samples;
          polyPts.push({ x: xi, y: fn(xi) });
        }
        // Close polygon
        polyPts.push(polyPts[0]);

        t.push({
          x: polyPts.map(p => p.x), y: polyPts.map(p => p.y),
          type: 'scatter', mode: 'lines',
          fill: 'toself',
          fillcolor: 'rgba(239, 68, 68, 0.25)',
          line: { width: 0 },
          showlegend: i === 0,
          name: i === 0 ? 'Error region' : undefined,
          hovertemplate: ''
        });
      }
    }

    // 5. Sample point markers (for current rectType)
    const sampleXs = riemann.rects.map(r => r.sampleX);
    const sampleYs = sampleXs.map(fn);
    t.push({
      x: sampleXs, y: sampleYs,
      type: 'scatter', mode: 'markers',
      marker: {
        color: palette.mainTraces.tertiary,
        size: 8,
        symbol: 'circle',
        line: { color: '#ffffff', width: 1 }
      },
      name: `ξᵢ (${rectType})`,
      hovertemplate: 'ξ: %{x:.2f}<br>f(ξ): %{y:.4f}<extra></extra>'
    });

    // 6. Vertical lines at a, b
    const auxColor = palette.auxTraces.tangent;
    const allYs = xs.map(fn);
    const yMaxPlot = Math.max(...allYs.filter(v => isFinite(v))) * 1.15;
    const yMinPlot = Math.min(0, Math.min(...allYs.filter(v => isFinite(v)))) * 1.15;
    t.push({
      type: 'scatter', mode: 'lines',
      x: [aClamp, aClamp], y: [yMinPlot, yMaxPlot],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bClamp, bClamp], y: [yMinPlot, yMaxPlot],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    // 7. Markers at (a, f(a)) and (b, f(b)) on the curve
    const fa = fn(aClamp);
    const fb = fn(bClamp);
    t.push({
      type: 'scatter', mode: 'markers',
      x: [aClamp, bClamp], y: [fa, fb],
      marker: {
        color: auxColor, size: 11,
        symbol: 'circle', line: { color: '#ffffff', width: 2 }
      },
      showlegend: false,
      hovertemplate: '(%{x:.2f}, %{y:.4f})<extra></extra>'
    });

    return t;
  }, [funcKey, fn, funcDef, a, b, n, rectType, showError, xRange, riemann, curveStep, palette, xMin, xMax]);

  // ── Annotations ──────────────────────────────────────────
  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const auxColor = palette.auxTraces.tangent;

    return [
      { x: aClamp, y: 0, text: 'a', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: 16, weight: 700 } },
      { x: bClamp, y: 0, text: 'b', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: 16, weight: 700 } }
    ];
  }, [a, b, xRange, xMin, xMax, palette]);

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/definite-integral">
          ← Back to Definite Integral
        </BackButton>
        <SectionTitleH1>Definition of the Definite Integral</SectionTitleH1>
      </Header>

      <SectionDescription>
        The definite integral is defined as the <strong>limit of Riemann sums</strong>
        as the partition norm λ → 0 (equivalently n → ∞):<br/><br/>
        <strong>∫ₐᵇ f(x) dx = lim<sub>λ→0</sub> Σ<sub>i=1</sub><sup>n</sup> f(ξᵢ) · Δxᵢ</strong><br/><br/>
        Choose <strong>left</strong>, <strong>right</strong>, or <strong>midpoint</strong>
        sample points — all three converge to the same value. The error region (shown in red)
        visually shrinks as n increases.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Definition of the Definite Integral:</FormulaTitle>
        <Formula>
          ∫ₐᵇ f(x) dx = lim<sub>λ→0</sub> Σ<sub>i=1</sub><sup>n</sup> f(ξᵢ) · Δxᵢ<br/><br/>
          {funcKey}<br/><br/>
          a = {fmt(aClamp)} &nbsp;
          b = {fmt(bClamp)} &nbsp;
          n = {n}<br/>
          λ = (b − a) / n = <strong>{fmt(lambda)}</strong><br/><br/>
          <em>Riemann sums (all converging to I = {fmt(exactIntegral)}):</em><br/>
          Left Sum:    I<sub>n</sub> = {fmt(riemannLeft.sum)} &nbsp; Error = {fmt(Math.abs(riemannLeft.sum - exactIntegral))}<br/>
          Right Sum:   I<sub>n</sub> = {fmt(riemannRight.sum)} &nbsp; Error = {fmt(Math.abs(riemannRight.sum - exactIntegral))}<br/>
          Midpoint Sum: I<sub>n</sub> = {fmt(riemannMid.sum)} &nbsp; Error = {fmt(Math.abs(riemannMid.sum - exactIntegral))}<br/><br/>
          <strong>Current ({rectType}):</strong> I<sub>n</sub> = {fmt(riemann.sum)} &nbsp;
          Error = {fmt(error)} ({fmt(errorPct, 2)}%)<br/>
          <strong>Exact: I = {fmt(exactIntegral)}</strong><br/><br/>
          {funcDef.exactLabel(aClamp, bClamp, fmt)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'funcKey', label: 'Function', type: 'select',
                  options: Object.keys(FUNCTIONS) }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Interval &amp; Partition">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (lower)', min: -6, max: 6, step: 0.1 },
                { name: 'b', label: 'b (upper)', min: -6, max: 6, step: 0.1 },
                { name: 'n', label: 'n (rectangles)', min: 1, max: 100, step: 1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Riemann Sum">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'rectType', label: 'Sample Point', type: 'select',
                  options: ['left', 'right', 'midpoint'] },
                { name: 'showError', label: 'Show Error Region', type: 'toggle' }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -8, max: 8, step: 0.5, default: [-1, 5] }
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
          <DefiniteIntegralPlotter
            data={traces}
            xRange={xRange}
            title={`∫ₐᵇ f(x)dx = lim λ→0  Σ f(ξᵢ)·Δxᵢ  —  Iₙ = ${fmt(riemann.sum)}  I = ${fmt(exactIntegral)}`}
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

export default IntegralDefinitionViaLimit;

// UI Pattern: StandardSinglePlot — Fundamental Theorem of Calculus
// FTC Part 1: φ'(x) = f(x)  —  FTC Part 2: ∫ₐᵇ f(x) dx = F(b) - F(a)
import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';
import IntegralFunctionPlotter from '../../../../../components/visualization/IntegralFunctionPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  FormulaBox, FormulaTitle, Formula,
  FunctionSection
} from '../../../../../components/common/LayoutStyled';
import { legendPositionConfig } from '../../../../../constants/integralFunctionConfig';

const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// Functions with known antiderivatives
const FUNCTIONS = {
  'f(x) = sin(x)': {
    fn: (x) => Math.sin(x),
    antiderivative: (x) => -Math.cos(x),
    label: 'f(x) = sin(x)'
  },
  'f(x) = cos(x)': {
    fn: (x) => Math.cos(x),
    antiderivative: (x) => Math.sin(x),
    label: 'f(x) = cos(x)'
  },
  'f(x) = x': {
    fn: (x) => x,
    antiderivative: (x) => x * x / 2,
    label: 'f(x) = x'
  },
  'f(x) = x²': {
    fn: (x) => x * x,
    antiderivative: (x) => x * x * x / 3,
    label: 'f(x) = x²'
  }
};

// Numerical derivative (central difference)
function derivative(fn, x, h = 1e-6) {
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

// Midpoint rule for definite integral
function approximateIntegral(fn, a, b, n = 200) {
  if (a >= b) return 0;
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += fn(a + (i + 0.5) * dx);
  }
  return sum * dx;
}

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

/**
 * FundamentalTheorem — visual verification of FTC Parts 1 & 2
 */
const FundamentalTheorem = () => {
  const [params, setParams] = useState({
    funcKey: 'f(x) = sin(x)',
    a: -2,
    b: 2,
    x: 0.5,
    xRange: [-4, 4],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const styleConfig = useMemo(() => {
    switch (params.plotStyle) {
      case 'thin': return { fontSize: 10 };
      case 'thick': return { fontSize: 16 };
      case 'extra-thick': return { fontSize: 18 };
      default: return { fontSize: 12 };
    }
  }, [params.plotStyle]);

  const { funcKey, a, b, x, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const aClamp = Math.max(xMin, Math.min(xMax, a));
  const bClamp = Math.max(xMin, Math.min(xMax, b));
  const xClamp = Math.max(xMin, Math.min(xMax, x));
  const funcDef = FUNCTIONS[funcKey];
  const fn = funcDef.fn;
  const F = funcDef.antiderivative;

  // Integral function φ(t) = ∫ₐᵗ f(u) du = F(t) - F(a)
  const phi = useCallback((t) => F(t) - F(a), [F, a]);

  // Derivative φ'(x) = f(x) (FTC Part 1)
  const phiPrimeAtX = derivative(phi, x);
  const fAtX = fn(x);

  // FTC Part 2: ∫ₐᵇ f(x) dx = F(b) - F(a)
  const exactIntegral = F(b) - F(a);
  const approxIntegral = approximateIntegral(fn, a, b);

  const curvePts = 300;
  const curveStep = (xMax - xMin) / curvePts;

  // ── Left Plot: φ(x) with tangent ────────────────────
  const leftTraces = useMemo(() => {
    const t = [];
    const primaryColor = palette.mainTraces.primary;
    const auxColor = palette.auxTraces.tangent;

    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const phiYs = xs.map(tVal => phi(tVal));

    // φ(x) curve
    t.push({
      x: xs, y: phiYs,
      type: 'scatter', mode: 'lines',
      line: { color: primaryColor, width: 3 },
      name: 'φ(x) = ∫ₐˣ f(t) dt',
      hovertemplate: 'x: %{x:.2f}<br>φ(x): %{y:.4f}<extra></extra>'
    });

    // Tangent line at x
    const xClamp = Math.max(xMin, Math.min(xMax, x));
    const phiX = phi(xClamp);
    const slope = phiPrimeAtX;
    const tanSpan = Math.max(1, (xMax - xMin) * 0.2);
    const tanX1 = xClamp - tanSpan;
    const tanX2 = xClamp + tanSpan;
    t.push({
      x: [tanX1, tanX2],
      y: [phiX + slope * (tanX1 - xClamp), phiX + slope * (tanX2 - xClamp)],
      type: 'scatter', mode: 'lines',
      line: { color: auxColor, width: 2, dash: 'solid' },
      name: `Tangent (slope = ${slope.toFixed(4)})`,
      hovertemplate: 'slope: %{y:.4f}<extra></extra>'
    });

    // Vertical dashed lines at a, b, x from x-axis up to φ curve (T-shape)
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const phiA = phi(aClamp);
    const phiB = phi(bClamp);
    // Line at a (φ(a)=0 so this is effectively a marker on x-axis)
    t.push({
      type: 'scatter', mode: 'lines',
      x: [aClamp, aClamp], y: [0, phiA],
      line: { color: auxColor, width: 1.5, dash: 'dot' },
      showlegend: false, hovertemplate: ''
    });
    // Line at b
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bClamp, bClamp], y: [0, phiB],
      line: { color: auxColor, width: 1.5, dash: 'dot' },
      showlegend: false, hovertemplate: ''
    });
    // Line at x
    t.push({
      type: 'scatter', mode: 'lines',
      x: [xClamp, xClamp], y: [0, phiX],
      line: { color: auxColor, width: 1.5, dash: 'dot' },
      showlegend: false, hovertemplate: ''
    });

    // Marker at (a, φ(a)) = (a, 0)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [aClamp], y: [phiA],
      marker: { color: auxColor, size: 10, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      showlegend: false,
      hovertemplate: 'φ(%{x:.2f}) = %{y:.4f}<extra></extra>'
    });

    // Marker at (x, φ(x))
    t.push({
      type: 'scatter', mode: 'markers',
      x: [xClamp], y: [phiX],
      marker: { color: auxColor, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      showlegend: false,
      hovertemplate: 'φ(%{x:.2f}) = %{y:.4f}<extra></extra>'
    });

    return t;
  }, [phi, a, b, x, xRange, xMin, xMax, curveStep, palette, phiPrimeAtX]);

  // ── Right Plot: f(x) with integral area ─────────────
  const rightTraces = useMemo(() => {
    const t = [];
    const primaryColor = palette.mainTraces.tertiary;
    const fillColor = palette.mainTraces.fill;

    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const fYs = xs.map(fn);

    // f(x) curve
    t.push({
      x: xs, y: fYs,
      type: 'scatter', mode: 'lines',
      line: { color: primaryColor, width: 3 },
      name: funcDef.label,
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const xClamp = Math.max(xMin, Math.min(xMax, x));

    // Reference area: a → b (faint neutral fill)
    const refLeft = Math.min(aClamp, bClamp);
    const refRight = Math.max(aClamp, bClamp);
    if (refRight > refLeft) {
      const refPts = Math.max(2, Math.round((refRight - refLeft) / curveStep));
      const refXs = Array.from({ length: refPts + 1 }, (_, i) => refLeft + i * (refRight - refLeft) / refPts);
      const refYs = refXs.map(fn);
      t.push({
        x: [...refXs, ...refXs.slice().reverse()],
        y: [...refYs, refYs.map(() => 0)].flat(),
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: 'rgba(148, 163, 184, 0.12)',
        line: { width: 0 },
        name: '∫ₐᵇ f(x) dx (reference)',
        showlegend: true,
        hovertemplate: ''
      });
    }

    // Dynamic area: a → x (the integral function value)
    const dynLeft = Math.min(aClamp, xClamp);
    const dynRight = Math.max(aClamp, xClamp);
    if (dynRight > dynLeft) {
      const dynPts = Math.max(2, Math.round((dynRight - dynLeft) / curveStep));
      const dynXs = Array.from({ length: dynPts + 1 }, (_, i) => dynLeft + i * (dynRight - dynLeft) / dynPts);
      const dynYs = dynXs.map(fn);
      t.push({
        x: [...dynXs, ...dynXs.slice().reverse()],
        y: [...dynYs, dynYs.map(() => 0)].flat(),
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: fillColor,
        line: { width: 0 },
        name: '∫ₐˣ f(x) dx (dynamic)',
        showlegend: true,
        hovertemplate: ''
      });
    }

    // Marker at current x on f(x)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [xClamp], y: [fn(xClamp)],
      marker: { color: primaryColor, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      showlegend: false,
      hovertemplate: 'f(%{x:.2f}) = %{y:.4f}<extra></extra>'
    });

    return t;
  }, [fn, funcDef, a, b, x, xRange, xMin, xMax, curveStep, palette]);

  // ── Annotations ──────────────────────────────────────────
  const leftAnnotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const xClamp = Math.max(xMin, Math.min(xMax, x));
    const auxColor = palette.auxTraces.tangent;
    const primaryColor = palette.mainTraces.primary;

    return [
      // Stacked "a / F(a)=0" at the φ(a) = 0 point
      { x: aClamp, y: 0, text: 'a', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      // b label
      { x: bClamp, y: 0, text: 'b', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      // x label
      { x: xClamp, y: 0, text: 'x', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: primaryColor, size: styleConfig.fontSize + 2, weight: 700 } },
      // F(a)=0 label floating above the (a, 0) marker
      {
        x: aClamp, y: phi(aClamp),
        text: 'F(a) = 0', showarrow: true,
        arrowhead: 2, arrowcolor: auxColor,
        ax: -35, ay: -20,
        font: { color: auxColor, size: styleConfig.fontSize, weight: 600 }
      },
      // F(x) label pointing to the curve marker
      {
        x: xClamp, y: phi(xClamp),
        text: 'F(x)', showarrow: true,
        arrowhead: 2, arrowcolor: auxColor,
        ax: 35, ay: -25,
        font: { color: auxColor, size: styleConfig.fontSize + 1, weight: 700 }
      }
    ];
  }, [a, b, x, xRange, xMin, xMax, palette, styleConfig, phi]);

  const rightAnnotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const xClamp = Math.max(xMin, Math.min(xMax, x));
    const auxColor = palette.auxTraces.tangent;
    const primaryColor = palette.mainTraces.primary;
    return [
      { x: aClamp, y: 0, text: 'a', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      { x: bClamp, y: 0, text: 'b', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      { x: xClamp, y: 0, text: 'x', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: primaryColor, size: styleConfig.fontSize + 2, weight: 700 } }
    ];
  }, [a, b, x, xRange, xMin, xMax, palette, styleConfig]);

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();
  const slopeMatch = Math.abs(phiPrimeAtX - fAtX) < 0.01;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/integral-function">
          ← Back to Integral Function
        </BackButton>
        <SectionTitleH1>Fundamental Theorem of Calculus</SectionTitleH1>
      </Header>

      <SectionDescription>
        The Fundamental Theorem of Calculus (FTC) connects integration and differentiation:
        <br/><br/>
        <strong>Part 1:</strong> If φ(x) = ∫ₐˣ f(t) dt, then φ'(x) = f(x).
        <br/>
        The <strong>left plot</strong> shows φ(x) with its tangent line — the slope
        of the tangent equals f(x) (the original function).<br/><br/>
        <strong>Part 2:</strong> ∫ₐᵇ f(x) dx = F(b) − F(a), where F is any antiderivative of f.
        <br/>
        The <strong>right plot</strong> shows f(x) with shaded area ∫ₐᵇ f(x) dx.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>FTC Part 1 — Verification at x = {fmt(xClamp)}:</FormulaTitle>
        <Formula>
          φ'(x) = {fmt(phiPrimeAtX, 6)} &nbsp;
          {slopeMatch ? '✅' : '⚠️'} &nbsp;
          f(x) = {fmt(fAtX, 6)}
          &nbsp;&nbsp;
          {slopeMatch ? 'φ\'(x) ≈ f(x) ✓' : '(difference due to numerical approximation)'}
        </Formula>
        <FormulaTitle style={{ marginTop: '1rem' }}>FTC Part 2 — ∫ₐᵇ f(x) dx:</FormulaTitle>
        <Formula>
          ∫ₐᵇ f(x) dx = {fmt(exactIntegral, 6)} &nbsp;
          (exact) &nbsp;&nbsp;
          F(b) − F(a) = {fmt(exactIntegral, 6)}
          <br/>
          Midpoint approx (n=200): {fmt(approxIntegral, 6)}
          &nbsp; | &nbsp;
          a = {fmt(aClamp)}, b = {fmt(bClamp)}
        </Formula>
      </FormulaBox>

      <FunctionSection>
        <ControlsRow>
          <ParameterSection title="Function">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'funcKey', label: 'Function', type: 'select', options: Object.keys(FUNCTIONS) }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Parameters">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'Lower bound (a)', min: -4, max: 4, step: 0.1 },
                { name: 'b', label: 'Upper bound (b)', min: -4, max: 4, step: 0.1 },
                { name: 'x', label: 'Evaluation point (x)', min: -4, max: 4, step: 0.1 }
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
                ...legendPositionConfig,
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
              ]}
            />
          </ParameterSection>
        </ControlsRow>
      </FunctionSection>

      <PlotGrid2>
        <div>
          <IntegralFunctionPlotter
            data={leftTraces}
            xRange={xRange}
            title={`φ(x) = ∫ₐˣ f(t) dt`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            annotations={leftAnnotations}
          />
        </div>
        <div>
          <IntegralFunctionPlotter
            data={rightTraces}
            xRange={xRange}
            title={funcDef.label}
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

export default FundamentalTheorem;

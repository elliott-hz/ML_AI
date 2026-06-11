// UI Pattern: StandardSinglePlot — First vs Second Order Approximation
// Shows how 1st derivative determines direction (increase/decrease) while
// 2nd derivative determines curvature (bowl up/bowl down)
import React, { useState, useMemo, useCallback } from 'react';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { getTracePalette, ASPECT_RATIO_OPTIONS } from '../../../../constants/plotThemeConfig';
import DerivativeLocalApproximationPlotter from '../../../../components/visualization/DerivativeLocalApproximationPlotter';
import ParameterControls from '../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../components/visualization/ParameterSection';
import BackButton from '../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../components/common/LayoutStyled';
import { commonParamsConfig } from '../../../../constants/derivativeLocalApproximationConfig';

// Functions with 1st and 2nd derivatives
const FUNCTIONS = {
  'eˣ': {
    fn: (x) => Math.exp(x),
    fn1: (x) => Math.exp(x),
    fn2: (x) => Math.exp(x),
    label: 'f(x) = eˣ'
  },
  'sin(x)': {
    fn: (x) => Math.sin(x),
    fn1: (x) => Math.cos(x),
    fn2: (x) => -Math.sin(x),
    label: 'f(x) = sin(x)'
  },
  '1/(1+x)': {
    fn: (x) => 1 / (1 + x),
    fn1: (x) => -1 / ((1 + x) * (1 + x)),
    fn2: (x) => 2 / ((1 + x) * (1 + x) * (1 + x)),
    label: 'f(x) = 1/(1+x)',
    domainMin: -0.95
  },
  'ln(1+x)': {
    fn: (x) => Math.log(1 + x),
    fn1: (x) => 1 / (1 + x),
    fn2: (x) => -1 / ((1 + x) * (1 + x)),
    label: 'f(x) = ln(1+x)',
    domainMin: -0.95
  },
  'x²': {
    fn: (x) => x * x,
    fn1: (x) => 2 * x,
    fn2: (x) => 2,
    label: 'f(x) = x²'
  }
};

const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();
const signStr = (v) => v > 0 ? '> 0' : v < 0 ? '< 0' : '= 0';

/**
 * FirstVsSecondOrderApproximation — compare 1st-order (tangent) vs 2nd-order (quadratic) approximation
 */
const FirstVsSecondOrderApproximation = () => {
  const [params, setParams] = useState({
    funcKey: '1/(1+x)',
    x0: 0,
    showTangent: true,
    showQuadratic: true,
    xRange: [-3, 3],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { funcKey, x0, showTangent, showQuadratic, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const funcDef = FUNCTIONS[funcKey];
  const fn = funcDef.fn;
  const fn1 = funcDef.fn1;
  const fn2 = funcDef.fn2;
  const domainMin = funcDef.domainMin || -Infinity;

  // Clamp x0 to a reasonable range within the view
  const x0Clamp = Math.max(xMin, Math.min(xMax, x0));

  // Compute derivatives at x0
  const f0 = fn(x0Clamp);
  const f1 = fn1(x0Clamp);
  const f2 = fn2(x0Clamp);

  // Tangent line P₁(x) = f(x₀) + f'(x₀)(x - x₀)
  const tangent = useCallback((x) => f0 + f1 * (x - x0Clamp), [f0, f1, x0Clamp]);

  // Quadratic approximation P₂(x) = P₁(x) + ½ f''(x₀)(x - x₀)²
  const quadratic = useCallback((x) => f0 + f1 * (x - x0Clamp) + 0.5 * f2 * (x - x0Clamp) * (x - x0Clamp), [f0, f1, f2, x0Clamp]);

  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;
  const xs = useMemo(
    () => Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep),
    [xMin, xMax, curvePts, curveStep]
  );

  const traces = useMemo(() => {
    const t = [];
    const primaryColor = palette.mainTraces.primary;
    const tangentColor = palette.auxTraces.tangent;
    const secondaryColor = palette.mainTraces.secondary;

    // Filter domain for functions with restrictions
    const domainXs = xs.filter(x => x > domainMin);
    const fYs = domainXs.map(fn);
    const tanYs = domainXs.map(tangent);
    const quadYs = domainXs.map(quadratic);

    // 1. Original function
    t.push({
      x: domainXs, y: fYs,
      type: 'scatter', mode: 'lines',
      line: { color: primaryColor, width: 3.5 },
      name: funcDef.label,
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    // 2. Tangent line (1st order)
    if (showTangent) {
      t.push({
        x: domainXs, y: tanYs,
        type: 'scatter', mode: 'lines',
        line: { color: tangentColor, width: 3, dash: 'dash' },
        name: `P₁(x) = ${fmt(f0)} + ${fmt(f1)}(x − ${fmt(x0Clamp)})`,
        hovertemplate: 'x: %{x:.2f}<br>P₁(x): %{y:.4f}<extra></extra>'
      });
    }

    // 3. Quadratic approximation (2nd order)
    if (showQuadratic) {
      t.push({
        x: domainXs, y: quadYs,
        type: 'scatter', mode: 'lines',
        line: { color: secondaryColor, width: 3, dash: 'dot' },
        name: `P₂(x) = P₁(x) + ½·${fmt(f2)}(x − ${fmt(x0Clamp)})²`,
        hovertemplate: 'x: %{x:.2f}<br>P₂(x): %{y:.4f}<extra></extra>'
      });
    }

    // 4. Marker at (x₀, f(x₀))
    t.push({
      type: 'scatter', mode: 'markers',
      x: [x0Clamp], y: [f0],
      marker: { color: primaryColor, size: 14, symbol: 'circle', line: { color: '#ffffff', width: 2.5 } },
      showlegend: false,
      hovertemplate: `x₀ = ${fmt(x0Clamp)}<br>f(x₀) = ${fmt(f0)}<extra></extra>`
    });

    return t;
  }, [xs, fn, tangent, quadratic, showTangent, showQuadratic, x0Clamp, f0, f1, f2, funcDef, domainMin, palette]);

  // Annotations for derivative role labels
  const annotations = useMemo(() => {
    const tangentColor = palette.auxTraces.tangent;
    const secondaryColor = palette.mainTraces.secondary;
    const primaryColor = palette.mainTraces.primary;
    const fs = 12;

    const arr = [];

    // f'(x₀) annotation — above/below the tangent near x₀
    const f1Sign = f1 > 0 ? 'increasing ↗' : f1 < 0 ? 'decreasing ↘' : 'stationary →';
    arr.push({
      x: x0Clamp + 0.8, y: tangent(x0Clamp + 0.8),
      text: `f'(x₀) ${signStr(f1)}  → ${f1Sign}`,
      showarrow: false,
      font: { color: tangentColor, size: fs, weight: 600 }
    });

    // f''(x₀) annotation — below the quadratic label
    const f2Sign = f2 > 0 ? 'bowl up ∪' : f2 < 0 ? 'bowl down ∩' : 'no curvature −';
    arr.push({
      x: x0Clamp + 0.8, y: quadratic(x0Clamp + 0.8) - 0.5,
      text: `f''(x₀) ${signStr(f2)}  → ${f2Sign}`,
      showarrow: false,
      font: { color: secondaryColor, size: fs, weight: 600 }
    });

    return arr;
  }, [x0Clamp, f1, f2, tangent, quadratic, palette]);

  const differenceDescription = useMemo(() => {
    const f1Sign = f1 > 0 ? 'increasing' : f1 < 0 ? 'decreasing' : 'stationary';
    const f2Bowl = f2 > 0 ? 'bowl up (convex ∪)' : f2 < 0 ? 'bowl down (concave ∩)' : 'linear (no curvature)';
    return `At x₀ = ${fmt(x0Clamp)}:  f'(x₀) = ${fmt(f1)} → function is ${f1Sign}.  f''(x₀) = ${fmt(f2)} → curvature is ${f2Bowl}.`;
  }, [x0Clamp, f1, f2]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/3-taylor-formula/derivative-local-approximation">
          ← Back to Derivative Local Approximation
        </BackButton>
        <SectionTitleH1>First vs Second Order Approximation</SectionTitleH1>
      </Header>

      <SectionDescription>
        The <strong>first derivative</strong> f'(x₀) tells us the direction: is the function increasing or decreasing
        at this point? The <strong>second derivative</strong> f''(x₀) tells us the curvature: is the function bending
        upward or downward in a neighborhood? Together, they reveal the limitation of linear approximation
        and motivate why we need higher-order (polynomial) terms for a better fit.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Roles of Each Derivative:</FormulaTitle>
        <Formula>
          <strong>1st derivative</strong> f'(x₀) &nbsp;→&nbsp; direction (tangent slope)<br/>
          <strong>2nd derivative</strong> f''(x₀) &nbsp;→&nbsp; curvature (bowl up / bowl down)<br/><br/>
          Tangent (1st order): &nbsp; P₁(x) = f(x₀) + f'(x₀)(x − x₀)<br/>
          Quadratic (2nd order): &nbsp; P₂(x) = P₁(x) + ½ f''(x₀)(x − x₀)²
        </Formula>
        <Formula>
          {differenceDescription}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'funcKey', label: 'Function', type: 'select', options: Object.keys(FUNCTIONS) }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Expansion Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -4, max: 4, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Approximation">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'showTangent', label: 'Show Tangent (1st order)', type: 'toggle' },
                { name: 'showQuadratic', label: 'Show Quadratic (2nd order)', type: 'toggle' }
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
        </ControlsPanel>
        <PlotPanel>
          <DerivativeLocalApproximationPlotter
            data={traces}
            xRange={xRange}
            title={`${funcDef.label} — Local Approximation`}
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

export default FirstVsSecondOrderApproximation;

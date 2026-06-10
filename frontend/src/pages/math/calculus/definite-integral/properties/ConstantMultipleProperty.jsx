// UI Pattern: StandardSinglePlot — Constant Multiple Property of Definite Integral
// ∫ₐᵇ k·f(x) dx = k · ∫ₐᵇ f(x) dx
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

function approximateIntegral(fn, a, b, n = 200) {
  if (a >= b) return 0;
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += fn(a + (i + 0.5) * dx);
  }
  return sum * dx;
}

const FUNCTIONS = {
  'f(x) = x²/4 + 1': {
    fn: (x) => x * x / 4 + 1
  },
  'f(x) = sin(x) + 1.5': {
    fn: (x) => Math.sin(x) + 1.5
  },
  'f(x) = e^(x/4)': {
    fn: (x) => Math.exp(x / 4)
  }
};

/**
 * ConstantMultipleProperty — visual verification of ∫k·f = k·∫f
 *
 * ∫ₐᵇ k·f(x) dx = k · ∫ₐᵇ f(x) dx
 */
const ConstantMultipleProperty = () => {
  const [params, setParams] = useState({
    funcKey: 'f(x) = x²/4 + 1',
    k: 2,
    a: 0,
    b: 4,
    xRange: [-1, 5],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { funcKey, k, a, b, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const funcDef = FUNCTIONS[funcKey];
  const fn = funcDef.fn;

  const integralF = useMemo(() => approximateIntegral(fn, a, b), [fn, a, b]);
  const kfFn = useCallback((x) => k * fn(x), [k, fn]);
  const integralKf = useMemo(() => approximateIntegral(kfFn, a, b), [kfFn, a, b]);
  const expected = k * integralF;
  const diff = Math.abs(integralKf - expected);

  // Curve data
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ysF = xs.map(fn);
    const ysKf = xs.map(kfFn);

    // f(x)
    t.push({
      x: xs, y: ysF,
      type: 'scatter', mode: 'lines',
      name: funcKey,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    // k·f(x)
    t.push({
      x: xs, y: ysKf,
      type: 'scatter', mode: 'lines',
      name: `${k}·f(x)`,
      line: { color: palette.mainTraces.tertiary, width: 3, dash: 'dash' },
      hovertemplate: 'x: %{x:.2f}<br>k·f(x): %{y:.4f}<extra></extra>'
    });

    // Fills
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp < bClamp) {
      const fillN = 100;
      const fillStep = (bClamp - aClamp) / fillN;
      const fillXs = Array.from({ length: fillN + 1 }, (_, i) => aClamp + i * fillStep);
      t.push({
        x: fillXs, y: fillXs.map(fn),
        type: 'scatter', mode: 'lines',
        fill: 'tozeroy', fillcolor: `${palette.mainTraces.primary}40`,
        line: { width: 0 },
        name: `∫f(x) dx`, hovertemplate: ''
      });
      t.push({
        x: fillXs, y: fillXs.map(kfFn),
        type: 'scatter', mode: 'lines',
        fill: 'tozeroy', fillcolor: `${palette.mainTraces.tertiary}30`,
        line: { width: 0 },
        name: `∫${k}·f(x) dx`, hovertemplate: ''
      });
    }

    // Vertical lines at a, b
    const allYs = [...ysF, ...ysKf].filter(v => isFinite(v));
    const yMaxPlot = Math.max(...allYs) * 1.15;
    const yMinPlot = Math.min(0, Math.min(...allYs)) * 1.15;
    const auxColor = palette.auxTraces.tangent;
    const aClamped = Math.max(xMin, Math.min(xMax, a));
    const bClamped = Math.max(xMin, Math.min(xMax, b));
    t.push({
      type: 'scatter', mode: 'lines',
      x: [aClamped, aClamped], y: [yMinPlot, yMaxPlot],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });
    t.push({
      type: 'scatter', mode: 'lines',
      x: [bClamped, bClamped], y: [yMinPlot, yMaxPlot],
      line: { color: auxColor, width: 2, dash: 'dash' },
      showlegend: false, hovertemplate: ''
    });

    return t;
  }, [funcDef, fn, kfFn, k, a, b, xRange, curveStep, palette, xMin, xMax]);

  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const auxColor = palette.auxTraces.tangent;
    return [
      { x: aClamp, y: 0, text: 'a', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: 14, weight: 700 } },
      { x: bClamp, y: 0, text: 'b', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: 14, weight: 700 } }
    ];
  }, [a, b, xRange, xMin, xMax, palette]);

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/definite-integral">
          ← Back to Definite Integral
        </BackButton>
        <SectionTitleH1>Constant Multiple Property</SectionTitleH1>
      </Header>

      <SectionDescription>
        A constant factor can be moved outside the integral:
        <br/><br/>
        <strong>∫ₐᵇ k·f(x) dx = k · ∫ₐᵇ f(x) dx</strong>
        <br/><br/>
        Geometrically, multiplying a function by a constant <strong>k</strong> scales
        the area under the curve by the same factor.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Verification:</FormulaTitle>
        <Formula>
          ∫ₐᵇ k·f(x) dx = k · ∫ₐᵇ f(x) dx<br/><br/>
          k = {fmt(k)}<br/>
          a = {fmt(Math.max(xMin, Math.min(xMax, a)))} &nbsp;
          b = {fmt(Math.max(xMin, Math.min(xMax, b)))}<br/><br/>
          ∫ f(x) dx = <strong>{fmt(integralF)}</strong><br/>
          k · ∫ f(x) dx = {fmt(k)} × {fmt(integralF)} = <strong>{fmt(expected)}</strong><br/>
          ∫ k·f(x) dx = <strong>{fmt(integralKf)}</strong><br/><br/>
          Difference: <strong>{fmt(diff)}</strong> &nbsp;
          {diff < 0.01 ? '✅ Property holds' : '⚠️ Small numerical error'}
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
                  options: Object.keys(FUNCTIONS) },
                { name: 'k', label: 'k (constant multiplier)', min: 0.2, max: 5, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Interval">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (lower)', min: -4, max: 6, step: 0.1 },
                { name: 'b', label: 'b (upper)', min: -4, max: 6, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -6, max: 8, step: 0.5, default: [-1, 5] }
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
            title={`∫k·f = ${fmt(integralKf)}  =  k·∫f = ${fmt(k)} × ${fmt(integralF)} = ${fmt(expected)}`}
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

export default ConstantMultipleProperty;

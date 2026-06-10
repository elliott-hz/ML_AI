// UI Pattern: StandardSinglePlot — Sum or Difference Property of Definite Integral
// ∫[f(x) ± g(x)]dx = ∫f(x)dx ± ∫g(x)dx
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

// Riemann sum via midpoint rule
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
  'f(x)=3+sin(x), g(x)=1+0.8cos(x)': {
    labelF: 'f(x) = 3 + sin(x)',
    labelG: 'g(x) = 1 + 0.8cos(x)',
    f: (x) => 3 + Math.sin(x),
    g: (x) => 1 + 0.8 * Math.cos(x)
  },
  'f(x)=√(x+2), g(x)=0.5x': {
    labelF: 'f(x) = √(x + 2)',
    labelG: 'g(x) = 0.5·x',
    f: (x) => Math.sqrt(Math.max(0, x + 2)),
    g: (x) => 0.5 * x
  }
};

/**
 * SumOrDifferenceProperty — visual verification of integral linearity (sum/difference)
 *
 * ∫_a^b [f(x) ± g(x)] dx = ∫_a^b f(x) dx ± ∫_a^b g(x) dx
 */
const SumOrDifferenceProperty = () => {
  const [params, setParams] = useState({
    funcPair: 'f(x)=3+sin(x), g(x)=1+0.8cos(x)',
    mode: 'sum',     // 'sum' or 'difference'
    a: 0,
    b: 4,
    xRange: [-1, 5],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // Style config matching DefiniteIntegralPlotter's mapping
  const styleConfig = useMemo(() => {
    switch (params.plotStyle) {
      case 'thin': return { fontSize: 10 };
      case 'thick': return { fontSize: 16 };
      case 'extra-thick': return { fontSize: 18 };
      default: return { fontSize: 12 };
    }
  }, [params.plotStyle]);

  const { funcPair, mode, a, b, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const pair = FUNCTIONS[funcPair];

  // Approximate integrals
  const integralF = useMemo(() => approximateIntegral(pair.f, a, b), [pair.f, a, b]);
  const integralG = useMemo(() => approximateIntegral(pair.g, a, b), [pair.g, a, b]);
  const combinedFn = useCallback((x) => mode === 'sum' ? pair.f(x) + pair.g(x) : pair.f(x) - pair.g(x), [pair, mode]);
  const integralCombined = useMemo(() => approximateIntegral(combinedFn, a, b), [combinedFn, a, b]);
  const expected = mode === 'sum' ? integralF + integralG : integralF - integralG;
  const diff = Math.abs(integralCombined - expected);

  // Curve data
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ysF = xs.map(pair.f);
    const ysG = xs.map(pair.g);
    const ysCombined = xs.map(combinedFn);

    // f(x)
    t.push({
      x: xs, y: ysF,
      type: 'scatter', mode: 'lines',
      name: pair.labelF,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });
    // g(x)
    t.push({
      x: xs, y: ysG,
      type: 'scatter', mode: 'lines',
      name: pair.labelG,
      line: { color: palette.mainTraces.secondary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>g(x): %{y:.4f}<extra></extra>'
    });

    // f ± g
    const combinedLabel = mode === 'sum' ? 'f(x) + g(x)' : 'f(x) − g(x)';
    t.push({
      x: xs, y: ysCombined,
      type: 'scatter', mode: 'lines',
      name: combinedLabel,
      line: { color: palette.mainTraces.tertiary, width: 3, dash: 'dash' },
      hovertemplate: 'x: %{x:.2f}<br>%{y:.4f}<extra></extra>'
    });

    // Fill under f between [a,b]
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp < bClamp) {
      const fillN = 100;
      const fillStep = (bClamp - aClamp) / fillN;
      const fillXs = Array.from({ length: fillN + 1 }, (_, i) => aClamp + i * fillStep);
      t.push({
        x: fillXs, y: fillXs.map(pair.f),
        type: 'scatter', mode: 'lines',
        fill: 'tozeroy', fillcolor: `${palette.mainTraces.primary}40`,
        line: { width: 0 },
        name: '∫f(x) dx', hovertemplate: ''
      });
      t.push({
        x: fillXs, y: fillXs.map(pair.g),
        type: 'scatter', mode: 'lines',
        fill: 'tozeroy', fillcolor: `${palette.mainTraces.secondary}40`,
        line: { width: 0 },
        name: '∫g(x) dx', hovertemplate: ''
      });
    }

    // Vertical lines at a, b
    const allYs = [...ysF, ...ysG, ...ysCombined].filter(v => isFinite(v));
    const yMaxPlot = Math.max(...allYs) * 1.15;
    const yMinPlot = Math.min(0, Math.min(...allYs)) * 1.15;
    const auxColor = palette.auxTraces.tangent;
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

    return t;
  }, [pair, combinedFn, mode, a, b, xRange, curveStep, palette, xMin, xMax]);

  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const auxColor = palette.auxTraces.tangent;
    return [
      { x: aClamp, y: 0, text: 'a', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      { x: bClamp, y: 0, text: 'b', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } }
    ];
  }, [a, b, xRange, xMin, xMax, palette, styleConfig]);

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();
  const modeSymbol = mode === 'sum' ? '+' : '−';

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/definite-integral">
          ← Back to Definite Integral
        </BackButton>
        <SectionTitleH1>Sum &amp; Difference Property</SectionTitleH1>
      </Header>

      <SectionDescription>
        The definite integral is <strong>linear</strong> with respect to addition and subtraction:
        <br/><br/>
        <strong>∫ₐᵇ [f(x) ± g(x)] dx = ∫ₐᵇ f(x) dx ± ∫ₐᵇ g(x) dx</strong>
        <br/><br/>
        This means the integral of a sum (or difference) equals the sum (or difference)
        of the individual integrals.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Verification:</FormulaTitle>
        <Formula>
          ∫ₐᵇ [f(x) {modeSymbol} g(x)] dx = ∫ₐᵇ f(x) dx {modeSymbol} ∫ₐᵇ g(x) dx<br/><br/>
          a = {fmt(Math.max(xMin, Math.min(xMax, a)))} &nbsp;
          b = {fmt(Math.max(xMin, Math.min(xMax, b)))}<br/><br/>
          ∫ f(x) dx = <strong>{fmt(integralF)}</strong><br/>
          ∫ g(x) dx = <strong>{fmt(integralG)}</strong><br/>
          ∫ f(x) dx {modeSymbol} ∫ g(x) dx = <strong>{fmt(expected)}</strong><br/>
          ∫ [f(x) {modeSymbol} g(x)] dx = <strong>{fmt(integralCombined)}</strong><br/><br/>
          Difference: <strong>{fmt(diff)}</strong> &nbsp;
          {diff < 0.01 ? '✅ Property holds' : '⚠️ Small numerical error'}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Pair">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'funcPair', label: 'Functions', type: 'select',
                  options: Object.keys(FUNCTIONS) },
                { name: 'mode', label: 'Operation', type: 'select',
                  options: ['sum', 'difference'] }
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
            title={`∫[f${modeSymbol}g] = ${fmt(integralCombined)}  =  ∫f ${modeSymbol} ∫g = ${fmt(expected)}`}
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

export default SumOrDifferenceProperty;

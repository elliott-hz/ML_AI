// UI Pattern: StandardSinglePlot — Integral Additivity Property (Interval Additivity)
// ∫ₐᵇ f(x) dx + ∫ᵇᶜ f(x) dx = ∫ₐᶜ f(x) dx
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
  'f(x) = sin(x) + 2': {
    fn: (x) => Math.sin(x) + 2
  },
  'f(x) = (x−2)³/8 + 2': {
    fn: (x) => Math.pow(x - 2, 3) / 8 + 2
  }
};

/**
 * IntegralAdditivityProperty — visual verification of ∫ₐᵇ + ∫ᵇᶜ = ∫ₐᶜ
 */
const IntegralAdditivityProperty = () => {
  const [params, setParams] = useState({
    funcKey: 'f(x) = x²/4 + 1',
    a: 0,
    b: 2.5,
    c: 5,
    xRange: [-1, 6],
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

  const { funcKey, a, b, c, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const funcDef = FUNCTIONS[funcKey];
  const fn = funcDef.fn;

  const integralAB = useMemo(() => approximateIntegral(fn, a, b), [fn, a, b]);
  const integralBC = useMemo(() => approximateIntegral(fn, b, c), [fn, b, c]);
  const integralAC = useMemo(() => approximateIntegral(fn, a, c), [fn, a, c]);
  const sumABBC = integralAB + integralBC;
  const diff = Math.abs(integralAC - sumABBC);

  // Curve data
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ys = xs.map(fn);

    // Curve
    t.push({
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: funcKey,
      line: { color: palette.mainTraces.primary, width: 3 },
      hovertemplate: 'x: %{x:.2f}<br>f(x): %{y:.4f}<extra></extra>'
    });

    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const cClamp = Math.max(xMin, Math.min(xMax, c));

    // Fill [a, b] in primary color
    if (aClamp < bClamp) {
      const fillN = 80;
      const fillStepAB = (bClamp - aClamp) / fillN;
      const fillXsAB = Array.from({ length: fillN + 1 }, (_, i) => aClamp + i * fillStepAB);
      t.push({
        x: fillXsAB, y: fillXsAB.map(fn),
        type: 'scatter', mode: 'lines',
        fill: 'tozeroy', fillcolor: `${palette.mainTraces.primary}60`,
        line: { width: 0 },
        name: '∫ₐᵇ f(x) dx', hovertemplate: ''
      });
    }

    // Fill [b, c] in secondary color
    if (bClamp < cClamp) {
      const fillN = 80;
      const fillStepBC = (cClamp - bClamp) / fillN;
      const fillXsBC = Array.from({ length: fillN + 1 }, (_, i) => bClamp + i * fillStepBC);
      t.push({
        x: fillXsBC, y: fillXsBC.map(fn),
        type: 'scatter', mode: 'lines',
        fill: 'tozeroy', fillcolor: `${palette.mainTraces.secondary}60`,
        line: { width: 0 },
        name: '∫ᵇᶜ f(x) dx', hovertemplate: ''
      });
    }

    // Vertical lines at a, b, c
    const allYs = ys.filter(v => isFinite(v));
    const yMaxPlot = Math.max(...allYs) * 1.15;
    const yMinPlot = Math.min(0, Math.min(...allYs)) * 1.15;
    const auxColor = palette.auxTraces.tangent;

    const addVertLine = (xVal, label) => {
      const xClamped = Math.max(xMin, Math.min(xMax, xVal));
      t.push({
        type: 'scatter', mode: 'lines',
        x: [xClamped, xClamped], y: [yMinPlot, yMaxPlot],
        line: { color: auxColor, width: 2, dash: 'dash' },
        showlegend: false, hovertemplate: ''
      });
    };
    addVertLine(a, 'a');
    addVertLine(b, 'b');
    addVertLine(c, 'c');

    return t;
  }, [funcDef, fn, a, b, c, xRange, curveStep, palette, xMin, xMax]);

  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    const cClamp = Math.max(xMin, Math.min(xMax, c));
    const auxColor = palette.auxTraces.tangent;
    return [
      { x: aClamp, y: 0, text: 'a', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      { x: bClamp, y: 0, text: 'b', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      { x: cClamp, y: 0, text: 'c', showarrow: false, xanchor: 'center', yanchor: 'top', yshift: -10, font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } }
    ];
  }, [a, b, c, xRange, xMin, xMax, palette, styleConfig]);

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/definite-integral">
          ← Back to Definite Integral
        </BackButton>
        <SectionTitleH1>Integral Additivity (Interval) Property</SectionTitleH1>
      </Header>

      <SectionDescription>
        The definite integral is <strong>additive</strong> over adjacent intervals:
        <br/><br/>
        <strong>∫ₐᵇ f(x) dx + ∫ᵇᶜ f(x) dx = ∫ₐᶜ f(x) dx</strong>
        <br/><br/>
        The total area from <strong>a</strong> to <strong>c</strong> equals the sum of
        the area from <strong>a</strong> to <strong>b</strong> plus the area from
        <strong>b</strong> to <strong>c</strong>.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Verification:</FormulaTitle>
        <Formula>
          ∫ₐᵇ f(x) dx + ∫ᵇᶜ f(x) dx = ∫ₐᶜ f(x) dx<br/><br/>
          a = {fmt(Math.max(xMin, Math.min(xMax, a)))} &nbsp;
          b = {fmt(Math.max(xMin, Math.min(xMax, b)))} &nbsp;
          c = {fmt(Math.max(xMin, Math.min(xMax, c)))}<br/><br/>
          ∫ₐᵇ f(x) dx = <strong>{fmt(integralAB)}</strong><br/>
          ∫ᵇᶜ f(x) dx = <strong>{fmt(integralBC)}</strong><br/>
          ∫ₐᵇ + ∫ᵇᶜ = <strong>{fmt(sumABBC)}</strong><br/>
          ∫ₐᶜ f(x) dx = <strong>{fmt(integralAC)}</strong><br/><br/>
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
                  options: Object.keys(FUNCTIONS) }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Split Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (left)', min: -4, max: 6, step: 0.1 },
                { name: 'b', label: 'b (split point)', min: -4, max: 6, step: 0.1 },
                { name: 'c', label: 'c (right)', min: -4, max: 6, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -6, max: 8, step: 0.5, default: [-1, 6] }
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
            title={`∫ₐᵇ + ∫ᵇᶜ = ${fmt(sumABBC)}  =  ∫ₐᶜ = ${fmt(integralAC)}`}
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

export default IntegralAdditivityProperty;

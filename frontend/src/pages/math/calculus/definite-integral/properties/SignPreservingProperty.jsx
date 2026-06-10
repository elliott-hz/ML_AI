// UI Pattern: StandardSinglePlot — Sign Preserving Property of Definite Integral
// If f(x) ≥ g(x) on [a, b], then ∫ₐᵇ f(x)dx ≥ ∫ₐᵇ g(x)dx
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
  'f(x)=sin(x)+3, g(x)=cos(x)+1.5': {
    labelF: 'f(x) = sin(x) + 3',
    labelG: 'g(x) = cos(x) + 1.5',
    f: (x) => Math.sin(x) + 3,
    g: (x) => Math.cos(x) + 1.5
  },
  'f(x)=x²/6+2.5, g(x)=x/4+1': {
    labelF: 'f(x) = x²/6 + 2.5',
    labelG: 'g(x) = x/4 + 1',
    f: (x) => x * x / 6 + 2.5,
    g: (x) => x / 4 + 1
  },
  'f(x)=e^(x/3)+1, g(x)=sin(x)+1.5': {
    labelF: 'f(x) = e^(x/3) + 1',
    labelG: 'g(x) = sin(x) + 1.5',
    f: (x) => Math.exp(x / 3) + 1,
    g: (x) => Math.sin(x) + 1.5
  }
};

/**
 * SignPreservingProperty — visual verification that f ≥ g ⇒ ∫f ≥ ∫g
 */
const SignPreservingProperty = () => {
  const [params, setParams] = useState({
    funcPair: 'f(x)=sin(x)+3, g(x)=cos(x)+1.5',
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

  const { funcPair, a, b, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const pair = FUNCTIONS[funcPair];

  const integralF = useMemo(() => approximateIntegral(pair.f, a, b), [pair.f, a, b]);
  const integralG = useMemo(() => approximateIntegral(pair.g, a, b), [pair.g, a, b]);
  const diffIntegrals = integralF - integralG;

  // Curve data
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);
    const ysF = xs.map(pair.f);
    const ysG = xs.map(pair.g);

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

    // Region between f and g (filled)
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const bClamp = Math.max(xMin, Math.min(xMax, b));
    if (aClamp < bClamp) {
      // Build polygon: trace f forward, g backward
      const fillN = 100;
      const fillStep = (bClamp - aClamp) / fillN;
      const polyXs = [];
      const polyYs = [];
      for (let i = 0; i <= fillN; i++) {
        const xi = aClamp + i * fillStep;
        polyXs.push(xi);
        polyYs.push(pair.f(xi));
      }
      for (let i = fillN; i >= 0; i--) {
        const xi = aClamp + i * fillStep;
        polyXs.push(xi);
        polyYs.push(pair.g(xi));
      }
      t.push({
        x: polyXs, y: polyYs,
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: `${palette.mainTraces.tertiary}40`,
        line: { width: 0 },
        name: 'f(x) − g(x) region',
        hovertemplate: ''
      });
    }

    // Vertical lines at a, b
    const allYs = [...ysF, ...ysG].filter(v => isFinite(v));
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
  }, [pair, a, b, xRange, curveStep, palette, xMin, xMax]);

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

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/definite-integral">
          ← Back to Definite Integral
        </BackButton>
        <SectionTitleH1>Sign Preserving Property</SectionTitleH1>
      </Header>

      <SectionDescription>
        If <strong>f(x) ≥ g(x)</strong> for all x in <strong>[a, b]</strong>, then:
        <br/><br/>
        <strong>∫ₐᵇ f(x) dx ≥ ∫ₐᵇ g(x) dx</strong>
        <br/><br/>
        The region between the two curves (highlighted) represents the difference
        <strong> ∫[f(x) − g(x)] dx ≥ 0</strong>. The larger function always has
        a larger (or equal) integral over the same interval.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Verification:</FormulaTitle>
        <Formula>
          f(x) ≥ g(x)  ⇒  ∫ₐᵇ f(x) dx ≥ ∫ₐᵇ g(x) dx<br/><br/>
          a = {fmt(Math.max(xMin, Math.min(xMax, a)))} &nbsp;
          b = {fmt(Math.max(xMin, Math.min(xMax, b)))}<br/><br/>
          ∫ f(x) dx = <strong>{fmt(integralF)}</strong><br/>
          ∫ g(x) dx = <strong>{fmt(integralG)}</strong><br/>
          ∫ [f(x) − g(x)] dx = <strong>{fmt(diffIntegrals)}</strong><br/><br/>
          <strong>{fmt(integralF)} ≥ {fmt(integralG)} &nbsp;
          {integralF >= integralG - 0.001 ? '✅ Holds' : '⚠️ Check'}</strong>
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
                  options: Object.keys(FUNCTIONS) }
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
            title={`f ≥ g  ⇒  ∫f = ${fmt(integralF)} ≥ ∫g = ${fmt(integralG)}`}
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

export default SignPreservingProperty;

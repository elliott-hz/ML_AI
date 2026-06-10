// UI Pattern: StandardSinglePlot — Geometric Meaning of Integral Function
// φ(x) = ∫ₐˣ f(t) dt: the area under the curve from a to x defines a function of x
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../constants/plotThemeConfig';
import IntegralFunctionPlotter from '../../../../components/visualization/IntegralFunctionPlotter';
import ParameterControls from '../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../components/visualization/ParameterSection';
import BackButton from '../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../components/common/LayoutStyled';
import { legendPositionConfig } from '../../../../constants/integralFunctionConfig';

// Functions with known antiderivatives for integral function φ(x) = ∫ₐˣ f(t) dt
const FUNCTIONS = {
  'f(x) = sin(x)': {
    fn: (x) => Math.sin(x),
    antiderivative: (x) => -Math.cos(x),
    label: 'f(t) = sin(t)'
  },
  'f(x) = cos(x)': {
    fn: (x) => Math.cos(x),
    antiderivative: (x) => Math.sin(x),
    label: 'f(t) = cos(t)'
  },
  'f(x) = x': {
    fn: (x) => x,
    antiderivative: (x) => x * x / 2,
    label: 'f(t) = t'
  },
  'f(x) = x²': {
    fn: (x) => x * x,
    antiderivative: (x) => x * x * x / 3,
    label: 'f(t) = t²'
  }
};

/**
 * GeometricMeaning — visualize φ(x) = ∫ₐˣ f(t) dt
 */
const GeometricMeaning = () => {
  const [params, setParams] = useState({
    funcKey: 'f(x) = sin(x)',
    a: -2,
    x: 2,
    xRange: [-4, 4],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // Style config matching IntegralFunctionPlotter's mapping
  const styleConfig = useMemo(() => {
    switch (params.plotStyle) {
      case 'thin': return { fontSize: 10 };
      case 'thick': return { fontSize: 16 };
      case 'extra-thick': return { fontSize: 18 };
      default: return { fontSize: 12 };
    }
  }, [params.plotStyle]);

  const { funcKey, a, x, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];
  const aClamp = Math.max(xMin, Math.min(xMax, a));
  const xClamp = Math.max(xMin, Math.min(xMax, x));
  const funcDef = FUNCTIONS[funcKey];
  const fn = funcDef.fn;
  const F = funcDef.antiderivative;

  // Integral function φ(x) = ∫ₐˣ f(t) dt = F(x) - F(a)
  const phi = useCallback((t) => F(t) - F(a), [F, a]);

  // ── Traces ──────────────────────────────────────────
  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;

  const traces = useMemo(() => {
    const t = [];
    const primaryColor = palette.mainTraces.primary;
    const auxColor = palette.auxTraces.tangent;
    const fillColor = palette.mainTraces.fill;

    // Build full x-axis array
    const xs = Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep);

    // 1. f(t) curve
    const fYs = xs.map(fn);
    t.push({
      x: xs, y: fYs,
      type: 'scatter', mode: 'lines',
      line: { color: primaryColor, width: 3 },
      name: funcDef.label,
      hovertemplate: 't: %{x:.2f}<br>f(t): %{y:.4f}<extra></extra>'
    });

    // 2. φ(x) curve (the integral function)
    const phiYs = xs.map(tVal => phi(tVal));
    t.push({
      x: xs, y: phiYs,
      type: 'scatter', mode: 'lines',
      line: { color: auxColor, width: 3, dash: 'dash' },
      name: 'φ(x) = ∫ₐˣ f(t) dt',
      hovertemplate: 'x: %{x:.2f}<br>φ(x): %{y:.4f}<extra></extra>'
    });

    // 3. Shaded area under f(t) from a to x
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const xClamp = Math.max(xMin, Math.min(xMax, x));
    const left = Math.min(aClamp, xClamp);
    const right = Math.max(aClamp, xClamp);
    if (right > left) {
      const fillPts = Math.max(2, Math.round((right - left) / curveStep));
      const fillXs = Array.from({ length: fillPts + 1 }, (_, i) => left + i * (right - left) / fillPts);
      const fillYs = fillXs.map(fn);
      t.push({
        x: [...fillXs, ...fillXs.slice().reverse()],
        y: [...fillYs, fillYs.map(() => 0)].flat(),
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: fillColor,
        line: { width: 0 },
        showlegend: false,
        hovertemplate: ''
      });
    }

    // 4. Vertical reference line at the movable x
    t.push({
      type: 'scatter', mode: 'lines',
      x: [xClamp, xClamp],
      y: [Math.min(0, phi(xClamp)), Math.max(fn(xClamp), phi(xClamp))],
      line: { color: auxColor, width: 2, dash: 'dot' },
      showlegend: false, hovertemplate: ''
    });

    // 5. Marker at (x, φ(x))
    t.push({
      type: 'scatter', mode: 'markers',
      x: [xClamp], y: [phi(xClamp)],
      marker: { color: auxColor, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      showlegend: false,
      hovertemplate: 'φ(%{x:.2f}) = %{y:.4f}<extra></extra>'
    });

    return t;
  }, [fn, funcDef, phi, a, x, xRange, xMin, xMax, curveStep, palette]);

  // ── Annotations ──────────────────────────────────────────
  const annotations = useMemo(() => {
    const aClamp = Math.max(xMin, Math.min(xMax, a));
    const xClamp = Math.max(xMin, Math.min(xMax, x));
    const auxColor = palette.auxTraces.tangent;
    const primaryColor = palette.mainTraces.primary;

    return [
      { x: aClamp, y: 0, text: 'a', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: auxColor, size: styleConfig.fontSize + 2, weight: 700 } },
      { x: xClamp, y: 0, text: 'x', showarrow: false,
        xanchor: 'center', yanchor: 'top', yshift: -10,
        font: { color: primaryColor, size: styleConfig.fontSize + 2, weight: 700 } }
    ];
  }, [a, x, xRange, xMin, xMax, palette, styleConfig]);

  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/integral-function">
          ← Back to Integral Function
        </BackButton>
        <SectionTitleH1>Geometric Meaning of Integral Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The <strong>integral function</strong> (or accumulation function) is defined as:
        <br/><br/>
        <strong>φ(x) = ∫ₐˣ f(t) dt</strong>
        <br/><br/>
        For each x, φ(x) gives the <strong>signed area</strong> under f(t) from the fixed point a to x.
        The dashed curve shows how this accumulated area changes as x varies — it is the integral function.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Integral Function:</FormulaTitle>
        <Formula>
          φ(x) = ∫ₐˣ f(t) dt = F(x) − F(a)<br/><br/>
          {funcKey}<br/><br/>
          a = {fmt(aClamp)} &nbsp;
          x = {fmt(xClamp)} &nbsp;
          φ(x) = {fmt(phi(xClamp), 6)}
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

          <ParameterSection title="Integration Bounds">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'Lower bound (a)', min: -4, max: 4, step: 0.1 },
                { name: 'x', label: 'Variable upper bound (x)', min: -4, max: 4, step: 0.1 }
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
        </ControlsPanel>
        <PlotPanel>
          <IntegralFunctionPlotter
            data={traces}
            xRange={xRange}
            title={`φ(x) = ∫ₐˣ ${funcKey.replace('f(x) = ', '')} dt`}
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

export default GeometricMeaning;

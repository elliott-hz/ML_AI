// UI Pattern: StandardSinglePlot — First-Order Approximation
// Shows eˣ ≈ 1+x and ln(1+x) ≈ x as tangent-line approximations at x=0
import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { getTracePalette, ASPECT_RATIO_OPTIONS } from '../../../../constants/plotThemeConfig';
import { viewRangeConfig } from '../../../../constants/derivativeLocalApproximationConfig';
import DerivativeLocalApproximationPlotter from '../../../../components/visualization/DerivativeLocalApproximationPlotter';
import ParameterControls from '../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../components/visualization/ParameterSection';
import BackButton from '../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  FormulaBox, FormulaTitle, Formula,
  FunctionSection
} from '../../../../components/common/LayoutStyled';

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

const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

/**
 * FirstOrderApproximation — visualize linear (tangent) approximation for eˣ and ln(1+x)
 */
const FirstOrderApproximation = () => {
  const [params, setParams] = useState({
    dx: 0.3,
    showTangent: true,
    xRange: [-3, 3],
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { dx, showTangent, xRange } = params;
  const xMin = xRange[0], xMax = xRange[1];

  // Functions
  const exp = useCallback((x) => Math.exp(x), []);
  const ln1p = useCallback((x) => Math.log(1 + x), []);

  // Tangents at x=0
  // eˣ at 0: f(0)=1, f'(0)=1 → T(x) = 1 + x
  // ln(1+x) at 0: f(0)=0, f'(0)=1 → T(x) = x
  const tangentExp = useCallback((x) => 1 + x, []);
  const tangentLn = useCallback((x) => x, []);

  const curvePts = 400;
  const curveStep = (xMax - xMin) / curvePts;
  const xs = useMemo(
    () => Array.from({ length: curvePts + 1 }, (_, i) => xMin + i * curveStep),
    [xMin, xMax, curvePts, curveStep]
  );

  // ── Left Plot: eˣ ──────────────────────────────────
  const leftTraces = useMemo(() => {
    const t = [];
    const primary = palette.mainTraces.primary;
    const tangentColor = palette.auxTraces.tangent;
    const fillColor = palette.fills.primary;

    const expYs = xs.map(exp);
    const tanYs = xs.map(tangentExp);

    // eˣ curve
    t.push({
      x: xs, y: expYs,
      type: 'scatter', mode: 'lines',
      line: { color: primary, width: 3 },
      name: 'f(x) = eˣ',
      hovertemplate: 'x: %{x:.2f}<br>eˣ: %{y:.4f}<extra></extra>'
    });

    // Tangent line y = 1 + x
    if (showTangent) {
      t.push({
        x: xs, y: tanYs,
        type: 'scatter', mode: 'lines',
        line: { color: tangentColor, width: 3, dash: 'dash' },
        name: 'y = 1 + x (tangent)',
        hovertemplate: 'x: %{x:.2f}<br>1+x: %{y:.4f}<extra></extra>'
      });
    }

    // Highlight dx region around x=0
    const dxLeft = -dx;
    const dxRight = dx;
    if (dx > 0) {
      const fillPts = Math.max(2, Math.round(2 * dx / curveStep));
      const fillXs = Array.from({ length: fillPts + 1 }, (_, i) => dxLeft + i * 2 * dx / fillPts);
      const fillExp = fillXs.map(exp);
      const fillTan = fillXs.map(tangentExp);
      t.push({
        x: [...fillXs, ...fillXs.slice().reverse()],
        y: [...fillExp, ...fillTan.slice().reverse()],
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: fillColor,
        line: { width: 0 },
        name: `dx = ${fmt(dx)}`,
        showlegend: true,
        hovertemplate: ''
      });
    }

    // Marker at (0, 1)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [0], y: [1],
      marker: { color: primary, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      showlegend: false,
      hovertemplate: '(0, 1)<extra></extra>'
    });

    return t;
  }, [xs, exp, tangentExp, showTangent, dx, curveStep, palette]);

  const leftAnnotations = useMemo(() => {
    const tangentColor = palette.auxTraces.tangent;
    const primaryColor = palette.mainTraces.primary;
    const fs = 12;
    return [
      { x: 0, y: 1, text: '(0, 1)', showarrow: true, arrowhead: 2, arrowcolor: primaryColor, ax: 30, ay: -30, font: { color: primaryColor, size: fs + 2, weight: 600 } },
      { x: 0.8, y: 1.5, text: 'y = 1 + x', showarrow: false, font: { color: tangentColor, size: fs, weight: 600 } }
    ];
  }, [palette]);

  // ── Right Plot: ln(1+x) ────────────────────────────
  const rightTraces = useMemo(() => {
    const t = [];
    const tertiary = palette.mainTraces.tertiary;
    const tangentColor = palette.auxTraces.tangent;
    const fillColor = palette.fills.secondary;

    // Filter domain: x > -1
    const domainMask = xs.map(x => x > -1);
    const domainXs = xs.filter((_, i) => domainMask[i]);
    const lnYs = domainXs.map(ln1p);
    const tanYs = domainXs.map(tangentLn);

    // ln(1+x) curve
    t.push({
      x: domainXs, y: lnYs,
      type: 'scatter', mode: 'lines',
      line: { color: tertiary, width: 3 },
      name: 'f(x) = ln(1+x)',
      hovertemplate: 'x: %{x:.2f}<br>ln(1+x): %{y:.4f}<extra></extra>'
    });

    // Tangent line y = x
    if (showTangent) {
      t.push({
        x: domainXs, y: tanYs,
        type: 'scatter', mode: 'lines',
        line: { color: tangentColor, width: 3, dash: 'dash' },
        name: 'y = x (tangent)',
        hovertemplate: 'x: %{x:.2f}<br>x: %{y:.4f}<extra></extra>'
      });
    }

    // Highlight dx region around x=0
    const dxLeft = -dx;
    const dxRight = dx;
    if (dx > 0 && dxLeft > -1) {
      const fillPts = Math.max(2, Math.round(2 * dx / curveStep));
      const fillXs = Array.from({ length: fillPts + 1 }, (_, i) => dxLeft + i * 2 * dx / fillPts).filter(x => x > -1);
      if (fillXs.length >= 2) {
        const fillLn = fillXs.map(ln1p);
        const fillTan = fillXs.map(tangentLn);
        t.push({
          x: [...fillXs, ...fillXs.slice().reverse()],
          y: [...fillLn, ...fillTan.slice().reverse()],
          type: 'scatter', mode: 'lines',
          fill: 'toself',
          fillcolor: fillColor,
          line: { width: 0 },
          name: `dx = ${fmt(dx)}`,
          showlegend: true,
          hovertemplate: ''
        });
      }
    }

    // Marker at (0, 0)
    t.push({
      type: 'scatter', mode: 'markers',
      x: [0], y: [0],
      marker: { color: tertiary, size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
      showlegend: false,
      hovertemplate: '(0, 0)<extra></extra>'
    });

    return t;
  }, [xs, ln1p, tangentLn, showTangent, dx, curveStep, palette]);

  const rightAnnotations = useMemo(() => {
    const tangentColor = palette.auxTraces.tangent;
    const tertiaryColor = palette.mainTraces.tertiary;
    const fs = 12;
    return [
      { x: 0, y: 0, text: '(0, 0)', showarrow: true, arrowhead: 2, arrowcolor: tertiaryColor, ax: -30, ay: -30, font: { color: tertiaryColor, size: fs + 2, weight: 600 } },
      { x: 1, y: 0.7, text: 'y = x', showarrow: false, font: { color: tangentColor, size: fs, weight: 600 } }
    ];
  }, [palette]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/3-taylor-formula/derivative-local-approximation">
          ← Back to Derivative Local Approximation
        </BackButton>
        <SectionTitleH1>First-Order Approximation</SectionTitleH1>
      </Header>

      <SectionDescription>
        In a tiny neighborhood of a point, a function behaves much like its tangent line.
        This is the essence of <strong>first-order (linear) approximation</strong>:
        the derivative at a point gives the best linear approximation of the function near that point.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Linear Approximations at x = 0:</FormulaTitle>
        <Formula>
          eˣ ≈ 1 + x &nbsp;&nbsp; (since f(0) = 1, f'(0) = 1)<br/><br/>
          ln(1 + x) ≈ x &nbsp;&nbsp; (since f(0) = 0, f'(0) = 1)<br/><br/>
          <em>General: f(x) ≈ f(x₀) + f'(x₀)(x − x₀) &nbsp; as x → x₀</em>
        </Formula>
      </FormulaBox>

      <FunctionSection>
        <ControlsRow>
          <ParameterSection title="Approximation">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'dx', label: 'dx (neighborhood width)', min: 0.05, max: 1.5, step: 0.05 },
                { name: 'showTangent', label: 'Show Tangent', type: 'toggle' }
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
        </ControlsRow>
      </FunctionSection>

      <PlotGrid2>
        <div>
          <DerivativeLocalApproximationPlotter
            data={leftTraces}
            xRange={xRange}
            title="f(x) = eˣ"
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            annotations={leftAnnotations}
          />
        </div>
        <div>
          <DerivativeLocalApproximationPlotter
            data={rightTraces}
            xRange={xRange}
            title="f(x) = ln(1+x)"
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

export default FirstOrderApproximation;

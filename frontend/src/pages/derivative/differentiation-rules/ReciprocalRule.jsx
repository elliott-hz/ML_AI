// UI Pattern: ContentLayout — Controls + single combined plot
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import DerivativePlotter from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer,
  Header,
  SectionTitleH1,
  SectionDescription,
  ContentLayout,
  ControlsPanel,
  PlotPanel,
  FormulaBox,
  FormulaTitle,
  Formula,
} from '../../../components/style/DerivativeStyled';

/**
 * Reciprocal Rule — (1/x)' = -1/x²
 *
 * Single combined plot showing everything:
 * - Hyperbola y = 1/x
 * - Original rectangle (Area = 1)
 * - Green gain strip (y·dx), red loss strip (-x·dy), corner (dx·dy)
 * - New rectangle outline, tangent at x₀
 *
 * Layout: [Controls | Combined Plot]
 */
const ReciprocalRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    x0: 1,
    dx: 0.2,
    xRange: [0.2, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const yFn = useCallback((x) => 1 / x, []);
  const derivFn = useCallback((x) => -1 / (x * x), []);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  const x0 = params.x0;
  const dx = params.dx;
  const y0 = yFn(x0);
  const yp = derivFn(x0);
  const dy = yFn(x0 + dx) - y0;
  const ydGainLoss = dx >= 0 ? 'gain' : 'loss';
  const ydLabel = dx >= 0 ? 'y·dx' : '-y·dx';
  const ydValue = dx >= 0 ? (y0 * dx) : (-y0 * dx);
  const xdyGainLoss = dx >= 0 ? 'loss' : 'gain';
  const xdyLabel = dx >= 0 ? '-x·dy' : 'x·dy';
  const xdyValue = dx >= 0 ? (-x0 * dy) : (x0 * dy);

  // ── Plot 1: Hyperbola + rectangle + decomposition (merged) ────
  const plot1Data = useMemo(() => {
    const [xMin, xMax] = params.xRange;
    const x0 = params.x0;
    const x1 = x0 + params.dx;
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;

    // Curve y = 1/x
    const xs = [], ys = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x <= 0) continue;
      const y = 1 / x;
      if (isFinite(y) && !isNaN(y) && Math.abs(y) < 100) {
        xs.push(x);
        ys.push(y);
      }
    }

    const traces = [];

    // Curve
    traces.push({
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      name: 'y = 1/x',
      line: { color: palette.auxTraces.combined, width: 2.5 }
    });

    const y0 = 1 / x0;
    const y1 = 1 / x1;
    const dy = y1 - y0;

    if (!isFinite(y0) || !isFinite(y1) || y0 <= 0 || y1 <= 0) {
      // Fallback: just show the curve
      return traces;
    }

    // 1. Original rectangle [0, x₀] × [0, y₀]
    traces.push({
      x: [0, x0, x0, 0, 0], y: [0, 0, y0, y0, 0],
      type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.highlight,
      name: 'Area = 1',
      line: { color: palette.mainTraces.primary, width: 2 }
    });

    // 2. Green strip — y·dx area (positive when dx>0)
    traces.push({
      x: [x0, x1, x1, x0, x0], y: [0, 0, y0, y0, 0],
      type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.positive,
      name: `${ydLabel} = ${ydValue.toFixed(4)} (${ydGainLoss})`,
      line: { color: palette.mainTraces.secondary, width: 1.5 }
    });

    // 3. Red strip — x·dy area (negative when dx>0 → use -x·dy)
    traces.push({
      x: [0, x0, x0, 0, 0], y: [y1, y1, y0, y0, y1],
      type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.negative,
      name: `${xdyLabel} = ${xdyValue.toFixed(4)} (${xdyGainLoss})`,
      line: { color: palette.auxTraces.combined, width: 1.5 }
    });

    // 4. Corner — -dx·dy (area, always positive since dx·dy < 0)
    const cornerArea = -dx * dy;
    if (isFinite(cornerArea) && cornerArea > 1e-10) {
      traces.push({
        x: [x0, x1, x1, x0, x0], y: [y1, y1, y0, y0, y1],
        type: 'scatter', mode: 'lines',
        fill: 'toself', fillcolor: palette.fills.accent,
        name: `-dx·dy = ${cornerArea.toFixed(5)}`,
        line: { color: '#a855f7', width: 1.5 }
      });
    }

    // 5. New rectangle outline [0, x₁] × [0, y₁]
    traces.push({
      x: [0, x1, x1, 0, 0], y: [0, 0, y1, y1, 0],
      type: 'scatter', mode: 'lines',
      name: `New: x₁=${x1.toFixed(2)}, y₁=${y1.toFixed(2)}`,
      line: { color: palette.markers.evalX0, width: 1.5, dash: 'dash' }
    });

    // 6. Reference lines at x₀, y₀
    traces.push({
      x: [x0, x0], y: [0, y0],
      type: 'scatter', mode: 'lines',
      name: '', line: { color: palette.markers.evalX0, width: 1, dash: 'dot' },
      showlegend: false
    });
    traces.push({
      x: [0, x0], y: [y0, y0],
      type: 'scatter', mode: 'lines',
      name: '', line: { color: palette.markers.evalX0, width: 1, dash: 'dot' },
      showlegend: false
    });

    // 7. Point marker at (x₀, y₀)
    traces.push({
      x: [x0], y: [y0],
      type: 'scatter', mode: 'markers',
      name: `(${x0.toFixed(2)}, ${y0.toFixed(2)})`,
      marker: { color: palette.auxTraces.combined, size: 10, symbol: 'circle', line: { color: '#fff', width: 2 } }
    });

    // 8. Tangent at x₀ — slope = -1/x₀²
    const slope = -1 / (x0 * x0);
    const xSpan = (xMax - xMin) * 0.6;
    const tx = [Math.max(0.05, x0 - xSpan / 2), x0 + xSpan / 2];
    const ty = tx.map(x => y0 + slope * (x - x0));
    traces.push({
      x: tx, y: ty,
      type: 'scatter', mode: 'lines',
      name: `y' = -1/x² = ${slope.toFixed(3)}`,
      line: { color: palette.mainTraces.primary, width: 2, dash: 'dash' }
    });

    // ── Inline labels (like ProductRule plot3) ──
    traces.push({
      x: [x0 / 2], y: [y0 / 2],
      type: 'scatter', mode: 'text',
      text: ['x·y'],
      textfont: { color: palette.text.annotation, size: 13, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [(x0 + x1) / 2], y: [y0 / 2],
      type: 'scatter', mode: 'text',
      text: [`${ydLabel} (${ydGainLoss})`],
      textfont: { color: palette.text.annotation, size: 11, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [x0 / 2], y: [(y0 + y1) / 2],
      type: 'scatter', mode: 'text',
      text: [`${xdyLabel} (${xdyGainLoss})`],
      textfont: { color: palette.text.annotation, size: 11, family: 'monospace' },
      showlegend: false
    });
    if (isFinite(cornerArea) && cornerArea > 1e-10) {
      traces.push({
        x: [(x0 + x1) / 2], y: [(y0 + y1) / 2],
        type: 'scatter', mode: 'text',
        text: ['-dx·dy'],
        textfont: { color: palette.text.annotation, size: 10, family: 'monospace' },
        showlegend: false
      });
    }

    return traces;
  }, [params, palette]);

  // ── Plot 1 annotations ──
  const plot1Annotations = useMemo(() => {
    return [];
  }, []);

  const plot1XRange = useMemo(() => {
    const maxX = Math.max(params.xRange[1], params.x0 + params.dx + 0.5);
    return [params.xRange[0], maxX];
  }, [params.xRange, params.x0, params.dx]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
           Back to Derivative
        </BackButton>
        <SectionTitleH1>Reciprocal Rule</SectionTitleH1>
      </Header>

      <SectionDescription>
        Before tackling the quotient rule, understand the reciprocal function y = 1/x.
        Its key property: xy = 1, meaning the rectangle from (0,0) to (x,y) always has
        area 1. When x increases by dx, the area must stay 1 — so y must decrease
        by exactly dy = −dx/x². This conservation law gives us (1/x)' = −1/x².
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Reciprocal Rule:</FormulaTitle>
        <Formula>
          y = 1/x &nbsp;⇒&nbsp; x·y = 1 (constant area)<br/><br/>
          When x → x+dx: area must stay 1<br/>
          y·dx − x·(−dy) + dx·dy = 0 &nbsp; ({dx >= 0 ? 'gain − loss' : 'loss − gain'} + corner)<br/>
          Neglect dx·dy: &nbsp; y·dx = −x·dy<br/>
          ⇒ &nbsp; dy/dx = −y/x = −1/x²<br/><br/>
          <strong>(1/x)' = −1/x²</strong><br/><br/>
          At x₀ = {x0.toFixed(2)}: &nbsp;
          y = {isFinite(y0) ? y0.toFixed(3) : '?'}, &nbsp;
          y' = {isFinite(yp) ? yp.toFixed(3) : '?'}<br/>
          {ydLabel} = {ydValue.toFixed(4)}, &nbsp;
          {xdyLabel} = {xdyValue.toFixed(4)}
        </Formula>
      </FormulaBox>

      {/* Row 1: Controls + Plot 1 (merged: curve + rectangle + decomposition) */}
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Point on y = 1/x">
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: 0.5, max: 5, step: 0.1 },
                { name: 'dx', label: 'dx (increment)', min: -0.4, max: 0.4, step: 0.05 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'legendPosition', label: 'Legend', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] },
                { name: 'xRange', label: 'X Range', type: 'range', min: 0.1, max: 10, step: 0.1, default: [0.2, 5] },
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={plot1Data}
            annotations={plot1Annotations}
            xRange={plot1XRange}
            title={`y = 1/x  —  y·dx = −x·dy  (dx = ${dx.toFixed(3)})`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ReciprocalRule;

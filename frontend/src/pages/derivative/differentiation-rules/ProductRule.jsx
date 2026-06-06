// UI Pattern: MultiSectionPlot — ContentLayout (row 1) + PlotGrid2 (row 2, 2 plots)
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
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
  PlotGrid2
} from '../../../components/derivative/shared/DerivativeStyled';

// ─── Unicode superscript ───────────────────────────────────────────
const SUP = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
  '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
  '-': '\u207B', '.': '\u00B7',
  'm': '\u1D50', 'n': '\u207F'
};
const toSup = (s) => String(s).split('').map(c => SUP[c] || c).join('');
const fmtExp = (val) => toSup(val % 1 === 0 ? String(val) : val.toFixed(1));

/**
 * Product Rule — (uv)' = u'v + uv'
 *
 * u(x) = a + b·x^m
 * v(x) = c + d·x^n
 *
 * Row 1: [Controls | Plot 1: Product Function curves + tangents]
 * Row 2: [Plot 2: Area rectangle]  [Plot 3: Area Expansion]
 */
const ProductRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 2, b: 0.5, m: 3,   // u(x) = 2 + 0.5x³
    c: 1, d: 1, n: 2,     // v(x) = 1 + x²
    x0: 1,
    dx: 0.5,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const uFn = useCallback((x) => params.a + params.b * Math.pow(x, params.m), [params.a, params.b, params.m]);
  const vFn = useCallback((x) => params.c + params.d * Math.pow(x, params.n), [params.c, params.d, params.n]);
  const productFn = useCallback((x) => uFn(x) * vFn(x), [uFn, vFn]);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  const uLabel = `u(x) = ${params.a.toFixed(1)} + ${params.b.toFixed(1)}x${fmtExp(params.m)}`;
  const vLabel = `v(x) = ${params.c.toFixed(1)} + ${params.d.toFixed(1)}x${fmtExp(params.n)}`;

  // ── Plot 1: Product Function curves + tangents + markers ──────
  const plot1Data = useMemo(() => {
    const [xMin, xMax] = params.xRange;
    const x0 = params.x0;
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;

    const genTrace = (fn) => {
      const xs = [], ys = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step;
        const y = fn(x);
        if (isFinite(y) && !isNaN(y) && Math.abs(y) < 10000) {
          xs.push(x);
          ys.push(y);
        }
      }
      return { xs, ys };
    };

    const traces = [];

    // u(x)
    const uData = genTrace(uFn);
    traces.push({
      x: uData.xs, y: uData.ys,
      type: 'scatter', mode: 'lines',
      name: uLabel,
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });

    // v(x)
    const vData = genTrace(vFn);
    traces.push({
      x: vData.xs, y: vData.ys,
      type: 'scatter', mode: 'lines',
      name: vLabel,
      line: { color: palette.mainTraces.secondary, width: 2.5 }
    });

    // uv(x)
    const pData = genTrace(productFn);
    traces.push({
      x: pData.xs, y: pData.ys,
      type: 'scatter', mode: 'lines',
      name: 'u(x)·v(x)',
      line: { color: palette.auxTraces.combined, width: 2.5 }
    });

    // Vertical line at x₀
    const allY = [...uData.ys, ...vData.ys, ...pData.ys].filter(y => isFinite(y));
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);
    const pad = (yMax - yMin) * 0.15 || 1;
    traces.push({
      x: [x0, x0], y: [yMin - pad, yMax + pad],
      type: 'scatter', mode: 'lines',
      name: `x₀ = ${x0.toFixed(1)}`,
      line: { color: palette.markers.evalX0, width: 1.5, dash: 'dot' }
    });

    // ── Tangents at x₀ (slope in legend, no x₀ → keeps original color) ──
    const uPrimeVal = numDeriv(uFn, x0);
    const vPrimeVal = numDeriv(vFn, x0);
    const pPrimeVal = numDeriv(productFn, x0);
    const xSpan = (xMax - xMin) * 0.8;

    const addTan = (fn, derivVal, label, color) => {
      const f0 = fn(x0);
      const tx = [x0 - xSpan / 2, x0 + xSpan / 2];
      const ty = tx.map(x => f0 + derivVal * (x - x0));
      traces.push({
        x: tx, y: ty,
        type: 'scatter', mode: 'lines',
        name: `${label}' = ${isFinite(derivVal) ? derivVal.toFixed(1) : '?'}`,
        line: { color, width: 2, dash: 'dash' }
      });
    };

    addTan(uFn, uPrimeVal, 'u', palette.mainTraces.primary);
    addTan(vFn, vPrimeVal, 'v', palette.mainTraces.secondary);
    addTan(productFn, pPrimeVal, 'uv', palette.auxTraces.combined);

    // ── Marker points at x₀ ──
    traces.push({
      x: [x0], y: [uFn(x0)],
      type: 'scatter', mode: 'markers',
      name: '', marker: { color: palette.mainTraces.primary, size: 8, symbol: 'circle' },
      showlegend: false
    });
    traces.push({
      x: [x0], y: [vFn(x0)],
      type: 'scatter', mode: 'markers',
      name: '', marker: { color: palette.mainTraces.secondary, size: 8, symbol: 'circle' },
      showlegend: false
    });
    traces.push({
      x: [x0], y: [productFn(x0)],
      type: 'scatter', mode: 'markers',
      name: '', marker: { color: palette.auxTraces.combined, size: 8, symbol: 'circle' },
      showlegend: false
    });

    return traces;
  }, [params, uFn, vFn, productFn, numDeriv, uLabel, vLabel, palette]);

  // ── Plot 2: Area rectangle (u × v) ─────────────────────────────
  const plot2Data = useMemo(() => {
    const x0 = params.x0;
    const u0 = uFn(x0);
    const v0 = vFn(x0);
    if (!isFinite(u0) || !isFinite(v0)) return [];

    const rectX = [0, u0, u0, 0, 0];
    const rectY = [0, 0, v0, v0, 0];

    const traces = [];

    traces.push({
      x: rectX, y: rectY,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: palette.fills.primary,
      name: `Area = u·v`,
      line: { color: palette.mainTraces.primary, width: 2 }
    });

    traces.push({
      x: [u0 / 2], y: [-v0 * 0.08],
      type: 'scatter', mode: 'text',
      text: [`u = ${isFinite(u0) ? u0.toFixed(2) : '?'}`],
      textfont: { color: palette.mainTraces.primary, size: 14, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [-u0 * 0.08], y: [v0 / 2],
      type: 'scatter', mode: 'text',
      text: [`v = ${isFinite(v0) ? v0.toFixed(2) : '?'}`],
      textfont: { color: palette.mainTraces.secondary, size: 14, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [u0 / 2], y: [v0 / 2],
      type: 'scatter', mode: 'text',
      text: [`Area = ${isFinite(u0) && isFinite(v0) ? (u0 * v0).toFixed(2) : '?'}`],
      textfont: { color: palette.text.annotation, size: 15, family: 'monospace' },
      showlegend: false
    });

    return traces;
  }, [params, uFn, vFn, palette]);

  // ── Plot 3: Area Expansion (core) ──────────────────────────────
  const plot3Data = useMemo(() => {
    const x0 = params.x0;
    const dx = params.dx;
    const u0 = uFn(x0);
    const v0 = vFn(x0);
    const up = numDeriv(uFn, x0);
    const vp = numDeriv(vFn, x0);

    if (!isFinite(u0) || !isFinite(v0)) return [];

    const du = up * dx;
    const dv = vp * dx;

    const b1x = [0, u0, u0, 0, 0]; const b1y = [0, 0, v0, v0, 0];
    const b2x = [u0, u0 + du, u0 + du, u0, u0]; const b2y = [0, 0, v0, v0, 0];
    const b3x = [0, u0, u0, 0, 0]; const b3y = [v0, v0, v0 + dv, v0 + dv, v0];
    const b4x = [u0, u0 + du, u0 + du, u0, u0]; const b4y = [v0, v0, v0 + dv, v0 + dv, v0];

    const traces = [];

    traces.push({
      x: b1x, y: b1y, type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.highlight,
      name: 'uv (original)', line: { color: '#eab308', width: 1.5 }
    });
    traces.push({
      x: b2x, y: b2y, type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: 'rgba(250, 204, 21, 0.5)',
      name: `u'v·dx = ${(up * v0 * dx).toFixed(3)}`,
      line: { color: '#eab308', width: 1.5 }
    });
    traces.push({
      x: b3x, y: b3y, type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.secondary,
      name: `uv'·dx = ${(u0 * vp * dx).toFixed(3)}`,
      line: { color: palette.mainTraces.secondary, width: 1.5 }
    });
    traces.push({
      x: b4x, y: b4y, type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.accent,
      name: `u'v'·dx² = ${(up * vp * dx * dx).toFixed(5)}`,
      line: { color: '#a855f7', width: 1.5 }
    });

    traces.push({ x: [u0 / 2], y: [v0 / 2], type: 'scatter', mode: 'text', text: ['uv'], textfont: { color: palette.text.annotation, size: 13, family: 'monospace' }, showlegend: false });
    traces.push({ x: [u0 + du / 2], y: [v0 / 2], type: 'scatter', mode: 'text', text: ["u'v·dx"], textfont: { color: palette.text.annotation, size: 11, family: 'monospace' }, showlegend: false });
    traces.push({ x: [u0 / 2], y: [v0 + dv / 2], type: 'scatter', mode: 'text', text: ["uv'·dx"], textfont: { color: palette.text.annotation, size: 11, family: 'monospace' }, showlegend: false });
    traces.push({ x: [u0 + du / 2], y: [v0 + dv / 2], type: 'scatter', mode: 'text', text: ["u'v'·dx²"], textfont: { color: palette.text.annotation, size: 10, family: 'monospace' }, showlegend: false });

    return traces;
  }, [params, uFn, vFn, numDeriv, palette]);

  const x0 = params.x0;
  const dx = params.dx;
  const up = numDeriv(uFn, x0);
  const vp = numDeriv(vFn, x0);
  const u0 = uFn(x0);
  const v0 = vFn(x0);
  const productDeriv = u0 * vp + v0 * up;

  const plot2XRange = useMemo(() => {
    const uv = uFn(params.x0);
    if (!isFinite(uv)) return [-1, 5];
    const maxDim = Math.max(Math.abs(uv), Math.abs(vFn(params.x0)));
    return [-maxDim * 0.3, maxDim * 1.3];
  }, [params.x0, uFn, vFn]);

  const plot3XRange = useMemo(() => {
    const uv = uFn(params.x0);
    const vv = vFn(params.x0);
    const upv = numDeriv(uFn, params.x0);
    const vpv = numDeriv(vFn, params.x0);
    if (!isFinite(uv) || !isFinite(vv)) return [-0.5, 5];
    const totalW = Math.abs(uv) + Math.abs(upv * params.dx);
    const totalH = Math.abs(vv) + Math.abs(vpv * params.dx);
    const maxDim = Math.max(totalW, totalH);
    return [-maxDim * 0.15, maxDim * 1.15];
  }, [params.x0, params.dx, uFn, vFn, numDeriv]);

  const uSection = `u(x) = a + b·x${toSup('m')}`;
  const vSection = `v(x) = c + d·x${toSup('n')}`;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
           Back to Derivative
        </BackButton>
        <SectionTitleH1>Product Rule</SectionTitleH1>
      </Header>

      <SectionDescription>
        The product rule tells us how to differentiate the product of two functions:
        (uv)' = u'v + uv'. The key insight is that when u changes by u'dx and v changes by v'dx,
        the total area (u·v) grows by u'v·dx + uv'·dx plus a tiny u'v'·dx² term that vanishes.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Product Rule:</FormulaTitle>
        <Formula>
          (u·v)' = u'·v + u·v'<br/><br/>
          At x₀ = {x0.toFixed(1)}: &nbsp;
          u = {isFinite(u0) ? u0.toFixed(1) : '?'}, &nbsp;
          v = {isFinite(v0) ? v0.toFixed(1) : '?'}, &nbsp;
          u' = {isFinite(up) ? up.toFixed(1) : '?'}, &nbsp;
          v' = {isFinite(vp) ? vp.toFixed(1) : '?'}<br/>
          (uv)' = {isFinite(productDeriv) ? productDeriv.toFixed(1) : '?'}
        </Formula>
      </FormulaBox>

      {/* Row 1: Controls + Plot 1 */}
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title={uSection}>
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'a', label: 'constant (a)', min: -5, max: 5, step: 0.5 },
                { name: 'b', label: 'coeff (b)', min: -3, max: 3, step: 0.5 },
                { name: 'm', label: 'exponent (m)', min: 1, max: 5, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title={vSection}>
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'c', label: 'constant (c)', min: -5, max: 5, step: 0.5 },
                { name: 'd', label: 'coeff (d)', min: -3, max: 3, step: 0.5 },
                { name: 'n', label: 'exponent (n)', min: 1, max: 5, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Parameters">
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -10, max: 10, step: 0.1 },
                { name: 'dx', label: 'dx (increment)', min: 0.05, max: 0.5, step: 0.05 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'legendPosition', label: 'Legend', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] },
                { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 1, default: [-5, 5] },
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={plot1Data}
            xRange={params.xRange}
            title={`u(x)·v(x)  —  (uv)' = u'v + uv'`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>

      {/* Row 2: Plot 2 + Plot 3 */}
      <PlotGrid2>
        <DerivativePlotter
          data={plot2Data}
          xRange={plot2XRange}
          title={`Area = u × v`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio="1:1"
          legendPosition={params.legendPosition}
        />
        <DerivativePlotter
          data={plot3Data}
          xRange={plot3XRange}
          title={`Area Expansion  (dx = ${dx.toFixed(3)})`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio="1:1"
          legendPosition={params.legendPosition}
        />
      </PlotGrid2>
    </PageContainer>
  );
};

export default ProductRule;

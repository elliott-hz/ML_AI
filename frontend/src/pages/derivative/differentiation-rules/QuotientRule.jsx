// UI Pattern: MultiSectionPlot — ContentLayout (row 1) + PlotGrid2 (row 2, 2 plots)
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
import { createDataAnnotation } from '../../../utils/annotationUtils';
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
  PlotGrid2,
} from '../../../components/style/DerivativeStyled';

// ─── Unicode superscript ───────────────────────────────────────────
const SUP = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
  '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
  '-': '\u207B',
  'm': '\u1D50', 'n': '\u207F'
};
const toSup = (s) => String(s).split('').map(c => SUP[c] || c).join('');
const fmtExp = (val) => toSup(val % 1 === 0 ? String(val) : val.toFixed(1));

/**
 * Quotient Rule — (u/v)' = (u'v - uv') / v²
 *
 * Approach: rewrite u/v = u·(1/v) = u·w, then apply product rule.
 * w(x) = 1/v(x) is the reciprocal function.
 *
 * u(x) = a + b·x^m
 * v(x) = c + d·x^n
 *
 * Row 1: [Controls | Plot 1: Quotient Function curves + tangents]
 * Row 2: [Plot 2: Area decomposition u × w (product rule)]  [Plot 3: Reciprocal w(x) = 1/v(x)]
 */
const QuotientRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 2, b: 1, m: 3,     // u(x) = 2 + x³
    c: 2, d: -1.5, n: 1,     // v(x) = 2 - 1.5x
    x0: 1,
    dx: 0.1,
    xRange: [-3, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const uFn = useCallback((x) => params.a + params.b * Math.pow(x, params.m), [params.a, params.b, params.m]);
  const vFn = useCallback((x) => params.c + params.d * Math.pow(x, params.n), [params.c, params.d, params.n]);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  const quotientFn = useCallback((x) => {
    const v = vFn(x);
    if (Math.abs(v) < 1e-10) return NaN;
    return uFn(x) / v;
  }, [uFn, vFn]);

  // w(x) = 1/v(x) — the reciprocal, so that u/v = u·w (product rule)
  const wFn = useCallback((x) => {
    const v = vFn(x);
    if (Math.abs(v) < 1e-10) return NaN;
    return 1 / v;
  }, [vFn]);

  const uLabel = `u(x) = ${params.a.toFixed(1)} + ${params.b.toFixed(1)}x${fmtExp(params.m)}`;
  const vLabel = `v(x) = ${params.c.toFixed(1)} + ${params.d.toFixed(1)}x${fmtExp(params.n)}`;

  const x0 = params.x0;
  const dx = params.dx;
  const u0 = uFn(x0);
  const v0 = vFn(x0);
  const w0 = 1 / v0;
  const q0 = u0 / v0;
  const up = numDeriv(uFn, x0);
  const vp = numDeriv(vFn, x0);
  const wp = numDeriv(wFn, x0);
  const quotientDeriv = (up * v0 - u0 * vp) / (v0 * v0);

  // ── Plot 1: Quotient Function curves + tangents + markers ──────
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

    // u/v(x)
    const qData = genTrace(quotientFn);
    traces.push({
      x: qData.xs, y: qData.ys,
      type: 'scatter', mode: 'lines',
      name: 'u(x) / v(x)',
      line: { color: palette.auxTraces.combined, width: 2.5 }
    });

    // Vertical line at x₀
    const allY = [...uData.ys, ...vData.ys, ...qData.ys].filter(y => isFinite(y));
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);
    const pad = (yMax - yMin) * 0.15 || 1;
    traces.push({
      x: [x0, x0], y: [yMin - pad, yMax + pad],
      type: 'scatter', mode: 'lines',
      name: `x₀ = ${x0.toFixed(1)}`,
      line: { color: palette.markers.evalX0, width: 1.5, dash: 'dot' }
    });

    // Vertical line at x₁ = x₀ + dx
    const x1 = x0 + params.dx;
    traces.push({
      x: [x1, x1], y: [yMin - pad, yMax + pad],
      type: 'scatter', mode: 'lines',
      name: `x₁ = ${x1.toFixed(2)}`,
      line: { color: palette.markers.evalX0, width: 1.5, dash: 'dash' }
    });

    // ── Tangents at x₀ ──
    const uPrimeVal = numDeriv(uFn, x0);
    const vPrimeVal = numDeriv(vFn, x0);
    const qPrimeVal = numDeriv(quotientFn, x0);
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
    addTan(quotientFn, qPrimeVal, 'u/v', palette.auxTraces.combined);

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
    const qAtX0 = quotientFn(x0);
    if (isFinite(qAtX0)) {
      traces.push({
        x: [x0], y: [qAtX0],
        type: 'scatter', mode: 'markers',
        name: '', marker: { color: palette.auxTraces.combined, size: 8, symbol: 'circle' },
        showlegend: false
      });
    }

    // ── Marker points at x₁ ──
    const x1Pt = x0 + params.dx;
    traces.push({
      x: [x1Pt], y: [uFn(x1Pt)],
      type: 'scatter', mode: 'markers',
      name: '', marker: { color: palette.mainTraces.primary, size: 8, symbol: 'square' },
      showlegend: false
    });
    traces.push({
      x: [x1Pt], y: [vFn(x1Pt)],
      type: 'scatter', mode: 'markers',
      name: '', marker: { color: palette.mainTraces.secondary, size: 8, symbol: 'square' },
      showlegend: false
    });
    const qAtX1 = quotientFn(x1Pt);
    if (isFinite(qAtX1)) {
      traces.push({
        x: [x1Pt], y: [qAtX1],
        type: 'scatter', mode: 'markers',
        name: '', marker: { color: palette.auxTraces.combined, size: 8, symbol: 'square' },
        showlegend: false
      });
    }

    return traces;
  }, [params, uFn, vFn, quotientFn, numDeriv, uLabel, vLabel, palette]);

  // ── Plot 1 annotations (value labels at x₀ and x₁) ──
  const plot1Annotations = useMemo(() => {
    const x0 = params.x0;
    const x1 = x0 + params.dx;
    const u0 = uFn(x0), v0 = vFn(x0), q0 = quotientFn(x0);
    const u1 = uFn(x1), v1 = vFn(x1), q1 = quotientFn(x1);

    const fmt = (v) => isFinite(v) ? v.toFixed(2) : '?';
    const style = { plotStyle: params.plotStyle, themeMode };

    const annos = [];
    if (isFinite(u0)) annos.push(createDataAnnotation({ x: x0, y: u0, text: `u = ${fmt(u0)}`, color: palette.mainTraces.primary, ...style }));
    if (isFinite(v0)) annos.push(createDataAnnotation({ x: x0, y: v0, text: `v = ${fmt(v0)}`, color: palette.mainTraces.secondary, ...style }));
    if (isFinite(q0)) annos.push(createDataAnnotation({ x: x0, y: q0, text: `u/v = ${fmt(q0)}`, color: palette.auxTraces.combined, ...style }));
    if (isFinite(u1)) annos.push(createDataAnnotation({ x: x1, y: u1, text: `u = ${fmt(u1)}`, color: palette.mainTraces.primary, ...style }));
    if (isFinite(v1)) annos.push(createDataAnnotation({ x: x1, y: v1, text: `v = ${fmt(v1)}`, color: palette.mainTraces.secondary, ...style }));
    if (isFinite(q1)) annos.push(createDataAnnotation({ x: x1, y: q1, text: `u/v = ${fmt(q1)}`, color: palette.auxTraces.combined, ...style }));
    return annos;
  }, [params.x0, params.dx, uFn, vFn, quotientFn, palette, themeMode, params.plotStyle]);

  // ── Plot 2: Area decomposition u × w (w = 1/v) ───────────────
  // Same product-rule area diagram: (u·w)' = u'·w + u·w'
  // where w = 1/v,  w'·dx = −(1/v²)·v'·dx
  const plot2Data = useMemo(() => {
    const x0 = params.x0;
    const x1 = x0 + params.dx;
    const u0 = uFn(x0);
    const v0 = vFn(x0);
    if (!isFinite(u0) || !isFinite(v0) || Math.abs(v0) < 1e-10) return [];

    const w0 = 1 / v0;
    const u1 = uFn(x1);
    const v1 = vFn(x1);
    const w1 = 1 / v1;
    const du = u1 - u0;
    const dw = w1 - w0;

    if (!isFinite(u1) || !isFinite(w1)) return [];

    const traces = [];

    // 1. Original rectangle: width = w₀, height = u₀, area = u₀·w₀ = u₀/v₀
    const oRect = { x: [0, w0, w0, 0, 0], y: [0, 0, u0, u0, 0] };
    traces.push({
      x: oRect.x, y: oRect.y,
      type: 'scatter', mode: 'lines',
      fill: 'toself', fillcolor: palette.fills.highlight,
      name: `u·w = ${(u0 * w0).toFixed(3)}`,
      line: { color: palette.mainTraces.primary, width: 1.5 }
    });

    // 2. Top strip — numerator changes (u), w fixed: w₀·du
    const areaWdu = w0 * du;
    traces.push({
      x: [0, w0, w0, 0, 0], y: [u0, u0, u1, u1, u0],
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: du >= 0 ? palette.fills.positive : palette.fills.negative,
      name: `w·du (du/v) = ${areaWdu.toFixed(4)}`,
      line: { color: du >= 0 ? palette.mainTraces.secondary : palette.auxTraces.combined, width: 1.5 }
    });

    // 3. Right strip — reciprocal changes (w), u fixed: u₀·dw
    const areaUdw = u0 * dw;
    traces.push({
      x: [w0, w1, w1, w0, w0], y: [0, 0, u0, u0, 0],
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: dw >= 0 ? palette.fills.positive : palette.fills.negative,
      name: `u·dw (−u·dv/v²) = ${areaUdw.toFixed(4)}`,
      line: { color: dw >= 0 ? palette.mainTraces.secondary : palette.auxTraces.combined, width: 1.5 }
    });

    // 4. Corner — du·dw (second-order, negligible)
    const areaDudw = du * dw;
    if (isFinite(areaDudw) && Math.abs(areaDudw) > 1e-10) {
      traces.push({
        x: [w0, w1, w1, w0, w0], y: [u0, u0, u1, u1, u0],
        type: 'scatter', mode: 'lines',
        fill: 'toself', fillcolor: palette.fills.accent,
        name: `du·dw = ${areaDudw.toFixed(5)}`,
        line: { color: '#a855f7', width: 1.5 }
      });
    }

    // ── In-rectangle labels (matching ProductRule plot3 style) ──
    // Center of original rectangle
    traces.push({
      x: [w0 / 2], y: [u0 / 2],
      type: 'scatter', mode: 'text',
      text: ['u·w'],
      textfont: { color: palette.text.annotation, size: 13, family: 'monospace' },
      showlegend: false
    });
    // Center of top strip (w·du)
    traces.push({
      x: [w0 / 2], y: [(u0 + u1) / 2],
      type: 'scatter', mode: 'text',
      text: ["w·du"],
      textfont: { color: palette.text.annotation, size: 11, family: 'monospace' },
      showlegend: false
    });
    // Center of right strip (u·dw)
    traces.push({
      x: [(w0 + w1) / 2], y: [u0 / 2],
      type: 'scatter', mode: 'text',
      text: ["u·dw"],
      textfont: { color: palette.text.annotation, size: 11, family: 'monospace' },
      showlegend: false
    });
    // Center of corner (du·dw)
    if (isFinite(areaDudw) && Math.abs(areaDudw) > 1e-10) {
      traces.push({
        x: [(w0 + w1) / 2], y: [(u0 + u1) / 2],
        type: 'scatter', mode: 'text',
        text: ["du·dw"],
        textfont: { color: palette.text.annotation, size: 10, family: 'monospace' },
        showlegend: false
      });
    }

    return traces;
  }, [params, uFn, vFn, palette]);

  // ── Plot 3: Reciprocal function w(x) = 1/v(x) ──────────────────
  // Shows v(x) and w(x) together, with tangent to w at x₀
  // illustrating that dw/dx = -(1/v²)·dv/dx
  const plot3Data = useMemo(() => {
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

    // v(x)
    const vData = genTrace(vFn);
    traces.push({
      x: vData.xs, y: vData.ys,
      type: 'scatter', mode: 'lines',
      name: 'v(x)',
      line: { color: palette.mainTraces.secondary, width: 2.5 }
    });

    // w(x) = 1/v(x)
    const wData = genTrace(wFn);
    traces.push({
      x: wData.xs, y: wData.ys,
      type: 'scatter', mode: 'lines',
      name: 'w(x) = 1/v(x)',
      line: { color: palette.auxTraces.combined, width: 2.5 }
    });

    // Vertical reference at x₀
    const allY = [...vData.ys, ...wData.ys].filter(y => isFinite(y));
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);
    const pad = (yMax - yMin) * 0.15 || 1;

    traces.push({
      x: [x0, x0], y: [yMin - pad, yMax + pad],
      type: 'scatter', mode: 'lines',
      name: `x₀ = ${x0.toFixed(1)}`,
      line: { color: palette.markers.evalX0, width: 1.5, dash: 'dot' }
    });

    // Tangents at x₀
    const v0 = vFn(x0);
    const w0 = wFn(x0);
    const vp = numDeriv(vFn, x0);
    const wp = numDeriv(wFn, x0);
    const xSpan = (xMax - xMin) * 0.6;

    const addTan = (fn, derivVal, label, color) => {
      if (!isFinite(derivVal)) return;
      const f0 = fn(x0);
      const tx = [x0 - xSpan / 2, x0 + xSpan / 2];
      const ty = tx.map(x => f0 + derivVal * (x - x0));
      traces.push({
        x: tx, y: ty,
        type: 'scatter', mode: 'lines',
        name: `${label}' = ${derivVal.toFixed(2)}`,
        line: { color, width: 2, dash: 'dash' }
      });
    };

    addTan(vFn, vp, 'v', palette.mainTraces.secondary);
    addTan(wFn, wp, 'w = −v\'/v²', palette.auxTraces.combined);

    // Markers at x₀
    if (isFinite(v0)) {
      traces.push({
        x: [x0], y: [v0],
        type: 'scatter', mode: 'markers',
        name: '', marker: { color: palette.mainTraces.secondary, size: 8, symbol: 'circle' },
        showlegend: false
      });
    }
    if (isFinite(w0)) {
      traces.push({
        x: [x0], y: [w0],
        type: 'scatter', mode: 'markers',
        name: '', marker: { color: palette.auxTraces.combined, size: 8, symbol: 'circle' },
        showlegend: false
      });
    }

    // Visual indicator: "v↑ ⇒ w↓" double-arrow between v₀ and w₀
    if (isFinite(v0) && isFinite(w0)) {
      const arrowY = (v0 + w0) / 2;
      const xArrow = x0 + (xMax - xMin) * 0.06;
      traces.push({
        x: [xArrow], y: [arrowY],
        type: 'scatter', mode: 'text',
        text: ['v↑ ⇒ w↓'],
        textfont: { color: palette.text.annotation, size: 12, family: 'monospace' },
        showlegend: false
      });
    }

    return traces;
  }, [params, vFn, wFn, numDeriv, palette]);

  // ── Plot 3 annotations ──
  const plot3Annotations = useMemo(() => {
    const x0 = params.x0;
    const v0 = vFn(x0);
    const w0 = wFn(x0);
    const style = { plotStyle: params.plotStyle, themeMode };

    const annos = [];
    if (isFinite(v0)) annos.push(createDataAnnotation({
      x: x0, y: v0, text: `v = ${v0.toFixed(2)}`, color: palette.mainTraces.secondary, ...style
    }));
    if (isFinite(w0)) annos.push(createDataAnnotation({
      x: x0, y: w0, text: `w = 1/v = ${w0.toFixed(2)}`, color: palette.auxTraces.combined, ...style
    }));
    return annos;
  }, [params.x0, vFn, wFn, palette, themeMode, params.plotStyle]);

  const plot2XRange = useMemo(() => {
    const w0 = 1 / vFn(params.x0);
    const u0 = uFn(params.x0);
    if (!isFinite(w0) || !isFinite(u0)) return [-1, 5];
    const maxDim = Math.max(Math.abs(w0), Math.abs(u0));
    return [-maxDim * 0.3, maxDim * 1.3];
  }, [params.x0, uFn, vFn]);

  const plot3XRange = params.xRange;

  const uSection = `u(x) = a + b·x${toSup('m')}`;
  const vSection = `v(x) = c + d·x${toSup('n')}`;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
           Back to Derivative
        </BackButton>
        <SectionTitleH1>Quotient Rule</SectionTitleH1>
      </Header>

      <SectionDescription>
        The clearest way to see the quotient rule: rewrite u/v as u·(1/v). Let w = 1/v.
        Then (u/v) = u·w is a product, and by the familiar product rule:
        (u·w)' = u'·w + u·w'. The missing piece — w' = −v'/v² — is the Reciprocal Rule
        (see the Reciprocal Rule page for the area-conservation intuition).
        Substituting: (u/v)' = u'/v − u·v'/v².
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Quotient Rule:</FormulaTitle>
        <Formula>
          Let w = 1/v &nbsp;⇒&nbsp; u/v = u·w<br/>
          (u/v)' = (u·w)' = u'·w + u·w' &nbsp; (product rule)<br/>
          From the Reciprocal Rule: &nbsp; w' = −v'/v²<br/>
          Substituting: (u/v)' = u'/v − u·v'/v²<br/><br/>
          At x₀ = {x0.toFixed(1)}: &nbsp;
          u = {isFinite(u0) ? u0.toFixed(1) : '?'}, &nbsp;
          v = {isFinite(v0) ? v0.toFixed(1) : '?'}, &nbsp;
          w = 1/v = {isFinite(w0) ? w0.toFixed(2) : '?'}<br/>
          u' = {isFinite(up) ? up.toFixed(1) : '?'}, &nbsp;
          w' = {'−'}v'/v² = {isFinite(wp) ? wp.toFixed(2) : '?'}<br/>
          (u/v)' = {isFinite(quotientDeriv) ? quotientDeriv.toFixed(2) : '?'}
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
                { name: 'm', label: 'exponent (m)', min: 0.5, max: 5, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title={vSection}>
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'c', label: 'constant (c)', min: -5, max: 5, step: 0.5 },
                { name: 'd', label: 'coeff (d)', min: -3, max: 3, step: 0.5 },
                { name: 'n', label: 'exponent (n)', min: 0.5, max: 5, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Parameters">
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -10, max: 10, step: 0.1 },
                { name: 'dx', label: 'dx (increment)', min: 0.001, max: 0.5, step: 0.001 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams}
              config={[
                { name: 'legendPosition', label: 'Legend', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] },
                { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 1, default: [-3, 5] },
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={plot1Data}
            annotations={plot1Annotations}
            xRange={params.xRange}
            title={`Quotient Function: u(x) / v(x)  —  (u/v)' = (u'v − uv') / v²`}
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
          title={`u × w  (w = 1/v)  —  (u·w)' = u'·w + u·w'`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio="1:1"
          legendPosition={params.legendPosition}
        />
        <DerivativePlotter
          data={plot3Data}
          annotations={plot3Annotations}
          xRange={plot3XRange}
          title={`Reciprocal: w(x) = 1/v(x)  —  w' = −v'/v²`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio="1:1"
          legendPosition={params.legendPosition}
        />
      </PlotGrid2>
    </PageContainer>
  );
};

export default QuotientRule;

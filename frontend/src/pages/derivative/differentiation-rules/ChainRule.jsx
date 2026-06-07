// UI Pattern: MultiSectionPlot — ControlsBar (top) + PlotGrid2 (2 plots) + LiveValueBox
import React, { useState, useMemo, useCallback } from 'react';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer,
  Header,
  SectionTitleH1,
  SectionDescription,
  FormulaBox,
  FormulaTitle,
  Formula,
  ControlsBar,
  LiveValueRow,
  LiveValueLabel
} from '../../../components/style/DerivativeStyled';

const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LiveValueBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

/**
 * Chain Rule — dy/dx = dy/dz · dz/dx
 *
 * Visual approach:
 *   Plot 1: z = g(x) — inner function (x → z)
 *   Plot 2: y = f(z) — outer function (z → y)
 *
 * The flow Δx → Δz → Δy is shown across both plots,
 * making the chain rule multiplication visible.
 *
 * g(x) = a·x + b  (linear inner)
 * f(z) = z² + p·z + q  (quadratic outer, default p=0, q=0 → f(z)=z²)
 */
const ChainRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 0.5, b: 1,            // g(x) = 0.5x + 1
    p: 0, q: 0,               // f(z) = z² + 0·z + 0 = z²
    x0: 1,
    dx: 0.2,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  // ── Functions ───────────────────────────────────────────────
  const gFn = useCallback((x) => params.a * x + params.b, [params.a, params.b]);
  const fFn = useCallback((z) => z * z + params.p * z + params.q, [params.p, params.q]);
  const fgFn = useCallback((x) => {
    const z = gFn(x);
    if (!isFinite(z)) return NaN;
    return fFn(z);
  }, [gFn, fFn]);

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const x0 = params.x0;
  const dx = params.dx;
  const z0 = gFn(x0);
  const y0 = fFn(z0);
  const gp = params.a;  // g'(x) = a (exact, linear)
  const fp = 2 * z0 + params.p;  // f'(z) = 2z + p (exact, quadratic)
  const chainDeriv = gp * fp;

  // z-range for Plot 2 (output range of g over xRange)
  const zRange = useMemo(() => {
    const [xMin, xMax] = params.xRange;
    const zMin = gFn(xMin);
    const zMax = gFn(xMax);
    const zLo = Math.min(zMin, zMax);
    const zHi = Math.max(zMin, zMax);
    const pad = (zHi - zLo) * 0.15 || 1;
    return [zLo - pad, zHi + pad];
  }, [params.xRange, gFn]);

  // ── Plot 1: z = g(x), Δx → Δz ──────────────────────────────
  const plot1Data = useMemo(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;

    // g(x) curve
    const gxs = [], gys = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const z = gFn(x);
      if (isFinite(z)) { gxs.push(x); gys.push(z); }
    }

    const traces = [];

    // g(x) curve
    traces.push({
      x: gxs, y: gys,
      type: 'scatter', mode: 'lines',
      name: `z = g(x) = ${params.a}x ${params.b >= 0 ? '+' : ''}${params.b}`,
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });

    // Tangent at x₀
    const z0 = gFn(x0);
    const tanSpan = (xMax - xMin) * 0.25;
    const tx = [Math.max(xMin, x0 - tanSpan), Math.min(xMax, x0 + tanSpan)];
    const ty = tx.map(x => z0 + gp * (x - x0));
    traces.push({
      x: tx, y: ty,
      type: 'scatter', mode: 'lines',
      name: `g'(x₀) = ${gp.toFixed(3)}`,
      line: { color: palette.mainTraces.secondary, width: 2, dash: 'dash' }
    });

    // Vertical reference at x₀
    traces.push({
      x: [x0, x0], y: [0, z0],
      type: 'scatter', mode: 'lines',
      name: '',
      line: { color: palette.markers.evalX0, width: 1, dash: 'dot' },
      showlegend: false
    });

    // Δx arrow on x-axis
    const yMin = Math.min(...gys);
    const yMax = Math.max(...gys);
    const yPad = (yMax - yMin) * 0.15 || 1;
    traces.push({
      x: [x0, x0 + dx], y: [yMin - yPad, yMin - yPad],
      type: 'scatter', mode: 'lines+markers',
      name: `Δx = ${dx.toFixed(3)}`,
      marker: { color: palette.markers.evalX0, size: 6, symbol: 'arrow' },
      line: { color: palette.markers.evalX0, width: 3 }
    });

    // Δz arrow (vertical, from curve at x₀ to curve at x₀+dx)
    const z1 = gFn(x0 + dx);
    if (isFinite(z0) && isFinite(z1)) {
      traces.push({
        x: [x0 + dx, x0 + dx], y: [z0, z1],
        type: 'scatter', mode: 'lines+markers',
        name: `Δz ≈ g'(x₀)·dx = ${(gp * dx).toFixed(4)}`,
        marker: { color: palette.auxTraces.derivative, size: 6, symbol: 'arrow' },
        line: { color: palette.auxTraces.derivative, width: 2.5 }
      });
    }

    // Point at (x₀, z₀)
    traces.push({
      x: [x0], y: [z0],
      type: 'scatter', mode: 'markers',
      name: `(x₀, z₀) = (${x0.toFixed(1)}, ${z0.toFixed(2)})`,
      marker: { color: palette.mainTraces.primary, size: 10, symbol: 'circle', line: { color: '#fff', width: 2 } }
    });

    return traces;
  }, [params, gFn, gp, x0, dx, palette, themeMode]);

  // ── Plot 2: y = f(z), Δz → Δy ──────────────────────────────
  const plot2Data = useMemo(() => {
    const [zLo, zHi] = zRange;
    const numPoints = 400;
    const step = (zHi - zLo) / numPoints;

    // f(z) curve
    const fzs = [], fys = [];
    for (let i = 0; i <= numPoints; i++) {
      const z = zLo + i * step;
      const y = fFn(z);
      if (isFinite(y) && Math.abs(y) < 10000) { fzs.push(z); fys.push(y); }
    }

    const traces = [];

    // f(z) curve
    traces.push({
      x: fzs, y: fys,
      type: 'scatter', mode: 'lines',
      name: `y = f(z) = z²${params.p !== 0 ? ` ${params.p >= 0 ? '+' : ''}${params.p}z` : ''}${params.q !== 0 ? ` ${params.q >= 0 ? '+' : ''}${params.q}` : ''}`,
      line: { color: palette.auxTraces.derivative, width: 2.5 }
    });

    // Tangent at z₀
    const tanSpan = (zHi - zLo) * 0.25;
    const tz = [Math.max(zLo, z0 - tanSpan), Math.min(zHi, z0 + tanSpan)];
    const ty = tz.map(z => y0 + fp * (z - z0));
    traces.push({
      x: tz, y: ty,
      type: 'scatter', mode: 'lines',
      name: `f'(z₀) = ${fp.toFixed(3)}`,
      line: { color: palette.mainTraces.secondary, width: 2, dash: 'dash' }
    });

    // Vertical reference at z₀
    traces.push({
      x: [z0, z0], y: [0, y0],
      type: 'scatter', mode: 'lines',
      name: '',
      line: { color: palette.markers.evalX0, width: 1, dash: 'dot' },
      showlegend: false
    });

    // Δz arrow on z-axis
    const yMin = Math.min(...fys);
    const yMax = Math.max(...fys);
    const yPad = (yMax - yMin) * 0.15 || 1;
    const dz = gp * dx;
    traces.push({
      x: [z0, z0 + dz], y: [yMin - yPad, yMin - yPad],
      type: 'scatter', mode: 'lines+markers',
      name: `Δz = ${dz.toFixed(4)}`,
      marker: { color: palette.auxTraces.derivative, size: 6, symbol: 'arrow' },
      line: { color: palette.auxTraces.derivative, width: 3 }
    });

    // Δy arrow (vertical, from f(z₀) to f(z₀+Δz))
    const y1 = fFn(z0 + dz);
    if (isFinite(y0) && isFinite(y1)) {
      traces.push({
        x: [z0 + dz, z0 + dz], y: [y0, y1],
        type: 'scatter', mode: 'lines+markers',
        name: `Δy ≈ f'(z₀)·Δz = ${(fp * dz).toFixed(4)}`,
        marker: { color: palette.mainTraces.primary, size: 6, symbol: 'arrow' },
        line: { color: palette.mainTraces.primary, width: 2.5 }
      });
    }

    // Point at (z₀, y₀)
    traces.push({
      x: [z0], y: [y0],
      type: 'scatter', mode: 'markers',
      name: `(z₀, y₀) = (${z0.toFixed(2)}, ${y0.toFixed(2)})`,
      marker: { color: palette.auxTraces.derivative, size: 10, symbol: 'circle', line: { color: '#fff', width: 2 } }
    });

    // Crosshair: horizontal line from z-axis at z₀ to curve
    traces.push({
      x: [z0, z0], y: [0, y0],
      type: 'scatter', mode: 'lines',
      name: '',
      line: { color: palette.text.muted, width: 1.5, dash: 'dot' },
      showlegend: false
    });

    return traces;
  }, [zRange, fFn, gp, fp, x0, dx, y0, z0, palette, themeMode, params.p, params.q]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
           Back to Derivative
        </BackButton>
        <SectionTitleH1>Chain Rule</SectionTitleH1>
      </Header>

      <SectionDescription>
        The chain rule tells us how to differentiate composite functions:
        <strong> dy/dx = dy/dz · dz/dx</strong>, where z = g(x) and y = f(z).
        Changes propagate through each layer — the rate multiplies at every step.
        This is the foundation of backpropagation in neural networks.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Chain Rule:</FormulaTitle>
        <Formula>
          y = f(g(x)) &nbsp; where &nbsp; z = g(x), y = f(z)<br/>
          <strong>dy/dx = f'(g(x)) · g'(x)</strong><br/><br/>
          g(x) = {params.a}x {params.b >= 0 ? '+' : ''}{params.b} &nbsp;→&nbsp; g'(x) = {gp.toFixed(1)}<br/>
          f(z) = z²{params.p !== 0 ? ` ${params.p >= 0 ? '+' : ''}${params.p}z` : ''}{params.q !== 0 ? ` ${params.q >= 0 ? '+' : ''}${params.q}` : ''} &nbsp;→&nbsp; f'(z) = 2z {params.p !== 0 ? `${params.p >= 0 ? '+' : ''}${params.p}` : ''}<br/><br/>
          At x₀ = {x0.toFixed(1)}: &nbsp;
          z₀ = g(x₀) = {isFinite(z0) ? z0.toFixed(3) : '?'}<br/>
          g'(x₀) = {gp.toFixed(3)} &nbsp;
          f'(z₀) = {isFinite(fp) ? fp.toFixed(3) : '?'}<br/>
          <strong>dy/dx = {gp.toFixed(3)} × {isFinite(fp) ? fp.toFixed(3) : '?'} = {isFinite(chainDeriv) ? chainDeriv.toFixed(3) : '?'}</strong>
        </Formula>
      </FormulaBox>

      {/* Controls Bar */}
      <ControlsBar>
        <ParameterSection title="Inner Function — z = g(x) = a·x + b">
          <ParameterControls
            parameters={params}
            onChange={setParams}
            config={[
              { name: 'a', label: 'a (slope)', min: -5, max: 5, step: 0.1 },
              { name: 'b', label: 'b (intercept)', min: -5, max: 5, step: 0.1 }
            ]}
          />
        </ParameterSection>

        <ParameterSection title="Outer Function — y = f(z) = z² + p·z + q">
          <ParameterControls
            parameters={params}
            onChange={setParams}
            config={[
              { name: 'p', label: 'p (linear term)', min: -5, max: 5, step: 0.1 },
              { name: 'q', label: 'q (constant term)', min: -5, max: 5, step: 0.1 }
            ]}
          />
        </ParameterSection>

        <ParameterSection title="Evaluation Point">
          <ParameterControls
            parameters={params}
            onChange={setParams}
            config={[
              { name: 'x0', label: 'x₀', min: -5, max: 5, step: 0.1 },
              { name: 'dx', label: 'dx (increment)', min: 0.001, max: 1, step: 0.01 }
            ]}
          />
        </ParameterSection>

        <ParameterSection title="General Settings">
          <ParameterControls
            parameters={params}
            onChange={setParams}
            config={[
              { name: 'legendPosition', label: 'Legend', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] },
              { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] },
              { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 1, default: [-5, 5] },
              { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
            ]}
          />
        </ParameterSection>
      </ControlsBar>

      {/* Live values — the chain flow */}
      <LiveValueBox>
        <LiveValueRow>
          <LiveValueLabel>📍 Change Flow:</LiveValueLabel>
          <span>
            Δx = {dx.toFixed(3)}
            {'  →[× g\'=' }{gp.toFixed(3)}{']→  '}
            Δz ≈ {isFinite(gp * dx) ? (gp * dx).toFixed(5) : '?'}
            {'  →[× f\'=' }{isFinite(fp) ? fp.toFixed(3) : '?'}{']→  '}
            <span style={{ color: palette.mainTraces.primary, fontWeight: 700 }}>
              Δy ≈ {isFinite(fp * gp * dx) ? (fp * gp * dx).toFixed(5) : '?'}
            </span>
          </span>
        </LiveValueRow>
        <LiveValueRow>
          <LiveValueLabel>✦ Values:</LiveValueLabel>
          <span>
            x₀ = {x0.toFixed(1)}
            {'  →  '} z₀ = g(x₀) = {isFinite(z0) ? z0.toFixed(3) : '?'}
            {'  →  '} y₀ = f(z₀) = {isFinite(y0) ? y0.toFixed(3) : '?'}
          </span>
        </LiveValueRow>
        <LiveValueRow>
          <LiveValueLabel>✧ Derivative:</LiveValueLabel>
          <span>
            g'(x₀) = {gp.toFixed(3)}
            {'  ×  '} f'(z₀) = {isFinite(fp) ? fp.toFixed(3) : '?'}
            {'  =  '}
            <span style={{ color: palette.mainTraces.primary, fontWeight: 700, fontSize: '1.1em' }}>
              dy/dx = {isFinite(chainDeriv) ? chainDeriv.toFixed(3) : '?'}
            </span>
          </span>
        </LiveValueRow>
      </LiveValueBox>

      {/* Plots */}
      <PlotGrid2>
        <DerivativePlotter
          data={plot1Data}
          xRange={params.xRange}
          title={`Step 1: z = g(x)  —  Δx → Δz  (dx = ${dx.toFixed(3)})`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio={params.aspectRatio}
          legendPosition={params.legendPosition}
        />
        <DerivativePlotter
          data={plot2Data}
          xRange={zRange}
          title={`Step 2: y = f(z)  —  Δz → Δy`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio={params.aspectRatio}
          legendPosition={params.legendPosition}
        />
      </PlotGrid2>
    </PageContainer>
  );
};

export default ChainRule;

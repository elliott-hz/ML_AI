// UI Pattern: MultiSectionPlot — ContentLayout (row 1) + PlotGrid2 (row 2, 2 plots) + LiveValueBox
import React, { useState, useMemo, useCallback } from 'react';
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
  ContentLayout,
  ControlsPanel,
  PlotPanel,
  FormulaBox,
  FormulaTitle,
  Formula,
  ControlsBar,
  Label,
  FuncInput,
  LiveValueRow,
  LiveValueLabel
} from '../../../components/derivative/shared/DerivativeStyled';

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

// ─── Expression evaluator ─────────────────────────────────────────
function compileExpression(expr) {
  const s = expr
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/asin\(/g, 'Math.asin(')
    .replace(/acos\(/g, 'Math.acos(')
    .replace(/atan\(/g, 'Math.atan(')
    .replace(/π/g, 'Math.PI')
    .replace(/e\^/g, 'Math.exp(')
    .replace(/\^/g, '**')
    .replace(/²/g, '**2')
    .replace(/³/g, '**3');
  try {
    return new Function('x', `"use strict"; return (${s})`);
  } catch {
    return () => NaN;
  }
}

/**
 * Chain Rule — dy/dx = dy/dz · dz/dx
 *
 * Parameters on top (full width)
 * Below: [Plot 1: g(x) + f(g(x))]  [Plot 2: Flow of Change]
 */
const ChainRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    gExpr: '0.5*x+1',
    fExpr: 'x*x',
    x0: 1,
    dx: 0.1,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const gFn = useMemo(() => compileExpression(params.gExpr), [params.gExpr]);
  const fFn = useMemo(() => compileExpression(params.fExpr), [params.fExpr]);

  // Composition: f(g(x))
  const fgFn = useCallback((x) => {
    const z = gFn(x);
    if (!isFinite(z)) return NaN;
    return fFn(z);
  }, [gFn, fFn]);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  // ── Plot 1: g(x) and f(g(x)) ──────────────────────────────────
  const plot1Data = useMemo(() => {
    const [xMin, xMax] = params.xRange;
    const x0 = params.x0;
    const z0 = gFn(x0);
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

    // g(x)
    const gData = genTrace(gFn);
    traces.push({
      x: gData.xs, y: gData.ys,
      type: 'scatter', mode: 'lines',
      name: `g(x) = ${params.gExpr}`,
      line: { color: '#6366f1', width: 2.5 }
    });

    // f(g(x))
    const fgData = genTrace(fgFn);
    traces.push({
      x: fgData.xs, y: fgData.ys,
      type: 'scatter', mode: 'lines',
      name: `f(g(x)) = ${params.fExpr.replace(/z/g, '(' + params.gExpr + ')')}`,
      line: { color: '#ef4444', width: 2.5, dash: 'dash' }
    });

    // Vertical line at x₀
    const allY = [...gData.ys, ...fgData.ys].filter(y => isFinite(y));
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);
    const pad = (yMax - yMin) * 0.15 || 1;
    traces.push({
      x: [x0, x0], y: [yMin - pad, yMax + pad],
      type: 'scatter', mode: 'lines',
      name: `x₀ = ${x0.toFixed(1)}`,
      line: { color: '#f59e0b', width: 1.5, dash: 'dot' }
    });

    // Marker at (x₀, g(x₀))
    if (isFinite(gFn(x0))) {
      traces.push({
        x: [x0], y: [gFn(x0)],
        type: 'scatter', mode: 'markers',
        name: `(x₀, g(x₀))`,
        marker: { color: '#22c55e', size: 10, symbol: 'circle' }
      });
    }

    return traces;
  }, [params, gFn, fgFn]);

  // ── Plot 2: Flow of Change ────────────────────────────────────
  const plot2Data = useMemo(() => {
    const x0 = params.x0;
    const dx = params.dx;
    const z0 = gFn(x0);
    const gp = numDeriv(gFn, x0);
    const fp = numDeriv(fFn, z0);

    if (!isFinite(z0)) return [];

    const dz = gp * dx;
    const dy = fp * dz;

    // Build g(x) curve for context
    const [xMin, xMax] = params.xRange;
    const numPoints = 200;
    const step = (xMax - xMin) / numPoints;
    const gxs = [], gys = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = gFn(x);
      if (isFinite(y) && !isNaN(y)) {
        gxs.push(x);
        gys.push(y);
      }
    }

    const traces = [];

    // g(x) curve (light, for context)
    traces.push({
      x: gxs, y: gys,
      type: 'scatter', mode: 'lines',
      name: `g(x)`,
      line: { color: '#6366f1', width: 1.5, opacity: 0.5 }
    });

    // Δx on x-axis
    const yPad = (Math.max(...gys) - Math.min(...gys)) * 0.15 || 1;
    const yMin = Math.min(...gys) - yPad;
    const yMax = Math.max(...gys) + yPad;

    // Δx arrow (horizontal segment on x-axis)
    traces.push({
      x: [x0, x0 + dx], y: [yMin, yMin],
      type: 'scatter', mode: 'lines+markers',
      name: `Δx = ${dx.toFixed(3)}`,
      marker: { color: '#f59e0b', size: 6, symbol: 'arrow' },
      line: { color: '#f59e0b', width: 3 }
    });

    // Vertical line at x₀ (thin)
    traces.push({
      x: [x0, x0], y: [0, gFn(x0)],
      type: 'scatter', mode: 'lines',
      name: '',
      line: { color: '#475569', width: 1, dash: 'dot' },
      showlegend: false
    });

    // Vertical line at x₀+dx
    traces.push({
      x: [x0 + dx, x0 + dx], y: [0, gFn(x0 + dx)],
      type: 'scatter', mode: 'lines',
      name: '',
      line: { color: '#475569', width: 1, dash: 'dot' },
      showlegend: false
    });

    // Δz vertical arrow on curve
    if (isFinite(gFn(x0)) && isFinite(gFn(x0 + dx))) {
      traces.push({
        x: [x0 + dx, x0 + dx], y: [gFn(x0), gFn(x0 + dx)],
        type: 'scatter', mode: 'lines+markers',
        name: `Δz ≈ g'(x₀)·dx = ${isFinite(gp) ? gp.toFixed(3) : '?'} × ${dx.toFixed(3)} = ${isFinite(dz) ? dz.toFixed(3) : '?'}`,
        marker: { color: '#22c55e', size: 6, symbol: 'arrow' },
        line: { color: '#22c55e', width: 2.5 }
      });
    }

    // Tangent line at x₀ (for g(x))
    if (isFinite(gFn(x0)) && isFinite(gp)) {
      const tanX = [x0 - 1, x0 + 1];
      const tanY = tanX.map(x => gFn(x0) + gp * (x - x0));
      traces.push({
        x: tanX, y: tanY,
        type: 'scatter', mode: 'lines',
        name: `g'(x₀) = ${gp.toFixed(3)}`,
        line: { color: '#22c55e', width: 1.5, dash: 'dash' }
      });
    }

    return traces;
  }, [params, gFn, fFn, numDeriv]);

  const x0 = params.x0;
  const dx = params.dx;
  const z0 = (() => { try { return gFn(x0); } catch { return NaN; } })();
  const y0 = (() => { try { return fFn(z0); } catch { return NaN; } })();
  const gp = numDeriv(gFn, x0);
  const fp = numDeriv(fFn, z0);
  const chainDeriv = gp * fp;

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
        dy/dx = dy/dz · dz/dx, where z = g(x) and y = f(z).
        Changes propagate through each layer — the rate multiplies at every step.
        This is the foundation of backpropagation in neural networks.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Chain Rule:</FormulaTitle>
        <Formula>
          y = f(g(x))<br/>
          dy/dx = f'(g(x)) · g'(x)<br/><br/>
          At x₀ = {x0.toFixed(1)}: &nbsp;
          z = g(x₀) = {isFinite(z0) ? z0.toFixed(3) : '?'}<br/>
          g'(x₀) = {isFinite(gp) ? gp.toFixed(3) : '?'} &nbsp;
          f'(z₀) = {isFinite(fp) ? fp.toFixed(3) : '?'}<br/>
          dy/dx = {isFinite(chainDeriv) ? chainDeriv.toFixed(3) : '?'}
        </Formula>
      </FormulaBox>

      {/* Parameters on top (full width) */}
      <ControlsBar>
        <ParameterSection title="Function Editor">
          <Label>g(x) =</Label>
          <FuncInput
            value={params.gExpr}
            onChange={e => setParams(p => ({ ...p, gExpr: e.target.value }))}
          />
          <Label>f(z) =</Label>
          <FuncInput
            value={params.fExpr}
            onChange={e => setParams(p => ({ ...p, fExpr: e.target.value }))}
          />
        </ParameterSection>

        <ParameterSection title="Parameters">
          <ParameterControls
            parameters={params}
            onChange={setParams}
            config={[
              { name: 'x0', label: 'x₀', min: -5, max: 5, step: 0.1 },
              { name: 'dx', label: 'dx (increment)', min: 0.001, max: 0.5, step: 0.001 }
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

      {/* Live values */}
      <LiveValueBox>
        <LiveValueRow>
          <LiveValueLabel>Flow:</LiveValueLabel>
          <span>
            x₀ = {x0.toFixed(1)}
            {'  →  '} z = g(x₀) = {isFinite(z0) ? z0.toFixed(3) : '?'}
            {'  →  '} y = f(z) = {isFinite(y0) ? y0.toFixed(3) : '?'}
          </span>
        </LiveValueRow>
        <LiveValueRow>
          <LiveValueLabel>Derivatives:</LiveValueLabel>
          <span>
            g'(x₀) = {isFinite(gp) ? gp.toFixed(3) : '?'}
            {'  ×  '} f'(z₀) = {isFinite(fp) ? fp.toFixed(3) : '?'}
            {'  =  '}
            <span style={{ color: '#6366f1', fontWeight: 700 }}>
              dy/dx = {isFinite(chainDeriv) ? chainDeriv.toFixed(3) : '?'}
            </span>
          </span>
        </LiveValueRow>
        <LiveValueRow>
          <LiveValueLabel>Change:</LiveValueLabel>
          <span>
            Δx = {dx.toFixed(3)}
            {'  →  '} Δz ≈ g'·dx = {isFinite(gp * dx) ? (gp * dx).toFixed(5) : '?'}
            {'  →  '} Δy ≈ f'·Δz = {isFinite(fp * gp * dx) ? (fp * gp * dx).toFixed(5) : '?'}
          </span>
        </LiveValueRow>
      </LiveValueBox>

      {/* Plots */}
      <PlotGrid2>
        <DerivativePlotter
          data={plot1Data}
          xRange={params.xRange}
          title={`Composition: g(x) & f(g(x))`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio={params.aspectRatio}
          legendPosition={params.legendPosition}
        />
        <DerivativePlotter
          data={plot2Data}
          xRange={params.xRange}
          title={`Flow of Change  (dx = ${dx.toFixed(3)})`}
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

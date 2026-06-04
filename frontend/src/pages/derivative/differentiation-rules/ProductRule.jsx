import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const FormulaTitle = styled.h3`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 16px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ControlsPanel = styled.div`
  flex: 0 0 350px;
  min-width: 300px;
`;

const PlotPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  margin-top: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  margin-bottom: 4px;
  display: block;
`;

const FuncInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme?.colors?.inputBg || '#334155'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#475569'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const LiveValueBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-top: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const LiveValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-family: 'Courier New', monospace;
`;

const LiveValueLabel = styled.span`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
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
 * Product Rule — (uv)' = u'v + uv'
 *
 * Row 1: [Controls | Plot 1: Product Function curves]
 * Row 2: [Plot 2: Area rectangle]  [Plot 3: Area Expansion]
 */
const ProductRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    uExpr: '2+0.5*x',
    vExpr: '1+x*x',
    x0: 1,
    dx: 0.1,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const uFn = useMemo(() => compileExpression(params.uExpr), [params.uExpr]);
  const vFn = useMemo(() => compileExpression(params.vExpr), [params.vExpr]);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  // ── Plot 1: Product Function curves ────────────────────────────
  const productFn = useCallback((x) => uFn(x) * vFn(x), [uFn, vFn]);

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
      name: `u(x) = ${params.uExpr}`,
      line: { color: '#6366f1', width: 2.5 }
    });

    // v(x)
    const vData = genTrace(vFn);
    traces.push({
      x: vData.xs, y: vData.ys,
      type: 'scatter', mode: 'lines',
      name: `v(x) = ${params.vExpr}`,
      line: { color: '#22c55e', width: 2.5 }
    });

    // uv(x)
    const pData = genTrace(productFn);
    traces.push({
      x: pData.xs, y: pData.ys,
      type: 'scatter', mode: 'lines',
      name: 'u(x)·v(x)',
      line: { color: '#ef4444', width: 2.5 }
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
      line: { color: '#f59e0b', width: 1.5, dash: 'dot' }
    });

    return traces;
  }, [params, uFn, vFn, productFn]);

  // ── Plot 2: Area rectangle (u × v) ─────────────────────────────
  const plot2Data = useMemo(() => {
    const x0 = params.x0;
    const u0 = uFn(x0);
    const v0 = vFn(x0);
    if (!isFinite(u0) || !isFinite(v0)) return [];

    // Rectangle corners: bottom-left at (0, 0), width = u0, height = v0
    const rectX = [0, u0, u0, 0, 0];
    const rectY = [0, 0, v0, v0, 0];

    const traces = [];

    // Filled rectangle
    traces.push({
      x: rectX, y: rectY,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(99, 102, 241, 0.15)',
      name: `Area = u·v`,
      line: { color: '#6366f1', width: 2 }
    });

    // Labels for u, v
    traces.push({
      x: [u0 / 2], y: [-v0 * 0.08],
      type: 'scatter', mode: 'text',
      text: [`u = ${isFinite(u0) ? u0.toFixed(2) : '?'}`],
      textfont: { color: '#6366f1', size: 14, family: 'monospace' },
      name: 'u',
      showlegend: false
    });

    traces.push({
      x: [-u0 * 0.08], y: [v0 / 2],
      type: 'scatter', mode: 'text',
      text: [`v = ${isFinite(v0) ? v0.toFixed(2) : '?'}`],
      textfont: { color: '#22c55e', size: 14, family: 'monospace' },
      name: 'v',
      showlegend: false
    });

    traces.push({
      x: [u0 / 2], y: [v0 / 2],
      type: 'scatter', mode: 'text',
      text: [`Area = ${isFinite(u0) && isFinite(v0) ? (u0 * v0).toFixed(2) : '?'}`],
      textfont: { color: '#f8fafc', size: 15, family: 'monospace' },
      name: 'Area',
      showlegend: false
    });

    return traces;
  }, [params, uFn, vFn]);

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

    // Block 1: original area (bottom-left) — light yellow
    const b1x = [0, u0, u0, 0, 0];
    const b1y = [0, 0, v0, v0, 0];

    // Block 2: right strip (u'v·dx) — yellow
    const b2x = [u0, u0 + du, u0 + du, u0, u0];
    const b2y = [0, 0, v0, v0, 0];

    // Block 3: top strip (uv'·dx) — cyan
    const b3x = [0, u0, u0, 0, 0];
    const b3y = [v0, v0, v0 + dv, v0 + dv, v0];

    // Block 4: top-right corner (u'v'·dx²) — purple
    const b4x = [u0, u0 + du, u0 + du, u0, u0];
    const b4y = [v0, v0, v0 + dv, v0 + dv, v0];

    const traces = [];

    // Block 1
    traces.push({
      x: b1x, y: b1y,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(250, 204, 21, 0.2)',
      name: 'uv (original)',
      line: { color: '#eab308', width: 1.5 }
    });

    // Block 2
    traces.push({
      x: b2x, y: b2y,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(250, 204, 21, 0.5)',
      name: `u'v·dx = ${(up * v0 * dx).toFixed(3)}`,
      line: { color: '#eab308', width: 1.5 }
    });

    // Block 3
    traces.push({
      x: b3x, y: b3y,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(34, 197, 94, 0.4)',
      name: `uv'·dx = ${(u0 * vp * dx).toFixed(3)}`,
      line: { color: '#22c55e', width: 1.5 }
    });

    // Block 4
    traces.push({
      x: b4x, y: b4y,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(168, 85, 247, 0.4)',
      name: `u'v'·dx² = ${(up * vp * dx * dx).toFixed(5)}`,
      line: { color: '#a855f7', width: 1.5 }
    });

    // Labels inside blocks
    const totalW = u0 + du;
    const totalH = v0 + dv;
    traces.push({
      x: [u0 / 2], y: [v0 / 2],
      type: 'scatter', mode: 'text',
      text: ['uv'],
      textfont: { color: '#f8fafc', size: 13, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [u0 + du / 2], y: [v0 / 2],
      type: 'scatter', mode: 'text',
      text: ["u'v·dx"],
      textfont: { color: '#f8fafc', size: 11, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [u0 / 2], y: [v0 + dv / 2],
      type: 'scatter', mode: 'text',
      text: ["uv'·dx"],
      textfont: { color: '#f8fafc', size: 11, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [u0 + du / 2], y: [v0 + dv / 2],
      type: 'scatter', mode: 'text',
      text: ["u'v'·dx²"],
      textfont: { color: '#f8fafc', size: 10, family: 'monospace' },
      showlegend: false
    });

    return traces;
  }, [params, uFn, vFn, numDeriv]);

  const x0 = params.x0;
  const dx = params.dx;
  const u0 = (() => { try { return uFn(x0); } catch { return NaN; } })();
  const v0 = (() => { try { return vFn(x0); } catch { return NaN; } })();
  const up = numDeriv(uFn, x0);
  const vp = numDeriv(vFn, x0);
  const productVal = u0 * v0;
  const productDeriv = u0 * vp + v0 * up;

  // Pre-compute xRange values for Plot 2 and Plot 3
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

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
           Back to Derivative
        </BackButton>
        <Title>Product Rule</Title>
      </Header>

      <Description>
        The product rule tells us how to differentiate the product of two functions:
        (uv)' = u'v + uv'. The key insight is that when u changes by u'dx and v changes by v'dx,
        the total area (u·v) grows by u'v·dx + uv'·dx plus a tiny u'v'·dx² term that vanishes.
      </Description>

      <FormulaBox>
        <FormulaTitle>Product Rule:</FormulaTitle>
        <Formula>
          (u·v)' = u'·v + u·v'<br/><br/>
          At x₀ = {x0.toFixed(1)}: &nbsp;
          u = {isFinite(u0) ? u0.toFixed(2) : '?'}, &nbsp;
          v = {isFinite(v0) ? v0.toFixed(2) : '?'}, &nbsp;
          u' = {isFinite(up) ? up.toFixed(3) : '?'}, &nbsp;
          v' = {isFinite(vp) ? vp.toFixed(3) : '?'}<br/>
          (uv)' = {isFinite(productDeriv) ? productDeriv.toFixed(3) : '?'}
        </Formula>
      </FormulaBox>

      {/* Row 1: Controls + Plot 1 */}
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Editor">
            <Label>u(x) =</Label>
            <FuncInput
              value={params.uExpr}
              onChange={e => setParams(p => ({ ...p, uExpr: e.target.value }))}
            />
            <Label>v(x) =</Label>
            <FuncInput
              value={params.vExpr}
              onChange={e => setParams(p => ({ ...p, vExpr: e.target.value }))}
            />
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -5, max: 5, step: 0.1 },
                { name: 'dx', label: 'dx (increment)', min: 0.001, max: 0.5, step: 0.001 }
              ]}
            />
          </ParameterSection>

          <LiveValueBox>
            <LiveValueRow>
              <LiveValueLabel>u(x₀) =</LiveValueLabel>
              <span>{isFinite(u0) ? u0.toFixed(3) : '—'}</span>
            </LiveValueRow>
            <LiveValueRow>
              <LiveValueLabel>v(x₀) =</LiveValueLabel>
              <span>{isFinite(v0) ? v0.toFixed(3) : '—'}</span>
            </LiveValueRow>
            <LiveValueRow>
              <LiveValueLabel>uv(x₀) =</LiveValueLabel>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{isFinite(productVal) ? productVal.toFixed(3) : '—'}</span>
            </LiveValueRow>
            <LiveValueRow>
              <LiveValueLabel>u'(x₀) =</LiveValueLabel>
              <span>{isFinite(up) ? up.toFixed(3) : '—'}</span>
            </LiveValueRow>
            <LiveValueRow>
              <LiveValueLabel>v'(x₀) =</LiveValueLabel>
              <span>{isFinite(vp) ? vp.toFixed(3) : '—'}</span>
            </LiveValueRow>
            <LiveValueRow>
              <LiveValueLabel>(uv)'(x₀) =</LiveValueLabel>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{isFinite(productDeriv) ? productDeriv.toFixed(3) : '—'}</span>
            </LiveValueRow>
          </LiveValueBox>

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
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={plot1Data}
            xRange={params.xRange}
            title="Product Function: u(x) · v(x)"
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
          title={`Area = u × v  (u=${isFinite(u0) ? u0.toFixed(2) : '?'}, v=${isFinite(v0) ? v0.toFixed(2) : '?'})`}
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

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
 * Quotient Rule — (u/v)' = (u'v - uv') / v²
 *
 * Row 1: [Controls | Plot 1: Quotient Function curves]
 * Row 2: [Plot 2: Geometric rectangle]  [Plot 3: Ratio Change]
 */
const QuotientRule = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    uExpr: '6',
    vExpr: '2+0.5*x',
    x0: 1,
    dx: 0.1,
    xRange: [-3, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const uFn = useMemo(() => compileExpression(params.uExpr), [params.uExpr]);
  const vFn = useMemo(() => compileExpression(params.vExpr), [params.vExpr]);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  // ── Plot 1: Quotient Function curves ───────────────────────────
  const quotientFn = useCallback((x) => {
    const v = vFn(x);
    if (Math.abs(v) < 1e-10) return NaN;
    return uFn(x) / v;
  }, [uFn, vFn]);

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

    // u/v(x)
    const qData = genTrace(quotientFn);
    traces.push({
      x: qData.xs, y: qData.ys,
      type: 'scatter', mode: 'lines',
      name: 'u(x) / v(x)',
      line: { color: '#ef4444', width: 2.5 }
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
      line: { color: '#f59e0b', width: 1.5, dash: 'dot' }
    });

    return traces;
  }, [params, uFn, vFn, quotientFn]);

  // ── Plot 2: Area rectangle (u = v × (u/v)) ────────────────────
  const plot2Data = useMemo(() => {
    const x0 = params.x0;
    const u0 = uFn(x0);
    const v0 = vFn(x0);
    if (!isFinite(u0) || !isFinite(v0) || Math.abs(v0) < 1e-10) return [];

    const q = u0 / v0;

    // Rectangle: width = v, height = u/v, area = u
    const rectX = [0, v0, v0, 0, 0];
    const rectY = [0, 0, q, q, 0];

    const traces = [];

    // Filled rectangle
    traces.push({
      x: rectX, y: rectY,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(99, 102, 241, 0.15)',
      name: 'Area = u',
      line: { color: '#6366f1', width: 2 }
    });

    // Labels
    traces.push({
      x: [v0 / 2], y: [-q * 0.08],
      type: 'scatter', mode: 'text',
      text: [`v = ${isFinite(v0) ? v0.toFixed(2) : '?'} (width)`],
      textfont: { color: '#22c55e', size: 13, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [-v0 * 0.08], y: [q / 2],
      type: 'scatter', mode: 'text',
      text: [`u/v = ${isFinite(q) ? q.toFixed(2) : '?'} (height)`],
      textfont: { color: '#ef4444', size: 13, family: 'monospace' },
      showlegend: false
    });
    traces.push({
      x: [v0 / 2], y: [q / 2],
      type: 'scatter', mode: 'text',
      text: [`Area = u = ${isFinite(u0) ? u0.toFixed(2) : '?'}`],
      textfont: { color: '#f8fafc', size: 14, family: 'monospace' },
      showlegend: false
    });

    return traces;
  }, [params, uFn, vFn]);

  // ── Plot 3: Ratio Change ──────────────────────────────────────
  const plot3Data = useMemo(() => {
    const x0 = params.x0;
    const dx = params.dx;
    const u0 = uFn(x0);
    const v0 = vFn(x0);
    const up = numDeriv(uFn, x0);
    const vp = numDeriv(vFn, x0);

    if (!isFinite(u0) || !isFinite(v0) || Math.abs(v0) < 1e-10) return [];

    const q0 = u0 / v0;
    const du = up * dx;
    const dv = vp * dx;

    // New values
    const u1 = u0 + du;
    const v1 = v0 + dv;
    const q1 = u1 / v1;

    const traces = [];

    // Original rectangle (area = u0, width = v0, height = q0)
    const r1x = [0, v0, v0, 0, 0];
    const r1y = [0, 0, q0, q0, 0];
    traces.push({
      x: r1x, y: r1y,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(99, 102, 241, 0.15)',
      name: 'Original',
      line: { color: '#6366f1', width: 1.5 }
    });

    // Positive contribution: Δu makes height go up (u'·dx / v)
    const posContrib = (up * dx) / v0;
    if (isFinite(posContrib) && Math.abs(posContrib) > 1e-8) {
      const stripY = q0 + (posContrib > 0 ? 0 : posContrib);
      const stripH = Math.abs(posContrib);
      const px = [0, v0, v0, 0, 0];
      const py = [stripY, stripY, stripY + stripH, stripY + stripH, stripY];
      traces.push({
        x: px, y: py,
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: posContrib > 0 ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        name: `${posContrib > 0 ? '+' : ''}${(posContrib).toFixed(3)} (u'·dx / v)`,
        line: { color: posContrib > 0 ? '#22c55e' : '#ef4444', width: 1.5 }
      });
    }

    // New rectangle (area = u1, width = v1, height = q1)
    const r2x = [0, v1, v1, 0, 0];
    const r2y = [0, 0, q1, q1, 0];
    traces.push({
      x: r2x, y: r2y,
      type: 'scatter', mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(251, 191, 36, 0.1)',
      name: 'After change',
      line: { color: '#f59e0b', width: 1.5, dash: 'dot' }
    });

    // Labels
    traces.push({
      x: [v0 / 2], y: [q0 / 2],
      type: 'scatter', mode: 'text',
      text: [`u = ${u0.toFixed(2)}`],
      textfont: { color: '#f8fafc', size: 12, family: 'monospace' },
      showlegend: false
    });

    const formulaStr = `(u/v)' = (${up.toFixed(2)}×${v0.toFixed(2)} − ${u0.toFixed(2)}×${vp.toFixed(2)}) / ${v0.toFixed(2)}²`;
    traces.push({
      x: [Math.max(v0, v1) * 0.5], y: [Math.max(q0, q1) * 1.3],
      type: 'scatter', mode: 'text',
      text: [formulaStr],
      textfont: { color: '#f8fafc', size: 12, family: 'monospace' },
      showlegend: false
    });

    return traces;
  }, [params, uFn, vFn, numDeriv]);

  const x0 = params.x0;
  const u0 = (() => { try { return uFn(x0); } catch { return NaN; } })();
  const v0 = (() => { try { return vFn(x0); } catch { return NaN; } })();
  const up = numDeriv(uFn, x0);
  const vp = numDeriv(vFn, x0);
  const q0 = u0 / v0;
  const quotientDeriv = (up * v0 - u0 * vp) / (v0 * v0);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
           Back to Derivative
        </BackButton>
        <Title>Quotient Rule</Title>
      </Header>

      <Description>
        The quotient rule tells us how to differentiate the quotient of two functions:
        (u/v)' = (u'v − uv') / v². Think of u as an area and v as a width — the height u/v
        increases when u grows and decreases when v grows, giving the numerator u'v − uv'.
        The v² in the denominator shows the diluted effect of a larger v.
      </Description>

      <FormulaBox>
        <FormulaTitle>Quotient Rule:</FormulaTitle>
        <Formula>
          (u/v)' = (u'·v − u·v') / v²<br/><br/>
          At x₀ = {x0.toFixed(1)}: &nbsp;
          u = {isFinite(u0) ? u0.toFixed(2) : '?'}, &nbsp;
          v = {isFinite(v0) ? v0.toFixed(2) : '?'}, &nbsp;
          u/v = {isFinite(q0) ? q0.toFixed(3) : '?'}<br/>
          (u/v)' = {isFinite(quotientDeriv) ? quotientDeriv.toFixed(3) : '?'}
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
              <LiveValueLabel>u/v(x₀) =</LiveValueLabel>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{isFinite(q0) ? q0.toFixed(3) : '—'}</span>
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
              <LiveValueLabel>(u/v)'(x₀) =</LiveValueLabel>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{isFinite(quotientDeriv) ? quotientDeriv.toFixed(3) : '—'}</span>
            </LiveValueRow>
            <LiveValueRow>
              <LiveValueLabel>v(x₀)² =</LiveValueLabel>
              <span style={{ color: '#a855f7' }}>{isFinite(v0) ? (v0 * v0).toFixed(3) : '—'}</span>
            </LiveValueRow>
          </LiveValueBox>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
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
            xRange={params.xRange}
            title="Quotient Function: u(x) / v(x)"
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
          title={`u = v × (u/v)  (u=${isFinite(u0) ? u0.toFixed(2) : '?'})`}
          showExportButton={false}
          plotStyle={params.plotStyle}
          aspectRatio="1:1"
          legendPosition={params.legendPosition}
        />
        <DerivativePlotter
          data={plot3Data}
          title={`Ratio Change  (dx = ${params.dx.toFixed(3)})`}
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

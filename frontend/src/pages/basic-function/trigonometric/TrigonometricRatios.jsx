import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter from '../../../components/visualization/FunctionPlotter';
import DerivativePlotter from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  flex-shrink: 0;
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
  flex-shrink: 0;
  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
`;

// ── Row 1: Controls Bar ──────────────────────────────

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  flex-shrink: 0;
  flex-wrap: wrap;
  min-height: 42px;
  width: 100%;
`;

const SliderGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  align-items: center;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  height: 42px;
  box-sizing: border-box;
  flex: 1;
  min-width: 200px;
`;

const SliderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  label {
    color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }
  input[type='range'] {
    flex: 1;
    min-width: 60px;
    accent-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
  .val {
    color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
    font-size: 13px;
    min-width: 36px;
    text-align: right;
    font-family: monospace;
  }
`;

const PillAngle = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
  height: 42px;
  box-sizing: border-box;
  width: 170px;
  flex-shrink: 0;
  justify-content: center;
`;

const AngleBig = styled.span`
  color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  font-size: 20px;
  font-weight: 700;
`;

const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  overflow: hidden;
  flex-shrink: 0;
`;

const ToggleBtn = styled.button`
  padding: 6px ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ $active, theme }) => ($active ? (theme?.colors?.primary || '#6366f1') : 'transparent')};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;
  height: 42px;
  box-sizing: border-box;
  &:hover {
    background: ${({ $active, theme }) =>
      $active ? (theme?.colors?.primary || '#6366f1') : (theme?.colors?.inputBg || '#334155')};
  }
`;

const StyleSelect = styled.select`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: 6px ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  font-size: 13px;
  cursor: pointer;
  height: 42px;
  box-sizing: border-box;
`;

// ── Row 2: Ratio Cards (horizontal) ──────────────────

const RatiosBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  flex-shrink: 0;
  width: 100%;
  min-height: 42px;
`;

const MiniCard = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: 4px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 90px;
  flex: 1;
  height: 42px;
  box-sizing: border-box;
`;

const MiniName = styled.span`
  color: ${({ $color }) => $color || '#cbd5e1'};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
`;

const MiniVal = styled.span`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 15px;
  font-weight: 700;
  font-family: monospace;
`;

const MiniInf = styled(MiniVal)`
  color: ${({ theme }) => theme?.colors?.error || '#ef4444'};
`;

// ── Row 3: Two Plots ─────────────────────────────────

const PlotRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  flex: 1;
  min-height: 0;
`;

const PlotHalf = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const PlotHalfNarrow = styled.div`
  flex: 0 0 38%;
  min-width: 0;
  min-height: 0;
  display: grid;
  aspect-ratio: 1;
  
  & > * {
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
  }
`;

// ── Helpers ──────────────────────────────────────────

const formatVal = (v) => {
  if (!isFinite(v) || v === undefined || v === null) return null;
  return parseFloat(v.toFixed(4)).toString();
};

const isInfinite = (v) => !isFinite(v) || Math.abs(v) > 1e8;

/**
 * TrigonometricRatios — interactive exploration of the 6 trig ratios.
 */
const TrigonometricRatios = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({ radius: 3, angle: 45 });
  const [plotStyle, setPlotStyle] = useState('medium');
  const [activePlot, setActivePlot] = useState('sin-cos'); // 'sin-cos' | 'tan-cot' | 'sec-csc'

  const { radius, angle } = params;
  const angleRad = angle * Math.PI / 180;
  const cx = radius * Math.cos(angleRad);
  const cy = radius * Math.sin(angleRad);
  const theta = angleRad;
  const hyp = radius;

  // ── 6 trig ratios ──
  const sinVal = hyp > 0 ? cy / hyp : 0;
  const cosVal = hyp > 0 ? cx / hyp : 0;
  const tanVal = cx !== 0 ? cy / cx : Infinity;
  const cscVal = cy !== 0 ? hyp / cy : Infinity;
  const secVal = cx !== 0 ? hyp / cx : Infinity;
  const cotVal = cy !== 0 ? cx / cy : Infinity;

  const ratioData = [
    { name: 'sin', formula: 'a / c', value: sinVal, color: '#6366f1' },
    { name: 'cos', formula: 'b / c', value: cosVal, color: '#06b6d4' },
    { name: 'tan', formula: 'a / b', value: tanVal, color: '#f59e0b' },
    { name: 'csc', formula: 'c / a', value: cscVal, color: '#10b981' },
    { name: 'sec', formula: 'c / b', value: secVal, color: '#f97316' },
    { name: 'cot', formula: 'b / a', value: cotVal, color: '#ec4899' }
  ];

  // ── Triangle traces ──
  const triangleTraces = useMemo(() => {
    const traces = [];

    // Edges A(0,0) → B(cx,0) → C(cx,cy) → A
    traces.push({
      x: [0, cx, cx, 0], y: [0, 0, cy, 0],
      mode: 'lines+markers', type: 'scatter',
      name: 'Triangle',
      line: { color: '#6366f1', width: 3 },
      marker: { size: [10, 10, 10, 1], color: ['#6366f1', '#6366f1', '#6366f1', 'rgba(0,0,0,0)'], symbol: 'circle' },
      hoverinfo: 'skip', showlegend: false
    });

    // Right angle indicator at B
    const s = 0.2;
    const rx = cx - Math.sign(cx || 1) * s;
    const ry = cy !== 0 ? Math.sign(cy) * s : s;
    traces.push({
      x: [rx, cx, cx], y: [0, 0, ry],
      mode: 'lines', type: 'scatter',
      name: 'Right Angle', line: { color: '#94a3b8', width: 1.5 },
      hoverinfo: 'skip', showlegend: false
    });

    // Angle arc at A
    const arcRes = 40, arcR = 0.35;
    const arcX = [], arcY = [];
    for (let i = 0; i <= arcRes; i++) {
      const a = (theta / arcRes) * i;
      arcX.push(arcR * Math.cos(a)); arcY.push(arcR * Math.sin(a));
    }
    traces.push({
      x: arcX, y: arcY, mode: 'lines', type: 'scatter',
      name: 'θ', line: { color: '#f59e0b', width: 2.5 },
      hoverinfo: 'skip', showlegend: false
    });

    // θ label
    const midA = theta / 2, labelR = 0.9;
    const tDeg = (theta * 180 / Math.PI).toFixed(1);
    traces.push({
      x: [labelR * Math.cos(midA)], y: [labelR * Math.sin(midA)],
      mode: 'text', type: 'scatter',
      text: [`θ = ${tDeg}°`], textposition: 'middle center',
      textfont: { color: '#f59e0b', size: 14, family: 'serif, italic' },
      hoverinfo: 'skip', showlegend: false
    });

    // Point labels
    const lo = 0.3;
    traces.push({
      x: [0, cx, cx + (cx >= 0 ? 1 : -1) * lo],
      y: [-lo, -lo, cy + (cy >= 0 ? 1 : -1) * lo],
      mode: 'text', type: 'scatter',
      text: ['A(0,0)', `B(${cx.toFixed(2)},0)`, `C(${cx.toFixed(2)},${cy.toFixed(2)})`],
      textposition: 'middle center', textfont: { color: '#f8fafc', size: 11 },
      hoverinfo: 'skip', showlegend: false
    });

    // Side length labels
    const aLen = Math.abs(cy), bLen = Math.abs(cx), cLen = hyp;
    const ps = 0.45;
    const cPerpX = -cy / (hyp || 1) * ps;
    const cPerpY = cx / (hyp || 1) * ps;
    traces.push({
      x: [cx + (cx >= 0 ? 0.45 : -0.45), cx / 2, cx / 2 + cPerpX],
      y: [cy / 2, (cy >= 0 ? -0.45 : 0.45), cy / 2 + cPerpY],
      mode: 'text', type: 'scatter',
      text: [`a = ${aLen.toFixed(1)}`, `b = ${bLen.toFixed(1)}`, `c = ${cLen.toFixed(1)}`],
      textposition: 'middle center', textfont: { color: '#94a3b8', size: 12 },
      hoverinfo: 'skip', showlegend: false
    });

    return traces;
  }, [cx, cy, theta, hyp]);

  // ── Sampling ──
  const NUM_PTS = 2000;
  const sampleFunction = useMemo(() => {
    const xVals = [];
    for (let i = 0; i < NUM_PTS; i++)
      xVals.push(-Math.PI + (2 * Math.PI * i) / (NUM_PTS - 1));
    return xVals;
  }, []);

  const makeTrigTrace = (fn, _name, _color, _dash, xVals, thetaVal) => {
    const yVals = xVals.map(x => fn(x));
    const cleaned = yVals.map(v => (!isFinite(v) || Math.abs(v) > 50) ? NaN : v);
    const inter = fn(thetaVal);
    const interValid = isFinite(inter) && Math.abs(inter) < 50;
    return { yVals: cleaned, inter, interValid };
  };

  // ── Sin/Cos traces ──
  const sinCosTraces = useMemo(() => {
    const xVals = sampleFunction, tv = theta;
    const traces = [];
    const sd = makeTrigTrace(Math.sin, '', '', '', xVals, tv);
    const cd = makeTrigTrace(Math.cos, '', '', '', xVals, tv);
    traces.push({ x: xVals, y: sd.yVals, mode: 'lines', type: 'scatter', name: 'sin(θ)', line: { color: '#6366f1', width: 2 } });
    traces.push({ x: xVals, y: cd.yVals, mode: 'lines', type: 'scatter', name: 'cos(θ)', line: { color: '#06b6d4', width: 2 } });

    // Faint auxiliary grid lines at key angles
    const keyAngles = [-Math.PI / 2, 0, Math.PI / 2];
    keyAngles.forEach(x => {
      traces.push({
        x: [x, x], y: [-1.5, 1.5], mode: 'lines', type: 'scatter',
        line: { color: 'rgba(148, 163, 184, 0.2)', width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
    });

    traces.push({ x: [tv, tv], y: [-1.5, 1.5], mode: 'lines', type: 'scatter', name: `θ = ${(tv * 180 / Math.PI).toFixed(1)}°`, line: { color: '#f59e0b', width: 2, dash: 'dash' } });

    const mx = [], my = [], mt = [], mc = [];
    if (sd.interValid) { mx.push(tv); my.push(sd.inter); mt.push(`sin = ${formatVal(sd.inter)}`); mc.push('#6366f1'); }
    if (cd.interValid) { mx.push(tv); my.push(cd.inter); mt.push(`cos = ${formatVal(cd.inter)}`); mc.push('#06b6d4'); }
    if (mx.length) {
      traces.push({
        x: mx, y: my, mode: 'markers+text', type: 'scatter', name: 'Values',
        marker: { size: 9, color: mc, symbol: 'circle', line: { color: '#fff', width: 1 } },
        text: mt, textposition: 'top center', textfont: { size: 10, color: '#f8fafc' }, hoverinfo: 'text'
      });
    }
    return traces;
  }, [theta, sampleFunction]);

  // ── Tan/Cot traces ──
  const tanCotTraces = useMemo(() => {
    const xVals = sampleFunction, tv = theta;
    const traces = [];
    const cfgs = [
      { fn: (x) => Math.tan(x), name: 'tan(θ)', color: '#f59e0b' },
      { fn: (x) => 1 / Math.tan(x), name: 'cot(θ)', color: '#10b981' }
    ];
    const allMx = [], allMy = [], allMt = [], allMc = [];
    cfgs.forEach(({ fn, name, color }) => {
      const d = makeTrigTrace(fn, name, color, 'solid', xVals, tv);
      traces.push({ x: xVals, y: d.yVals, mode: 'lines', type: 'scatter', name, line: { color, width: 2 } });
      if (d.interValid) { allMx.push(tv); allMy.push(d.inter); allMt.push(`${name.replace('(θ)', '')} = ${formatVal(d.inter)}`); allMc.push(color); }
    });
    traces.push({ x: [tv, tv], y: [-5, 5], mode: 'lines', type: 'scatter', name: `θ = ${(tv * 180 / Math.PI).toFixed(1)}°`, line: { color: '#f59e0b', width: 2, dash: 'dash' } });
    if (allMx.length) traces.push({ x: allMx, y: allMy, mode: 'markers+text', type: 'scatter', name: 'Values', marker: { size: 9, color: allMc, symbol: 'circle', line: { color: '#fff', width: 1 } }, text: allMt, textposition: 'top center', textfont: { size: 10, color: '#f8fafc' }, hoverinfo: 'text' });
    return traces;
  }, [theta, sampleFunction]);

  // ── Sec/Csc traces ──
  const secCscTraces = useMemo(() => {
    const xVals = sampleFunction, tv = theta;
    const traces = [];
    const cfgs = [
      { fn: (x) => 1 / Math.cos(x), name: 'sec(θ)', color: '#f97316' },
      { fn: (x) => 1 / Math.sin(x), name: 'csc(θ)', color: '#ec4899' }
    ];
    const allMx = [], allMy = [], allMt = [], allMc = [];
    cfgs.forEach(({ fn, name, color }) => {
      const d = makeTrigTrace(fn, name, color, 'solid', xVals, tv);
      traces.push({ x: xVals, y: d.yVals, mode: 'lines', type: 'scatter', name, line: { color, width: 2 } });
      if (d.interValid) { allMx.push(tv); allMy.push(d.inter); allMt.push(`${name.replace('(θ)', '')} = ${formatVal(d.inter)}`); allMc.push(color); }
    });
    traces.push({ x: [tv, tv], y: [-5, 5], mode: 'lines', type: 'scatter', name: `θ = ${(tv * 180 / Math.PI).toFixed(1)}°`, line: { color: '#f59e0b', width: 2, dash: 'dash' } });
    if (allMx.length) traces.push({ x: allMx, y: allMy, mode: 'markers+text', type: 'scatter', name: 'Values', marker: { size: 9, color: allMc, symbol: 'circle', line: { color: '#fff', width: 1 } }, text: allMt, textposition: 'top center', textfont: { size: 10, color: '#f8fafc' }, hoverinfo: 'text' });
    return traces;
  }, [theta, sampleFunction]);

  const handleSlider = (key) => (e) => {
    setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }));
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>← Basic</BackButton>
        <Title>Trigonometric Ratios</Title>
      </Header>

      {/* Row 1: Controls */}
      <ControlsBar>
        <SliderGroup>
          <SliderItem>
            <label>Radius</label>
            <input type="range" min={0.5} max={6} step={0.1} value={params.radius} onChange={handleSlider('radius')} />
            <span className="val">{params.radius.toFixed(1)}</span>
          </SliderItem>
          <SliderItem>
            <label>Angle</label>
            <input type="range" min={-180} max={180} step={10} value={params.angle} onChange={handleSlider('angle')} />
            <span className="val">{params.angle}°</span>
          </SliderItem>
        </SliderGroup>

        <PillAngle>
          <AngleBig>θ = {angle}°</AngleBig>
          <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 6 }}>({angleRad.toFixed(3)} rad)</span>
        </PillAngle>

        <ToggleGroup>
          <ToggleBtn $active={activePlot === 'sin-cos'} onClick={() => setActivePlot('sin-cos')}>sin / cos</ToggleBtn>
          <ToggleBtn $active={activePlot === 'tan-cot'} onClick={() => setActivePlot('tan-cot')}>tan / cot</ToggleBtn>
          <ToggleBtn $active={activePlot === 'sec-csc'} onClick={() => setActivePlot('sec-csc')}>sec / csc</ToggleBtn>
        </ToggleGroup>

        <StyleSelect value={plotStyle} onChange={(e) => setPlotStyle(e.target.value)}>
          <option value="thin">Thin</option>
          <option value="medium">Medium</option>
          <option value="thick">Thick</option>
          <option value="extra-thick">Extra-thick</option>
        </StyleSelect>
      </ControlsBar>

      {/* Row 2: Ratio cards */}
      <RatiosBar>
        {ratioData.map(({ name, formula, value, color }) => (
          <MiniCard key={name}>
            <MiniName $color={color}>{name} = {formula}</MiniName>
            {isInfinite(value) ? <MiniInf>∞</MiniInf> : <MiniVal>{formatVal(value)}</MiniVal>}
          </MiniCard>
        ))}
      </RatiosBar>

      {/* Row 3: Two plots */}
      <PlotRow>
        <PlotHalfNarrow>
          <FunctionPlotter
            data={triangleTraces}
            xRange={[-5, 5]} yRange={[-5, 5]}
            aspectRatio="1:1"
            title="Right Triangle"
            plotStyle={plotStyle}
            showExportButton={false}
          />
        </PlotHalfNarrow>
        <PlotHalf>
          {activePlot === 'sin-cos' && (
            <DerivativePlotter
              data={sinCosTraces}
              xRange={[-Math.PI, Math.PI]} yRange={[-1.5, 1.5]}
              xTickMode="pi"
              title="sin(θ) &amp; cos(θ)"
              plotStyle={plotStyle}
              aspectRatio="auto"
              legendPosition="top-right"
              showExportButton={false}
            />
          )}
          {activePlot === 'tan-cot' && (
            <DerivativePlotter
              data={tanCotTraces}
              xRange={[-Math.PI, Math.PI]} yRange={[-5, 5]}
              xTickMode="pi"
              title="tan(θ) &amp; cot(θ)"
              plotStyle={plotStyle}
              aspectRatio="auto"
              legendPosition="top-right"
              showExportButton={false}
            />
          )}
          {activePlot === 'sec-csc' && (
            <DerivativePlotter
              data={secCscTraces}
              xRange={[-Math.PI, Math.PI]} yRange={[-5, 5]}
              xTickMode="pi"
              title="sec(θ) &amp; csc(θ)"
              plotStyle={plotStyle}
              aspectRatio="auto"
              legendPosition="top-right"
              showExportButton={false}
            />
          )}
        </PlotHalf>
      </PlotRow>
    </PageContainer>
  );
};

export default TrigonometricRatios;

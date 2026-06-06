import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import FunctionPlotter from '../../../components/visualization/FunctionPlotter';
import BackButton from '../../../components/layout/BackButton';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { useSplitter } from '../../../hooks/useSplitter';

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
  align-items: flex-start;
  gap: 0;
  flex: 1;
  min-height: 0;
  position: relative;
`;

const PlotHalf = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const PlotHalfNarrow = styled.div`
  display: flex;
  position: relative;
  min-width: 0;
  min-height: 0;
`;

const PlotInner = styled.div`
  flex: 1;
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

const Resizer = styled.div`
  width: 8px;
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 3px;
    bottom: 0;
    width: 2px;
    background: ${({ theme }) => theme?.colors?.border || '#334155'};
    border-radius: 1px;
    transition: background 0.2s ease;
  }
  &:hover::after {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
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
  const themeMode = useThemeMode();
  const {
    leftRatio, rightPlotKey, rowRef, onResizeStart,
  } = useSplitter();

  const [params, setParams] = useState({ angle: 45 });
  const [plotStyle, setPlotStyle] = useState('medium');
  const [activePlot, setActivePlot] = useState('sin-cos');
  const [rightAspect, setRightAspect] = useState('auto');
  const [legendPos, setLegendPos] = useState('top-right');

  const plotTextColor = themeMode === 'dark' ? '#f8fafc' : '#1e293b';
  const plotSubTextColor = themeMode === 'dark' ? '#94a3b8' : '#475569';
  const auxGridColor = themeMode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.3)';

  // Force remount right plot after fullscreen exit
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setRightPlotKey(k => k + 1);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const { angle } = params;
  const R = 3;
  const angleRad = angle * Math.PI / 180;
  const cx = R * Math.cos(angleRad);
  const cy = R * Math.sin(angleRad);
  const theta = angleRad;
  const hyp = R;

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

    // Unit circle (trajectory of point C)
    const circPts = 100;
    const circX = [], circY = [];
    for (let i = 0; i <= circPts; i++) {
      const a = (2 * Math.PI * i) / circPts;
      circX.push(R * Math.cos(a));
      circY.push(R * Math.sin(a));
    }
    traces.push({
      x: circX, y: circY, mode: 'lines', type: 'scatter',
      name: 'Unit Circle', line: { color: auxGridColor, width: 1.5, dash: 'dash' },
      hoverinfo: 'skip', showlegend: false
    });

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
      text: ['A(0,0)', `B(${cx.toFixed(1)},0)`, `C(${cx.toFixed(1)},${cy.toFixed(1)})`],
      textposition: 'middle center', textfont: { color: plotTextColor, size: 11 },
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
      textposition: 'middle center', textfont: { color: plotSubTextColor, size: 12 },
      hoverinfo: 'skip', showlegend: false
    });

    return traces;
  }, [cx, cy, theta, hyp, themeMode]);

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
        line: { color: auxGridColor, width: 1, dash: 'dot' },
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
        text: mt, textposition: 'top center', textfont: { size: 10, color: plotTextColor }, hoverinfo: 'text'
      });
    }
    return traces;
  }, [theta, sampleFunction, themeMode]);

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
    if (allMx.length) traces.push({ x: allMx, y: allMy, mode: 'markers+text', type: 'scatter', name: 'Values', marker: { size: 9, color: allMc, symbol: 'circle', line: { color: '#fff', width: 1 } }, text: allMt, textposition: 'top center', textfont: { size: 10, color: plotTextColor }, hoverinfo: 'text' });
    return traces;
  }, [theta, sampleFunction, themeMode]);
  
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
    if (allMx.length) traces.push({ x: allMx, y: allMy, mode: 'markers+text', type: 'scatter', name: 'Values', marker: { size: 9, color: allMc, symbol: 'circle', line: { color: '#fff', width: 1 } }, text: allMt, textposition: 'top center', textfont: { size: 10, color: plotTextColor }, hoverinfo: 'text' });
    return traces;
  }, [theta, sampleFunction, themeMode]);
  
  const handleSlider = (key) => (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) return;
    setParams(p => ({ ...p, [key]: val }));
  };

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function">← Basic</BackButton>
        <Title>Trigonometric Ratios</Title>
      </Header>

      {/* Row 1: Controls */}
      <ControlsBar>
        <SliderGroup>
          <SliderItem>
            <label>Angle</label>
            <input type="range" min={-180} max={180} step={5} value={params.angle} onChange={handleSlider('angle')} />
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

        <StyleSelect value={rightAspect} onChange={(e) => setRightAspect(e.target.value)}>
          <option value="auto">Auto</option>
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="1:1">1:1</option>
        </StyleSelect>

        <StyleSelect value={legendPos} onChange={(e) => setLegendPos(e.target.value)}>
          <option value="top-right">Top-Right</option>
          <option value="top-left">Top-Left</option>
          <option value="bottom-left">Bottom-Left</option>
          <option value="bottom-right">Bottom-Right</option>
          <option value="None">None</option>
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
      <PlotRow ref={rowRef}>
        <PlotHalfNarrow style={{ flex: `0 0 ${leftRatio}%` }}>
          <PlotInner>
            <FunctionPlotter
              data={triangleTraces}
              xRange={[-5, 5]} yRange={[-5, 5]}
              aspectRatio="1:1"
              title="Right Triangle"
              plotStyle={plotStyle}
              showExportButton={false}
            />
          </PlotInner>
          <Resizer onMouseDown={onResizeStart} />
        </PlotHalfNarrow>
        <PlotHalf>
          {activePlot === 'sin-cos' && (
            <FunctionPlotter
              key={`${activePlot}-${rightAspect}-${rightPlotKey}`}
              data={sinCosTraces}
              xRange={[-Math.PI, Math.PI]} yRange={[-1.5, 1.5]}
              xTickMode="pi"
              title="sin(θ) &amp; cos(θ)"
              plotStyle={plotStyle}
              aspectRatio={rightAspect}
              legendPosition={legendPos}
              showExportButton={false}
            />
          )}
          {activePlot === 'tan-cot' && (
            <FunctionPlotter
              key={`${activePlot}-${rightAspect}-${rightPlotKey}`}
              data={tanCotTraces}
              xRange={[-Math.PI, Math.PI]} yRange={[-5, 5]}
              xTickMode="pi"
              title="tan(θ) &amp; cot(θ)"
              plotStyle={plotStyle}
              aspectRatio={rightAspect}
              legendPosition={legendPos}
              showExportButton={false}
            />
          )}
          {activePlot === 'sec-csc' && (
            <FunctionPlotter
              key={`${activePlot}-${rightAspect}-${rightPlotKey}`}
              data={secCscTraces}
              xRange={[-Math.PI, Math.PI]} yRange={[-5, 5]}
              xTickMode="pi"
              title="sec(θ) &amp; csc(θ)"
              plotStyle={plotStyle}
              aspectRatio={rightAspect}
              legendPosition={legendPos}
              showExportButton={false}
            />
          )}
        </PlotHalf>
      </PlotRow>
    </PageContainer>
  );
};

export default TrigonometricRatios;

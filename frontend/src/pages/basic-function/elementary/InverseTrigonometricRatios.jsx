import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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
  width: 210px;
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

// ── Inverse trig parameters per mode ──

const INV_MODES = {
  'arcsin-arccos': {
    sliderMin: -1, sliderMax: 1, sliderStep: 0.01,
    plotYRange: [-Math.PI, Math.PI],
    plotTitle: 'arcsin(x) &amp; arccos(x)',
    invLabel: 'x ∈ [-1, 1]'
  },
  'arctan-arccot': {
    sliderMin: -10, sliderMax: 10, sliderStep: 0.1,
    plotYRange: [-Math.PI, Math.PI],
    plotTitle: 'arctan(x) &amp; arccot(x)',
    invLabel: 'x ∈ [-10, 10]'
  },
  'arcsec-arccsc': {
    sliderMin: -10, sliderMax: 10, sliderStep: 0.1,
    plotYRange: [-Math.PI, Math.PI],
    plotTitle: 'arcsec(x) &amp; arccsc(x)',
    invLabel: 'x ∈ [-10, 10]'
  }
};

/**
 * InverseTrigonometricRatios — interactive exploration of the 6 inverse trig ratios.
 *
 * Follows the same unit-circle + triangle paradigm as TrigonometricRatios,
 * but inverted: the user controls a ratio value x, and the page shows the
 * resulting angle θ = arcsin(x), arccos(x), etc.
 */
const InverseTrigonometricRatios = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({ value: 0.5 });
  const [plotStyle, setPlotStyle] = useState('medium');
  const [activePlot, setActivePlot] = useState('arcsin-arccos');
  const [leftRatio, setLeftRatio] = useState(38);
  const [rightAspect, setRightAspect] = useState('auto');
  const [legendPos, setLegendPos] = useState('top-right');
  const [rightPlotKey, setRightPlotKey] = useState(0);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  const rowRef = useRef(null);
  const dragging = useRef(false);

  // Theme detection (same polling approach as the plotters)
  useEffect(() => {
    const interval = setInterval(() => {
      const mode = localStorage.getItem('themeMode') || 'dark';
      setThemeMode(mode);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const plotTextColor = themeMode === 'dark' ? '#f8fafc' : '#1e293b';
  const plotSubTextColor = themeMode === 'dark' ? '#94a3b8' : '#475569';
  const auxGridColor = themeMode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.3)';

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setRightPlotKey(k => k + 1);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const mode = INV_MODES[activePlot];
  const { value } = params;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // ── Unit circle geometry ──
  // For the unit circle: x = cos(θ), y = sin(θ)
  // arcsin(y) = θ  where y ∈ [-1, 1], θ ∈ [-π/2, π/2]
  // arccos(x) = θ  where x ∈ [-1, 1], θ ∈ [0, π]
  // arctan(y/x) = θ where θ ∈ (-π/2, π/2)
  //
  // We visualize by placing a point on the unit circle at the computed angle.
  let theta;
  let ratioLabel;
  const cVal = clamp(value, mode.sliderMin, mode.sliderMax);

  if (activePlot === 'arcsin-arccos') {
    // arcsin: use y-coordinate, arccos: use x-coordinate
    // Show both: point at angle where sin(θ) = cVal AND cos(θ) = cVal
    // arcsin: θ = asin(cVal) in [-π/2, π/2]
    // arccos: θ = acos(cVal) in [0, π]
    const thetaArcsin = Math.asin(cVal);            // [-π/2, π/2]
    const thetaArccos = Math.acos(cVal);             // [0, π]
    // For the triangle visualization, show the arcsin angle
    theta = thetaArcsin;
    ratioLabel = `sin(θ) = ${cVal.toFixed(3)}`;
  } else if (activePlot === 'arctan-arccot') {
    // arctan: θ = atan(cVal) in (-π/2, π/2)
    theta = Math.atan(cVal);
    ratioLabel = `tan(θ) = ${cVal.toFixed(3)}`;
  } else {
    // arcsec: sec(θ) = cVal  →  cos(θ) = 1/cVal  →  θ = acos(1/cVal)
    // For |cVal| < 1, arcsec is undefined (keep within domain)
    const safeRatio = cVal >= -1 && cVal <= 1 ? (cVal >= 0 ? 1 : -1) : 1 / cVal;
    theta = Math.acos(clamp(safeRatio, -1, 1));
    ratioLabel = `sec(θ) = ${cVal.toFixed(3)}`;
    // For visual clarity, use the clamped angle
    if (cVal < -1) theta = Math.acos(-1 / cVal);
    else if (cVal > 1) theta = Math.acos(1 / cVal);
    else theta = Math.acos(clamp(cVal, -1, 1));  // domain boundary
  }

  const cx = Math.cos(theta);
  const cy = Math.sin(theta);
  const thetaDeg = (theta * 180 / Math.PI);

  // ── 6 inverse trig values ──
  const invData = [
    { name: 'arcsin', formula: 'sin⁻¹(x)', value: isFinite(Math.asin(clamp(cVal, -1, 1))) ? Math.asin(clamp(cVal, -1, 1)) * 180 / Math.PI : NaN, color: '#6366f1' },
    { name: 'arccos', formula: 'cos⁻¹(x)', value: isFinite(Math.acos(clamp(cVal, -1, 1))) ? Math.acos(clamp(cVal, -1, 1)) * 180 / Math.PI : NaN, color: '#06b6d4' },
    { name: 'arctan', formula: 'tan⁻¹(x)', value: Math.atan(cVal) * 180 / Math.PI, color: '#f59e0b' },
    { name: 'arccot', formula: 'cot⁻¹(x)', value: (Math.PI / 2 - Math.atan(cVal)) * 180 / Math.PI, color: '#10b981' },
    { name: 'arcsec', formula: 'sec⁻¹(x)', value: Math.abs(cVal) >= 1 ? Math.acos(1 / cVal) * 180 / Math.PI : NaN, color: '#f97316' },
    { name: 'arccsc', formula: 'csc⁻¹(x)', value: Math.abs(cVal) >= 1 ? Math.asin(1 / cVal) * 180 / Math.PI : NaN, color: '#ec4899' }
  ];

  // ── Triangle traces (unit circle) ──
  const triangleTraces = useMemo(() => {
    const traces = [];
    const R = 2.5;  // unit circle radius for display

    // Unit circle
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

    // Axes
    traces.push({
      x: [-R * 1.3, R * 1.3], y: [0, 0], mode: 'lines', type: 'scatter',
      name: 'x-axis', line: { color: 'rgba(148,163,184,0.4)', width: 1 },
      hoverinfo: 'skip', showlegend: false
    });
    traces.push({
      x: [0, 0], y: [-R * 1.3, R * 1.3], mode: 'lines', type: 'scatter',
      name: 'y-axis', line: { color: 'rgba(148,163,184,0.4)', width: 1 },
      hoverinfo: 'skip', showlegend: false
    });

    // Point P on circle
    const px = R * cx, py = R * cy;
    traces.push({
      x: [0, px, px, 0], y: [0, 0, py, 0],
      mode: 'lines+markers', type: 'scatter',
      name: 'Triangle',
      line: { color: '#6366f1', width: 3 },
      marker: { size: [10, 10, 10, 1], color: ['#6366f1', '#6366f1', '#6366f1', 'rgba(0,0,0,0)'], symbol: 'circle' },
      hoverinfo: 'skip', showlegend: false
    });

    // Right angle indicator at B (px, 0)
    const s = 0.15;
    const rx = px - Math.sign(px || 1) * s;
    const ry = py !== 0 ? Math.sign(py) * s : s;
    traces.push({
      x: [rx, px, px], y: [0, 0, ry],
      mode: 'lines', type: 'scatter',
      name: 'Right Angle', line: { color: '#94a3b8', width: 1.5 },
      hoverinfo: 'skip', showlegend: false
    });

    // Angle arc at origin
    const arcRes = 40, arcR = 0.4;
    const arcX = [], arcY = [];
    for (let i = 0; i <= arcRes; i++) {
      const a = (Math.abs(theta) / arcRes) * i * Math.sign(theta || 1);
      arcX.push(arcR * Math.cos(a)); arcY.push(arcR * Math.sin(a));
    }
    traces.push({
      x: arcX, y: arcY, mode: 'lines', type: 'scatter',
      name: 'θ', line: { color: '#f59e0b', width: 2.5 },
      hoverinfo: 'skip', showlegend: false
    });

    // θ label
    const midA = Math.abs(theta) / 2 * Math.sign(theta || 1);
    const labelR = 0.7;
    traces.push({
      x: [labelR * Math.cos(midA)], y: [labelR * Math.sin(midA)],
      mode: 'text', type: 'scatter',
      text: [`θ = ${thetaDeg.toFixed(1)}°`],
      textposition: 'middle center',
      textfont: { color: '#f59e0b', size: 14, family: 'serif, italic' },
      hoverinfo: 'skip', showlegend: false
    });

    // Point P label
    traces.push({
      x: [px], y: [py + 0.3],
      mode: 'text', type: 'scatter',
      text: [`P(${cx.toFixed(3)}, ${cy.toFixed(3)})`],
      textposition: 'middle center', textfont: { color: plotTextColor, size: 11 },
      hoverinfo: 'skip', showlegend: false
    });

    // Side labels
    const adj = R * Math.abs(cx), opp = R * Math.abs(cy);
    traces.push({
      x: [R * cx / 2], y: [-0.3],
      mode: 'text', type: 'scatter',
      text: [`adj = ${adj.toFixed(2)}`],
      textposition: 'middle center', textfont: { color: plotSubTextColor, size: 11 },
      hoverinfo: 'skip', showlegend: false
    });
    traces.push({
      x: [px + (px >= 0 ? 0.3 : -0.3)], y: [py / 2],
      mode: 'text', type: 'scatter',
      text: [`opp = ${opp.toFixed(2)}`],
      textposition: 'middle center', textfont: { color: plotSubTextColor, size: 11 },
      hoverinfo: 'skip', showlegend: false
    });
    traces.push({
      x: [px / 2 + 0.3], y: [py / 2 + 0.3],
      mode: 'text', type: 'scatter',
      text: [`hyp = ${R.toFixed(1)}`],
      textposition: 'middle center', textfont: { color: plotSubTextColor, size: 11 },
      hoverinfo: 'skip', showlegend: false
    });

    // Ratio label
    traces.push({
      x: [0], y: [-R * 1.1],
      mode: 'text', type: 'scatter',
      text: [ratioLabel],
      textposition: 'middle center',
      textfont: { color: '#6366f1', size: 13, weight: 700 },
      hoverinfo: 'skip', showlegend: false
    });

    return traces;
  }, [cx, cy, theta, thetaDeg, ratioLabel, themeMode]);

  // ── Sampling for function curves ──
  const NUM_PTS = 2000;

  // arcsin / arccos sampling
  const invArcsinArccosTraces = useMemo(() => {
    const traces = [];
    const xVals = [];
    for (let i = 0; i < NUM_PTS; i++)
      xVals.push(-1 + (2 * i) / (NUM_PTS - 1));

    const arcsinY = xVals.map(x => { const v = Math.asin(x); return isFinite(v) ? v : NaN; });
    const arccosY = xVals.map(x => { const v = Math.acos(x); return isFinite(v) ? v : NaN; });
    const interVal = clamp(cVal, -1, 1);

    traces.push({ x: xVals, y: arcsinY, mode: 'lines', type: 'scatter', name: 'arcsin(x)', line: { color: '#6366f1', width: 2 } });
    traces.push({ x: xVals, y: arccosY, mode: 'lines', type: 'scatter', name: 'arccos(x)', line: { color: '#06b6d4', width: 2 } });

    // Vertical line at current x
    traces.push({
      x: [interVal, interVal], y: [-Math.PI, Math.PI],
      mode: 'lines', type: 'scatter',
      line: { color: '#f59e0b', width: 2, dash: 'dash' },
      hoverinfo: 'skip', showlegend: false
    });

    // Marker points
    const mx = [], my = [], mt = [], mc = [];
    const as = Math.asin(interVal);
    const ac = Math.acos(interVal);
    if (isFinite(as)) { mx.push(interVal, interVal); my.push(as, ac); mt.push(`arcsin = ${formatVal(as)}`, `arccos = ${formatVal(ac)}`); mc.push('#6366f1', '#06b6d4'); }
    if (mx.length) {
      traces.push({
        x: mx, y: my, mode: 'markers+text', type: 'scatter', name: 'Values',
        marker: { size: 9, color: mc, symbol: 'circle', line: { color: '#fff', width: 1 } },
        text: mt, textposition: 'top center', textfont: { size: 10, color: plotTextColor }, hoverinfo: 'text'
      });
    }

    return traces;
  }, [cVal, themeMode]);

  // arctan / arccot sampling
  const invArctanArccotTraces = useMemo(() => {
    const traces = [];
    const xVals = [];
    const lo = -10, hi = 10;
    for (let i = 0; i < NUM_PTS; i++)
      xVals.push(lo + (hi - lo) * i / (NUM_PTS - 1));

    const arctanY = xVals.map(x => Math.atan(x));
    const arccotY = xVals.map(x => Math.PI / 2 - Math.atan(x));

    traces.push({ x: xVals, y: arctanY, mode: 'lines', type: 'scatter', name: 'arctan(x)', line: { color: '#f59e0b', width: 2 } });
    traces.push({ x: xVals, y: arccotY, mode: 'lines', type: 'scatter', name: 'arccot(x)', line: { color: '#10b981', width: 2 } });

    // Asymptote hints at ±π/2
    traces.push({
      x: [-10, 10], y: [Math.PI / 2, Math.PI / 2],
      mode: 'lines', type: 'scatter',
      line: { color: auxGridColor, width: 1, dash: 'dot' },
      hoverinfo: 'skip', showlegend: false
    });
    traces.push({
      x: [-10, 10], y: [-Math.PI / 2, -Math.PI / 2],
      mode: 'lines', type: 'scatter',
      line: { color: auxGridColor, width: 1, dash: 'dot' },
      hoverinfo: 'skip', showlegend: false
    });

    // Vertical line at current x
    traces.push({
      x: [cVal, cVal], y: [-Math.PI, Math.PI],
      mode: 'lines', type: 'scatter',
      line: { color: '#f59e0b', width: 2, dash: 'dash' },
      hoverinfo: 'skip', showlegend: false
    });

    const mx = [cVal, cVal], my = [Math.atan(cVal), Math.PI / 2 - Math.atan(cVal)];
    const mt = [`arctan = ${formatVal(Math.atan(cVal))}`, `arccot = ${formatVal(Math.PI / 2 - Math.atan(cVal))}`];
    traces.push({
      x: mx, y: my, mode: 'markers+text', type: 'scatter', name: 'Values',
      marker: { size: 9, color: ['#f59e0b', '#10b981'], symbol: 'circle', line: { color: '#fff', width: 1 } },
      text: mt, textposition: 'top center', textfont: { size: 10, color: plotTextColor }, hoverinfo: 'text'
    });

    return traces;
  }, [cVal, themeMode]);

  // arcsec / arccsc sampling
  const invArcsecArccscTraces = useMemo(() => {
    const traces = [];
    const lo = -10, hi = 10;
    const xVals = [];
    for (let i = 0; i < NUM_PTS; i++)
      xVals.push(lo + (hi - lo) * i / (NUM_PTS - 1));

    const arcsecY = xVals.map(x => {
      if (Math.abs(x) < 1) return NaN;
      return Math.acos(1 / x);
    });
    const arccscY = xVals.map(x => {
      if (Math.abs(x) < 1) return NaN;
      return Math.asin(1 / x);
    });

    traces.push({ x: xVals, y: arcsecY, mode: 'lines', type: 'scatter', name: 'arcsec(x)', line: { color: '#f97316', width: 2 } });
    traces.push({ x: xVals, y: arccscY, mode: 'lines', type: 'scatter', name: 'arccsc(x)', line: { color: '#ec4899', width: 2 } });

    // Vertical lines at x = ±1 (domain boundaries)
    [1, -1].forEach(x => {
      traces.push({
        x: [x, x], y: [-Math.PI, Math.PI],
        mode: 'lines', type: 'scatter',
        line: { color: auxGridColor, width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
    });

    // Vertical line at current x
    traces.push({
      x: [cVal, cVal], y: [-Math.PI, Math.PI],
      mode: 'lines', type: 'scatter',
      line: { color: '#f59e0b', width: 2, dash: 'dash' },
      hoverinfo: 'skip', showlegend: false
    });

    const mx = [], my = [], mt = [], mc = [];
    if (Math.abs(cVal) >= 1) {
      const sv = Math.acos(1 / cVal);
      const cv = Math.asin(1 / cVal);
      mx.push(cVal, cVal); my.push(sv, cv);
      mt.push(`arcsec = ${formatVal(sv)}`, `arccsc = ${formatVal(cv)}`);
      mc.push('#f97316', '#ec4899');
    }
    if (mx.length) {
      traces.push({
        x: mx, y: my, mode: 'markers+text', type: 'scatter', name: 'Values',
        marker: { size: 9, color: mc, symbol: 'circle', line: { color: '#fff', width: 1 } },
        text: mt, textposition: 'top center', textfont: { size: 10, color: plotTextColor }, hoverinfo: 'text'
      });
    }

    return traces;
  }, [cVal, themeMode]);

  const handleSlider = (key) => (e) => {
    setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }));
  };

  // ── Splitter drag handlers ──
  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev) => {
      if (!dragging.current || !rowRef.current) return;
      const rect = rowRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftRatio(Math.max(20, Math.min(60, pct)));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setRightPlotKey(k => k + 1);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>← Basic</BackButton>
        <Title>Inverse Trigonometric Ratios</Title>
      </Header>

      {/* Row 1: Controls */}
      <ControlsBar>
        <SliderGroup>
          <SliderItem>
            <label>x</label>
            <input type="range" min={mode.sliderMin} max={mode.sliderMax} step={mode.sliderStep} value={params.value} onChange={handleSlider('value')} />
            <span className="val">{cVal.toFixed(3)}</span>
          </SliderItem>
        </SliderGroup>

        <PillAngle>
          <AngleBig>θ = {thetaDeg.toFixed(1)}°</AngleBig>
          <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 6 }}>({theta.toFixed(3)} rad)</span>
        </PillAngle>

        <ToggleGroup>
          <ToggleBtn $active={activePlot === 'arcsin-arccos'} onClick={() => setActivePlot('arcsin-arccos')}>arcsin / arccos</ToggleBtn>
          <ToggleBtn $active={activePlot === 'arctan-arccot'} onClick={() => setActivePlot('arctan-arccot')}>arctan / arccot</ToggleBtn>
          <ToggleBtn $active={activePlot === 'arcsec-arccsc'} onClick={() => setActivePlot('arcsec-arccsc')}>arcsec / arccsc</ToggleBtn>
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

      {/* Row 2: Inverse trig ratio cards */}
      <RatiosBar>
        {invData.map(({ name, formula, value, color }) => (
          <MiniCard key={name}>
            <MiniName $color={color}>{name} = {formula}</MiniName>
            {isNaN(value) || !isFinite(value) ? <MiniInf>N/A</MiniInf> : <MiniVal>{value.toFixed(2)}°</MiniVal>}
          </MiniCard>
        ))}
      </RatiosBar>

      {/* Row 3: Two plots */}
      <PlotRow ref={rowRef}>
        <PlotHalfNarrow style={{ flex: `0 0 ${leftRatio}%` }}>
          <PlotInner>
            <FunctionPlotter
              data={triangleTraces}
              xRange={[-3.5, 3.5]} yRange={[-3.5, 3.5]}
              aspectRatio="1:1"
              title="Unit Circle"
              plotStyle={plotStyle}
              showExportButton={false}
            />
          </PlotInner>
          <Resizer onMouseDown={onResizeStart} />
        </PlotHalfNarrow>
        <PlotHalf>
          {activePlot === 'arcsin-arccos' && (
            <DerivativePlotter
              key={`${activePlot}-${rightAspect}-${rightPlotKey}`}
              data={invArcsinArccosTraces}
              xRange={[-1.2, 1.2]} yRange={[-0.5, Math.PI + 0.5]}
              title={mode.plotTitle}
              plotStyle={plotStyle}
              aspectRatio={rightAspect}
              legendPosition={legendPos}
              showExportButton={false}
            />
          )}
          {activePlot === 'arctan-arccot' && (
            <DerivativePlotter
              key={`${activePlot}-${rightAspect}-${rightPlotKey}`}
              data={invArctanArccotTraces}
              xRange={[-10.5, 10.5]} yRange={[-Math.PI - 0.3, Math.PI + 0.3]}
              title={mode.plotTitle}
              plotStyle={plotStyle}
              aspectRatio={rightAspect}
              legendPosition={legendPos}
              showExportButton={false}
            />
          )}
          {activePlot === 'arcsec-arccsc' && (
            <DerivativePlotter
              key={`${activePlot}-${rightAspect}-${rightPlotKey}`}
              data={invArcsecArccscTraces}
              xRange={[-10.5, 10.5]} yRange={[-0.3, Math.PI + 0.3]}
              title={mode.plotTitle}
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

export default InverseTrigonometricRatios;

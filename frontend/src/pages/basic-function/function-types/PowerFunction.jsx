import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Plotly from 'plotly.js/dist/plotly.min.js';
import FunctionPlotter from '../../../components/visualization/FunctionPlotter';
import DerivativePlotter from '../../../components/visualization/DerivativePlotter';

// ── Styled Components ──────────────────────────────────

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  box-sizing: border-box;
  background: ${({ $dark }) => $dark ? '#0f172a' : '#f8fafc'};
  color: ${({ $dark }) => $dark ? '#f8fafc' : '#1e293b'};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
  &:hover { border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'}; color: ${({ theme }) => theme?.colors?.primary || '#6366f1'}; }
`;

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
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
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

const ExpressionPill = styled.div`
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
  flex-shrink: 0;
  gap: 8px;
`;

const ExprLabel = styled.span`
  color: ${({ $color }) => $color || '#f59e0b'};
  font-size: 15px;
  font-weight: 700;
  font-family: 'Georgia', serif;
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
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  transition: all 0.15s ease;
  white-space: nowrap;
  height: 42px;
  box-sizing: border-box;
  &:hover { background: ${({ $active, theme }) => ($active ? (theme?.colors?.primary || '#6366f1') : (theme?.colors?.inputBg || '#334155'))}; }
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

// ── Plot row ──
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

const CubeContainer = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 1;
`;

const PlotContainer = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 1;
  display: flex;
  position: relative;
  background: ${({ $dark }) => $dark ? '#1e293b' : '#ffffff'};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

// ── Ratio / data cards ──
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
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
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

// ── Helpers ────────────────────────────────────────────

function formatVal(v) {
  if (v === undefined || v === null || !isFinite(v)) return null;
  if (Math.abs(v) < 0.0001) return '0';
  return v.toFixed(4);
}

// ── 3D Cube Component ────────────────────────────────

const cubeStyleMap = {
  thin:        { line: 1, fontSize: 9 },
  medium:      { line: 2, fontSize: 10 },
  thick:       { line: 2, fontSize: 11 },
  'extra-thick': { line: 3, fontSize: 12 },
};

function Cube3D({ size, dark, plotStyle }) {
  const plotRef = useRef(null);
  const containerRef = useRef(null);
  const cs = cubeStyleMap[plotStyle] || cubeStyleMap.medium;

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch(err =>
          console.log(`Fullscreen error: ${err.message}`)
        );
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    if (!plotRef.current || !size) return;
    const a = size;
    const pad = Math.max(0.3, a * 0.12);

    // 8 vertices
    const v = [
      [0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0],
      [0, 0, a], [a, 0, a], [a, a, a], [0, a, a]
    ];
    const x = v.map(p => p[0]);
    const y = v.map(p => p[1]);
    const z = v.map(p => p[2]);

    // Mesh faces (12 triangles)
    const i = [0, 0, 4, 4, 0, 0, 1, 1, 3, 3, 0, 0];
    const j = [1, 2, 5, 6, 3, 7, 5, 6, 2, 6, 1, 5];
    const k = [2, 3, 6, 7, 7, 4, 6, 2, 6, 7, 5, 4];
    const faceColors = [
      '#6366f1','#6366f1','#4f46e5','#4f46e5',
      '#818cf8','#818cf8','#4f46e5','#4f46e5',
      '#818cf8','#818cf8','#6366f1','#6366f1',
    ];

    // Wireframe edges (12 edges)
    const edges = [
      [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],
      [6,7],[7,4],[0,4],[1,5],[2,6],[3,7]
    ];
    const ex = [], ey = [], ez = [];
    edges.forEach(([p, q]) => {
      ex.push(v[p][0], v[q][0], null);
      ey.push(v[p][1], v[q][1], null);
      ez.push(v[p][2], v[q][2], null);
    });

    const data = [{
      type: 'mesh3d', x, y, z, i, j, k,
      facecolor: faceColors,
      opacity: 0.85, flatshading: true,
      lighting: { ambient: 0.6, diffuse: 0.5 },
      hoverinfo: 'skip',
    }, {
      type: 'scatter3d', mode: 'lines',
      x: ex, y: ey, z: ez,
      line: { color: '#6366f1', width: cs.line },
      hoverinfo: 'skip', showlegend: false,
    }, {
      type: 'scatter3d', mode: 'text',
      x: [a / 2], y: [a + 0.3], z: [a / 2],
      text: [`Volume = ${(a * a * a).toFixed(1)}`],
      textfont: { color: '#ffffff', size: cs.fontSize, family: 'Georgia' },
      hoverinfo: 'skip',
    }];

    const bg = dark ? '#1e293b' : '#ffffff';
    const axisColor = dark ? '#64748b' : '#475569';
    const gridColor = dark ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.6)';
    const tickColor = dark ? '#94a3b8' : '#334155';

    const layout = {
      title: {
        text: 'Cube (Volume)',
        font: { color: dark ? '#e0e0e0' : '#0f172a', size: cs.fontSize },
      },
      showlegend: false,
      scene: {
        xaxis: {
          visible: true, showgrid: true, range: [-pad, a + pad],
          tickfont: { color: tickColor, size: cs.fontSize },
          gridcolor: gridColor, zerolinecolor: axisColor,
          showbackground: true, backgroundcolor: bg,
        },
        yaxis: {
          visible: true, showgrid: true, range: [-pad, a + pad],
          tickfont: { color: tickColor, size: cs.fontSize },
          gridcolor: gridColor, zerolinecolor: axisColor,
          showbackground: true, backgroundcolor: bg,
        },
        zaxis: {
          visible: true, showgrid: true, range: [-pad, a + pad],
          tickfont: { color: tickColor, size: cs.fontSize },
          gridcolor: gridColor, zerolinecolor: axisColor,
          showbackground: true, backgroundcolor: bg,
        },
        camera: { eye: { x: 1.8, y: 1.8, z: 1.2 } },
        bgcolor: bg, aspectmode: 'cube',
      },
      margin: { l: 0, r: 0, t: 30, b: 0 },
      paper_bgcolor: bg, plot_bgcolor: bg,
      bordercolor: dark ? '#334155' : '#cbd5e1', borderwidth: 1,
    };

    const config = { displayModeBar: false, displaylogo: false, responsive: true };
    Plotly.newPlot(plotRef.current, data, layout, config);

    const ro = new ResizeObserver(() => {
      if (plotRef.current) Plotly.Plots.resize(plotRef.current);
    });
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (plotRef.current) { try { Plotly.purge(plotRef.current); } catch(e) {} }
    };
  }, [size, dark, cs]);

  return (
    <PlotContainer $dark={dark} ref={containerRef}>
      <button
        onClick={handleFullscreen}
        style={{
          position: 'absolute', top: '20px', right: '10px', zIndex: 10,
          background: '#6366f1', border: 'none', borderRadius: '4px',
          width: '18px', height: '18px', cursor: 'pointer',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Toggle Fullscreen"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
      <CubeContainer ref={plotRef} />
    </PlotContainer>
  );
}

// ── 3D Box Component (n=-2: x²·y=1) ─────────────────

const boxStyleMap = {
  thin:        { line: 1, fontSize: 9 },
  medium:      { line: 2, fontSize: 10 },
  thick:       { line: 2, fontSize: 11 },
  'extra-thick': { line: 3, fontSize: 12 },
};

function Box3D({ size, dark, plotStyle }) {
  const plotRef = useRef(null);
  const containerRef = useRef(null);
  const cs = boxStyleMap[plotStyle] || boxStyleMap.medium;

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch(err =>
          console.log(`Fullscreen error: ${err.message}`)
        );
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    if (!plotRef.current || !size) return;
    const a = size;
    const h = 1 / (a * a); // height = 1/x²
    const maxDim = Math.max(a, h);
    const pad = Math.max(0.3, maxDim * 0.08);

    // 8 vertices: base a×a, height h
    const v = [
      [0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0],
      [0, 0, h], [a, 0, h], [a, a, h], [0, a, h]
    ];
    const x = v.map(p => p[0]);
    const y = v.map(p => p[1]);
    const z = v.map(p => p[2]);

    // Mesh faces (12 triangles)
    const i = [0, 0, 4, 4, 0, 0, 1, 1, 3, 3, 0, 0];
    const j = [1, 2, 5, 6, 3, 7, 5, 6, 2, 6, 1, 5];
    const k = [2, 3, 6, 7, 7, 4, 6, 2, 6, 7, 5, 4];
    const faceColors = [
      '#f59e0b','#f59e0b','#d97706','#d97706',
      '#fbbf24','#fbbf24','#d97706','#d97706',
      '#fbbf24','#fbbf24','#f59e0b','#f59e0b',
    ];

    // Wireframe edges (12 edges)
    const edges = [
      [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],
      [6,7],[7,4],[0,4],[1,5],[2,6],[3,7]
    ];
    const ex = [], ey = [], ez = [];
    edges.forEach(([p, q]) => {
      ex.push(v[p][0], v[q][0], null);
      ey.push(v[p][1], v[q][1], null);
      ez.push(v[p][2], v[q][2], null);
    });

    const data = [{
      type: 'mesh3d', x, y, z, i, j, k,
      facecolor: faceColors,
      opacity: 0.85, flatshading: true,
      lighting: { ambient: 0.6, diffuse: 0.5 },
      hoverinfo: 'skip',
    }, {
      type: 'scatter3d', mode: 'lines',
      x: ex, y: ey, z: ez,
      line: { color: '#f59e0b', width: cs.line },
      hoverinfo: 'skip', showlegend: false,
    }, {
      type: 'scatter3d', mode: 'text',
      x: [a / 2], y: [a + (a * 0.08)], z: [h / 2],
      text: ['Volume = 1'],
      textfont: { color: '#ffffff', size: cs.fontSize, family: 'Georgia' },
      hoverinfo: 'skip',
    }];

    const bg = dark ? '#1e293b' : '#ffffff';
    const axisColor = dark ? '#64748b' : '#475569';
    const gridColor = dark ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.6)';
    const tickColor = dark ? '#94a3b8' : '#334155';
    // Camera: look from above-right, adjust for tall/flat box
    const camZ = maxDim / a < 1.5 ? 1.2 : 0.8;

    const layout = {
      title: {
        text: `Rectangular Box (x² · y = 1)`,
        font: { color: dark ? '#e0e0e0' : '#0f172a', size: cs.fontSize },
      },
      showlegend: false,
      scene: {
        xaxis: {
          visible: true, showgrid: true, range: [-pad, a + pad],
          tickfont: { color: tickColor, size: cs.fontSize },
          gridcolor: gridColor, zerolinecolor: axisColor,
          showbackground: true, backgroundcolor: bg,
        },
        yaxis: {
          visible: true, showgrid: true, range: [-pad, a + pad],
          tickfont: { color: tickColor, size: cs.fontSize },
          gridcolor: gridColor, zerolinecolor: axisColor,
          showbackground: true, backgroundcolor: bg,
        },
        zaxis: {
          visible: true, showgrid: true, range: [-pad, h + pad],
          tickfont: { color: tickColor, size: cs.fontSize },
          gridcolor: gridColor, zerolinecolor: axisColor,
          showbackground: true, backgroundcolor: bg,
        },
        camera: { eye: { x: 1.8, y: 1.8, z: camZ } },
        bgcolor: bg, aspectmode: 'data',
      },
      margin: { l: 0, r: 0, t: 30, b: 0 },
      paper_bgcolor: bg, plot_bgcolor: bg,
      bordercolor: dark ? '#334155' : '#cbd5e1', borderwidth: 1,
    };

    const config = { displayModeBar: false, displaylogo: false, responsive: true };
    Plotly.newPlot(plotRef.current, data, layout, config);

    const ro = new ResizeObserver(() => {
      if (plotRef.current) Plotly.Plots.resize(plotRef.current);
    });
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (plotRef.current) { try { Plotly.purge(plotRef.current); } catch(e) {} }
    };
  }, [size, dark, cs]);

  return (
    <PlotContainer $dark={dark} ref={containerRef}>
      <button
        onClick={handleFullscreen}
        style={{
          position: 'absolute', top: '20px', right: '10px', zIndex: 10,
          background: '#f59e0b', border: 'none', borderRadius: '4px',
          width: '18px', height: '18px', cursor: 'pointer',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Toggle Fullscreen"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
      <CubeContainer ref={plotRef} />
    </PlotContainer>
  );
}

// ── Component ──────────────────────────────────────────

export default function PowerFunction() {
  const navigate = useNavigate();

  const [params, setParams] = useState({ x: 1.5, n: 2 });
  const [plotStyle, setPlotStyle] = useState('medium');
  const [leftRatio, setLeftRatio] = useState(38);
  const [rightAspect, setRightAspect] = useState('auto');
  const [legendPos, setLegendPos] = useState('top-right');
  const [rightPlotKey, setRightPlotKey] = useState(0);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  const rowRef = useRef(null);
  const dragging = useRef(false);

  // Theme detection
  useEffect(() => {
    const interval = setInterval(() => {
      const mode = localStorage.getItem('themeMode') || 'dark';
      setThemeMode(mode);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const plotTextColor = themeMode === 'dark' ? '#f8fafc' : '#1e293b';
  const plotSubTextColor = themeMode === 'dark' ? '#94a3b8' : '#475569';

  // Fullscreen exit remount
  useEffect(() => {
    const onFS = () => { if (!document.fullscreenElement) setRightPlotKey(k => k + 1); };
    document.addEventListener('fullscreenchange', onFS);
    return () => document.removeEventListener('fullscreenchange', onFS);
  }, []);

  const { x: xVal, n } = params;

  // Derived
  function powerFn(base, exp) {
    if (exp === 0) return 1;
    if (exp < 0) return powerFn(base, -exp) === 0 ? Infinity : 1 / powerFn(base, -exp);
    const intExp = Math.round(exp);
    let r = 1;
    for (let i = 0; i < intExp; i++) r *= base;
    return r;
  }

  const yVal = powerFn(xVal, n);
  const absX = Math.abs(xVal);

  // Equivalent form string
  const equivForm = useMemo(() => {
    if (n === 0) return '1';
    if (n === 1) return 'x';
    if (n === -1) return '1/x';
    if (n === 2) return 'x²';
    if (n === -2) return '1/x²';
    if (n === 3) return 'x³';
    if (n === -3) return '1/x³';
    return `x^(${n})`;
  }, [n]);

  // ── Ratio cards ──
  const ratioData = [
    { name: 'x', value: xVal, color: '#6366f1' },
    { name: 'n', value: n, color: '#f59e0b' },
    { name: 'y = xⁿ', value: yVal, color: '#06b6d4' },
    { name: 'Form', value: equivForm, color: '#10b981' },
  ];

  // ── Geometric shape traces ──
  const shapeTraces = useMemo(() => {
    const traces = [];
    const x = xVal;
    const ax = absX;
    const isNeg = x < 0;

    // Axis
    traces.push({
      x: [-4, 4], y: [0, 0], mode: 'lines', type: 'scatter',
      line: { color: plotSubTextColor, width: 1 },
      hoverinfo: 'skip', showlegend: false
    });
    traces.push({
      x: [0, 0], y: [-4, 4], mode: 'lines', type: 'scatter',
      line: { color: plotSubTextColor, width: 1 },
      hoverinfo: 'skip', showlegend: false
    });

    if (n === 1 && x !== 0) {
      // Line segment 0 → x (extends left when x < 0)
      traces.push({
        x: [0, x], y: [0, 0], mode: 'lines+markers', type: 'scatter',
        line: { color: '#6366f1', width: 3 },
        marker: { size: 8, color: '#6366f1', symbol: 'circle' },
        hoverinfo: 'skip', showlegend: false
      });
      // Length label at midpoint
      traces.push({
        x: [x / 2], y: [0.15], mode: 'text', type: 'scatter',
        text: [`Length = ${ax.toFixed(1)}`],
        textfont: { color: plotTextColor, size: 12 },
        hoverinfo: 'skip', showlegend: false
      });
      // x label at endpoint
      traces.push({
        x: [x], y: [-0.15], mode: 'text', type: 'scatter',
        text: [`x = ${x.toFixed(1)}`],
        textfont: { color: '#6366f1', size: 11 },
        hoverinfo: 'skip', showlegend: false
      });
    } else if (n === 2 && ax > 0) {
      // Filled square — Q1 for x>0, Q3 for x<0
      const pts = [[0, 0], [x, 0], [x, x], [0, x], [0, 0]];
      traces.push({
        x: pts.map(p => p[0]), y: pts.map(p => p[1]),
        mode: 'lines', type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(99, 102, 241, 0.15)',
        line: { color: '#6366f1', width: 2 },
        hoverinfo: 'skip', showlegend: false
      });
      traces.push({
        x: [x / 2], y: [x / 2], mode: 'text', type: 'scatter',
        text: [`Area = ${(ax * ax).toFixed(1)}`],
        textfont: { color: plotTextColor, size: 14, family: 'Georgia' },
        hoverinfo: 'skip', showlegend: false
      });
      // Horizontal side label (below the bottom edge)
      const hY = x >= 0 ? -0.2 : x - 0.2;
      traces.push({
        x: [x / 2], y: [hY], mode: 'text', type: 'scatter',
        text: [`${ax.toFixed(1)}`],
        textfont: { color: '#6366f1', size: 11 },
        hoverinfo: 'skip', showlegend: false
      });
      // Vertical side label (left of the left edge)
      const vX = x >= 0 ? -0.3 : x - 0.3;
      traces.push({
        x: [vX], y: [x / 2], mode: 'text', type: 'scatter',
        text: [`${ax.toFixed(1)}`],
        textfont: { color: '#6366f1', size: 11 },
        hoverinfo: 'skip', showlegend: false
      });
    } else if (n === 3 && ax > 0) {
      // Cube — isometric projection with shaded faces
      const isoX = ax * 0.866;  // cos(30°)
      const isoY = ax * 0.5;    // sin(30°)
      const off = Math.min(0, x); // offset: 0 for x>0, x for x<0

      // Front face (solid outline + fill)
      traces.push({
        x: [off, off + ax, off + ax, off, off],
        y: [off, off, off + ax, off + ax, off],
        mode: 'lines', type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(99, 102, 241, 0.2)',
        line: { color: '#6366f1', width: 2 },
        hoverinfo: 'skip', showlegend: false
      });
      // Top face (lighter fill)
      traces.push({
        x: [off, off + ax, off + ax + isoX, off + isoX, off],
        y: [off + ax, off + ax, off + ax + isoY, off + ax + isoY, off + ax],
        mode: 'lines', type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(99, 102, 241, 0.08)',
        line: { color: '#6366f1', width: 1 },
        hoverinfo: 'skip', showlegend: false
      });
      // Right side face (medium fill)
      traces.push({
        x: [off + ax, off + ax, off + ax + isoX, off + ax + isoX, off + ax],
        y: [off, off + ax, off + ax + isoY, off + isoY, off],
        mode: 'lines', type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(99, 102, 241, 0.13)',
        line: { color: '#6366f1', width: 1 },
        hoverinfo: 'skip', showlegend: false
      });
      // Back edges (dashed)
      traces.push({
        x: [off + isoX, off + ax + isoX, off + ax + isoX, off + isoX, off + isoX],
        y: [off + isoY, off + isoY, off + ax + isoY, off + ax + isoY, off + isoY],
        mode: 'lines', type: 'scatter',
        line: { color: 'rgba(99, 102, 241, 0.4)', width: 1.5, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
      // Hidden rear-bottom edge
      traces.push({
        x: [off, off + isoX], y: [off, off + isoY],
        mode: 'lines', type: 'scatter',
        line: { color: 'rgba(99, 102, 241, 0.25)', width: 1.5, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
      // Volume label
      traces.push({
        x: [(off * 2 + ax) / 2 + isoX * 0.4], y: [off + ax * 0.3],
        mode: 'text', type: 'scatter',
        text: [`Volume = ${(ax * ax * ax).toFixed(1)}`],
        textfont: { color: plotTextColor, size: 13, family: 'Georgia' },
        hoverinfo: 'skip', showlegend: false
      });
      // Side length label
      traces.push({
        x: [off + ax / 2], y: [off - 0.25], mode: 'text', type: 'scatter',
        text: [`${ax.toFixed(1)}`],
        textfont: { color: '#6366f1', size: 11 },
        hoverinfo: 'skip', showlegend: false
      });
    } else if (n === -1 && ax > 0) {
      // Rectangle xy = 1
      const yRecip = 1 / ax;
      const pts = [[0, 0], [ax, 0], [ax, yRecip], [0, yRecip], [0, 0]];
      traces.push({
        x: pts.map(p => p[0]), y: pts.map(p => p[1]),
        mode: 'lines', type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(245, 158, 11, 0.12)',
        line: { color: '#f59e0b', width: 2 },
        hoverinfo: 'skip', showlegend: false
      });
      // x label
      traces.push({
        x: [ax / 2], y: [-0.1], mode: 'text', type: 'scatter',
        text: [`x = ${ax.toFixed(1)}`],
        textfont: { color: '#f59e0b', size: 11 },
        hoverinfo: 'skip', showlegend: false
      });
      // y label
      traces.push({
        x: [-0.15], y: [yRecip / 2], mode: 'text', type: 'scatter',
        text: [`1/x = ${yRecip.toFixed(3)}`],
        textfont: { color: '#f59e0b', size: 11 },
        hoverinfo: 'skip', showlegend: false
      });
      // Area annotation
      traces.push({
        x: [ax / 2], y: [yRecip / 2], mode: 'text', type: 'scatter',
        text: ['xy = 1'],
        textfont: { color: plotTextColor, size: 12, family: 'Georgia' },
        hoverinfo: 'skip', showlegend: false
      });
    } else {
      // Generic view: show just the point and a text description
      const disp = n === 0 ? 'y = 1' : `y = x${superscript(n)}`;
      traces.push({
        x: [0.5], y: [0.5], mode: 'text', type: 'scatter',
        text: [disp],
        textfont: { color: plotTextColor, size: 16, family: 'Georgia' },
        hoverinfo: 'skip', showlegend: false
      });
    }

    return traces;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xVal, n, themeMode]);

  function superscript(num) {
    const sups = { '-2': '⁻²', '-1': '⁻¹', '0': '⁰', '1': '¹', '2': '²', '3': '³' };
    return sups[num] ?? `^(${num})`;
  }

  // ── Curve data ──
  const curveTraces = useMemo(() => {
    const traces = [];
    const numPts = 1000;
    const tMin = -3, tMax = 3;
    const step = (tMax - tMin) / numPts;

    if (n === 0) {
      // y = 1
      traces.push({
        x: [tMin, tMax], y: [1, 1], mode: 'lines', type: 'scatter',
        name: 'y = 1',
        line: { color: '#6366f1', width: 2 },
        hoverinfo: 'skip', showlegend: false
      });
    } else if (n < 0) {
      // Negative n — split into two branches (left and right of asymptote)
      const absN = -n;
      // Right branch (t > 0)
      const xR = [], yR = [];
      for (let i = 1; i < numPts; i++) {
        const t = i * step;
        const val = 1 / Math.pow(t, absN);
        if (isFinite(val) && Math.abs(val) < 50) { xR.push(t); yR.push(val); }
      }
      if (xR.length) {
        traces.push({
          x: xR, y: yR, mode: 'lines', type: 'scatter',
          name: `y = x${superscript(n)}`,
          line: { color: '#6366f1', width: 2 },
          hoverinfo: 'skip', showlegend: false
        });
      }
      // Left branch (t < 0)
      const xL = [], yL = [];
      for (let i = 1; i < numPts; i++) {
        const t = -i * step;
        let val;
        if (absN % 2 === 0) val = 1 / Math.pow(Math.abs(t), absN);
        else val = 1 / Math.pow(t, absN);
        if (isFinite(val) && Math.abs(val) < 50) { xL.push(t); yL.push(val); }
      }
      if (xL.length) {
        traces.push({
          x: xL, y: yL, mode: 'lines', type: 'scatter',
          name: `y = x${superscript(n)}`,
          line: { color: '#6366f1', width: 2 },
          hoverinfo: 'skip', showlegend: false
        });
      }
    } else {
      // n > 0
      const xVals = [], yVals = [];
      for (let i = 0; i <= numPts; i++) {
        const t = tMin + i * step;
        let val;
        if (n === 1) val = t;
        else if (n === 2) val = t * t;
        else if (n === 3) val = t * t * t;
        else val = Math.pow(t, n);
        if (isFinite(val) && Math.abs(val) < 50) { xVals.push(t); yVals.push(val); }
      }
      if (xVals.length) {
        traces.push({
          x: xVals, y: yVals, mode: 'lines', type: 'scatter',
          name: `y = x${superscript(n)}`,
          line: { color: '#6366f1', width: 2 },
          hoverinfo: 'skip', showlegend: false
        });
      }
    }

    // Vertical line at current x
    traces.push({
      x: [xVal, xVal], y: [Math.min(-3, yVal - 0.5), Math.max(3, yVal + 0.5)],
      mode: 'lines', type: 'scatter',
      name: `x = ${xVal.toFixed(1)}`,
      line: { color: '#f59e0b', width: 2, dash: 'dash' },
      hoverinfo: 'skip', showlegend: false
    });

    // Point marker at (x, y)
    const ptY = isFinite(yVal) && Math.abs(yVal) < 50 ? yVal : null;
    if (ptY !== null) {
      traces.push({
        x: [xVal], y: [ptY], mode: 'markers+text', type: 'scatter',
        name: `(${xVal.toFixed(1)}, ${ptY.toFixed(3)})`,
        marker: { size: 10, color: '#f59e0b', symbol: 'circle', line: { color: '#fff', width: 1 } },
        text: [`(${xVal.toFixed(1)}, ${ptY.toFixed(3)})`],
        textposition: 'top center',
        textfont: { size: 11, color: plotTextColor },
        hoverinfo: 'text'
      });
    }

    return traces;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xVal, n, themeMode]);

  // ── Handlers ──
  const handleSlider = (key) => (e) => {
    setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }));
  };

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

  // ── Render ──
  const yDisplay = isFinite(yVal) && Math.abs(yVal) < 1e8
    ? (Math.abs(yVal) < 0.0001 ? '0' : yVal.toFixed(4))
    : (yVal === Infinity || yVal === -Infinity ? '±∞' : 'undefined');

  return (
    <PageContainer $dark={themeMode === 'dark'}>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>← Basic</BackButton>
        <Title>Power Function y = x<sup>n</sup></Title>
      </Header>

      {/* Row 1: Controls */}
      <ControlsBar>
        <SliderGroup>
          <SliderItem>
            <label>x</label>
            <input type="range" min={-3} max={3} step={0.1} value={params.x} onChange={handleSlider('x')} />
            <span className="val">{params.x.toFixed(1)}</span>
          </SliderItem>
        </SliderGroup>

        <ToggleGroup>
          {[-2, -1, 0, 1, 2, 3].map(v => (
            <ToggleBtn key={v} $active={params.n === v} onClick={() => setParams(p => ({ ...p, n: v }))}>
              n={v}
            </ToggleBtn>
          ))}
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

      {/* Row 2: Data cards */}
      <RatiosBar>
        {ratioData.map(({ name, value, color }) => (
          <MiniCard key={name}>
            <MiniName $color={color}>{name}</MiniName>
            <MiniVal>{typeof value === 'number' && isFinite(value) ? (Math.abs(value) < 0.0001 ? '0' : value.toFixed(4)) : String(value)}</MiniVal>
          </MiniCard>
        ))}
      </RatiosBar>

      {/* Row 3: Two plots */}
      <PlotRow ref={rowRef}>
        <PlotHalfNarrow style={{ flex: `0 0 ${leftRatio}%` }}>
          {n === -2 && absX > 0 ? (
            <Box3D size={absX} dark={themeMode === 'dark'} plotStyle={plotStyle} />
          ) : n === 3 && absX > 0 ? (
            <Cube3D size={absX} dark={themeMode === 'dark'} plotStyle={plotStyle} />
          ) : (
          <PlotInner>
            <FunctionPlotter
              data={shapeTraces}
              xRange={[-4, 4]} yRange={[-4, 4]}
              aspectRatio="1:1"
              title={n === 1 ? 'Line Segment' : n === 2 ? 'Square (Area)' : n === 3 ? 'Cube (Volume)' : n === -1 ? 'Rectangle (xy = 1)' : n === 0 ? 'Constant y = 1' : `Power y = x${superscript(n)}`}
              plotStyle={plotStyle}
              showExportButton={false}
            />
          </PlotInner>
          )}
          <Resizer onMouseDown={onResizeStart} />
        </PlotHalfNarrow>
        <PlotHalf>
          <DerivativePlotter
            key={`power-${rightAspect}-${rightPlotKey}`}
            data={curveTraces}
            xRange={[-3, 3]}
            title={`y = x${superscript(n)}`}
            plotStyle={plotStyle}
            aspectRatio={rightAspect}
            legendPosition={legendPos}
            showExportButton={false}
          />
        </PlotHalf>
      </PlotRow>
    </PageContainer>
  );
}

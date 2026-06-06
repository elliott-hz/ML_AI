import { useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Plotly from 'plotly.js/dist/plotly.min.js';

const Container = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 1;
`;

const Wrapper = styled.div`
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

const STYLE_MAP = {
  thin:        { line: 1, fontSize: 9 },
  medium:      { line: 2, fontSize: 10 },
  thick:       { line: 2, fontSize: 11 },
  'extra-thick': { line: 3, fontSize: 12 },
};

/**
 * Interactive 3D rectangular box where x²·y = 1 (n = -2).
 */
export default function Box3D({ size, dark, plotStyle = 'medium' }) {
  const plotRef = useRef(null);
  const containerRef = useRef(null);
  const cs = STYLE_MAP[plotStyle] || STYLE_MAP.medium;

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    if (!plotRef.current || !size) return;
    const a = size;
    const h = 1 / (a * a);
    const maxDim = Math.max(a, h);
    const pad = Math.max(0.3, maxDim * 0.08);

    const v = [
      [0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0],
      [0, 0, h], [a, 0, h], [a, a, h], [0, a, h]
    ];
    const x = v.map(p => p[0]);
    const y = v.map(p => p[1]);
    const z = v.map(p => p[2]);

    const i = [0, 0, 4, 4, 0, 0, 1, 1, 3, 3, 0, 0];
    const j = [1, 2, 5, 6, 3, 7, 5, 6, 2, 6, 1, 5];
    const k = [2, 3, 6, 7, 7, 4, 6, 2, 6, 7, 5, 4];
    const faceColors = [
      '#f59e0b','#f59e0b','#d97706','#d97706',
      '#fbbf24','#fbbf24','#d97706','#d97706',
      '#fbbf24','#fbbf24','#f59e0b','#f59e0b',
    ];

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
    const camZ = maxDim / a < 1.5 ? 1.2 : 0.8;

    const layout = {
      title: {
        text: 'Rectangular Box (x² · y = 1)',
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
    <Wrapper $dark={dark} ref={containerRef}>
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
      <Container ref={plotRef} />
    </Wrapper>
  );
}

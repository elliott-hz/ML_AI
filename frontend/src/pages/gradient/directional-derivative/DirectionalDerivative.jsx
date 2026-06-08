// UI Pattern: MultiSectionPlot — 3D surface above, 2D contour below
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import styled from 'styled-components';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette, getPlotLayout } from '../../../constants/plotThemeConfig';
import { legendPositionConfig } from '../../../constants/partialDerivativeConfig';
import Plotter3D from '../../../components/visualization/Plotter3D';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../components/common/LayoutStyled';

const ContourWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: 8px;
  margin-top: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

/**
 * DirectionalDerivative — Directional Derivative on a 2D Gaussian
 *
 * z = f(x,y) = (1/2π)·exp(−½(x²+y²))
 * At point (x₀,y₀), the directional derivative in direction θ is:
 *   D_θ f = ∇f·(cosθ, sinθ) = fx·cosθ + fy·sinθ
 *
 * Shows the 3D bell curve above and its 2D contour map below.
 */
const DirectionalDerivative = () => {
  const [params, setParams] = useState({
    x0: 0.5,
    y0: 0.3,
    theta: 45,         // direction angle in degrees
    xRange: [-3, 3],
    yRange: [-3, 3],
    resolution: 40,
    aspectRatio: '4:3',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const contourRef = useRef(null);
  const hasInitContour = useRef(false);
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const plotLayout = getPlotLayout(themeMode);

  const { x0, y0, theta, xRange, yRange } = params;
  const thetaRad = theta * Math.PI / 180;
  const res = params.resolution;

  // ── Gaussian bell curve ─────────────────────────────────
  // z = (1/2π)·exp(−½(x²+y²))
  const fn = (x, y) => (1 / (2 * Math.PI)) * Math.exp(-0.5 * (x * x + y * y));
  const z0 = fn(x0, y0);

  // Partial derivatives
  // ∂f/∂x = −x·f(x,y),  ∂f/∂y = −y·f(x,y)
  const fx = -x0 * z0;
  const fy = -y0 * z0;
  const dirDeriv = fx * Math.cos(thetaRad) + fy * Math.sin(thetaRad);

  // ── 3D Surface data ─────────────────────────────────────
  const surfaceData = useMemo(() => {
    const xStep = (xRange[1] - xRange[0]) / res;
    const yStep = (yRange[1] - yRange[0]) / res;
    const xVals = Array.from({ length: res + 1 }, (_, i) => xRange[0] + i * xStep);
    const yVals = Array.from({ length: res + 1 }, (_, i) => yRange[0] + i * yStep);
    const zVals = yVals.map(y => xVals.map(x => fn(x, y)));

    return {
      type: 'surface',
      x: xVals,
      y: yVals,
      z: zVals,
      colorscale: palette.surface.colorscale,
      opacity: 0.8,
      contours: {
        x: { show: false },
        y: { show: false },
        z: { show: true, color: palette.surface.contour, width: 0.5 }
      },
      showscale: false,
      name: 'Gaussian Bell',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.4f}<extra></extra>'
    };
  }, [res, xRange, yRange, palette]);

  // ── Overlay traces (3D) ─────────────────────────────────
  const overlay3D = useMemo(() => {
    const traces = [];

    // Point A
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x0], y: [y0], z: [z0],
      marker: { color: palette.markers.evalX0, size: 12, symbol: 'circle', line: { color: '#fff', width: 2 } },
      name: `A = (${x0.toFixed(2)}, ${y0.toFixed(2)}, ${z0.toFixed(4)})`,
      showlegend: true
    });

    // Direction arrow on surface: short segment in direction θ
    const arrowLen = Math.min(xRange[1] - xRange[0], yRange[1] - yRange[0]) * 0.12;
    const dx = arrowLen * Math.cos(thetaRad);
    const dy = arrowLen * Math.sin(thetaRad);
    const dz = fn(x0 + dx, y0 + dy) - z0;
    const n = 8;
    const arrowPts = Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      return { x: x0 + dx * t, y: y0 + dy * t, z: z0 + dz * t };
    });

    traces.push({
      type: 'scatter3d', mode: 'lines+markers',
      x: arrowPts.map(p => p.x),
      y: arrowPts.map(p => p.y),
      z: arrowPts.map(p => p.z),
      line: { color: palette.auxTraces.tangent, width: 5 },
      marker: { color: palette.auxTraces.tangent, size: 4, symbol: 'arrow' },
      name: `θ = ${theta}°`,
      showlegend: true
    });

    return traces;
  }, [x0, y0, z0, thetaRad, theta, xRange, yRange, palette]);

  const all3DData = useMemo(() => [surfaceData, ...overlay3D], [surfaceData, overlay3D]);

  // ── 3D Scene ────────────────────────────────────────────
  const zMax3D = 1 / (2 * Math.PI);
  const scene = useMemo(() => {
    // compute reasonable x/y dtick based on range span
    const xSpan = xRange[1] - xRange[0];
    const ySpan = yRange[1] - yRange[0];
    const dtickXY = xSpan > 6 ? 2 : xSpan > 4 ? 1.5 : 1;

    const base = {
      xRange: [xRange[0] - 0.2, xRange[1] + 0.2],
      yRange: [yRange[0] - 0.2, yRange[1] + 0.2],
      zRange: [-0.02, zMax3D * 1.15],
      dtick: dtickXY,
      camera: {
        eye: { x: 2.5, y: -2.5, z: 1.2 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 }
      }
    };
    if (params.aspectRatio === 'auto') {
      base.aspectmode = 'manual';
      base.aspectratio = { x: 1, y: 1, z: 0.6 };
    } else {
      const [w, h] = params.aspectRatio.split(':').map(Number);
      if (w && h) {
        const maxDim = Math.max(w, h);
        base.aspectmode = 'manual';
        base.aspectratio = { x: w / maxDim, y: h / maxDim, z: 0.5 };
      }
    }
    return base;
  }, [xRange, yRange, zMax3D, params.aspectRatio]);

  // ── 2D Contour data & layout ────────────────────────────
  const { contourData, contourLayout } = useMemo(() => {
    const N = res;
    const xStep = (xRange[1] - xRange[0]) / N;
    const yStep = (yRange[1] - yRange[0]) / N;
    const xVals = Array.from({ length: N + 1 }, (_, i) => xRange[0] + i * xStep);
    const yVals = Array.from({ length: N + 1 }, (_, i) => yRange[0] + i * yStep);
    const zVals = yVals.map(y => xVals.map(x => fn(x, y)));

    // Gradient arrow (true direction of steepest ascent)
    const gradScale = Math.min(xRange[1] - xRange[0], yRange[1] - yRange[0]) * 0.2;
    const gLen = Math.sqrt(fx * fx + fy * fy);
    const gNormX = gLen > 0 ? fx / gLen : 0;
    const gNormY = gLen > 0 ? fy / gLen : 0;

    const d = [
      {
        type: 'contour',
        x: xVals,
        y: yVals,
        z: zVals,
        colorscale: [
          [0, '#1e3a5f'],
          [0.25, '#2d7fb8'],
          [0.5, '#6abed8'],
          [0.75, '#f5d56e'],
          [1, '#f4a261']
        ],
        contours: { coloring: 'heatmap', showlabels: true },
        line: { color: '#ffffff', width: 0.5 },
        showscale: false,
        hoverinfo: 'none'
      },
      // Point A on contour
      {
        type: 'scatter', mode: 'markers',
        x: [x0], y: [y0],
        marker: { color: palette.markers.evalX0, size: 14, symbol: 'circle', line: { color: '#fff', width: 2 } },
        name: `A (${x0.toFixed(2)}, ${y0.toFixed(2)})`,
        showlegend: true
      },
      // Direction arrow (θ) as scatter with line+marker
      {
        type: 'scatter', mode: 'lines+markers',
        x: [x0, x0 + Math.cos(thetaRad) * gradScale * 0.8],
        y: [y0, y0 + Math.sin(thetaRad) * gradScale * 0.8],
        line: { color: palette.auxTraces.tangent, width: 3 },
        marker: { color: palette.auxTraces.tangent, size: 8, symbol: 'arrow' },
        name: `Direction θ = ${theta}°`,
        showlegend: true
      },
      // Gradient vector (∇f) for comparison
      {
        type: 'scatter', mode: 'lines+markers',
        x: [x0, x0 + gNormX * gradScale],
        y: [y0, y0 + gNormY * gradScale],
        line: { color: palette.auxTraces.derivative, width: 2.5, dash: 'dash' },
        marker: { color: palette.auxTraces.derivative, size: 6, symbol: 'arrow' },
        name: `∇f (steepest)`,
        showlegend: true
      }
    ];

    const legX = params.legendPosition === 'top-right' || params.legendPosition === 'bottom-right' ? 0.98 : 0.02;
    const legY = params.legendPosition === 'top-right' || params.legendPosition === 'top-left' ? 0.98 : 0.02;
    const legXa = params.legendPosition === 'top-right' || params.legendPosition === 'bottom-right' ? 'right' : 'left';
    const legYa = params.legendPosition === 'top-right' || params.legendPosition === 'top-left' ? 'top' : 'bottom';

    const l = {
      title: { text: 'Contour Map', font: { color: plotLayout.titleFontColor, size: 14 } },
      xaxis: {
        title: 'x', range: xRange,
        gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: 11 },
        titlefont: { color: plotLayout.axisLabelColor, size: 12 },
        showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true
      },
      yaxis: {
        title: 'y', range: yRange,
        gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
        tickfont: { color: plotLayout.tickFontColor, size: 11 },
        titlefont: { color: plotLayout.axisLabelColor, size: 12 },
        showline: true, linewidth: 1, linecolor: plotLayout.axisColor, mirror: true,
        scaleanchor: 'x', scaleratio: 1
      },
      plot_bgcolor: plotLayout.plot_bgcolor,
      paper_bgcolor: plotLayout.paper_bgcolor,
      margin: { l: 50, r: 20, t: 40, b: 50 },
      showlegend: params.legendPosition !== 'None',
      legend: params.legendPosition !== 'None'
        ? { font: { color: plotLayout.legend.fontColor, size: 11 }, bgcolor: plotLayout.legend.bgcolor, bordercolor: plotLayout.legend.bordercolor, borderwidth: 1, x: legX, y: legY, xanchor: legXa, yanchor: legYa }
        : undefined,
      hovermode: 'closest'
    };
    return { contourData: d, contourLayout: l };
  }, [res, xRange, yRange, x0, y0, thetaRad, theta, fx, fy, params.legendPosition, plotLayout, palette]);

  // ── Render contour ──────────────────────────────────────
  const config = {
    displayModeBar: true, displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'sendDataToCloud'],
    toImageButtonOptions: { format: 'png', filename: `contour_${Date.now()}`, height: 600, width: 800, scale: 2 }
  };

  useEffect(() => {
    if (!contourRef.current) return;
    const gd = contourRef.current;
    if (!hasInitContour.current) {
      Plotly.newPlot(gd, contourData, contourLayout, config).then(() => { hasInitContour.current = true; });
    } else {
      Plotly.react(gd, contourData, contourLayout, config);
    }
    return () => { if (contourRef.current) Plotly.purge(contourRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contourData, contourLayout]);

  useEffect(() => {
    const handleResize = () => { if (contourRef.current) Plotly.Plots.resize(contourRef.current); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/gradient">
          ← Back to Gradient
        </BackButton>
        <SectionTitleH1>Directional Derivative: D<sub>θ</sub>f</SectionTitleH1>
      </Header>

      <SectionDescription>
        The <strong>directional derivative</strong> D<sub>θ</sub>f measures the rate of change
        of a multi-variable function in an <em>arbitrary direction</em> θ. It generalises the
        partial derivatives (which follow the axes) to any unit vector u = (cosθ, sinθ):
        <br/>
        <strong>D<sub>θ</sub>f = ∇f · u = (∂f/∂x)·cosθ + (∂f/∂y)·sinθ</strong>
        <br/>
        The surface below is the 2D Gaussian bell curve
        <strong> z = (1/2π)·e<sup>−½(x²+y²)</sup></strong>.
        The 3D view shows the direction arrow on the surface; the contour map below shows the
        direction arrow (solid) vs the gradient ∇f (dashed, steepest ascent).
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>2D Gaussian & Directional Derivative:</FormulaTitle>
        <Formula>
          f(x, y) = (1 / 2π)·e<sup>−½(x²+y²)</sup><br/><br/>
          ∂f/∂x = −x·f(x,y) &nbsp; ∂f/∂y = −y·f(x,y)<br/><br/>
          At (x₀, y₀) = ({x0.toFixed(2)}, {y0.toFixed(2)}): &nbsp; z₀ = {z0.toFixed(4)}<br/>
          ∇f = ({fx.toFixed(4)}, {fy.toFixed(4)})<br/>
          D<sub>θ</sub>f = ∇f·(cosθ, sinθ) = <strong>{dirDeriv.toFixed(4)}</strong>
          &nbsp; (θ = {theta}°)
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Evaluation Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -2.8, max: 2.8, step: 0.1 },
                { name: 'y0', label: 'y₀', min: -2.8, max: 2.8, step: 0.1 },
                { name: 'theta', label: 'θ (deg)', min: 0, max: 360, step: 5 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-3, 3] },
                { name: 'yRange', label: 'Y Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-3, 3] }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                ...legendPositionConfig,
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <Plotter3D
            data={all3DData}
            title="Gaussian Bell — 3D Surface"
            showExportButton={false}
            height="450px"
            scene={scene}
            plotStyle={params.plotStyle}
            legendPosition={params.legendPosition}
          />

          <ContourWrapper>
            <div ref={contourRef} style={{ width: '100%', height: '100%' }} />
          </ContourWrapper>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DirectionalDerivative;

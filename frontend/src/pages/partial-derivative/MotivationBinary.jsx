// UI Pattern: StandardSinglePlot — single ContentLayout, one 3D plot
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getTracePalette } from '../../constants/plotThemeConfig';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';
import BackButton from '../../components/layout/BackButton';
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
  Formula
} from '../../components/style/PartialDerivativeStyled';

const PlotContainer = styled.div`
  width: 100%;
  height: 500px;

  .js-plotly-plot .plotly .main-svg {
    border-radius: 8px;
  }
`;

const Note = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  font-style: italic;
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

/**
 * MotivationBinary — Binary Two-Variable Function
 *
 * z = f(x, y) = x² + y²  (paraboloid, x,y ≥ 0)
 * Demonstrates that a binary function has two independent inputs:
 * z changes when EITHER x changes OR y changes.
 *
 * Visuals:
 *   - 3D surface plot of z = x² + y²
 *   - Point A at (x₀, y₀, z₀)
 *   - Projection to xy-plane (z=0)
 *   - Projection to xz-plane (y=0)
 *   - Projection to yz-plane (x=0)
 */
const MotivationBinary = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    x0: 1.5,
    y0: 1.0,
    resolution: 30
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const x0 = params.x0;
  const y0 = params.y0;
  const z0 = x0 * x0 + y0 * y0;

  // Partial derivatives: ∂z/∂x = 2x, ∂z/∂y = 2y
  const dzdx = 2 * x0;
  const dzdy = 2 * y0;

  // Range for the surface plot [0, 3]
  const range = [0, 3];
  const n = params.resolution;
  const step = (range[1] - range[0]) / n;

  // ── Surface data ────────────────────────────────────────
  const surfaceData = useMemo(() => {
    const xVals = Array.from({ length: n + 1 }, (_, i) => range[0] + i * step);
    const yVals = Array.from({ length: n + 1 }, (_, i) => range[0] + i * step);
    const zVals = yVals.map(y => xVals.map(x => x * x + y * y));

    return {
      type: 'surface',
      x: xVals,
      y: yVals,
      z: zVals,
      colorscale: [
        [0, '#1e3a5f'],
        [0.25, '#2563eb'],
        [0.5, '#6366f1'],
        [0.75, '#a855f7'],
        [1, '#e879f9']
      ],
      opacity: 0.85,
      contours: {
        x: { show: true, color: '#94a3b8', width: 0.5 },
        y: { show: true, color: '#94a3b8', width: 0.5 },
        z: { show: true, color: '#94a3b8', width: 0.5 }
      },
      showscale: false,
      name: 'z = x² + y²',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>'
    };
  }, [n]);

  // ── Projection & point traces ───────────────────────────
  const overlayTraces = useMemo(() => {
    const traces = [];

    // Helper: line between two 3D points
    const line3d = (p1, p2, color, width = 2, dash = 'solid', name = '', showLegend = false) => ({
      type: 'scatter3d',
      mode: 'lines',
      x: [p1[0], p2[0]],
      y: [p1[1], p2[1]],
      z: [p1[2], p2[2]],
      line: { color, width, dash },
      name,
      showlegend: showLegend,
      hovertemplate: ''
    });

    // Point A on surface
    traces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [x0],
      y: [y0],
      z: [z0],
      marker: {
        color: palette.markers.evalX0,
        size: 10,
        symbol: 'circle',
        line: { color: '#fff', width: 2 }
      },
      name: `A = (${x0.toFixed(1)}, ${y0.toFixed(1)}, ${z0.toFixed(1)})`,
      showlegend: true
    });

    // Projection 1: A → xy-plane (z=0)  — red
    traces.push(line3d(
      [x0, y0, z0],
      [x0, y0, 0],
      palette.markers.evalX0, 2, 'dash', '', false
    ));

    // Projection 2: A → xz-plane (y=0)  — yellow
    traces.push(line3d(
      [x0, y0, z0],
      [x0, 0, z0],
      palette.mainTraces.secondary, 2, 'dash', '', false
    ));

    // Projection 3: A → yz-plane (x=0)  — cyan
    traces.push(line3d(
      [x0, y0, z0],
      [0, y0, z0],
      '#22d3ee', 2, 'dash', '', false
    ));

    // Footprint markers on each plane
    traces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [x0],
      y: [y0],
      z: [0],
      marker: { color: palette.markers.evalX0, size: 5, symbol: 'circle' },
      name: '(x₀, y₀, 0)',
      showlegend: false
    });
    traces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [x0],
      y: [0],
      z: [z0],
      marker: { color: palette.mainTraces.secondary, size: 5, symbol: 'circle' },
      name: '(x₀, 0, z₀)',
      showlegend: false
    });
    traces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [0],
      y: [y0],
      z: [z0],
      marker: { color: '#22d3ee', size: 5, symbol: 'circle' },
      name: '(0, y₀, z₀)',
      showlegend: false
    });

    return traces;
  }, [x0, y0, z0, palette]);

  // ── Camera position ─────────────────────────────────────
  const camera = useMemo(() => ({
    eye: { x: 3.5, y: -3.5, z: 2.5 },
    center: { x: 1.5, y: 1.5, z: 2 },
    up: { x: 0, y: 0, z: 1 }
  }), []);

  const layout = useMemo(() => ({
    scene: {
      xaxis: {
        title: { text: 'x', font: { color: '#94a3b8' } },
        range,
        dtick: 0.5,
        gridcolor: '#334155',
        zerolinecolor: '#475569'
      },
      yaxis: {
        title: { text: 'y', font: { color: '#94a3b8' } },
        range,
        dtick: 0.5,
        gridcolor: '#334155',
        zerolinecolor: '#475569'
      },
      zaxis: {
        title: { text: 'z', font: { color: '#94a3b8' } },
        range: [0, 18],
        dtick: 2,
        gridcolor: '#334155',
        zerolinecolor: '#475569'
      },
      bgcolor: 'transparent',
      camera,
      aspectmode: 'manual',
      aspectratio: { x: 1, y: 1, z: 1.2 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 0, r: 0, t: 0, b: 0 },
    autosize: true,
    legend: {
      x: 1.05,
      y: 1,
      font: { color: '#cbd5e1', size: 11 },
      bgcolor: 'rgba(30, 41, 59, 0.8)'
    }
  }), [camera]);

  const plotConfig = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d', 'select2d'],
    toImageButtonOptions: { format: 'png', filename: 'binary-function-3d', scale: 2 }
  }), []);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative/partial-derivative">
          ← Back to Partial Derivative
        </BackButton>
        <SectionTitleH1>Binary Function: z = f(x, y)</SectionTitleH1>
      </Header>

      <SectionDescription>
        A <strong>binary (two-variable) function</strong> has two independent inputs.
        Here <strong>z = x² + y²</strong> — <em>z</em> changes when <em>either</em> x changes
        <em> or </em> y changes. The three dashed projection lines from point A to
        each coordinate plane (xy, xz, yz) illustrate that z depends on both x and y.
        To isolate just the effect of x, we would hold y constant — that is the essence
        of the <strong>partial derivative ∂z/∂x</strong>.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Two-Variable Function:</FormulaTitle>
        <Formula>
          z = f(x, y) = x² + y²<br/><br/>
          Partial derivative w.r.t x: &nbsp; <strong>∂z/∂x = 2x</strong> &nbsp; (treat y as constant)<br/>
          Partial derivative w.r.t y: &nbsp; <strong>∂z/∂y = 2y</strong> &nbsp; (treat x as constant)<br/><br/>
          At (x₀, y₀) = ({x0.toFixed(1)}, {y0.toFixed(1)}):<br/>
          z₀ = {z0.toFixed(3)} &nbsp;
          ∂z/∂x = {dzdx.toFixed(2)} &nbsp;
          ∂z/∂y = {dzdy.toFixed(2)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Evaluation Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: 0.1, max: 2.9, step: 0.1 },
                { name: 'y0', label: 'y₀', min: 0.1, max: 2.9, step: 0.1 }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <PlotContainer>
            <Plot
              data={[surfaceData, ...overlayTraces]}
              layout={layout}
              config={plotConfig}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          </PlotContainer>
          <Note>
            Drag to rotate · Scroll to zoom ·
            <span style={{ color: palette.markers.evalX0 }}> ●</span> xy-plane ·
            <span style={{ color: palette.mainTraces.secondary }}> ●</span> xz-plane ·
            <span style={{ color: '#22d3ee' }}> ●</span> yz-plane
          </Note>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default MotivationBinary;

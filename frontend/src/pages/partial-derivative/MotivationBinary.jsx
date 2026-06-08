// UI Pattern: StandardSinglePlot — single ContentLayout with one 3D plot via PartialDerivativePlotter
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ASPECT_RATIO_OPTIONS } from '../../constants/plotThemeConfig';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getTracePalette } from '../../constants/plotThemeConfig';
import { legendPositionConfig } from '../../constants/partialDerivativeConfig';
import Plotter3D from '../../components/visualization/Plotter3D';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';
import BackButton from '../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../components/common/LayoutStyled';

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
 */
const MotivationBinary = () => {
  const [params, setParams] = useState({
    x0: 1.5,
    y0: 1.0,
    resolution: 30,
    aspectRatio: '1:1',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const x0 = params.x0;
  const y0 = params.y0;
  const z0 = x0 * x0 + y0 * y0;
  const dzdx = 2 * x0;
  const dzdy = 2 * y0;

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
      colorscale: palette.surface.colorscale,
      opacity: 0.85,
      contours: {
        x: { show: true, color: palette.surface.contour, width: 0.5 },
        y: { show: true, color: palette.surface.contour, width: 0.5 },
        z: { show: true, color: palette.surface.contour, width: 0.5 }
      },
      showscale: false,
      name: 'z = x² + y²',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>'
    };
  }, [n, palette]);

  // ── Overlay traces ──────────────────────────────────────
  const overlayTraces = useMemo(() => {
    const traces = [];

    const line3d = (p1, p2, color, width = 2, dash = 'solid') => ({
      type: 'scatter3d',
      mode: 'lines',
      x: [p1[0], p2[0]],
      y: [p1[1], p2[1]],
      z: [p1[2], p2[2]],
      line: { color, width, dash },
      showlegend: false,
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

    const [planeXY, planeXZ, planeYZ] = palette.surface.planeProjection;

    // Projection 1: A → xy-plane (z=0)
    traces.push(line3d([x0, y0, z0], [x0, y0, 0], planeXY, 2, 'dash'));
    // Projection 2: A → xz-plane (y=0)
    traces.push(line3d([x0, y0, z0], [x0, 0, z0], planeXZ, 2, 'dash'));
    // Projection 3: A → yz-plane (x=0)
    traces.push(line3d([x0, y0, z0], [0, y0, z0], planeYZ, 2, 'dash'));

    // Footprint markers
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x0], y: [y0], z: [0],
      marker: { color: planeXY, size: 5, symbol: 'circle' },
      showlegend: false
    });
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x0], y: [0], z: [z0],
      marker: { color: planeXZ, size: 5, symbol: 'circle' },
      showlegend: false
    });
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [0], y: [y0], z: [z0],
      marker: { color: planeYZ, size: 5, symbol: 'circle' },
      showlegend: false
    });

    return traces;
  }, [x0, y0, z0, palette]);

  const allData = useMemo(() => [surfaceData, ...overlayTraces], [surfaceData, overlayTraces]);

  // ── Scene config for 3D ─────────────────────────────────
  const scene = useMemo(() => {
    const base = {
      xRange: [0, 3.2],
      yRange: [0, 3.2],
      zRange: [0, 18],
      dtick: 0.5,
      camera: {
        eye: { x: 1.8, y: -1.8, z: 1.2 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 }
      }
    };
    // auto → aspectmode:'data'；指定比例 → manual + normalized aspectratio
    if (params.aspectRatio === 'auto') {
      base.aspectmode = 'data';
    } else {
      const [w, h] = params.aspectRatio.split(':').map(Number);
      if (w && h) {
        const maxDim = Math.max(w, h);
        base.aspectmode = 'manual';
        base.aspectratio = { x: w / maxDim, y: h / maxDim, z: 0.8 };
      }
    }
    return base;
  }, [params.aspectRatio]);

  const [planeXY, planeXZ, planeYZ] = palette.surface.planeProjection;

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

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                ...legendPositionConfig,
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <Plotter3D
            data={allData}
            title="z = x² + y² — Two Inputs, One Output"
            showExportButton={false}
            scene={scene}
            legendPosition={params.legendPosition}
          />
          <Note>
            Drag to rotate · Scroll to zoom ·
            <span style={{ color: planeXY }}> ●</span> xy-plane ·
            <span style={{ color: planeXZ }}> ●</span> xz-plane ·
            <span style={{ color: planeYZ }}> ●</span> yz-plane
          </Note>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default MotivationBinary;

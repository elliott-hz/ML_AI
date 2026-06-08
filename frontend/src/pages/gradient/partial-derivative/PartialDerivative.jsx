// UI Pattern: StandardSinglePlot — single ContentLayout with one 3D plot via Plotter3D
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
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

const Note = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  font-style: italic;
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

/**
 * PartialDerivative — Partial Derivatives on a Parametric Surface
 *
 * z = f(x, y) = a·x^m + b·y^n
 * Visualises the partial derivatives ∂z/∂x and ∂z/∂y as tangent lines
 * along the cross-section curves at the evaluation point.
 */
const PartialDerivative = () => {
  const [params, setParams] = useState({
    a: 1.0,
    m: 2.0,
    b: 1.0,
    n: 2.0,
    x0: 1.5,
    y0: 1.0,
    resolution: 30,
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { a, m, b, n, x0, y0 } = params;
  const z0 = a * Math.pow(x0, m) + b * Math.pow(y0, n);
  const dzdx = a * m * Math.pow(x0, m - 1);
  const dzdy = b * n * Math.pow(y0, n - 1);

  const range = [0, 3];
  const res = params.resolution;
  const step = (range[1] - range[0]) / res;

  // ── Function helper ─────────────────────────────────────
  const fn = (x, y) => a * Math.pow(x, m) + b * Math.pow(y, n);

  // ── Surface data ────────────────────────────────────────
  const surfaceData = useMemo(() => {
    const xVals = Array.from({ length: res + 1 }, (_, i) => range[0] + i * step);
    const yVals = Array.from({ length: res + 1 }, (_, i) => range[0] + i * step);
    const zVals = yVals.map(y => xVals.map(x => fn(x, y)));

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
      name: `z = ${a}·x^${m} + ${b}·y^${n}`,
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>'
    };
  }, [res, a, m, b, n, palette]);

  // ── Tangent + marker overlay traces ─────────────────────
  const overlayTraces = useMemo(() => {
    const traces = [];

    const line3d = (p1, p2, color, dash = 'solid', width = 3, name = '') => ({
      type: 'scatter3d',
      mode: 'lines',
      x: [p1[0], p2[0]],
      y: [p1[1], p2[1]],
      z: [p1[2], p2[2]],
      line: { color, dash, width },
      showlegend: !!name,
      name,
      hovertemplate: ''
    });

    // ── Tangent line in x-direction (∂z/∂x) ──────────────
    const tanSpan = 1.2;
    const txMin = Math.max(range[0], x0 - tanSpan);
    const txMax = Math.min(range[1], x0 + tanSpan);
    const tX = Array.from({ length: 20 }, (_, i) => txMin + (txMax - txMin) * i / 19);
    const tanX = tX.map(x => ({
      x, y: y0,
      z: z0 + dzdx * (x - x0)
    }));
    traces.push({
      type: 'scatter3d', mode: 'lines',
      x: tanX.map(p => p.x),
      y: tanX.map(p => p.y),
      z: tanX.map(p => p.z),
      line: { color: palette.auxTraces.tangent, width: 6 },
      name: `∂z/∂x = ${dzdx.toFixed(2)}`,
      showlegend: true
    });

    // ── Tangent line in y-direction (∂z/∂y) ──────────────
    const tyMin = Math.max(range[0], y0 - tanSpan);
    const tyMax = Math.min(range[1], y0 + tanSpan);
    const tY = Array.from({ length: 20 }, (_, i) => tyMin + (tyMax - tyMin) * i / 19);
    const tanY = tY.map(y => ({
      x: x0, y,
      z: z0 + dzdy * (y - y0)
    }));
    traces.push({
      type: 'scatter3d', mode: 'lines',
      x: tanY.map(p => p.x),
      y: tanY.map(p => p.y),
      z: tanY.map(p => p.z),
      line: { color: palette.auxTraces.derivative, width: 6 },
      name: `∂z/∂y = ${dzdy.toFixed(2)}`,
      showlegend: true
    });

    // ── Point A on surface ────────────────────────────────
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x0], y: [y0], z: [z0],
      marker: {
        color: palette.markers.evalX0,
        size: 10,
        symbol: 'circle',
        line: { color: '#fff', width: 2 }
      },
      name: `A = (${x0.toFixed(1)}, ${y0.toFixed(1)}, ${z0.toFixed(2)})`,
      showlegend: true
    });

    // ── Projection lines ──────────────────────────────────
    const [planeXY, planeXZ, planeYZ] = palette.surface.planeProjection;
    traces.push(line3d([x0, y0, z0], [x0, y0, 0], planeXY, 'dash'));
    traces.push(line3d([x0, y0, z0], [x0, 0, z0], planeXZ, 'dash'));
    traces.push(line3d([x0, y0, z0], [0, y0, z0], planeYZ, 'dash'));

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
  }, [x0, y0, z0, dzdx, dzdy, a, m, b, n, palette]);

  const allData = useMemo(() => [surfaceData, ...overlayTraces], [surfaceData, overlayTraces]);

  // ── Dynamic zRange ──────────────────────────────────────
  const maxZ = a * Math.pow(range[1], m) + b * Math.pow(range[1], n);
  const zRange = [0, Math.max(maxZ * 1.15, 1)];

  // ── Scene config ────────────────────────────────────────
  const scene = useMemo(() => {
    const base = {
      xRange: [0, 3.2],
      yRange: [0, 3.2],
      zRange,
      dtick: Math.max(Math.round(zRange[1] / 8 * 2) / 2, 0.5),
      camera: {
        eye: { x: 1.8, y: -1.8, z: 1.2 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 }
      }
    };
    if (params.aspectRatio === 'auto') {
      base.aspectmode = 'manual';
      base.aspectratio = { x: 1, y: 1, z: 2 };
    } else {
      const [w, h] = params.aspectRatio.split(':').map(Number);
      if (w && h) {
        const maxDim = Math.max(w, h);
        base.aspectmode = 'manual';
        base.aspectratio = { x: w / maxDim, y: h / maxDim, z: 0.8 };
      }
    }
    return base;
  }, [params.aspectRatio, zRange]);

  const [planeXY, planeXZ, planeYZ] = palette.surface.planeProjection;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/gradient">
          ← Back to Gradient
        </BackButton>
        <SectionTitleH1>Partial Derivative: ∂z/∂x and ∂z/∂y</SectionTitleH1>
      </Header>

      <SectionDescription>
        For a binary function <strong>z = f(x, y)</strong>, the <strong>partial derivative</strong>
        measures how <em>z</em> changes when <em>only one</em> input varies while the other is held
        constant. The surface below shows <strong>z = a·x<sup>m</sup> + b·y<sup>n</sup></strong>.
        The two highlighted curves are <em>cross-sections</em> through the surface at y₀ (varying x)
        and at x₀ (varying y). The <span style={{ color: palette.auxTraces.tangent }}><strong>cyan</strong></span>
        and <span style={{ color: palette.auxTraces.derivative }}><strong>red</strong></span> tangent
        lines show ∂z/∂x and ∂z/∂y respectively — the instantaneous rate of change along each
        cross-section.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Parametric Two-Variable Function:</FormulaTitle>
        <Formula>
          z = f(x, y) = {a}·x<sup>{m}</sup> + {b}·y<sup>{n}</sup><br/><br/>
          Partial derivative w.r.t x: &nbsp; <strong>∂z/∂x = {a}·{m}·x<sup>{m - 1}</sup></strong> &nbsp; (hold y constant)<br/>
          Partial derivative w.r.t y: &nbsp; <strong>∂z/∂y = {b}·{n}·y<sup>{n - 1}</sup></strong> &nbsp; (hold x constant)<br/><br/>
          At (x₀, y₀) = ({x0.toFixed(1)}, {y0.toFixed(1)}):<br/>
          z₀ = {z0.toFixed(3)} &nbsp;
          ∂z/∂x = {dzdx.toFixed(3)} &nbsp;
          ∂z/∂y = {dzdy.toFixed(3)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Curvature Control">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (x coeff)', min: 0.1, max: 3, step: 0.1 },
                { name: 'm', label: 'm (x exponent)', min: 1, max: 4, step: 0.5 },
                { name: 'b', label: 'b (y coeff)', min: 0.1, max: 3, step: 0.1 },
                { name: 'n', label: 'n (y exponent)', min: 1, max: 4, step: 0.5 }
              ]}
            />
          </ParameterSection>

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
                { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS },
                { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
              ]}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <Plotter3D
            data={allData}
            title={`z = ${a}·x^${m} + ${b}·y^${n} — Partial Derivatives`}
            showExportButton={false}
            scene={scene}
            plotStyle={params.plotStyle}
            legendPosition={params.legendPosition}
            crossSection={{
              x0, y0,
              fn,
              range,
              colorX: palette.surface.crossSection.fx,
              colorY: palette.surface.crossSection.fy
            }}
          >
            <ParameterSection title="Evaluation Point" style={{ margin: 0, border: 'none', background: 'transparent', padding: 0 }}>
              <ParameterControls
                parameters={params}
                onChange={setParams}
                config={[
                  { name: 'x0', label: 'x₀', min: 0.1, max: 2.9, step: 0.1 },
                  { name: 'y0', label: 'y₀', min: 0.1, max: 2.9, step: 0.1 }
                ]}
              />
            </ParameterSection>
          </Plotter3D>
          <Note>
            Drag to rotate · Scroll to zoom ·
            <span style={{ color: palette.auxTraces.tangent }}> ●</span> ∂z/∂x tangent ·
            <span style={{ color: palette.auxTraces.derivative }}> ●</span> ∂z/∂y tangent ·
            <span style={{ color: planeXY }}> ●</span> xy ·
            <span style={{ color: planeXZ }}> ●</span> xz ·
            <span style={{ color: planeYZ }}> ●</span> yz
          </Note>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default PartialDerivative;

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
 * z = d·(a·(x-xc)^m + b·(y-yc)^n) + c
 *   where d = ±1 (direction), controls bowl up or down
 *   (xc, yc, c) shifts the bowl centre in 3D space
 *   m, n are integers to avoid negative-base power issues
 *
 * Visualises the partial derivatives ∂z/∂x and ∂z/∂y as tangent lines
 * along the cross-section curves at the evaluation point.
 */
const PartialDerivative = () => {
  const [params, setParams] = useState({
    a: 1.0,
    m: 2,
    b: 1.0,
    n: 2,
    xc: 2,
    yc: 2,
    c: 0,
    direction: true,   // true = bowl up, false = bowl down
    x0: 2.5,
    y0: 1.5,
    xRange: [0, 4],
    yRange: [0, 4],
    resolution: 30,
    aspectRatio: 'auto',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const { a, m, b, n, xc, yc, c, direction, x0, y0, xRange, yRange } = params;

  // ── Function & derived values ───────────────────────────
  const dir = direction ? 1 : -1; // convert boolean → ±1

  // ── Combined range for Plotter3D crossSection ──────────
  const crossRange = [Math.min(xRange[0], yRange[0]), Math.max(xRange[1], yRange[1])];

  // ── Unicode superscript ─────────────────────────────────
  const sup = (n) => String(n).split('').map(c => ({'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','.':'·'})[c] || c).join('');
  const fmt = (v, decimals = 1) => Number(v.toFixed(decimals)).toString();
  const term = (coeff, varName, center, exp) => {
    const v = center === 0 ? varName : `(${varName}${center > 0 ? '−' : '+'}${fmt(Math.abs(center))})`;
    return `${fmt(coeff)}·${v}${sup(exp)}`;
  };

  const fn = (x, y) => dir * (a * Math.pow(x - xc, m) + b * Math.pow(y - yc, n)) + c;
  const z0 = fn(x0, y0);
  const dzdx = dir * a * m * Math.pow(x0 - xc, m - 1);
  const dzdy = dir * b * n * Math.pow(y0 - yc, n - 1);

  const res = params.resolution;

  // ── Dynamic zRange ──────────────────────────────────────
  const zBounds = useMemo(() => {
    // sample at 9 key points (corners + edges + centre)
    const xs = [xRange[0], xc, xRange[1]];
    const ys = [yRange[0], yc, yRange[1]];
    let zMin = Infinity, zMax = -Infinity;
    for (const x of xs) {
      for (const y of ys) {
        const z = fn(x, y);
        if (z < zMin) zMin = z;
        if (z > zMax) zMax = z;
      }
    }
    const pad = Math.max((zMax - zMin) * 0.15, 1);
    return [zMin - pad, zMax + pad];
  }, [a, m, b, n, xc, yc, c, dir, xRange, yRange]);

  // ── Surface data ────────────────────────────────────────
  const surfaceData = useMemo(() => {
    const xStep = (xRange[1] - xRange[0]) / res;
    const yStep = (yRange[1] - yRange[0]) / res;
    const xVals = Array.from({ length: res + 1 }, (_, i) => xRange[0] + i * xStep);
    const yVals = Array.from({ length: res + 1 }, (_, i) => yRange[0] + i * yStep);
    const zVals = yVals.map(y => xVals.map(x => fn(x, y)));

    const dirLabel = dir === 1 ? '↑' : '↓';
    return {
      type: 'surface',
      x: xVals,
      y: yVals,
      z: zVals,
      colorscale: palette.surface.colorscale,
      opacity: 0.55,
      contours: {
        x: { show: true, color: palette.surface.contour, width: 0.5 },
        y: { show: true, color: palette.surface.contour, width: 0.5 },
        z: { show: true, color: palette.surface.contour, width: 0.5 }
      },
      showscale: false,
      name: `z = ${term(a, 'x', xc, m)} + ${term(b, 'y', yc, n)} ${c >= 0 ? '+' : '−'} ${fmt(Math.abs(c))}`,
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>'
    };
  }, [res, a, m, b, n, xc, yc, c, dir, palette]);

  // ── Coordinate plane surfaces (semi-transparent) ───────
  const planeSurfaces = useMemo(() => {
    const [xyColor, xzColor, yzColor] = palette.surface.planeProjection;
    const [zMin, zMax] = zBounds;

    const mesh = (verts, color) => ({
      type: 'mesh3d',
      x: verts.map(v => v[0]),
      y: verts.map(v => v[1]),
      z: verts.map(v => v[2]),
      i: [0, 0], j: [1, 2], k: [2, 3],
      color,
      opacity: 0.12,
      showscale: false,
      hoverinfo: 'none',
      showlegend: false
    });

    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;

    return [
      mesh([[xMin, yMin, 0], [xMax, yMin, 0], [xMax, yMax, 0], [xMin, yMax, 0]], xyColor),  // xy-plane  z=0
      mesh([[xMin, 0, zMin], [xMax, 0, zMin], [xMax, 0, zMax], [xMin, 0, zMax]], xzColor),  // xz-plane  y=0
      mesh([[0, yMin, zMin], [0, yMax, zMin], [0, yMax, zMax], [0, yMin, zMax]], yzColor),  // yz-plane  x=0
    ];
  }, [palette, zBounds, xRange, yRange]);

  // ── Tangent + marker overlay traces ─────────────────────
  const overlayTraces = useMemo(() => {
    const traces = [];
    const N = 30;

    // Helper: parametric tangent line, full range, dashed
    const tanTrace = (pts, color, name) => ({
      type: 'scatter3d', mode: 'lines',
      x: pts.map(p => p.x),
      y: pts.map(p => p.y),
      z: pts.map(p => p.z),
      line: { color, width: 5, dash: 'dash' },
      name,
      showlegend: true
    });

    // ── Tangent in x-direction (∂z/∂x) — full x-range ────
    const tX = Array.from({ length: N + 1 }, (_, i) => xRange[0] + (xRange[1] - xRange[0]) * i / N);
    const tanX = tX.map(x => ({ x, y: y0, z: z0 + dzdx * (x - x0) }));
    traces.push(tanTrace(tanX, palette.surface.crossSection.fx, `∂z/∂x = ${dzdx.toFixed(2)}`));

    // ── L1 label at x-tangent end (higher-z side) ─────────
    const l1End = dzdx >= 0 ? xRange[1] : xRange[0];
    const l1Off = (yRange[1] - yRange[0]) * 0.07;
    const l1z = z0 + dzdx * (l1End - x0);
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [l1End], y: [y0 + l1Off], z: [l1z],
      text: ['L₁'],
      textfont: { color: palette.surface.crossSection.fx, size: 18, weight: 800 },
      textposition: 'middle right',
      showlegend: false, hoverinfo: 'none'
    });

    // ── Tangent in y-direction (∂z/∂y) — full y-range ────
    const tY = Array.from({ length: N + 1 }, (_, i) => yRange[0] + (yRange[1] - yRange[0]) * i / N);
    const tanY = tY.map(y => ({ x: x0, y, z: z0 + dzdy * (y - y0) }));
    traces.push(tanTrace(tanY, palette.surface.crossSection.fy, `∂z/∂y = ${dzdy.toFixed(2)}`));

    // ── L2 label at y-tangent end (higher-z side) ─────────
    const l2End = dzdy >= 0 ? yRange[1] : yRange[0];
    const l2Off = (xRange[1] - xRange[0]) * 0.07;
    const l2z = z0 + dzdy * (l2End - y0);
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x0 + l2Off], y: [l2End], z: [l2z],
      text: ['L₂'],
      textfont: { color: palette.surface.crossSection.fy, size: 18, weight: 800 },
      textposition: 'middle right',
      showlegend: false, hoverinfo: 'none'
    });

    // ── Point A on surface ────────────────────────────────
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x0], y: [y0], z: [z0],
      marker: {
        color: palette.markers.evalX0,
        size: 12, symbol: 'circle',
        line: { color: '#fff', width: 2 }
      },
      name: `A = (${x0.toFixed(1)}, ${y0.toFixed(1)}, ${z0.toFixed(2)})`,
      showlegend: true
    });

    // ── Projection lines (to coordinate planes) ──────────
    const [planeXY, planeXZ, planeYZ] = palette.surface.planeProjection;
    const l3 = (p1, p2, color, dash = 'dash') => ({
      type: 'scatter3d', mode: 'lines',
      x: [p1[0], p2[0]], y: [p1[1], p2[1]], z: [p1[2], p2[2]],
      line: { color, dash }, showlegend: false, hovertemplate: ''
    });

    traces.push(l3([x0, y0, z0], [x0, y0, 0], planeXY));            // → xy-plane (z=0)
    traces.push(l3([x0, y0, z0], [x0, 0, z0], planeXZ));            // → xz-plane (y=0)
    traces.push(l3([x0, y0, z0], [0, y0, z0], planeYZ));            // → yz-plane (x=0)

    // Footprints (½ of point A size)
    traces.push({ type: 'scatter3d', mode: 'markers', x: [x0], y: [y0], z: [0],    marker: { color: planeXY, size: 6 }, showlegend: false });
    traces.push({ type: 'scatter3d', mode: 'markers', x: [x0], y: [0],   z: [z0],  marker: { color: planeXZ, size: 6 }, showlegend: false });
    traces.push({ type: 'scatter3d', mode: 'markers', x: [0],   y: [y0], z: [z0],  marker: { color: planeYZ, size: 6 }, showlegend: false });

    return traces;
  }, [x0, y0, z0, dzdx, dzdy, palette, xRange, yRange]);

  const allData = useMemo(() => [surfaceData, ...planeSurfaces, ...overlayTraces], [surfaceData, planeSurfaces, overlayTraces]);

  // ── Scene config ────────────────────────────────────────
  const scene = useMemo(() => {
    const pad = 0.2;
    const base = {
      xRange: [xRange[0] - pad, xRange[1] + pad],
      yRange: [yRange[0] - pad, yRange[1] + pad],
      zRange: zBounds,
      dtick: Math.max(Math.round((zBounds[1] - zBounds[0]) / 8 * 2) / 2, 0.5),
      camera: {
        eye: { x: 2.5, y: -2.5, z: 1.5 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 }
      }
    };
    if (params.aspectRatio === 'auto') {
      base.aspectmode = 'manual';
      base.aspectratio = { x: 1, y: 1, z: 1.2 };
    } else {
      const [w, h] = params.aspectRatio.split(':').map(Number);
      if (w && h) {
        const maxDim = Math.max(w, h);
        base.aspectmode = 'manual';
        base.aspectratio = { x: w / maxDim, y: h / maxDim, z: 0.8 };
      }
    }
    return base;
  }, [params.aspectRatio, zBounds, xRange, yRange]);

  const [planeXY, planeXZ, planeYZ] = palette.surface.planeProjection;
  const dirLabel = dir === 1 ? 'up' : 'down';

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
        constant. The surface shows a parametric bowl <strong>z = d·(a·(x−xc)<sup>m</sup> + b·(y−yc)<sup>n</sup>) + c</strong>
        where <strong>d = {dirLabel}</strong> controls the bowl direction, <strong>(xc, yc, c)</strong> shifts
        the bowl centre, and <strong>m, n</strong> adjust the curvature. The
        <span style={{ color: palette.surface.crossSection.fx }}><strong> first cross-section</strong></span>
        (varying x at y₀) and its <span style={{ color: palette.surface.crossSection.fx }}><strong>dashed tangent</strong></span>
        show ∂z/∂x; the <span style={{ color: palette.surface.crossSection.fy }}><strong> second cross-section</strong></span>
        (varying y at x₀) and its <span style={{ color: palette.surface.crossSection.fy }}><strong>dashed tangent</strong></span>
        show ∂z/∂y.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Parametric Bowl Function:</FormulaTitle>
        <Formula>
          z = {dir}·({a}·(x − {xc})<sup>{m}</sup> + {b}·(y − {yc})<sup>{n}</sup>) + ({c})<br/><br/>
          ∂z/∂x = {dir}·{a}·{m}·(x − {xc})<sup>{m - 1}</sup> &nbsp; (hold y constant)<br/>
          ∂z/∂y = {dir}·{b}·{n}·(y − {yc})<sup>{n - 1}</sup> &nbsp; (hold x constant)<br/><br/>
          At (x₀, y₀) = ({x0.toFixed(1)}, {y0.toFixed(1)}):<br/>
          z₀ = {z0.toFixed(3)} &nbsp;
          ∂z/∂x = {dzdx.toFixed(3)} &nbsp;
          ∂z/∂y = {dzdy.toFixed(3)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Bowl Shape">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'a', label: 'a (x coeff)', min: 0.1, max: 3, step: 0.1 },
                { name: 'm', label: 'm (x exponent)', min: 1, max: 4, step: 1 },
                { name: 'b', label: 'b (y coeff)', min: 0.1, max: 3, step: 0.1 },
                { name: 'n', label: 'n (y exponent)', min: 1, max: 4, step: 1 },
                { name: 'direction', label: '↑ Bowl Up', type: 'toggle', showToggleLabel: false }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Bowl Centre">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xc', label: 'xc (bowl centre x)', min: -3, max: 3, step: 0.1 },
                { name: 'yc', label: 'yc (bowl centre y)', min: -3, max: 3, step: 0.1 },
                { name: 'c', label: 'c (z-offset)', min: -5, max: 5, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Evaluation Point">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: 0.1, max: 3.8, step: 0.1 },
                { name: 'y0', label: 'y₀', min: 0.1, max: 3.8, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'xRange', label: 'X Range', type: 'range', min: -6, max: 6, step: 0.5, default: [0, 4] },
                { name: 'yRange', label: 'Y Range', type: 'range', min: -6, max: 6, step: 0.5, default: [0, 4] }
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
            title={`z = ${dirLabel}·(${term(a, 'x', xc, m)} + ${term(b, 'y', yc, n)}) + ${fmt(c)}`}
            showExportButton={false}
            height="750px"
            scene={scene}
            plotStyle={params.plotStyle}
            legendPosition={params.legendPosition}
            crossSection={{
              x0, y0,
              fn,
              range: crossRange,
              colorX: palette.surface.crossSection.fx,
              colorY: palette.surface.crossSection.fy
            }}
          >
            <ParameterSection title="Evaluation Point" style={{ margin: 0, border: 'none', background: 'transparent', padding: 0 }}>
              <ParameterControls
                parameters={params}
                onChange={setParams}
                config={[
                  { name: 'x0', label: 'x₀', min: 0.1, max: 3.8, step: 0.1 },
                  { name: 'y0', label: 'y₀', min: 0.1, max: 3.8, step: 0.1 }
                ]}
              />
            </ParameterSection>
          </Plotter3D>
          <Note>
            Drag to rotate · Scroll to zoom ·
            <span style={{ color: palette.surface.crossSection.fx }}> ●</span> ∂z/∂x tangent ·
            <span style={{ color: palette.surface.crossSection.fy }}> ●</span> ∂z/∂y tangent ·
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

// UI Pattern: MultiSectionPlot — 3D surface above, 2D contour below
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import styled from 'styled-components';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette, getPlotLayout } from '../../../../../constants/plotThemeConfig';
import { legendPositionConfig } from '../../../../../constants/gradientConfig';
import Plotter3D from '../../../../../components/visualization/Plotter3D';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../../components/common/LayoutStyled';

const ContourWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: 8px;
  margin-top: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const DualPlotRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const PlotHalf = styled.div`
  flex: 1;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

/**
 * GaussianBellPoints — 2D Gaussian bell with adjustable points O, Q
 *
 * z = f(x,y) = (1/2π)·exp(−½(x²+y²))
 * O is on the surface; Q is lower on the surface.
 * The QXY plane (z = z_Q) is shown. P is the foot of the perpendicular
 * from O onto the QXY plane. deltaX, deltaY, φ connect P and Q.
 */
const DirectionalDerivative = () => {
  const [params, setParams] = useState({
    x1: 0.3,
    y1: 0.3,
    x2: 1.0,
    y2: 1.8,
    xRange: [-3, 3],
    yRange: [-3, 3],
    resolution: 80,
    aspectRatio: '1:1',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const contourRef = useRef(null);
  const hasInitContour = useRef(false);
  const tangentRef = useRef(null);
  const hasInitTangent = useRef(false);
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const plotLayout = getPlotLayout(themeMode);

  const { x1, y1, x2, y2, xRange, yRange } = params;
  const res = params.resolution;

  // ── Gaussian bell curve ─────────────────────────────────
  const fn = (x, y) => (1 / (2 * Math.PI)) * Math.exp(-0.5 * (x * x + y * y));
  const zO = fn(x1, y1);
  const zQ = fn(x2, y2);
  const zP = zQ;  // P is on the QXY plane (z = z_Q)

  // P = foot of perpendicular from O to QXY plane
  const xP = x1, yP = y1;

  const deltaX = xP - x2;
  const deltaY = yP - y2;
  const rho = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const thetaRad = Math.atan2(y2 - y1, x2 - x1);

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
      colorscale: [
        [0, '#0c2d4d'],
        [0.2, '#1b5e8a'],
        [0.4, '#2d8bbd'],
        [0.6, '#5ec0c0'],
        [0.8, '#d4b84c'],
        [1, '#e86e3a']
      ],
      opacity: 0.5,
      showscale: true,
      name: 'Gaussian Bell',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.4f}<extra></extra>'
    };
  }, [res, xRange, yRange, palette]);

  // ── Helper: trace generator ─────────────────────────────
  const line3 = (pts, color, dash) => ({
    type: 'scatter3d', mode: 'lines',
    x: pts.map(p => p[0]),
    y: pts.map(p => p[1]),
    z: pts.map(p => p[2]),
    line: { color, dash: dash || 'solid' },
    showlegend: false, hoverinfo: 'none'
  });

  // ── Overlay traces (3D) ─────────────────────────────────
  const overlay3D = useMemo(() => {
    const traces = [];

    // ── Point O on surface ────────────────────────────────
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x1], y: [y1], z: [zO],
      marker: { color: palette.mainTraces.primary, size: 12, symbol: 'circle', line: { color: '#fff', width: 2 } },
      name: 'O',
      showlegend: true
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x1], y: [y1], z: [zO],
      text: ['O'], textfont: { color: palette.mainTraces.primary, size: 18, weight: 800 },
      textposition: 'top right', showlegend: false, hoverinfo: 'none'
    });

    // ── Point Q on surface ────────────────────────────────
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x2], y: [y2], z: [zQ],
      marker: { color: palette.auxTraces.tangent, size: 12, symbol: 'circle', line: { color: '#fff', width: 2 } },
      name: 'Q',
      showlegend: true
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x2], y: [y2], z: [zQ],
      text: ['Q'], textfont: { color: palette.auxTraces.tangent, size: 18, weight: 800 },
      textposition: 'top right', showlegend: false, hoverinfo: 'none'
    });

    // ── Point P on QXY plane ──────────────────────────────
    const pColor = palette.auxTraces.derivative;
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [xP], y: [yP], z: [zP],
      marker: { color: pColor, size: 10, symbol: 'diamond', line: { color: '#fff', width: 1.5 } },
      name: 'P (foot)',
      showlegend: true
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [xP], y: [yP], z: [zP],
      text: ['P'], textfont: { color: pColor, size: 18, weight: 800 },
      textposition: 'bottom right', showlegend: false, hoverinfo: 'none'
    });

    // ── Δz: Vertical dashed line O → P (perpendicular) ──
    traces.push(line3(
      [[x1, y1, zO], [xP, yP, zP]],
      palette.mainTraces.primary, 'dash'
    ));
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x1], y: [y1], z: [(zO + zP) / 2],
      text: ['Δz'], textfont: { color: palette.mainTraces.primary, size: 14, weight: 800 },
      textposition: 'middle right', showlegend: false, hoverinfo: 'none'
    });

    // ── deltaX: dashed line from P to (x2, yP, zP) ────────
    const dxColor = palette.auxTraces.combined;
    traces.push(line3(
      [[xP, yP, zP], [x2, yP, zP]],
      dxColor, 'dash'
    ));
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [(xP + x2) / 2], y: [yP], z: [zP],
      text: ['Δx'], textfont: { color: dxColor, size: 14, weight: 800 },
      textposition: 'bottom center', showlegend: false, hoverinfo: 'none'
    });

    // ── deltaY: dashed line from (x2, yP, zP) to Q ────────
    traces.push(line3(
      [[x2, yP, zP], [x2, y2, zP]],
      dxColor, 'dash'
    ));
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x2], y: [(yP + y2) / 2], z: [zP],
      text: ['Δy'], textfont: { color: dxColor, size: 14, weight: 800 },
      textposition: 'middle right', showlegend: false, hoverinfo: 'none'
    });

    // ── ρ = distance PQ (diagonal dashed line) ────────────
    const rhoColor = palette.mainTraces.secondary;
    traces.push(line3(
      [[xP, yP, zP], [x2, y2, zP]],
      rhoColor, 'dash'
    ));
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [(xP + x2) / 2], y: [(yP + y2) / 2], z: [zP],
      text: ['ρ'], textfont: { color: rhoColor, size: 16, weight: 800 },
      textposition: 'middle right', showlegend: false, hoverinfo: 'none'
    });

    // ── Direction line L: O → Q ──────────────────────────
    const lColor = palette.mainTraces.secondary;
    traces.push({
      type: 'scatter3d', mode: 'lines',
      x: [x1, x2], y: [y1, y2], z: [zO, zQ],
      line: { color: lColor, width: 3 },
      name: 'L',
      showlegend: true
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [(x1 + x2) / 2], y: [(y1 + y2) / 2], z: [(zO + zQ) / 2],
      text: ['L'], textfont: { color: lColor, size: 16, weight: 800 },
      textposition: 'top right', showlegend: false, hoverinfo: 'none'
    });

    return traces;
  }, [
    x1, y1, zO, x2, y2, zQ, xP, yP, zP,
    deltaX, deltaY, rho, xRange, yRange, palette
  ]);

  const all3DData = useMemo(() => [surfaceData, ...overlay3D], [surfaceData, overlay3D]);

  // ── 3D Scene ────────────────────────────────────────────
  const zMax3D = 1 / (2 * Math.PI);
  const scene = useMemo(() => {
    const xSpan = xRange[1] - xRange[0];
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

    const pColor = palette.auxTraces.derivative;
    const dxColor = palette.auxTraces.combined;
    const rhoColor = palette.mainTraces.secondary;

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
      // O marker
      { type: 'scatter', mode: 'markers', x: [x1], y: [y1],
        marker: { color: palette.mainTraces.primary, size: 14, symbol: 'circle', line: { color: '#fff', width: 2 } },
        name: 'O', showlegend: true },
      // Q marker
      { type: 'scatter', mode: 'markers', x: [x2], y: [y2],
        marker: { color: palette.auxTraces.tangent, size: 14, symbol: 'circle', line: { color: '#fff', width: 2 } },
        name: 'Q', showlegend: true },
      // P marker
      { type: 'scatter', mode: 'markers', x: [xP], y: [yP],
        marker: { color: pColor, size: 10, symbol: 'diamond', line: { color: '#fff', width: 1.5 } },
        name: 'P (foot)', showlegend: true },
      // deltaX
      { type: 'scatter', mode: 'lines', x: [xP, x2], y: [yP, yP],
        line: { color: dxColor, width: 2, dash: 'dash' }, showlegend: false, hoverinfo: 'none' },
      // deltaY
      { type: 'scatter', mode: 'lines', x: [x2, x2], y: [yP, y2],
        line: { color: dxColor, width: 2, dash: 'dash' }, showlegend: false, hoverinfo: 'none' },
      // ρ
      { type: 'scatter', mode: 'lines', x: [xP, x2], y: [yP, y2],
        line: { color: rhoColor, width: 2.5, dash: 'dash' }, showlegend: false, hoverinfo: 'none' },
      // L direction line O → Q
      { type: 'scatter', mode: 'lines',
        x: [x1, x2], y: [y1, y2],
        line: { color: palette.mainTraces.secondary, width: 2.5 },
        name: 'L', showlegend: true }
    ];

    // ── Angle θ arc at P ──────────────────────────────
    const arcR = Math.min(xRange[1] - xRange[0], yRange[1] - yRange[0]) * 0.04;
    const nArc = 20;
    const arcPts = Array.from({ length: nArc + 1 }, (_, i) => {
      const a = (thetaRad * i) / nArc;
      return { x: x1 + arcR * Math.cos(a), y: y1 + arcR * Math.sin(a) };
    });
    d.push({
      type: 'scatter', mode: 'lines',
      x: arcPts.map(p => p.x),
      y: arcPts.map(p => p.y),
      line: { color: palette.mainTraces.secondary, width: 2 },
      showlegend: false, hoverinfo: 'none'
    });
    const thetaMid = thetaRad / 2;
    d.push({
      type: 'scatter', mode: 'text',
      x: [x1 + arcR * 0.7 * Math.cos(thetaMid)],
      y: [y1 + arcR * 0.7 * Math.sin(thetaMid)],
      text: ['θ'],
      textfont: { color: palette.mainTraces.secondary, size: 12, weight: 700 },
      textposition: 'middle center',
      showlegend: false, hoverinfo: 'none'
    });

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
  }, [res, xRange, yRange, x1, y1, x2, y2, xP, yP, thetaRad, params.legendPosition, plotLayout, palette]);

  // ── Tangent 3D visualization (∂f/∂x, ∂f/∂y, tangent plane) ──
  const dzDx = -x1 * zO;
  const dzDy = -y1 * zO;
  const tLen = 0.8;

  const tangentPlotData = useMemo(() => {
    const tSize = 0.7;
    const tRes = 25;
    const tStep = 2 * tSize / tRes;
    const txVals = Array.from({ length: tRes + 1 }, (_, i) => x1 - tSize + i * tStep);
    const tyVals = Array.from({ length: tRes + 1 }, (_, i) => y1 - tSize + i * tStep);

    const surfZVals = tyVals.map(ty => txVals.map(tx => fn(tx, ty)));
    const planeZVals = tyVals.map(ty => txVals.map(tx => zO + dzDx * (tx - x1) + dzDy * (ty - y1)));

    const traces = [];

    // Gaussian surface patch (semi-transparent)
    traces.push({
      type: 'surface',
      x: txVals, y: tyVals, z: surfZVals,
      colorscale: [
        [0, '#0c2d4d'], [0.2, '#1b5e8a'], [0.4, '#2d8bbd'],
        [0.6, '#5ec0c0'], [0.8, '#d4b84c'], [1, '#e86e3a']
      ],
      opacity: 0.35, showscale: false,
      name: 'Surface (patch)',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.4f}<extra></extra>'
    });

    // Point O
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x1], y: [y1], z: [zO],
      marker: { color: palette.mainTraces.primary, size: 12, symbol: 'circle', line: { color: '#fff', width: 2 } },
      name: 'O', showlegend: true
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x1], y: [y1], z: [zO],
      text: ['O'], textfont: { color: palette.mainTraces.primary, size: 18, weight: 800 },
      textposition: 'top right', showlegend: false, hoverinfo: 'none'
    });

    // X tangent line at O (∂f/∂x direction)
    traces.push({
      type: 'scatter3d', mode: 'lines',
      x: [x1 - tLen, x1 + tLen], y: [y1, y1],
      z: [zO - tLen * dzDx, zO + tLen * dzDx],
      line: { color: palette.mainTraces.primary, width: 3.5 },
      name: '∂f/∂x', showlegend: true
    });

    // Y tangent line at O (∂f/∂y direction)
    traces.push({
      type: 'scatter3d', mode: 'lines',
      x: [x1, x1], y: [y1 - tLen, y1 + tLen],
      z: [zO - tLen * dzDy, zO + tLen * dzDy],
      line: { color: palette.auxTraces.tangent, width: 3.5 },
      name: '∂f/∂y', showlegend: true
    });

    // Tangent plane (semi-transparent)
    traces.push({
      type: 'surface',
      x: txVals, y: tyVals, z: planeZVals,
      opacity: 0.25,
      colorscale: [[0, '#facc15'], [1, '#facc15']],
      showscale: false,
      name: 'Tangent Plane',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.4f}<extra></extra>'
    });

    return traces;
  }, [x1, y1, zO, dzDx, dzDy, tLen, palette]);

  const tangentPlotLayout = useMemo(() => {
    const zMin = Math.min(zO - tLen * Math.abs(dzDx), zO - tLen * Math.abs(dzDy), 0);
    const zMax = Math.max(zO + tLen * Math.abs(dzDx), zO + tLen * Math.abs(dzDy), zO + 0.02);

    return {
      scene: {
        xaxis: {
          title: 'x', range: [x1 - 1.2, x1 + 1.2],
          gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
          tickfont: { color: plotLayout.tickFontColor, size: 10 },
          titlefont: { color: plotLayout.axisLabelColor, size: 11 },
          showspikes: false
        },
        yaxis: {
          title: 'y', range: [y1 - 1.2, y1 + 1.2],
          gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
          tickfont: { color: plotLayout.tickFontColor, size: 10 },
          titlefont: { color: plotLayout.axisLabelColor, size: 11 },
          showspikes: false
        },
        zaxis: {
          title: 'z', range: [zMin - 0.02, zMax + 0.02],
          gridcolor: plotLayout.gridcolor, zerolinecolor: plotLayout.zerolinecolor,
          tickfont: { color: plotLayout.tickFontColor, size: 10 },
          titlefont: { color: plotLayout.axisLabelColor, size: 11 },
          showspikes: false
        },
        camera: {
          eye: { x: 2.0, y: -2.0, z: 1.0 },
          center: { x: 0, y: 0, z: 0 },
          up: { x: 0, y: 0, z: 1 }
        },
        aspectmode: 'manual',
        aspectratio: { x: 1, y: 1, z: 0.6 }
      },
      title: { text: 'Tangent Lines & Plane', font: { color: plotLayout.titleFontColor, size: 14 } },
      paper_bgcolor: plotLayout.paper_bgcolor,
      margin: { l: 0, r: 0, t: 40, b: 0 },
      showlegend: true,
      legend: {
        font: { color: plotLayout.legend.fontColor, size: 10 },
        bgcolor: plotLayout.legend.bgcolor,
        bordercolor: plotLayout.legend.bordercolor,
        borderwidth: 1,
        orientation: 'h',
        y: 1.12,
        x: 0.5,
        xanchor: 'center',
        yanchor: 'bottom'
      }
    };
  }, [x1, y1, zO, dzDx, dzDy, tLen, plotLayout]);

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

  // ── Render tangent 3D plot ───────────────────────────────
  useEffect(() => {
    if (!tangentRef.current) return;
    const gd = tangentRef.current;
    if (!hasInitTangent.current) {
      Plotly.newPlot(gd, tangentPlotData, tangentPlotLayout, config).then(() => { hasInitTangent.current = true; });
    } else {
      Plotly.react(gd, tangentPlotData, tangentPlotLayout, config);
    }
    return () => { if (tangentRef.current) Plotly.purge(tangentRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tangentPlotData, tangentPlotLayout]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/gradient">
          ← Back to Gradient
        </BackButton>
        <SectionTitleH1>Directional Derivative</SectionTitleH1>
      </Header>

      <SectionDescription>
        The <strong>directional derivative</strong> D<sub>L</sub>f measures the rate of change
        of a multi-variable function along an <em>arbitrary direction</em> L, not just along the
        coordinate axes. It generalises partial derivatives: D<sub>L</sub>f = ∇f · u, where
        u is the unit vector in direction L.<br/><br/>
        The surface is the 2D Gaussian bell <strong>z = (1/2π)·e<sup>−½(x²+y²)</sup></strong>.
        <strong>O</strong> and <strong>Q</strong> are two adjustable points on the surface.
        The <strong>QXY plane</strong> is the horizontal plane at z = z<sub>Q</sub>.
        <strong>P</strong> is the foot of the perpendicular from O onto the QXY plane.
        The line <strong>L</strong> (O→Q) defines the direction. The arc marks the angle θ
        between L and the x-axis. Dashed lines show Δx, Δy, Δz, and ρ.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Directional Derivative:</FormulaTitle>
        <Formula>
          f(x, y) = (1 / 2π)·e<sup>−½(x²+y²)</sup><br/><br/>
          O = ({x1.toFixed(2)}, {y1.toFixed(2)}, {zO.toFixed(4)})<br/>
          Q = ({x2.toFixed(2)}, {y2.toFixed(2)}, {zQ.toFixed(4)})<br/>
          P = ({xP.toFixed(2)}, {yP.toFixed(2)}, {zP.toFixed(4)})<br/><br/>
          Direction L: &nbsp; θ = {(thetaRad * 180 / Math.PI).toFixed(1)}°<br/>
          Δx = {deltaX.toFixed(3)} &nbsp; Δy = {deltaY.toFixed(3)} &nbsp; Δz = {(zO - zQ).toFixed(4)}<br/>
          ρ = √(Δx² + Δy²) = <strong>{rho.toFixed(4)}</strong><br/>
          Slope along L ≈ Δz / ρ = <strong>{((zO - zQ) / rho).toFixed(4)}</strong>
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Point O">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x1', label: 'x\u1D40', min: -2.8, max: 2.8, step: 0.1 },
                { name: 'y1', label: 'y\u1D40', min: -2.8, max: 2.8, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Point Q">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x2', label: 'x\u2092', min: -2.8, max: 2.8, step: 0.1 },
                { name: 'y2', label: 'y\u2092', min: -2.8, max: 2.8, step: 0.1 }
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
          <div style={{ width: '100%', aspectRatio: '4 / 3' }}>
            <Plotter3D
              data={all3DData}
              title="Gaussian Bell — 3D Surface"
              showExportButton={false}
              height="100%"
              scene={scene}
              plotStyle={params.plotStyle}
              legendPosition={params.legendPosition}
            />
          </div>
        </PlotPanel>
      </ContentLayout>

      <DualPlotRow>
        <PlotHalf>
          <div ref={contourRef} style={{ width: '100%', height: '100%', aspectRatio: '4/3' }} />
        </PlotHalf>
        <PlotHalf>
          <div ref={tangentRef} style={{ width: '100%', height: '100%', aspectRatio: '4/3' }} />
        </PlotHalf>
      </DualPlotRow>
    </PageContainer>
  );
};

export default DirectionalDerivative;

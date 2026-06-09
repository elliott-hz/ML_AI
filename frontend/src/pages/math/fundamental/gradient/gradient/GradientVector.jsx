// UI Pattern: MultiSectionPlot — 3D surface + 2D contour + numerical panel
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly.min.js';
import styled from 'styled-components';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette, getPlotLayout } from '../../../constants/plotThemeConfig';
import { legendPositionConfig } from '../../../constants/gradientConfig';
import Plotter3D from '../../../components/visualization/Plotter3D';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../components/common/LayoutStyled';

const DualPlotRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  width: 100%;
  margin-top: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const PlotHalf = styled.div`
  flex: 1;
  min-width: 0;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ValuesPanel = styled.div`
  flex: 1;
  min-width: 0;
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ValuesTitle = styled.h3`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  &:last-child { border-bottom: none; }
`;

const ValueLabel = styled.span`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  font-weight: 500;
`;

const ValueNumber = styled.span`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 14px;
  font-weight: 600;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
`;

const HighlightFormula = styled.div`
  background: ${({ theme }) => theme?.colors?.inputBg || '#334155'};
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#475569'};
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 15px;
  font-weight: 600;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  line-height: 1.6;
`;

const ColorDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
  background: ${({ $color }) => $color || '#6366f1'};
`;

const ArrowScaleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
`;

const ArrowScaleLabel = styled.span`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 12px;
`;

const ArrowScaleInput = styled.input`
  flex: 1;
  accent-color: #6366f1;
`;

const Note = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  font-style: italic;
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

// ── Arrowhead helpers ────────────────────────────────────
const arrowHeadPoints = (x0, y0, x1, y1, headSize = 0.15) => {
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const lx = x1 - headSize * Math.cos(angle - Math.PI / 6);
  const ly = y1 - headSize * Math.sin(angle - Math.PI / 6);
  const rx = x1 - headSize * Math.cos(angle + Math.PI / 6);
  const ry = y1 - headSize * Math.sin(angle + Math.PI / 6);
  return [lx, ly, rx, ry];
};
// 3D arrowhead — computes two wing points (lx,ly,lz) and (rx,ry,rz) from tip (x1,y1,z1)
// back toward shaft start (x0,y0,z0), splayed ±30° in the horizontal projection plane
const arrowHead3D = (x0, y0, z0, x1, y1, z1, headSize = 0.12) => {
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  const len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
  const lx = x1 - headSize * Math.cos(angle - Math.PI / 6);
  const ly = y1 - headSize * Math.sin(angle - Math.PI / 6);
  const rx = x1 - headSize * Math.cos(angle + Math.PI / 6);
  const ry = y1 - headSize * Math.sin(angle + Math.PI / 6);
  const t = headSize / len;
  const lz = z1 - t * dz;
  const rz = z1 - t * dz;
  return [lx, ly, lz, rx, ry, rz];
};

/**
 * GradientVector — Gradient Vector & Directional Derivative Relationship
 *
 * f(x,y) = (1/2π)·exp(−½(x²+y²))
 *
 * Core formula:
 *   ∂f/∂l = ∇f · e⃗ = (∂f/∂x, ∂f/∂y) · (cosθ, sinθ) = |∇f|·cosρ
 *
 * Shows:
 *   • Gradient vector ∇f at point O (direction & magnitude)
 *   • Direction unit vector e⃗ at angle θ
 *   • Angle ρ between ∇f and e⃗
 *   • Dot product relationship in both 3D surface and 2D contour views
 */
const GradientVector = () => {
  const [params, setParams] = useState({
    x0: 0.6,
    y0: 0.8,
    theta: 30,
    arrowScale: 0.4,
    xRange: [-3, 3],
    yRange: [-3, 3],
    resolution: 80,
    aspectRatio: '1:1',
    legendPosition: 'top-right',
    plotStyle: 'medium'
  });

  const contourRef = useRef(null);
  const hasInitContour = useRef(false);
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const plotLayout = getPlotLayout(themeMode);

  const { x0, y0, theta, arrowScale, xRange, yRange } = params;
  const res = params.resolution;

  // ── Gaussian bell ───────────────────────────────────────
  const fn = (x, y) => (1 / (2 * Math.PI)) * Math.exp(-0.5 * (x * x + y * y));
  const zO = fn(x0, y0);
  const zMax3D = 1 / (2 * Math.PI);

  // ── Gradient at O ───────────────────────────────────────
  const gradX = -x0 * zO;
  const gradY = -y0 * zO;
  const gradMag = Math.sqrt(gradX * gradX + gradY * gradY);
  const gradAngle = Math.atan2(gradY, gradX); // rad

  // ── Direction vector e⃗ at angle θ ──────────────────────
  const thetaRad = (theta * Math.PI) / 180;
  const eX = Math.cos(thetaRad);
  const eY = Math.sin(thetaRad);

  // ── Directional derivative & ρ (angle between ∇f and e⃗) ─
  const dirDeriv = gradX * eX + gradY * eY;
  const cosRho = gradMag > 0 ? dirDeriv / gradMag : 0;
  const rhoRad = gradMag > 0 ? Math.acos(Math.max(-1, Math.min(1, cosRho))) : 0;
  const rhoDeg = (rhoRad * 180) / Math.PI;

  // ── Arrow end points (scaled) ──────────────────────────
  const scale = arrowScale;
  const gEndX = x0 + (gradMag > 0 ? (gradX / gradMag) * scale : 0);
  const gEndY = y0 + (gradMag > 0 ? (gradY / gradMag) * scale : 0);
  const dEndX = x0 + eX * scale;
  const dEndY = y0 + eY * scale;

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
      opacity: 0.5,
      contours: {
        x: { show: true, color: palette.surface.contour, width: 0.5 },
        y: { show: true, color: palette.surface.contour, width: 0.5 },
        z: { show: true, color: palette.surface.contour, width: 0.5 }
      },
      showscale: false,
      name: 'Gaussian Bell',
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.4f}<extra></extra>'
    };
  }, [res, xRange, yRange, palette]);

  // ── 3D Overlay traces ───────────────────────────────────
  const overlay3D = useMemo(() => {
    const traces = [];

    // Edge case: gradMag = 0 at origin
    const hasGradient = gradMag > 1e-10;

    // Helper: 3D line
    const line3 = (pts, color, width = 3, dash = 'solid') => ({
      type: 'scatter3d', mode: 'lines',
      x: pts.map(p => p[0]),
      y: pts.map(p => p[1]),
      z: pts.map(p => p[2]),
      line: { color, width, dash },
      showlegend: false, hoverinfo: 'none'
    });

    // ── Point O ───────────────────────────────────────────
    traces.push({
      type: 'scatter3d', mode: 'markers',
      x: [x0], y: [y0], z: [zO],
      marker: {
        color: palette.markers.evalX0,
        size: 12, symbol: 'circle',
        line: { color: '#fff', width: 2 }
      },
      name: 'O',
      showlegend: true
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x0], y: [y0], z: [zO],
      text: ['O'],
      textfont: { color: palette.markers.evalX0, size: 18, weight: 800 },
      textposition: 'top right',
      showlegend: false, hoverinfo: 'none'
    });

    // ── Gradient arrow (in tangent plane at O, steepest ascent) ──
    if (hasGradient) {
      const gColor = palette.mainTraces.primary;
      // 3D direction in tangent plane: (gradX/|∇f|, gradY/|∇f|, |∇f|)
      // Steepest ascent: dz/ds = |∇f| when moving in gradient direction
      const g3Dz = zO + scale * gradMag;
      const gTip = [gEndX, gEndY, g3Dz];
      // Shaft
      traces.push(line3(
        [[x0, y0, zO], gTip],
        gColor, 4
      ));
      // Arrowhead (two line segments)
      const [gAhLx, gAhLy, gAhLz, gAhRx, gAhRy, gAhRz] = arrowHead3D(x0, y0, zO, gEndX, gEndY, g3Dz);
      traces.push({
        type: 'scatter3d', mode: 'lines',
        x: [gEndX, gAhLx, gEndX, gAhRx], y: [gEndY, gAhLy, gEndY, gAhRy], z: [g3Dz, gAhLz, g3Dz, gAhRz],
        line: { color: gColor, width: 4 },
        showlegend: false, hoverinfo: 'none'
      });
      // Label
      traces.push({
        type: 'scatter3d', mode: 'text',
        x: [gEndX], y: [gEndY], z: [g3Dz],
        text: ['∇f'],
        textfont: { color: gColor, size: 17, weight: 800 },
        textposition: 'top right',
        showlegend: false, hoverinfo: 'none'
      });

      // ── Perpendicular to ∇f (contour tangent in tangent plane) ──
      const perpLen = scale * 1.2;
      const uPerpX = -gradY / gradMag, uPerpY = gradX / gradMag;
      traces.push(line3(
        [[x0 - perpLen * uPerpX, y0 - perpLen * uPerpY, zO],
         [x0 + perpLen * uPerpX, y0 + perpLen * uPerpY, zO]],
        palette.auxTraces.combined, 3, 'dash'
      ));
      traces.push({
        type: 'scatter3d', mode: 'text',
        x: [(x0 + perpLen * uPerpX * 1.5)], y: [(y0 + perpLen * uPerpY * 1.5)], z: [zO],
        text: ['⟂'],
        textfont: { color: palette.auxTraces.combined, size: 16, weight: 800 },
        textposition: 'middle right',
        showlegend: false, hoverinfo: 'none'
      });
    }

    // ── Direction arrow →e (in tangent plane) ─────────────
    // 3D direction: (cosθ, sinθ, ∇f·e⃗), dz/ds = directional derivative
    const dColor = palette.auxTraces.tangent;
    const d3Dz = zO + scale * dirDeriv;
    const dTip = [dEndX, dEndY, d3Dz];
    traces.push(line3(
      [[x0, y0, zO], dTip],
      dColor, 4
    ));
    // Arrowhead (two line segments)
    const [dAhLx, dAhLy, dAhLz, dAhRx, dAhRy, dAhRz] = arrowHead3D(x0, y0, zO, dEndX, dEndY, d3Dz);
    traces.push({
      type: 'scatter3d', mode: 'lines',
      x: [dEndX, dAhLx, dEndX, dAhRx], y: [dEndY, dAhLy, dEndY, dAhRy], z: [d3Dz, dAhLz, d3Dz, dAhRz],
      line: { color: dColor, width: 4 },
      showlegend: false, hoverinfo: 'none'
    });
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [dEndX], y: [dEndY], z: [d3Dz],
      text: ['\u2192e'],
      textfont: { color: dColor, size: 17, weight: 800 },
      textposition: 'top right',
      showlegend: false, hoverinfo: 'none'
    });

    // ── Vertical guide from O to xy-plane ─────────────────
    traces.push(line3(
      [[x0, y0, zO], [x0, y0, 0]],
      palette.text.muted, 1, 'dot'
    ));

    // ── Partial derivative tangent lines at O ────────────────
    const tanLen = scale * 1.5;
    // ∂f/∂x tangent: along x-direction, z slope = gradX
    traces.push(line3(
      [[x0 - tanLen, y0, zO - tanLen * gradX],
       [x0 + tanLen, y0, zO + tanLen * gradX]],
      palette.surface.crossSection.fx, 3, 'dash'
    ));
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x0 + tanLen], y: [y0], z: [zO + tanLen * gradX],
      text: ['∂z/∂x'],
      textfont: { color: palette.surface.crossSection.fx, size: 14, weight: 800 },
      textposition: 'top right',
      showlegend: false, hoverinfo: 'none'
    });

    // ∂f/∂y tangent: along y-direction, z slope = gradY
    traces.push(line3(
      [[x0, y0 - tanLen, zO - tanLen * gradY],
       [x0, y0 + tanLen, zO + tanLen * gradY]],
      palette.surface.crossSection.fy, 3, 'dash'
    ));
    traces.push({
      type: 'scatter3d', mode: 'text',
      x: [x0], y: [y0 + tanLen], z: [zO + tanLen * gradY],
      text: ['∂z/∂y'],
      textfont: { color: palette.surface.crossSection.fy, size: 14, weight: 800 },
      textposition: 'top right',
      showlegend: false, hoverinfo: 'none'
    });

    return traces;
  }, [x0, y0, zO, gradX, gradY, gradMag, gEndX, gEndY, dEndX, dEndY, eX, eY, dirDeriv, scale, xRange, yRange, palette]);

  const all3DData = useMemo(() => [surfaceData, ...overlay3D], [surfaceData, overlay3D]);

  // ── 3D Scene ────────────────────────────────────────────
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

    const hasGradient = gradMag > 1e-10;
    const d = [];

    // ── Contour heatmap ───────────────────────────────────
    d.push({
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
      opacity: 0.8,
      showscale: false,
      hoverinfo: 'none'
    });

    // ── Point O ───────────────────────────────────────────
    d.push({
      type: 'scatter', mode: 'markers',
      x: [x0], y: [y0],
      marker: {
        color: palette.markers.evalX0, size: 14, symbol: 'circle',
        line: { color: '#fff', width: 2 }
      },
      name: 'O', showlegend: true
    });

    // ── Gradient arrow (with arrowhead) ───────────────────
    if (hasGradient) {
      const gColor = palette.mainTraces.primary;
      // Shaft
      d.push({
        type: 'scatter', mode: 'lines',
        x: [x0, gEndX], y: [y0, gEndY],
        line: { color: gColor, width: 3.5 },
        showlegend: false, hoverinfo: 'none'
      });
      // Arrowhead
      const [ahLx, ahLy, ahRx, ahRy] = arrowHeadPoints(x0, y0, gEndX, gEndY, 0.12);
      d.push({
        type: 'scatter', mode: 'lines',
        x: [gEndX, ahLx, gEndX, ahRx], y: [gEndY, ahLy, gEndY, ahRy],
        line: { color: gColor, width: 3.5 },
        showlegend: false, hoverinfo: 'none'
      });
      // Label — offset along arrow direction
      const gAngle = Math.atan2(gEndY - y0, gEndX - x0);
      const gLabelOff = 0.25;
      d.push({
        type: 'scatter', mode: 'text',
        x: [gEndX + gLabelOff * Math.cos(gAngle)],
        y: [gEndY + gLabelOff * Math.sin(gAngle)],
        text: ['∇f'],
        textfont: { color: gColor, size: 16, weight: 800 },
        textposition: 'middle center',
        showlegend: false, hoverinfo: 'none'
      });
    }

    // ── Direction arrow e⃗ (with arrowhead) ───────────────
    const dColor = palette.auxTraces.tangent;
    d.push({
      type: 'scatter', mode: 'lines',
      x: [x0, dEndX], y: [y0, dEndY],
      line: { color: dColor, width: 3.5 },
      showlegend: false, hoverinfo: 'none'
    });
    const [dAhLx, dAhLy, dAhRx, dAhRy] = arrowHeadPoints(x0, y0, dEndX, dEndY, 0.12);
    d.push({
      type: 'scatter', mode: 'lines',
      x: [dEndX, dAhLx, dEndX, dAhRx], y: [dEndY, dAhLy, dEndY, dAhRy],
      line: { color: dColor, width: 3.5 },
      showlegend: false, hoverinfo: 'none'
    });
    // Label — offset along arrow direction
    const dAngle = Math.atan2(dEndY - y0, dEndX - x0);
    const dLabelOff = 0.25;
    d.push({
      type: 'scatter', mode: 'text',
      x: [dEndX + dLabelOff * Math.cos(dAngle)],
      y: [dEndY + dLabelOff * Math.sin(dAngle)],
      text: ['\u2192e'],
      textfont: { color: dColor, size: 16, weight: 800 },
      textposition: 'middle center',
      showlegend: false, hoverinfo: 'none'
    });

    // ── Contour tangent line (⟂ ∇f) through O ──────────────
    if (hasGradient) {
      const perpLen = 0.5;
      const perpX = -gradY, perpY = gradX;
      const perpMag = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
      const ux = perpX / perpMag, uy = perpY / perpMag;
      d.push({
        type: 'scatter', mode: 'lines',
        x: [x0 - perpLen * ux, x0 + perpLen * ux],
        y: [y0 - perpLen * uy, y0 + perpLen * uy],
        line: { color: palette.auxTraces.combined, width: 2, dash: 'dash' },
        name: '⟂ ∇f (contour tangent)',
        showlegend: true,
        hoverinfo: 'none'
      });
    }

    // ── θ arc (from x-axis to direction e⃗) ───────────────
    const arcR = Math.min(xRange[1] - xRange[0], yRange[1] - yRange[0]) * 0.06;
    const nArc = 25;
    const thetaArcPts = Array.from({ length: nArc + 1 }, (_, i) => {
      const a = (thetaRad * i) / nArc;
      return { x: x0 + arcR * Math.cos(a), y: y0 + arcR * Math.sin(a) };
    });
    d.push({
      type: 'scatter', mode: 'lines',
      x: thetaArcPts.map(p => p.x),
      y: thetaArcPts.map(p => p.y),
      line: { color: palette.text.annotation, width: 2 },
      showlegend: false, hoverinfo: 'none'
    });
    const thetaMid = thetaRad / 2;
    d.push({
      type: 'scatter', mode: 'text',
      x: [x0 + arcR * 0.7 * Math.cos(thetaMid)],
      y: [y0 + arcR * 0.7 * Math.sin(thetaMid)],
      text: ['θ'],
      textfont: { color: palette.text.annotation, size: 13, weight: 700 },
      textposition: 'middle center',
      showlegend: false, hoverinfo: 'none'
    });

    // ── ρ arc (from gradient to direction) ────────────────
    if (hasGradient && rhoRad > 0.01) {
      const rhoArcR = arcR * 1.3;
      const nRhoArc = 25;
      const rhoStart = gradAngle;
      const rhoEnd = thetaRad;

      // Normalise arcs to go the shorter way
      let startAngle = rhoStart;
      let endAngle = rhoEnd;
      let delta = endAngle - startAngle;
      // Keep delta in (-π, π)
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;

      const rhoArcPts = Array.from({ length: nRhoArc + 1 }, (_, i) => {
        const a = startAngle + delta * (i / nRhoArc);
        return { x: x0 + rhoArcR * Math.cos(a), y: y0 + rhoArcR * Math.sin(a) };
      });
      const rhoColor = palette.auxTraces.combined;
      d.push({
        type: 'scatter', mode: 'lines',
        x: rhoArcPts.map(p => p.x),
        y: rhoArcPts.map(p => p.y),
        line: { color: rhoColor, width: 2 },
        showlegend: false, hoverinfo: 'none'
      });
      const rhoMid = startAngle + delta / 2;
      d.push({
        type: 'scatter', mode: 'text',
        x: [x0 + rhoArcR * 0.7 * Math.cos(rhoMid)],
        y: [y0 + rhoArcR * 0.7 * Math.sin(rhoMid)],
        text: ['ρ'],
        textfont: { color: rhoColor, size: 13, weight: 700 },
        textposition: 'middle center',
        showlegend: false, hoverinfo: 'none'
      });
    }

    // ── Layout ────────────────────────────────────────────
    const legX = params.legendPosition === 'top-right' || params.legendPosition === 'bottom-right' ? 0.98 : 0.02;
    const legY = params.legendPosition === 'top-right' || params.legendPosition === 'top-left' ? 0.98 : 0.02;
    const legXa = params.legendPosition === 'top-right' || params.legendPosition === 'bottom-right' ? 'right' : 'left';
    const legYa = params.legendPosition === 'top-right' || params.legendPosition === 'top-left' ? 'top' : 'bottom';

    const l = {
      title: { text: 'Contour Map — Gradient & Direction', font: { color: plotLayout.titleFontColor, size: 14 } },
      xaxis: {
        title: 'x', range: xRange,
        showgrid: true, gridcolor: '#64748b', gridwidth: 1,
        zeroline: true, zerolinecolor: '#94a3b8', zerolinewidth: 2,
        tickfont: { color: plotLayout.tickFontColor, size: 11 },
        titlefont: { color: plotLayout.axisLabelColor, size: 12 },
        showline: true, linewidth: 1.5, linecolor: plotLayout.axisColor, mirror: true,
        ticks: 'outside', ticklen: 6, tickwidth: 1.5, tickcolor: plotLayout.axisColor,
        showticklabels: true, dtick: 1
      },
      yaxis: {
        title: 'y', range: yRange,
        showgrid: true, gridcolor: '#64748b', gridwidth: 1,
        zeroline: true, zerolinecolor: '#94a3b8', zerolinewidth: 2,
        tickfont: { color: plotLayout.tickFontColor, size: 11 },
        titlefont: { color: plotLayout.axisLabelColor, size: 12 },
        showline: true, linewidth: 1.5, linecolor: plotLayout.axisColor, mirror: true,
        ticks: 'outside', ticklen: 6, tickwidth: 1.5, tickcolor: plotLayout.axisColor,
        showticklabels: true, dtick: 1,
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
  }, [res, xRange, yRange, x0, y0, gradX, gradY, gradMag, gradAngle, gEndX, gEndY, dEndX, dEndY, eX, eY, thetaRad, rhoRad, params.legendPosition, plotLayout, palette, scale]);

  // ── Render contour ──────────────────────────────────────
  const config = {
    displayModeBar: true, displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'sendDataToCloud'],
    toImageButtonOptions: { format: 'png', filename: `gradient_contour_${Date.now()}`, height: 600, width: 800, scale: 2 }
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

  // ── Format helpers ──────────────────────────────────────
  const fmt = (v, d = 4) => Number(v.toFixed(d)).toString();

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/gradient">
          ← Back to Gradient
        </BackButton>
        <SectionTitleH1>Gradient Vector: ∇f·→e = |∇f|·cos ρ</SectionTitleH1>
      </Header>

      <SectionDescription>
        The <strong>gradient</strong> ∇f = (∂f/∂x, ∂f/∂y) points in the direction of
        <strong>steepest ascent</strong> with magnitude |∇f|. A <strong>direction vector</strong>
        →e = (cos θ, sin θ) defines an arbitrary direction. The <strong>directional derivative</strong>
        ∂f/∂l = ∇f · →e = |∇f|·cos ρ measures how fast <em>f</em> changes along →e, where ρ is the
        angle between ∇f and →e.<br/><br/>
        The surface shows a 2D Gaussian bell <strong>f(x,y) = (1/2π)·e<sup>−½(x²+y²)</sup></strong>.
        Adjust point <strong>O</strong> and direction angle <strong>θ</strong> to explore how the
        relationship ∇f·→e = |∇f|·cos ρ governs the rate of change along any direction.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Gradient & Directional Derivative:</FormulaTitle>
        <Formula>
          f(x, y) = (1 / 2π)·e<sup>−½(x²+y²)</sup><br/>
          ∇f = (∂f/∂x, ∂f/∂y) = (−x·f, −y·f)<br/><br/>
          ∂f/∂l = ∇f · →e = (∂f/∂x, ∂f/∂y) · (cos θ, sin θ) = |∇f| · cos ρ<br/><br/>
          At O = ({x0.toFixed(2)}, {y0.toFixed(2)}, {zO.toFixed(4)}):<br/>
          ∇f = ({fmt(gradX)}, {fmt(gradY)}) &nbsp; |∇f| = {fmt(gradMag)}<br/>
          →e = ({fmt(eX)}, {fmt(eY)}) &nbsp; θ = {theta}° &nbsp; ρ = {fmt(rhoDeg)}°<br/>
          ∂f/∂l = ∇f · →e = {fmt(dirDeriv)} = |∇f|·cos ρ = {fmt(gradMag)}·{fmt(cosRho)} = {fmt(gradMag * cosRho)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Point O">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'x0', label: 'x₀', min: -2.8, max: 2.8, step: 0.1 },
                { name: 'y0', label: 'y₀', min: -2.8, max: 2.8, step: 0.1 }
              ]}
            />
          </ParameterSection>

          <ParameterSection title="Direction">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[
                { name: 'theta', label: 'θ (degrees)', min: 0, max: 360, step: 5 }
              ]}
            />
            <ArrowScaleRow>
              <ArrowScaleLabel>Arrow length</ArrowScaleLabel>
              <ArrowScaleInput
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={arrowScale}
                onChange={(e) => setParams(prev => ({ ...prev, arrowScale: parseFloat(e.target.value) }))}
              />
              <ArrowScaleLabel>{arrowScale.toFixed(2)}</ArrowScaleLabel>
            </ArrowScaleRow>
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
              title="Gaussian Bell — Gradient ∇f & Direction →e"
              showExportButton={false}
              height="100%"
              scene={scene}
              plotStyle={params.plotStyle}
              legendPosition={params.legendPosition}
            />
          </div>
          <Note>
            Drag to rotate · Scroll to zoom ·
            <span style={{ color: palette.mainTraces.primary }}> ●</span> ∇f gradient ·
            <span style={{ color: palette.auxTraces.tangent }}> ●</span> →e direction
          </Note>
        </PlotPanel>
      </ContentLayout>

      <DualPlotRow>
        <PlotHalf>
          <div ref={contourRef} style={{ width: '100%', height: '100%', aspectRatio: '4/3' }} />
        </PlotHalf>
        <PlotHalf>
          <ValuesPanel>
            <ValuesTitle>∇f · →e = |∇f| · cos ρ</ValuesTitle>

            <HighlightFormula>
              <HighlightText>
                ∂f/∂l = {fmt(dirDeriv)}
              </HighlightText>
            </HighlightFormula>

            <ValueRow>
              <ValueLabel><ColorDot $color={palette.mainTraces.primary} />∇f (gradient)</ValueLabel>
              <ValueNumber>({fmt(gradX)}, {fmt(gradY)})</ValueNumber>
            </ValueRow>
            <ValueRow>
              <ValueLabel>|∇f| (magnitude)</ValueLabel>
              <ValueNumber>{fmt(gradMag)}</ValueNumber>
            </ValueRow>
            <ValueRow>
              <ValueLabel>∇f direction angle</ValueLabel>
              <ValueNumber>{(gradAngle * 180 / Math.PI).toFixed(1)}°</ValueNumber>
            </ValueRow>

            <ValueRow>
              <ValueLabel><ColorDot $color={palette.auxTraces.tangent} />→e (unit vector)</ValueLabel>
              <ValueNumber>({fmt(eX)}, {fmt(eY)})</ValueNumber>
            </ValueRow>
            <ValueRow>
              <ValueLabel>θ (direction angle)</ValueLabel>
              <ValueNumber>{theta}°</ValueNumber>
            </ValueRow>

            <ValueRow>
              <ValueLabel><ColorDot $color={palette.auxTraces.combined} />ρ = ∠(∇f, →e)</ValueLabel>
              <ValueNumber>{fmt(rhoDeg)}°</ValueNumber>
            </ValueRow>
            <ValueRow>
              <ValueLabel>cos ρ</ValueLabel>
              <ValueNumber>{fmt(cosRho)}</ValueNumber>
            </ValueRow>

            <ValueRow style={{ borderBottom: '2px solid', borderBottomColor: palette.mainTraces.primary, paddingTop: '0.25rem' }}>
              <ValueLabel style={{ fontWeight: 700 }}>
                <ColorDot $color={palette.mainTraces.primary} />∂f/∂l = |∇f|·cos ρ
              </ValueLabel>
              <ValueNumber style={{ color: palette.mainTraces.primary, fontSize: 16 }}>
                {fmt(gradMag * cosRho)}
              </ValueNumber>
            </ValueRow>
          </ValuesPanel>
        </PlotHalf>
      </DualPlotRow>
    </PageContainer>
  );
};

export default GradientVector;

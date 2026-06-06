// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useCallback } from 'react';
import ContinuityPlotter from '../../../components/visualization/ContinuityPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, Formula
} from '../../../components/common/LayoutStyled';
import { commonParamsConfig } from '../../../constants/continuityConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Removable Discontinuity — lim f(x) ≠ f(x₀)
 * f(x) = ax + b for x ≠ x₀, but f(x₀) = c (a different value)
 */
const DiscontinuityRemovable = () => {
  const [params, setParams] = useState({
    a: 1.0,
    b: 0.0,
    x0: 0.0,
    c: 2.0,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const generateData = useCallback(() => {
    const { a, b, x0, c, xRange } = params;
    const [xMin, xMax] = xRange;
    const numPoints = 500;
    const traces = [];

    // f(x) = ax + b
    const f = (x) => a * x + b;
    const limitValue = f(x0);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      const y = f(x);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    // Also account for the isolated point c
    if (c < minY) minY = c;
    if (c > maxY) maxY = c;

    const padding = Math.max((maxY - minY) * 0.1, 0.3);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;

    // Draw the line in two parts to leave a gap at x0
    // Left part: x < x0
    if (xMin < x0) {
      const leftX = [];
      const leftY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((x0 - xMin) * i) / (numPoints / 2);
        if (x < x0 - 0.01) {
          leftX.push(x);
          leftY.push(f(x));
        }
      }
      if (leftX.length > 0) {
        traces.push({
          x: leftX, y: leftY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${a.toFixed(1)}x + ${b.toFixed(1)} (x < x₀)`,
          line: { color: palette.mainTraces.primary, width: 2.5 }
        });
      }
    }

    // Right part: x > x0
    if (xMax > x0) {
      const rightX = [];
      const rightY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = x0 + ((xMax - x0) * i) / (numPoints / 2);
        if (x > x0 + 0.01) {
          rightX.push(x);
          rightY.push(f(x));
        }
      }
      if (rightX.length > 0) {
        traces.push({
          x: rightX, y: rightY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${a.toFixed(1)}x + ${b.toFixed(1)} (x > x₀)`,
          line: { color: palette.mainTraces.primary, width: 2.5 }
        });
      }
    }

    // Vertical auxiliary line connecting limit value and f(x0)
    traces.push({
      x: [x0, x0],
      y: [Math.min(limitValue, c), Math.max(limitValue, c)],
      type: 'scatter', mode: 'lines',
      name: `gap: ${Math.abs(limitValue - c).toFixed(1)}`,
      line: { color: palette.limit.limitLine, width: 2, dash: 'dash' }
    });

    // Hollow circle at (x0, limitValue) — the "true" limit point
    traces.push({
      x: [x0], y: [limitValue],
      type: 'scatter', mode: 'markers+text',
      name: `lim: ${limitValue.toFixed(1)}`,
      marker: {
        size: 12, color: palette.markers.pointA,
        symbol: 'circle-open',
        line: { color: palette.markers.pointA, width: 2 }
      },
      text: [`lim = ${limitValue.toFixed(1)}`],
      textposition: 'left center',
      textfont: { size: 12, color: palette.markers.pointA }
    });

    // Filled circle at (x0, c) — the actual function value
    traces.push({
      x: [x0], y: [c],
      type: 'scatter', mode: 'markers+text',
      name: `f(x₀) = ${c.toFixed(1)}`,
      marker: {
        size: 12, color: palette.limit.hole,
        symbol: 'circle',
        line: { color: palette.limit.hole, width: 2 }
      },
      text: [`f(x₀) = ${c.toFixed(1)}`],
      textposition: 'right center',
      textfont: { size: 12, color: palette.limit.hole }
    });

    return traces;
  }, [params, themeMode]);

  const paramConfig = [
    { name: 'a', label: 'a (slope)', min: 0.1, max: 3.0, step: 0.1 },
    { name: 'b', label: 'b (intercept)', min: -2.0, max: 2.0, step: 0.1 },
    { name: 'x0', label: 'x₀', min: -2.0, max: 2.0, step: 0.1 },
    { name: 'c', label: 'f(x₀)', min: -3.0, max: 3.0, step: 0.1 }
  ];

  const limitValue = params.a * params.x0 + params.b;
  const gap = Math.abs(limitValue - params.c);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/continuity">
           Back to Continuity
        </BackButton>
        <SectionTitle>Discontinuity: lim f(x) ≠ f(x₀)</SectionTitle>
      </Header>

      <SectionDescription>
        The limit exists and f(x₀) is defined, but they are <strong>not equal</strong>.
        The function has a "hole" at x₀ with the value re-assigned elsewhere — another
        form of <strong>removable discontinuity</strong>.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          f(x) = {'{'}<br/>
          &nbsp;&nbsp;ax + b, &nbsp;&nbsp;x ≠ x₀ = {params.x0.toFixed(1)}<br/>
          &nbsp;&nbsp;c = {params.c.toFixed(1)}, &nbsp;&nbsp;&nbsp;&nbsp;x = x₀ = {params.x0.toFixed(1)}<br/>
          {'}'}<br/><br/>
          lim(x→x₀) f(x) = a·x₀ + b = {limitValue.toFixed(1)}<br/>
          f(x₀) = c = {params.c.toFixed(1)}<br/>
          lim ≠ f(x₀) &nbsp; → &nbsp; <strong>not continuous</strong> ✗<br/>
          Gap = |{limitValue.toFixed(1)} - {params.c.toFixed(1)}| = {gap.toFixed(1)}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Parameters">
            <ParameterControls parameters={params} onChange={setParams} config={paramConfig} />
          </ParameterSection>
          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <ContinuityPlotter
            data={generateData()}
            xRange={params.xRange}
            title={`lim f(x) ≠ f(x₀) at x₀ = ${params.x0.toFixed(1)}`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DiscontinuityRemovable;

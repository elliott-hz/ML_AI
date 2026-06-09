// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useCallback } from 'react';
import ContinuityPlotter from '../../../../../components/visualization/ContinuityPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, Formula
} from '../../../../../components/common/LayoutStyled';
import { commonParamsConfig } from '../../../../../constants/continuityConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';

/**
 * Jump Discontinuity — limit does not exist at x₀
 * Jump Discontinuity — limit does not exist at x₀
 * Piecewise: f(x) = L when x < x₀, f(x) = R when x ≥ x₀
 */
const DiscontinuityJump = () => {
  const [params, setParams] = useState({
    L: 1.0,
    R: 0.5,
    x0: 0.0,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const generateData = useCallback(() => {
    const { L, R, x0, xRange } = params;
    const [xMin, xMax] = xRange;
    const numPoints = 200;
    const traces = [];

    // Left branch: x < x0, y = L
    if (xMin < x0) {
      const leftX = [];
      const leftY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((x0 - xMin) * i) / (numPoints / 2);
        if (x < x0 - 0.01) {
          leftX.push(x);
          leftY.push(L);
        }
      }
      if (leftX.length > 0) {
        traces.push({
          x: leftX, y: leftY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${L.toFixed(1)} (x < x₀)`,
          line: { color: palette.markers.pointA, width: 2.5 }
        });
      }
    }

    // Right branch: x ≥ x0, y = R
    if (xMax > x0) {
      const rightX = [];
      const rightY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = x0 + ((xMax - x0) * i) / (numPoints / 2);
        rightX.push(x);
        rightY.push(R);
      }
      if (rightX.length > 0) {
        traces.push({
          x: rightX, y: rightY, type: 'scatter', mode: 'lines',
          name: `f(x) = ${R.toFixed(1)} (x ≥ x₀)`,
          line: { color: palette.mainTraces.secondary, width: 2.5 }
        });
      }
    }

    // Vertical line at x0 connecting L and R
    const auxYMin = Math.min(L, R) - 0.5;
    const auxYMax = Math.max(L, R) + 0.5;
    traces.push({
      x: [x0, x0], y: [L, R],
      type: 'scatter', mode: 'lines',
      name: `jump: ${(L - R).toFixed(1)}`,
      line: { color: palette.limit.limitLine, width: 2, dash: 'dash' }
    });

    // Hollow circle at (x0, L) — the left limit value (not the actual point)
    traces.push({
      x: [x0], y: [L],
      type: 'scatter', mode: 'markers',
      name: `lim(x→x₀⁻) = ${L.toFixed(1)}`,
      marker: {
        size: 12, color: palette.markers.pointA,
        symbol: 'circle-open',
        line: { color: palette.markers.pointA, width: 2 }
      }
    });

    // Filled circle at (x0, R) — the actual function value
    traces.push({
      x: [x0], y: [R],
      type: 'scatter', mode: 'markers+text',
      name: `f(x₀) = ${R.toFixed(1)}`,
      marker: {
        size: 12, color: palette.limit.rightLimit,
        symbol: 'circle',
        line: { color: palette.limit.rightLimit, width: 2 }
      },
      text: [`f(x₀) = ${R.toFixed(1)}`],
      textposition: 'bottom center',
      textfont: { size: 12, color: palette.limit.rightLimit }
    });

    return traces;
  }, [params, themeMode]);

  const paramConfig = [
    { name: 'L', label: 'L (left)', min: -3.0, max: 3.0, step: 0.1 },
    { name: 'R', label: 'R (right)', min: -3.0, max: 3.0, step: 0.1 },
    { name: 'x0', label: 'x₀', min: -2.0, max: 2.0, step: 0.1 }
  ];

  const jumpSize = params.L - params.R;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/continuity">
           Back to Continuity
        </BackButton>
        <SectionTitle>Discontinuity: Limit Does Not Exist at x₀</SectionTitle>
      </Header>

      <SectionDescription>
        The left-hand limit and right-hand limit at x₀ are <strong>different</strong>,
        so the two-sided limit does not exist. This is called a <strong>jump discontinuity</strong>.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          f(x) = {'{'}<br/>
          &nbsp;&nbsp;L = {params.L.toFixed(1)}, &nbsp;&nbsp;x &lt; x₀ = {params.x0.toFixed(1)}<br/>
          &nbsp;&nbsp;R = {params.R.toFixed(1)}, &nbsp;&nbsp;x ≥ x₀ = {params.x0.toFixed(1)}<br/>
          {'}'}<br/><br/>
          lim(x→x₀⁻) f(x) = {params.L.toFixed(1)}<br/>
          lim(x→x₀⁺) f(x) = {params.R.toFixed(1)}<br/>
          lim(x→x₀) f(x) <strong>does not exist</strong> ✗<br/>
          Jump size = |L - R| = {Math.abs(jumpSize).toFixed(1)}
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
            title={`Jump Discontinuity at x₀ = ${params.x0.toFixed(1)}`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[{ name: 'x0', label: 'x₀', min: -2.0, max: 2.0, step: 0.1 }]} />
          </ContinuityPlotter>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DiscontinuityJump;

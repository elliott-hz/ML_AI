// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import FunctionPlotter from '../../../../../components/visualization/FunctionPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../../../components/common/LayoutStyled';
import { plotStyleConfig, legendPositionConfig } from '../../../../../constants/basicFunctionConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';

/**
 * Reciprocal Functions 页面 - 倒函数可视化
 * Shows f(x) = a·x + b and its reciprocal g(x) = 1/(a·x + b)
 */
const ReciprocalFunctions = () => {
  const [params, setParams] = useState({
    a: 1.0,
    b: 0.0,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const coefficientConfig = [
    { name: 'a', label: 'a (slope)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'b (intercept)', min: -5, max: 5, step: 0.1 }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -20, max: 20, step: 1, default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  const generateData = useCallback(() => {
    const a = params.a;
    const b = params.b;
    const [xMin, xMax] = params.xRange;
    const numPoints = 300;

    // Asymptote at x = -b/a
    const asymX = -b / a;
    const asymInside = asymX > xMin && asymX < xMax;

    // 1. Original linear function f(x) = a·x + b
    const fX = [];
    const fY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (xMax - xMin) * i / numPoints;
      fX.push(x);
      fY.push(a * x + b);
    }

    const traces = [];

    traces.push({
      x: fX, y: fY,
      type: 'scatter', mode: 'lines',
      name: `f(x) = ${a.toFixed(1)}x + ${b.toFixed(1)}`,
      line: { color: palette.mainTraces.primary, width: 2 }
    });

    // 2. Reciprocal function g(x) = 1/(a·x + b), split at asymptote
    if (a !== 0) {
      // Left branch: x from xMin to just before asymptote
      const leftX = [];
      const leftY = [];
      const leftEnd = asymInside ? asymX - 0.001 : xMax;
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (leftEnd - xMin) * i / numPoints;
        const denom = a * x + b;
        leftX.push(x);
        leftY.push(1 / denom);
      }
      traces.push({
        x: leftX, y: leftY,
        type: 'scatter', mode: 'lines',
        name: `g(x) = 1/(${a.toFixed(1)}x + ${b.toFixed(1)})`,
        line: { color: palette.auxTraces.tangent, width: 2 },
        legendgroup: 'reciprocal',
      });

      // Right branch: x from just after asymptote to xMax
      const rightX = [];
      const rightY = [];
      const rightStart = asymInside ? asymX + 0.001 : xMin;
      for (let i = 0; i <= numPoints; i++) {
        const x = rightStart + (xMax - rightStart) * i / numPoints;
        const denom = a * x + b;
        rightX.push(x);
        rightY.push(1 / denom);
      }
      traces.push({
        x: rightX, y: rightY,
        type: 'scatter', mode: 'lines',
        name: `g(x) = 1/(${a.toFixed(1)}x + ${b.toFixed(1)})`,
        line: { color: palette.auxTraces.tangent, width: 2 },
        showlegend: false,
        legendgroup: 'reciprocal',
      });
    }

    // 3. Vertical asymptote at x = -b/a
    if (asymInside) {
      traces.push({
        x: [asymX, asymX],
        y: [asymYRange(xMin, xMax, a, b, 'min'), asymYRange(xMin, xMax, a, b, 'max')],
        type: 'scatter', mode: 'lines',
        name: `x = ${asymX.toFixed(2)} (asymptote)`,
        line: { color: palette.limit.boundary, width: 1, dash: 'dash' }
      });
    }

    // 4. Horizontal asymptote y = 0
    traces.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: 'scatter', mode: 'lines',
      name: 'y = 0 (asymptote)',
      line: { color: palette.limit.boundary, width: 1, dash: 'dash' }
    });

    return traces;
  }, [params.a, params.b, params.xRange, themeMode]);

  const traces = useMemo(() => generateData(), [generateData]);

  // Compute display values
  const asymX = params.a !== 0 ? -params.b / params.a : null;
  const reciprocalAtX0 = params.a !== 0 ? 1 / (params.a * 0 + params.b) : null;
  const fAtX0 = params.b;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitleH1>Reciprocal Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The reciprocal function g(x) = 1/f(x) reverses the output of the original function.
        When f(x) is large, its reciprocal is small, and vice versa. The graphs share key
        symmetry: points where f(x) = 1 are fixed (self-reciprocal).
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Reciprocal Relationship</FormulaTitle>
        <Formula>
          f(x) = a·x + b<br/>
          g(x) = 1 / f(x) = 1/(a·x + b)<br/><br/>
          Domain: x ≠ -b/a &nbsp; (vertical asymptote)<br/>
          Range: y ≠ 0 &nbsp; (horizontal asymptote)<br/><br/>
          Self-reciprocal point: where f(x) = 1 → g(x) = 1
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={coefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <FunctionPlotter
            data={traces}
            xRange={params.xRange}
            title={`Reciprocal: f(x) = ${params.a.toFixed(1)}x + ${params.b.toFixed(1)} and g(x) = 1/f(x)`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[
              { name: 'a', label: 'a (slope)', min: 0.1, max: 5, step: 0.1 },
              { name: 'b', label: 'b (intercept)', min: -5, max: 5, step: 0.5 }
            ]} />
          </FunctionPlotter>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

/**
 * Helper: compute a reasonable y-range for the asymptote line
 */
function asymYRange(xMin, xMax, a, b, mode) {
  let yMin = Infinity;
  let yMax = -Infinity;
  const num = 100;
  for (let i = 0; i <= num; i++) {
    const x = xMin + (xMax - xMin) * i / num;
    const denom = a * x + b;
    if (Math.abs(denom) > 1e-10) {
      const y = 1 / denom;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
  }
  const pad = (yMax - yMin) * 0.2 || 5;
  if (mode === 'min') return yMin - pad;
  return yMax + pad;
}

export default ReciprocalFunctions;

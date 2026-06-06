// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useMemo, useCallback } from 'react';
import FunctionPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/FunctionPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula,
  QuickSetRow, QuickBtn
} from '../../../components/common/LayoutStyled';
import { plotStyleConfig, legendPositionConfig } from '../../../constants/basicFunctionConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Exponential Function 页面 - 指数函数可视化
 * y = a · bˣ
 * Core concept: each unit step in x multiplies the output by the base b.
 */
const ExponentialFunction = () => {
  const [params, setParams] = useState({
    a: 1.0,
    b: 2.0,
    xRange: [-2, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-left'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const coefficientConfig = [
    { name: 'a', label: 'Coefficient (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Base (b)', min: 0.1, max: 5, step: 0.1 }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -20, max: 20, step: 1, default: [-2, 5]
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
    const baseDisplay = Math.abs(b - Math.E) < 1e-9 ? 'e' : b.toFixed(1);
    const [xMin, xMax] = params.xRange;
    const numPoints = 300;

    // 1. Continuous curve y = a · bˣ
    const xVals = [];
    const yVals = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (xMax - xMin) * i / numPoints;
      xVals.push(x);
      yVals.push(a * Math.pow(b, x));
    }

    const traces = [];

    traces.push({
      x: xVals, y: yVals,
      type: 'scatter', mode: 'lines',
      name: `y = ${a.toFixed(1)} · ${baseDisplay}ˣ`,
      line: { color: palette.mainTraces.primary, width: 2 }
    });

    // 2. Integer points with y-value labels
    const intStart = Math.ceil(xMin);
    const intEnd = Math.floor(xMax);
    const intX = [];
    const intY = [];
    const intLabels = [];

    for (let x = intStart; x <= intEnd; x++) {
      const y = a * Math.pow(b, x);
      intX.push(x);
      intY.push(y);
      intLabels.push(y.toFixed(2));
    }

    traces.push({
      x: intX, y: intY,
      type: 'scatter', mode: 'markers+text',
      name: 'Integer points',
      text: intLabels,
      textposition: 'top center',
      textfont: { color: palette.mainTraces.tertiary, size: 11, family: 'monospace' },
      marker: { color: palette.auxTraces.tangent, size: 8, symbol: 'circle' },
      showlegend: false
    });

    // 3. "×b" factor annotations between consecutive integer points
    if (intStart < intEnd) {
      const midX = [];
      const midY = [];
      const factorLabels = [];

      for (let x = intStart; x < intEnd; x++) {
        const y1 = a * Math.pow(b, x);
        const y2 = a * Math.pow(b, x + 1);
        midX.push(x + 0.5);
        midY.push(Math.max(y1, y2) * 1.15);  // place above the higher point
        factorLabels.push(`×${baseDisplay}`);
      }

      traces.push({
        x: midX, y: midY,
        type: 'scatter', mode: 'text',
        name: 'factor',
        text: factorLabels,
        textposition: 'middle center',
        textfont: { color: palette.mainTraces.secondary, size: 13, family: 'monospace', weight: 700 },
        showlegend: false
      });
    }

    return traces;
  }, [params.a, params.b, params.xRange, themeMode]);

  const traces = useMemo(() => generateData(), [generateData]);

  // When b is set to Euler's number, display "e" instead of "2.718"
  const baseDisplay = Math.abs(params.b - Math.E) < 1e-9 ? 'e' : params.b.toFixed(1);

  const growthDesc = params.b > 1
    ? 'Exponential Growth — each step multiplies by b > 1'
    : params.b < 1
      ? 'Exponential Decay — each step multiplies by b < 1'
      : 'Constant — b = 1, output stays the same';

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitleH1>Exponential Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The exponential function y = a·bˣ grows by a constant factor at each unit step.
        The base b determines whether the function grows (b &gt; 1), decays (0 &lt; b &lt; 1),
        or stays constant (b = 1). Watch how each integer increment multiplies the output by b.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Exponential Growth &amp; Decay</FormulaTitle>
        <Formula>
          y = a · bˣ<br/><br/>
          b &gt; 1 → exponential growth (e.g. 2ˣ: 1 → 2 → 4 → 8 → 16 → ...)<br/>
          b = 1 → constant (e.g. 1ˣ = 1)<br/>
          0 &lt; b &lt; 1 → exponential decay (e.g. 0.5ˣ: 1 → 0.5 → 0.25 → ...)<br/><br/>
          {growthDesc}
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

          <QuickSetRow>
            <span>Quick set:</span>
            <QuickBtn onClick={() => setParams(p => ({ ...p, b: Math.E }))}>
              b = e ({Math.E.toFixed(3)})
            </QuickBtn>
          </QuickSetRow>

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
            title={`Exponential: y = ${params.a.toFixed(1)} · ${baseDisplay}ˣ`}
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

export default ExponentialFunction;

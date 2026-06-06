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

const SUBSCRIPT_MAP = {
  '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
  '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089',
  'e': '\u2091'
};
const toSub = (s) => String(s).split('').map(c => SUBSCRIPT_MAP[c] || c).join('');
const fmtBaseDisplay = (b) => {
  const isE = Math.abs(b - Math.E) < 1e-9;
  if (isE) return { raw: 'e', sub: toSub('e') };
  const intVal = Math.round(b);
  const isInt = Math.abs(b - intVal) < 1e-9;
  if (isInt) return { raw: String(intVal), sub: toSub(String(intVal)) };
  const raw = b.toFixed(1);
  return { raw, sub: String(raw).split('').map(c => SUBSCRIPT_MAP[c] || c).join('') };
};

/**
 * Logarithmic Function 页面 - 对数函数可视化
 * y = log_b(x)
 * Inverse of exponential: if y = bˣ then x = log_b(y)
 */
const LogarithmicFunction = () => {
  const [params, setParams] = useState({
    a: 1.0,
    b: 2.0,
    xRange: [0.5, 8],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'bottom-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const coefficientConfig = [
    { name: 'a', label: 'Coefficient (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Base (b)', min: 0.5, max: 10, step: 0.5 }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: 0.5, max: 20, step: 0.5, default: [0.5, 8]
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
    const fmtA = a % 1 === 0 ? a.toFixed(0) : a.toFixed(1);
    const bd = fmtBaseDisplay(b);

    // 1. Continuous curve y = a · log_b(x) = a · ln(x) / ln(b)
    const xVals = [];
    const yVals = [];
    const safeMin = Math.max(xMin, 0.001);
    for (let i = 0; i <= numPoints; i++) {
      const x = safeMin + (xMax - safeMin) * i / numPoints;
      xVals.push(x);
      yVals.push(a * Math.log(x) / Math.log(b));
    }

    const traces = [];

    traces.push({
      x: xVals, y: yVals,
      type: 'scatter', mode: 'lines',
      name: `y = ${fmtA} · log${bd.sub}(x)`,
      line: { color: palette.mainTraces.primary, width: 2 }
    });

    // 2. Key points: x = b^k for integer k (capped to avoid freeze when b≈1)
    const ptX = [];
    const ptY = [];
    const ptLabels = [];

    const logB = Math.log(b);
    const MAX_KEY_POINTS = 30;

    if (Math.abs(logB) > 1e-10) {
      const maxK = Math.floor(Math.log(xMax) / logB);
      const minK = Math.ceil(Math.log(safeMin) / logB);
      const range = maxK - minK + 1;

      if (range > 0 && range < 1e6) {
        const stepK = Math.max(1, Math.floor(range / MAX_KEY_POINTS));
        let count = 0;
        for (let k = minK; k <= maxK && count < MAX_KEY_POINTS; k += stepK) {
          const x = Math.pow(b, k);
          ptX.push(x);
          ptY.push(a * k);
          ptLabels.push(`(${x.toFixed(2)}, ${(a * k).toFixed(1)})`);
          count++;
        }
      }
    }

    traces.push({
      x: ptX, y: ptY,
      type: 'scatter', mode: 'markers+text',
      name: 'Key points',
      text: ptLabels,
      textposition: 'top center',
      textfont: { color: palette.mainTraces.tertiary, size: 10, family: 'monospace' },
      marker: { color: palette.auxTraces.tangent, size: 8, symbol: 'circle' },
      showlegend: false
    });

    // 3. Vertical asymptote at x = 0
    traces.push({
      x: [0, 0],
      y: [-10, 10],
      type: 'scatter', mode: 'lines',
      name: 'x = 0 (asymptote)',
      line: { color: palette.limit.boundary, width: 1, dash: 'dash' },
      showlegend: false
    });

    return traces;
  }, [params.a, params.b, params.xRange, themeMode]);

  const traces = useMemo(() => generateData(), [generateData]);

  const fmtA = params.a % 1 === 0 ? params.a.toFixed(0) : params.a.toFixed(1);
  const bdRender = fmtBaseDisplay(params.b);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitleH1>Logarithmic Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The logarithmic function y = log<sub>b</sub>(x) answers "how many times must we multiply b to get x?"
        It is the inverse of the exponential function: if y = bˣ then x = log<sub>b</sub>(y).
        In ML, logarithms appear in cross-entropy loss, information entropy, TF-IDF, and feature transformations.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Logarithm &amp; Its Inverse (Exponential)</FormulaTitle>
        <Formula>
          y = a · log<sub>b</sub>(x) &nbsp; ↔ &nbsp; x = b<sup>y/a</sup><br/><br/>
          b &gt; 1 → increasing slowly, compresses large values<br/>
          0 &lt; b &lt; 1 → decreasing<br/>
          Domain: x &gt; 0 &nbsp; | &nbsp; Asymptote: x = 0<br/><br/>
          Cross-entropy: L = -Σ y·log(ŷ)<br/>
          Entropy: H = -Σ p·log(p)
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
            title={`Logarithmic: y = ${fmtA} · log${bdRender.sub}(x)`}
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

export default LogarithmicFunction;

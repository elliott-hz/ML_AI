// UI Pattern: ToggleSelector — single plot with ToggleGroup to switch functions
import React, { useState, useCallback } from 'react';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula,
  ToggleGroup, ToggleBtn
} from '../../../components/limit/shared/LimitStyled';
import { commonParamsConfig } from '../../../constants/limitConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Trigonometric Intuitive Limit — visual overview of trig function limits
 *
 *   sin(x):  oscillates between -1 and 1, no limit at ±∞
 *   cos(x):  oscillates between -1 and 1, no limit at ±∞
 *   tan(x):  vertical asymptotes at x = π/2 + nπ, no limit at ±∞
 */
const TrigonometricIntuitiveLimit = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    coefficient: 1,
    xRange: [-8, 8],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('sin');

  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-8, 8];
    const k = params.coefficient || 1;
    const numPoints = 800;

    const traces = [];

    const colors = { sin: palette.mainTraces.primary, cos: palette.auxTraces.tangent, tan: palette.mainTraces.tertiary };
    const color = colors[activeFunction];

    if (activeFunction === 'sin' || activeFunction === 'cos') {
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(activeFunction === 'sin' ? Math.sin(k * x) : Math.cos(k * x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: activeFunction === 'sin' ? `f(x) = sin(${k.toFixed(1)}x)` : `f(x) = cos(${k.toFixed(1)}x)`,
        line: { color, width: 2.5 }
      });

      // Range boundaries y = ±1
      traces.push({
        x: [xMin, xMax], y: [1, 1], type: 'scatter', mode: 'lines',
        name: 'y = 1', line: { color: palette.limit.limitLine, width: 1.5, dash: 'dash' }
      });
      traces.push({
        x: [xMin, xMax], y: [-1, -1], type: 'scatter', mode: 'lines',
        name: 'y = -1', line: { color: palette.limit.limitLine, width: 1.5, dash: 'dash' }
      });

      // x = 0 reference
      traces.push({
        x: [0, 0], y: [-1.5, 1.5], type: 'scatter', mode: 'lines',
        name: 'x = 0', line: { color: palette.limit.verticalAsymptote, width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
    } else {
      // tan(x): split at asymptotes
      const keyPoints = [];
      for (let n = -5; n <= 5; n++) {
        keyPoints.push((Math.PI / 2 + n * Math.PI) / k);
      }

      let segStart = xMin;
      for (const asymp of keyPoints) {
        if (asymp <= xMin) continue;
        if (asymp >= xMax) break;
        const segX = [], segY = [];
        for (let i = 0; i <= numPoints / 4; i++) {
          const x = segStart + ((asymp - 0.01 - segStart) * i) / (numPoints / 4);
          segX.push(x);
          segY.push(Math.tan(k * x));
        }
        if (segX.length > 0) {
          traces.push({
            x: segX, y: segY, type: 'scatter', mode: 'lines',
            name: `f(x) = tan(${k.toFixed(1)}x)`, line: { color, width: 2.5 },
            showlegend: segStart === xMin
          });
        }
        // Vertical asymptote
        traces.push({
          x: [asymp, asymp], y: [-10, 10], type: 'scatter', mode: 'lines',
          name: `x = ${asymp.toFixed(2)}`, line: { color: palette.limit.verticalAsymptote, width: 1, dash: 'dot' },
          hoverinfo: 'skip', showlegend: false
        });
        segStart = asymp + 0.01;
      }
      // Last segment
      if (segStart < xMax) {
        const segX = [], segY = [];
        for (let i = 0; i <= numPoints / 4; i++) {
          const x = segStart + ((xMax - segStart) * i) / (numPoints / 4);
          segX.push(x);
          segY.push(Math.tan(k * x));
        }
        if (segX.length > 0) {
          traces.push({
            x: segX, y: segY, type: 'scatter', mode: 'lines',
            name: `f(x) = tan(${k.toFixed(1)}x)`, line: { color, width: 2.5 },
            showlegend: false
          });
        }
      }
    }

    return traces;
  }, [params, activeFunction]);

  const coefficientConfig = [
    { name: 'coefficient', label: 'Frequency (k)', min: 0.5, max: 3, step: 0.1, type: 'slider' }
  ];

  const k = params.coefficient;

  let limitDesc, formulaLines;
  if (activeFunction === 'sin') {
    limitDesc = 'sin(x) oscillates between −1 and 1 for all real x. It has no limit at ±∞ (the function never settles to a single value). At x = 0, sin(0) = 0 and the limit equals the function value.';
    formulaLines = [`f(x) = sin(${k.toFixed(1)}x)`, `Range: [−1, 1]`, `lim(x→±∞) sin(x) does not exist (oscillatory)`];
  } else if (activeFunction === 'cos') {
    limitDesc = 'cos(x) oscillates between −1 and 1, shifted relative to sin(x). Like sin(x), it has no limit at ±∞. At x = 0, cos(0) = 1.';
    formulaLines = [`f(x) = cos(${k.toFixed(1)}x)`, `Range: [−1, 1]`, `lim(x→±∞) cos(x) does not exist (oscillatory)`];
  } else {
    limitDesc = 'tan(x) = sin(x)/cos(x) has vertical asymptotes where cos(x) = 0, at x = π/2 + nπ. Near each asymptote the function diverges to ±∞. There is no finite limit at any asymptote.';
    formulaLines = [`f(x) = tan(${k.toFixed(1)}x)`, `Asymptotes at x = π/(2k) + nπ/k`, `lim(x→asymptote) tan(x) = ±∞ (diverges)`];
  }

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Trig. — Intuitive Limits</SectionTitle>
      </Header>

      <SectionDescription>
        An intuitive look at how trigonometric functions behave across their domain.
        Rather than computing exact limits, observe the overall patterns: bounded oscillation for sin/cos,
        and vertical asymptotes for tan.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'sin'} onClick={() => setActiveFunction('sin')}>sin(x)</ToggleBtn>
        <ToggleBtn $active={activeFunction === 'cos'} onClick={() => setActiveFunction('cos')}>cos(x)</ToggleBtn>
        <ToggleBtn $active={activeFunction === 'tan'} onClick={() => setActiveFunction('tan')}>tan(x)</ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          {formulaLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}{i < formulaLines.length - 1 && <br/>}
            </React.Fragment>
          ))}
        </Formula>
      </FormulaBox>

      <SectionDescription>{limitDesc}</SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Coefficients">
            <ParameterControls parameters={params} onChange={setParams} config={coefficientConfig} />
          </ParameterSection>
          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>
        <PlotPanel>
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: ${activeFunction}(${k.toFixed(1)}x)`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default TrigonometricIntuitiveLimit;

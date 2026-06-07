// UI Pattern: ToggleSelector — single plot with ToggleGroup to switch functions
import React, { useState, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import LimitPlotter from '../../../components/visualization/LimitPlotter';
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

const toPiLabel = (val) => {
  const halfPi = Math.PI / 2;
  const k = Math.round(val / halfPi);
  if (Math.abs(val - k * halfPi) > 1e-6) return val.toFixed(2);
  const neg = k < 0 ? '−' : '';
  const absK = Math.abs(k);
  if (absK === 0) return '0';
  if (absK === 1) return `${neg}π/2`;
  if (absK % 2 === 0) return `${neg}${absK / 2 === 1 ? '' : absK / 2}π`;
  return `${neg}${absK}π/2`;
};

/**
 * Inverse Trig. Intuitive Limit — overview of inverse trig function behavior
 *
 *   arctan(x):  domain (-∞, +∞), range (-π/2, π/2), horizontal asymptotes
 *   arcsin(x):  domain [-1, 1], range [-π/2, π/2], finite endpoint limits
 *   arccos(x):  domain [-1, 1], range [0, π], finite endpoint limits
 */
const InverseTrigIntuitiveLimit = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    coefficient: 1,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('arctan');

  const generateFunctionData = useCallback(() => {
    let [xMin, xMax] = params.xRange || [-5, 5];
    const a = params.coefficient || 1;
    const numPoints = 400;

    const traces = [];

    if (activeFunction === 'arctan') {
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(a * Math.atan(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `f(x) = ${a.toFixed(1)}·arctan(x)`, line: { color: palette.mainTraces.primary, width: 2.5 }
      });

      const asy = a * Math.PI / 2;
      traces.push({
        x: [xMin, xMax], y: [asy, asy], type: 'scatter', mode: 'lines',
        name: `lim x→+${toPiLabel(asy)}`, line: { color: palette.limit.limitLine, width: 2, dash: 'dash' }
      });
      traces.push({
        x: [xMin, xMax], y: [-asy, -asy], type: 'scatter', mode: 'lines',
        name: `lim x→${toPiLabel(-asy)}`, line: { color: palette.limit.limitLine, width: 2, dash: 'dash' }
      });
    } else {
      xMin = Math.max(-1, xMin);
      xMax = Math.min(1, xMax);
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(activeFunction === 'arcsin' ? a * Math.asin(x) : a * Math.acos(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `f(x) = ${a.toFixed(1)}·${activeFunction}(x)`, line: { color: palette.mainTraces.primary, width: 2.5 }
      });

      // Domain boundary lines
      const yLo = activeFunction === 'arcsin' ? -a * Math.PI / 2 : 0;
      const yHi = activeFunction === 'arcsin' ? a * Math.PI / 2 : a * Math.PI;
      traces.push({
        x: [-1, -1], y: [-8, 8], type: 'scatter', mode: 'lines',
        name: `x → −1⁺: lim = ${toPiLabel(yLo)}`, line: { color: palette.limit.limitLine, width: 2, dash: 'dash' }
      });
      traces.push({
        x: [1, 1], y: [-8, 8], type: 'scatter', mode: 'lines',
        name: `x → 1⁻: lim = ${toPiLabel(yHi)}`, line: { color: palette.limit.limitLine, width: 2, dash: 'dash' }
      });
    }

    return traces;
  }, [params, activeFunction, themeMode]);

  const coefficientConfig = [
    { name: 'coefficient', label: 'Coefficient (a)', min: 0.5, max: 5, step: 0.1, type: 'slider' }
  ];

  const a = params.coefficient;

  let formulaLines, limitDesc;
  if (activeFunction === 'arctan') {
    const asy = a * Math.PI / 2;
    formulaLines = [`f(x) = ${a.toFixed(1)}·arctan(x)`, `Domain: (-∞, +∞)`, `Range: (${toPiLabel(-asy)}, ${toPiLabel(asy)})`];
    limitDesc = `The arctangent function approaches horizontal asymptotes at y = ±${toPiLabel(asy)} as x → ±∞. It is the inverse of tan(x) and is defined for all real x.`;
  } else if (activeFunction === 'arcsin') {
    const hi = a * Math.PI / 2;
    const lo = -a * Math.PI / 2;
    formulaLines = [`f(x) = ${a.toFixed(1)}·arcsin(x)`, `Domain: [-1, 1]`, `Range: [${toPiLabel(lo)}, ${toPiLabel(hi)}]`];
    limitDesc = `arcsin(x) is defined only on [-1, 1]. At x = -1, the function reaches its minimum ${toPiLabel(lo)}; at x = 1, its maximum ${toPiLabel(hi)}. These are the finite endpoint limits.`;
  } else {
    const hi = a * Math.PI;
    formulaLines = [`f(x) = ${a.toFixed(1)}·arccos(x)`, `Domain: [-1, 1]`, `Range: [0, ${toPiLabel(hi)}]`];
    limitDesc = `arccos(x) is the inverse of cos(x), defined on [-1, 1]. It decreases from ${toPiLabel(hi)} at x = -1 to 0 at x = 1, with finite endpoint limits.`;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Inverse Trig. — Intuitive Limits</SectionTitle>
      </Header>

      <SectionDescription>
        Observe the domain, range, and boundary behavior of inverse trigonometric functions.
        These functions map real numbers (arctan) or bounded intervals (arcsin, arccos) to angles.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'arctan'} onClick={() => {
          setActiveFunction('arctan');
          setParams(p => ({ ...p, xRange: [-5, 5] }));
        }}>arctan(x)</ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arcsin'} onClick={() => {
          setActiveFunction('arcsin');
          setParams(p => ({ ...p, xRange: [-1.5, 1.5] }));
        }}>arcsin(x)</ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arccos'} onClick={() => {
          setActiveFunction('arccos');
          setParams(p => ({ ...p, xRange: [-1.5, 1.5] }));
        }}>arccos(x)</ToggleBtn>
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
            xRange={activeFunction === 'arctan' ? params.xRange : [-1.5, 1.5]}
            title={`Function: ${activeFunction}(${a.toFixed(1)}x)`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            yTickMode="pi"
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InverseTrigIntuitiveLimit;

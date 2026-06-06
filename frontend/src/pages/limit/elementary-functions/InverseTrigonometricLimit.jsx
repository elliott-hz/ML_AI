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
 * Inverse Trigonometric Limit — classic limits of inverse trig functions at x = 0
 *
 *   arcsin(kx)/(kx) → 1   (arcsin x ~ x)
 *   arctan(kx)/(kx) → 1   (arctan x ~ x)
 *   (arccos(kx) − π/2)/(kx) → -1   (arccos x = π/2 − x + o(x))
 */
const InverseTrigonometricLimit = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    coefficient: 1,        // 缩放系数 k
    xRange: [-1.5, 1.5],       // X轴范围
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('arcsin');

  // 生成函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-1.5, 1.5];
    const k = params.coefficient || 1;
    const numPoints = 400;

    const fnLabel = activeFunction === 'arcsin' ? `arcsin(${k.toFixed(1)}x)` :
                    activeFunction === 'arctan' ? `arctan(${k.toFixed(1)}x)` :
                    `arccos(${k.toFixed(1)}x)-π/2`;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      let y;

      if (activeFunction === 'arcsin') {
        // arcsin(kx)/(kx) — domain: x ∈ [-1/k, 1/k], limit at 0 → 1
        const denom = k * x;
        const arg = k * x;
        y = Math.abs(denom) > 1e-10 && Math.abs(arg) <= 1
          ? Math.asin(arg) / denom
          : Math.abs(arg) <= 1 ? 1 : NaN;
      } else if (activeFunction === 'arctan') {
        // arctan(kx)/(kx) — limit at 0 → 1
        const denom = k * x;
        y = Math.abs(denom) > 1e-10 ? Math.atan(k * x) / denom : 1;
      } else {
        // (arccos(kx) - π/2)/(kx) — limit at 0 → -1
        const denom = k * x;
        const arg = k * x;
        y = Math.abs(denom) > 1e-10 && Math.abs(arg) <= 1
          ? (Math.acos(arg) - Math.PI / 2) / denom
          : Math.abs(arg) <= 1 ? -1 : NaN;
      }

      xValues.push(x);
      yValues.push(y);
    }

    const traces = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: `f(x) = ${fnLabel}`,
      line: {
        color: palette.mainTraces.primary,
        width: 2.5
      }
    }];

    // 极限参考线
    let limitValue;
    if (activeFunction === 'arcsin' || activeFunction === 'arctan') {
      limitValue = 1;
    } else {
      limitValue = -1;
    }

    // Domain boundary lines for arcsin/arccos
    if (activeFunction !== 'arctan') {
      const bound = 1 / Math.abs(k || 1);
      traces.push({
        x: [bound, bound],
        y: [limitValue - 5, limitValue + 5],
        type: 'scatter',
        mode: 'lines',
        name: `x = ${bound.toFixed(2)}`,
        line: { color: palette.limit.boundary, width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
      traces.push({
        x: [-bound, -bound],
        y: [limitValue - 5, limitValue + 5],
        type: 'scatter',
        mode: 'lines',
        name: `x = ${(-bound).toFixed(2)}`,
        line: { color: palette.limit.boundary, width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
    }

    traces.push({
      x: [xMin, xMax],
      y: [limitValue, limitValue],
      type: 'scatter',
      mode: 'lines',
      name: `lim x→${limitValue}`,
      line: {
        color: palette.limit.limitLine,
        width: 2,
        dash: 'dash'
      }
    });

    // x = 0 reference line
    traces.push({
      x: [0, 0],
      y: [limitValue - 3, limitValue + 3],
      type: 'scatter',
      mode: 'lines',
      name: 'x = 0',
      line: { color: palette.limit.verticalAsymptote, width: 1, dash: 'dot' },
      hoverinfo: 'skip', showlegend: false
    });

    return traces;
  }, [params, activeFunction, themeMode]);

  const coefficientConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (k)',
      min: 0.5,
      max: 3,
      step: 0.1,
      type: 'slider'
    }
  ];

  const limitValue = (activeFunction === 'arcsin' || activeFunction === 'arctan') ? 1 : -1;
  const k = params.coefficient;

  const functionTitle = activeFunction === 'arcsin' ? `arcsin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        activeFunction === 'arctan' ? `arctan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        `(arccos(${k.toFixed(1)}x) - π/2) / (${k.toFixed(1)}x)`;

  const fnLatex = activeFunction === 'arcsin' ? `arcsin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  activeFunction === 'arctan' ? `arctan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  `(arccos(${k.toFixed(1)}x) - π/2) / (${k.toFixed(1)}x)`;

  const limitLatex = limitValue === 1 ? '1' : '-1';

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Inverse Trig. — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Explore the classic limits of inverse trigonometric functions at x = 0.
        Like their trigonometric counterparts, these functions satisfy simple asymptotic relations:
        arcsin(x) ~ x, arctan(x) ~ x, and arccos(x) = π/2 − x + o(x) as x → 0.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'arcsin'} onClick={() => setActiveFunction('arcsin')}>
          arcsin(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arctan'} onClick={() => setActiveFunction('arctan')}>
          arctan(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arccos'} onClick={() => setActiveFunction('arccos')}>
          (arccos(kx) − π/2) / (kx)
        </ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          f(x) = {fnLatex}<br/>
          As x → 0, f(x) → {limitLatex}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {activeFunction === 'arcsin' && 'arcsin(x) ~ x as x → 0, so arcsin(kx)/(kx) → 1. This is the inverse counterpart of sin(x)/x → 1, and is used in deriving the derivative (arcsin x)′ = 1/√(1−x²).'}
        {activeFunction === 'arctan' && 'arctan(x) ~ x as x → 0, so arctan(kx)/(kx) → 1. This is equivalent to tan(x)/x → 1 via the inverse relationship, and gives the derivative (arctan x)′ = 1/(1+x²).'}
        {activeFunction === 'arccos' && 'arccos(x) = π/2 − arcsin(x), so its first-order expansion is arccos(x) = π/2 − x + o(x). Hence (arccos(kx)−π/2)/(kx) → −1, consistent with (arccos x)′ = −1/√(1−x²).'}
      </SectionDescription>

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
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = ${functionTitle}`}
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

export default InverseTrigonometricLimit;

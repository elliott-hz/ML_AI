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

/**
 * Trigonometric Function Limit - classic finite limits of trig functions
 *
 *   lim(x→0) sin(kx)/(kx) = 1
 *   lim(x→0) tan(kx)/(kx) = 1
 *   lim(x→0) (1 - cos(kx))/x = 0
 */
const TrigonometricFunctionLimit = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,        // 缩放系数 k
    xRange: [-8, 8],       // X轴范围
    plotStyle: 'medium',   // Plot 样式档位
    aspectRatio: 'auto',   // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('sin');

  // 生成函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-8, 8];
    const k = params.coefficient || 1;
    const numPoints = 400;

    const fnLabel = activeFunction === 'sin' ? `sin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                    activeFunction === 'tan' ? `tan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                    activeFunction === 'cos1' ? `(1-cos(${k.toFixed(1)}x)) / x` :
                    `(1-cos(${k.toFixed(1)}x)) / (${k.toFixed(1)}x)²`;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      let y;

      if (activeFunction === 'sin') {
        y = Math.abs(k * x) > 1e-10 ? Math.sin(k * x) / (k * x) : 1;
      } else if (activeFunction === 'tan') {
        y = Math.abs(k * x) > 1e-10 ? Math.tan(k * x) / (k * x) : 1;
      } else if (activeFunction === 'cos1') {
        y = Math.abs(k * x) > 1e-10 ? (1 - Math.cos(k * x)) / x : 0;
      } else {
        // (1 - cos(kx)) / (kx)²  →  1/2
        y = Math.abs(k * x) > 1e-10 ? (1 - Math.cos(k * x)) / (k * k * x * x) : 0.5;
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
    if (activeFunction === 'sin' || activeFunction === 'tan') {
      limitValue = 1;
    } else if (activeFunction === 'cos1') {
      limitValue = 0;
    } else {
      limitValue = 0.5;
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

    // 垂直参考线 x = 0
    traces.push({
      x: [0, 0],
      y: [limitValue - 2, limitValue + 2],
      type: 'scatter',
      mode: 'lines',
      name: 'x = 0',
      line: {
        color: palette.limit.verticalAsymptote,
        width: 1,
        dash: 'dot'
      }
    });

    return traces;
  }, [params, activeFunction, themeMode]);

  // 参数配置
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

  const limitValue = (activeFunction === 'sin' || activeFunction === 'tan') ? 1 :
                     activeFunction === 'cos1' ? 0 : 0.5;
  const k = params.coefficient;

  const functionTitle = activeFunction === 'sin' ? `sin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        activeFunction === 'tan' ? `tan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                        activeFunction === 'cos1' ? `(1 - cos(${k.toFixed(1)}x)) / x` :
                        `(1 - cos(${k.toFixed(1)}x)) / (${k.toFixed(1)}x)²`;

  const fnLatex = activeFunction === 'sin' ? `sin(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  activeFunction === 'tan' ? `tan(${k.toFixed(1)}x) / (${k.toFixed(1)}x)` :
                  activeFunction === 'cos1' ? `(1 - cos(${k.toFixed(1)}x)) / x` :
                  `(1 - cos(${k.toFixed(1)}x)) / (${k.toFixed(1)}x)²`;

  const limitLatex = limitValue === 1 ? '1' : limitValue === 0.5 ? '1/2' : '0';

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Trigonometric — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Explore the classic finite limits of trigonometric functions. These limits are foundational
        for deriving derivatives of trigonometric functions in calculus.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'sin'} onClick={() => setActiveFunction('sin')}>
          sin(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'tan'} onClick={() => setActiveFunction('tan')}>
          tan(kx) / (kx)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'cos1'} onClick={() => setActiveFunction('cos1')}>
          (1 - cos(kx)) / x
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'cos2'} onClick={() => setActiveFunction('cos2')}>
          (1 - cos(kx)) / (kx)²
        </ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          f(x) = {fnLatex}<br/>
          As x → 0, f(x) → {limitLatex}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {activeFunction === 'sin' && 'This is the most important limit in trigonometry. The function sin(x)/x has a removable discontinuity at x = 0 with limit 1.'}
        {activeFunction === 'tan' && 'Similarly to sin(x)/x, this limit follows from tan(x) = sin(x)/cos(x) and the fact that cos(x) → 1 as x → 0.'}
        {activeFunction === 'cos1' && 'The function (1 - cos(x))/x approaches 0 as x → 0, which is essential for deriving the derivative of cos(x).'}
        {activeFunction === 'cos2' && 'This second-order limit (1-cos(x))/x² → 1/2 follows from the Taylor expansion cos(x) = 1 − x²/2 + ... It is foundational for understanding second-order approximations.'}
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
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default TrigonometricFunctionLimit;

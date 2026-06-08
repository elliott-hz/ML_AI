// UI Pattern: StandardSinglePlot — controls left + single LimitPlotter right
import React, { useState, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import LimitPlotter from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula,
  QuickSetRow, QuickBtn
} from '../../../components/limit/shared/LimitStyled';
import { commonParamsConfig } from '../../../constants/limitConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Exponential Function Limit — f(x) = a·bˣ
 *
 *   b > 1:  lim(x→-∞) a·bˣ = 0  (horizontal asymptote on the left)
 *   0 < b < 1:  lim(x→+∞) a·bˣ = 0  (horizontal asymptote on the right)
 *   b = 1:  f(x) = a (constant)
 */
const ExponentialFunctionLimit = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,       // 系数 a
    base: 2,              // 底数 b
    xRange: [-5, 5],      // X轴范围
    plotStyle: 'medium',  // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例
    legendPosition: 'top-right'
  });

  // 生成连续函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-5, 5];
    const a = params.coefficient || 1;
    const b = params.base || 2;
    const numPoints = 300;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValues.push(x);
      yValues.push(a * Math.pow(b, x));
    }

    // 底数显示名
    const baseLabel = Math.abs(b - Math.E) < 1e-9 ? 'e' : b.toFixed(1);

    const traces = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: `f(x) = ${a.toFixed(1)}·${baseLabel}ˣ`,
      line: {
        color: palette.mainTraces.primary,
        width: 2.5
      }
    }];

    // ✅ 水平渐近线 y = 0 (only when base ≠ 1 — constant function has no asymptote)
    if (Math.abs(b - 1) > 1e-9) {
      traces.push({
        x: [xMin, xMax],
        y: [0, 0],
        type: 'scatter',
        mode: 'lines',
        name: 'lim x→0',
        line: {
          color: palette.limit.limitLine,
          width: 2,
          dash: 'dash'
        }
      });
    }

    return traces;
  }, [params, themeMode]);

  // 参数配置
  const functionConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.1,
      max: 5,
      step: 0.1,
      type: 'slider'
    },
    {
      name: 'base',
      label: 'Base (b)',
      min: 0.1,
      max: 5,
      step: 0.1,
      type: 'slider'
    }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -10,
      max: 10,
      step: 1,
      default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  const a = params.coefficient;
  const b = params.base;
  const baseLabel = Math.abs(b - Math.E) < 1e-9 ? 'e' : b.toFixed(1);

  // 极限描述
  let limitDesc;
  if (b > 1) {
    limitDesc = `As x → −∞, f(x) → 0  (horizontal asymptote on the left)`;
  } else if (b < 1) {
    limitDesc = `As x → +∞, f(x) → 0  (horizontal asymptote on the right)`;
  } else {
    limitDesc = `f(x) = ${a.toFixed(1)} (constant) — limit everywhere = ${a.toFixed(1)}`;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Exponential — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Observe how the exponential function a·bˣ behaves at its limits.
        The base b determines which side approaches the horizontal asymptote y = 0.
      </SectionDescription>

      <SectionTitle>Function: y = a·b<sup>x</sup></SectionTitle>

      <FormulaBox>
        <Formula>
          f(x) = {a.toFixed(1)}·{baseLabel}<sup>x</sup><br/>
          {limitDesc}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {b > 1
          ? `With b = ${b.toFixed(1)} > 1, the function grows exponentially as x → +∞ and approaches 0 as x → −∞.`
          : b < 1
            ? `With b = ${b.toFixed(1)} < 1, the function decays toward 0 as x → +∞ and grows unbounded as x → −∞.`
            : 'The base is 1, making this a constant function with no interesting limit behavior.'}
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={functionConfig}
            />
          </ParameterSection>

          <QuickSetRow>
            <span>Quick set:</span>
            <QuickBtn onClick={() => setParams(p => ({ ...p, base: Math.E }))}>
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
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = ${a.toFixed(1)}·${baseLabel}ˣ`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[
              { name: 'coefficient', label: 'Coefficient (a)', min: 0.1, max: 5, step: 0.1 },
              { name: 'base', label: 'Base (b)', min: 0.1, max: 5, step: 0.1 },
            ]} />
          </LimitPlotter>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ExponentialFunctionLimit;

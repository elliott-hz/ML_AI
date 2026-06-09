// UI Pattern: DualSequencePlot — two stacked LimitPlotters (sequence + function)
import React, { useState, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import LimitPlotter from '../../../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula,
  FunctionSection
} from '../../../../../components/style/LimitStyled';
import { legendPositionConfig, plotStyleConfig } from '../../../../../constants/limitConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';

/**
 * Convergent Sequence 1 - u_n = 1/3^n → 0
 */
const ConvergentSequence1 = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    base: 2,           // 底数
    maxN: 50,          // 显示的项数
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成离散序列数据
  const generateSequenceData = useCallback(() => {
    const maxN = params.maxN || 50;
    const base = params.base || 2;

    const nValues = [];
    const uValues = [];

    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
      uValues.push(1 / Math.pow(base, n));
    }

    const traces = [{
      x: nValues,
      y: uValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'uₙ',
      line: {
        color: palette.mainTraces.primary,
        width: 2,
        shape: 'spline'
      },
      marker: {
        size: 8,
        color: palette.mainTraces.primary,
        symbol: 'circle'
      }
    }];

    // ✅ 添加收敛辅助线（y=0）
    traces.push({
      x: [0, maxN],
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

    return traces;
  }, [params, themeMode]);

  // 生成连续原函数数据
  const generateFunctionData = useCallback(() => {
    const maxN = Math.min(params.maxN, 20);
    const base = params.base || 2;
    const numPoints = 200;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = 0 + (maxN * i) / numPoints;
      xValues.push(x);
      yValues.push(1 / Math.pow(base, x));
    }

    return [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)',
      line: {
        color: palette.mainTraces.primary,
        width: 2.5
      }
    }];
  }, [params, themeMode]);

  // 参数配置 - 分组版本
  const coefficientConfig = [
    { name: 'base', label: 'Base (b)', min: 1.1, max: 10, step: 0.1 }
  ];

  const generalSettingsConfig = [
    { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 100, step: 10 },
    ...legendPositionConfig,
    ...plotStyleConfig,
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Convergent Sequence: Exponential Decay</SectionTitle>
      </Header>

      <SectionDescription>
        This sequence demonstrates exponential decay. As n increases, the terms rapidly approach zero.
        The larger the base, the faster the convergence.
      </SectionDescription>

      <SectionTitle>Sequence: u<sub>n</sub> = 1/a<sup>n</sup></SectionTitle>

      <FormulaBox>
        <Formula>
          lim<sub>n→∞</sub> <span style={{ fontSize: '24px' }}>1/a<sup>n</sup></span> = 0
        </Formula>
      </FormulaBox>

      <SectionDescription>
        Adjust the base (a) to see how it affects the rate of convergence.
        Larger bases result in faster decay toward zero.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
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
              config={generalSettingsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={generateSequenceData()}
            xRange={[0, params.maxN]}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            title={`Sequence: uₙ = 1/${params.base}ⁿ`}
            showLimitLine={true}
            limitValue={0}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[
              { name: 'base', label: 'Base (b)', min: 1.1, max: 10, step: 0.1 },
              { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 100, step: 10 },
            ]} />
          </LimitPlotter>

          {/* 原函数图像 */}
          <div style={{ marginTop: '1rem' }}>
            <LimitPlotter
              data={generateFunctionData()}
              xRange={[0, Math.min(params.maxN, 20)]}
              title={`Original Function: f(x) = 1/${params.base}ˣ`}
              plotStyle={params.plotStyle}
              aspectRatio={params.aspectRatio}
              legendPosition={params.legendPosition}
            />
          </div>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ConvergentSequence1;

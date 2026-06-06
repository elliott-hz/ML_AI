// UI Pattern: DualSequencePlot — two stacked LimitPlotters (sequence + function)
import React, { useState, useCallback } from 'react';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula,
  FunctionSection
} from '../../../components/limit/shared/LimitStyled';
import { legendPositionConfig, plotStyleConfig } from '../../../constants/limitConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Convergent Sequence 2 - u_n = n/(n+1) → 1
 */
const ConvergentSequence2 = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    maxN: 50,          // 显示的项数
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成离散序列数据
  const generateSequenceData = useCallback(() => {
    const maxN = params.maxN || 50;

    const nValues = [];
    const uValues = [];

    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
      uValues.push(n / (n + 1));
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

    // ✅ 添加收敛辅助线（y=1）
    traces.push({
      x: [0, maxN],
      y: [1, 1],
      type: 'scatter',
      mode: 'lines',
      name: 'lim x→1',
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
    const numPoints = 200;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = 0 + (maxN * i) / numPoints;
      xValues.push(x);
      yValues.push(x / (x + 1));
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
        <SectionTitle>Convergent Sequence: Rational Approach</SectionTitle>
      </Header>

      <SectionDescription>
        This sequence demonstrates how a rational function approaches its horizontal asymptote.
        The terms approach 1 from below, getting closer but never exceeding it.
      </SectionDescription>

      <SectionTitle>Sequence: u<sub>n</sub> = n/(n+1)</SectionTitle>

      <FormulaBox>
        <Formula>
          lim<sub>n→</sub> <span style={{ fontSize: '24px' }}>n/(n+1)</span> = 1
        </Formula>
      </FormulaBox>

      <SectionDescription>
        Observe how the sequence approaches 1 as n increases.
        Each term is slightly less than 1, but the difference becomes negligible for large n.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
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
            title={`Sequence: uₙ = n/(n+1)`}
          />

          {/* 原函数图像 */}
          <div style={{ marginTop: '1rem' }}>
            <LimitPlotter
              data={generateFunctionData()}
              xRange={[0, Math.min(params.maxN, 20)]}
              title={`Original Function: f(x) = x/(x+1)`}
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

export default ConvergentSequence2;

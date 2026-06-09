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
} from '../../../../../components/limit/shared/LimitStyled';
import { legendPositionConfig, plotStyleConfig } from '../../../../../constants/limitConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';

/**
 * Divergent Sequence 2 - u_n = sin(n) (oscillating)
 */
const DivergentSequence2 = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    maxN: 20,          // 显示的项数
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成离散序列数据（振荡发散）
  const generateSequenceData = useCallback(() => {
    const maxN = params.maxN || 20;

    const nValues = [];
    const uValues = [];

    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
      uValues.push(Math.sin(n));
    }

    return [{
      x: nValues,
      y: uValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'uₙ',
      line: {
        color: palette.mainTraces.primary, // ✅ 改为蓝色，与收敛序列一致
        width: 2,
        shape: 'spline'
      },
      marker: {
        size: 8,
        color: palette.mainTraces.primary, // ✅ 改为蓝色，与收敛序列一致
        symbol: 'circle'
      }
    }];
  }, [params, themeMode]);

  // 生成连续原函数数据
  const generateFunctionData = useCallback(() => {
    const maxN = Math.min(params.maxN, 30);
    const numPoints = 200;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = 0 + (maxN * i) / numPoints;
      xValues.push(x);
      yValues.push(Math.sin(x));
    }

    return [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)',
      line: {
        color: palette.mainTraces.primary, // ✅ 改为蓝色，与收敛序列一致
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

        <SectionTitle>Divergent Sequence: Oscillation</SectionTitle>
      </Header>

      <SectionDescription>
        This sequence demonstrates oscillatory behavior. The terms follow a sine wave pattern,
        oscillating between -1 and 1 without settling on a single value. Therefore, the limit does not exist.
      </SectionDescription>

      <SectionTitle>Sequence: u<sub>n</sub> = sin(n)</SectionTitle>

      <FormulaBox>
        <Formula>
          lim<sub>n→</sub> <span style={{ fontSize: '24px' }}>sin(n)</span> does not exist
        </Formula>
      </FormulaBox>

      <SectionDescription>
        Observe how sin(n) oscillates as n increases through integer values.
        Since π is irrational, sin(n) never repeats exactly and continues to oscillate indefinitely.
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
            title={`Sequence: uₙ = sin(n)`}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[
              { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 100, step: 10 },
            ]} />
          </LimitPlotter>

          {/* 原函数图像 */}
          <div style={{ marginTop: '1rem' }}>
            <LimitPlotter
              data={generateFunctionData()}
              xRange={[0, Math.min(params.maxN, 30)]}
              title={`Original Function: f(x) = sin(x)`}
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

export default DivergentSequence2;

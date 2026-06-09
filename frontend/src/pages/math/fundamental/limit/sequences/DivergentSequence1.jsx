// UI Pattern: DualSequencePlot — two stacked LimitPlotters (sequence + function)
import React, { useState, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import LimitPlotter from '../../../components/visualization/LimitPlotter';
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
 * Divergent Sequence 1 - u_n = n² → ∞
 */
const DivergentSequence1 = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    maxN: 20,          // 显示的项数
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成离散序列数据（发散序列，不需要辅助线）
  const generateSequenceData = useCallback(() => {
    const maxN = params.maxN || 20;

    const nValues = [];
    const uValues = [];

    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
      uValues.push(Math.pow(n, 2));
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
    const maxN = Math.min(params.maxN, 20);
    const numPoints = 200;

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = 0 + (maxN * i) / numPoints;
      xValues.push(x);
      yValues.push(Math.pow(x, 2));
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
    { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 50, step: 5 },
    ...legendPositionConfig,
    ...plotStyleConfig,
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Divergent Sequence: Quadratic Growth</SectionTitle>
      </Header>

      <SectionDescription>
        This sequence demonstrates unbounded growth. As n increases, the terms grow quadratically
        and approach infinity. There is no finite limit.
      </SectionDescription>

      <SectionTitle>Sequence: u<sub>n</sub> = n²</SectionTitle>

      <FormulaBox>
        <Formula>
          lim<sub>n→∞</sub> <span style={{ fontSize: '24px' }}>n²</span> = +∞
        </Formula>
      </FormulaBox>

      <SectionDescription>
        Observe how rapidly the sequence grows. The quadratic nature means each term
        increases much faster than the previous one, leading to divergence.
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
            title={`Sequence: uₙ = n²`}
          >
            <ParameterControls parameters={params} onChange={setParams} config={[
              { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 50, step: 5 },
            ]} />
          </LimitPlotter>

          {/* 原函数图像 */}
          <div style={{ marginTop: '1rem' }}>
            <LimitPlotter
              data={generateFunctionData()}
              xRange={[0, Math.min(params.maxN, 20)]}
              title={`Original Function: f(x) = x²`}
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

export default DivergentSequence1;

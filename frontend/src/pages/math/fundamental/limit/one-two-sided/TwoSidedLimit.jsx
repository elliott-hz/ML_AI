// UI Pattern: StandardSinglePlot — controls left + single LimitPlotter right
import React, { useState, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../../../constants/plotThemeConfig';
import LimitPlotter from '../../../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../../../components/visualization/ParameterControls';
import ParameterSection from '../../../../../components/visualization/ParameterSection';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula
} from '../../../../../components/style/LimitStyled';
import { commonParamsConfig } from '../../../../../constants/limitConfig';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';

/**
 * Two-Sided Limit - Continuous function showing left and right limits are equal
 * f(x) = (x²-1)/(x-1), which simplifies to x+1 for x ≠ 1
 */
const TwoSidedLimit = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);
  const [params, setParams] = useState({
    xRange: [-1, 3],     // X轴范围（围绕x=1）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成连续函数数据（有理函数，在 x=1 处有可去间断点）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-1, 3];
    const numPoints = 200;
    
    const traces = [];
    
    // ✅ 先计算函数的 Y 范围，用于确定垂直辅助线的长度
    let minY = Infinity;
    let maxY = -Infinity;
    
    // 遍历 X 范围，计算函数的最小和最大值
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      if (Math.abs(x - 1) > 0.01) { // 避免接近 1
        const y = (x * x - 1) / (x - 1); // f(x) = x+1
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    
    // 添加一些边距，确保辅助线稍微超出函数范围
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;
    
    // ✅ 将数据分为两部分：x < 1 和 x > 1（避免在 x=1 处连接）
    // 第一部分：x < 1
    if (xMin < 1) {
      const xValuesLeft = [];
      const yValuesLeft = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((Math.min(1, xMax) - xMin) * i) / (numPoints / 2);
        if (Math.abs(x - 1) > 0.01) { // 避免接近 1
          xValuesLeft.push(x);
          // f(x) = (x²-1)/(x-1) = x+1 (for x ≠ 1)
          yValuesLeft.push((x * x - 1) / (x - 1));
        }
      }
      
      if (xValuesLeft.length > 0) {
        traces.push({
          x: xValuesLeft,
          y: yValuesLeft,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x)',
          line: {
            color: palette.mainTraces.primary,
            width: 2.5
          }
        });
      }
    }

    // 第二部分：x > 1
    if (xMax > 1) {
      const xValuesRight = [];
      const yValuesRight = [];

      for (let i = 0; i <= numPoints / 2; i++) {
        const x = Math.max(1, xMin) + ((xMax - Math.max(1, xMin)) * i) / (numPoints / 2);
        if (Math.abs(x - 1) > 0.01) { // 避免接近 1
          xValuesRight.push(x);
          // f(x) = (x²-1)/(x-1) = x+1 (for x ≠ 1)
          yValuesRight.push((x * x - 1) / (x - 1));
        }
      }

      if (xValuesRight.length > 0) {
        traces.push({
          x: xValuesRight,
          y: yValuesRight,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x)',
          line: {
            color: palette.mainTraces.primary,
            width: 2.5
          }
        });
      }
    }

    // ✅ 添加垂直辅助线（x=1，可去间断点）- 使用动态计算的 Y 范围
    traces.push({
      x: [1, 1],
      y: [auxYMin, auxYMax],
      type: 'scatter',
      mode: 'lines',
      name: 'x = 1',
      line: {
        color: palette.limit.limitLine,
        width: 2,
        dash: 'dash'
      }
    });

    // ✅ 添加水平辅助线（y=2，极限值）
    traces.push({
      x: [xMin, xMax],
      y: [2, 2],
      type: 'scatter',
      mode: 'lines',
      name: 'lim x→2',
      line: {
        color: palette.limit.limitLine,
        width: 2,
        dash: 'dash'
      }
    });

    // ✅ 添加可去间断点 (1, 2) - 空心点
    traces.push({
      x: [1],
      y: [2],
      type: 'scatter',
      mode: 'markers+text',
      name: 'Hole',
      marker: {
        size: 12,
        color: palette.limit.hole,
        symbol: 'circle-open',
        line: {
          color: palette.limit.hole,
          width: 2
        }
      },
      text: ['Hole at (1, 2)'],
      textposition: 'top center',
      textfont: {
        size: 12,
        color: palette.limit.hole
      }
    });
    
    return traces;
  }, [params, themeMode]);

  // 参数配置
  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -2,
      max: 4,
      step: 0.5,
      default: [-1, 3]
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

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Two-Sided Limit</SectionTitle>
      </Header>
      
      <SectionDescription>
        Explore two-sided limits using a continuous rational function. 
        Observe how the left-hand limit and right-hand limit approach the same value as x → 1.
      </SectionDescription>

      <SectionTitle>Rational Function Example</SectionTitle>
      
      <FormulaBox>
        <Formula>
          f(x) = (x² - 1) / (x - 1)<br/><br/>
          Simplifies to: f(x) = x + 1, &nbsp;&nbsp;x ≠ 1
        </Formula>
      </FormulaBox>
      
      <SectionDescription>
        <strong>Left-hand limit:</strong> lim<sub>x→1⁻</sub> f(x) = 2<br/>
        <strong>Right-hand limit:</strong> lim<sub>x→1⁺</sub> f(x) = 2<br/><br/>
        Since both limits are <strong>equal</strong>, the two-sided limit exists:<br/>
        <strong>lim<sub>x→1</sub> f(x) = 2</strong>
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          {/* 显示原函数图，带辅助线和关键点 */}
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Rational Function: Left = Right Limit`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default TwoSidedLimit;

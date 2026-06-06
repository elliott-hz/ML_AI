// UI Pattern: StandardSinglePlot — controls left + single LimitPlotter right
import React, { useState, useCallback } from 'react';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula
} from '../../../components/limit/shared/LimitStyled';
import { commonParamsConfig } from '../../../constants/limitConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Infinitesimal Property 1: Sum of Finite Infinitesimals
 * Shows that x + x² + x³ → 0 as x → 0
 */
const InfinitesimalSum = () => {
  // 参数状态
  const [params, setParams] = useState({
    xRange: [-2, 2],     // X轴范围（围绕x=0）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // 生成连续函数数据（多条曲线）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-2, 2];
    const numPoints = 200;
    
    const traces = [];
    
    // ✅ 先计算所有曲线的 Y 范围，用于确定辅助线的长度
    let minY = Infinity;
    let maxY = -Infinity;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      const y1 = x;
      const y2 = x * x;
      const y3 = x * x * x;
      const ySum = x + x * x + x * x * x;
      
      if (y1 < minY) minY = y1;
      if (y1 > maxY) maxY = y1;
      if (y2 < minY) minY = y2;
      if (y2 > maxY) maxY = y2;
      if (y3 < minY) minY = y3;
      if (y3 > maxY) maxY = y3;
      if (ySum < minY) minY = ySum;
      if (ySum > maxY) maxY = ySum;
    }
    
    // 添加一些边距，确保辅助线稍微超出函数范围
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;
    
    // ✅ 曲线1：无穷小 α₁(x) = x - 蓝色实线
    const xValues1 = [];
    const yValues1 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValues1.push(x);
      yValues1.push(x);
    }
    
    traces.push({
      x: xValues1,
      y: yValues1,
      type: 'scatter',
      mode: 'lines',
      name: 'α₁(x) = x',
      line: { 
        color: palette.mainTraces.primary,
        width: 2.5
      }
    });
    
    // ✅ 曲线2：无穷小 α₂(x) = x² - 绿色实线
    const xValues2 = [];
    const yValues2 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValues2.push(x);
      yValues2.push(x * x);
    }
    
    traces.push({
      x: xValues2,
      y: yValues2,
      type: 'scatter',
      mode: 'lines',
      name: 'α₂(x) = x²',
      line: { 
        color: palette.mainTraces.secondary,
        width: 2.5
      }
    });
    
    // ✅ 曲线3：无穷小 α₃(x) = x³ - 橙色实线
    const xValues3 = [];
    const yValues3 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValues3.push(x);
      yValues3.push(x * x * x);
    }
    
    traces.push({
      x: xValues3,
      y: yValues3,
      type: 'scatter',
      mode: 'lines',
      name: 'α₃(x) = x³',
      line: { 
        color: palette.mainTraces.tertiary,
        width: 2.5
      }
    });
    
    // ✅ 曲线4：和 β(x) = x + x² + x³ - 红色实线（主要曲线）
    const xValuesSum = [];
    const yValuesSum = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesSum.push(x);
      yValuesSum.push(x + x * x + x * x * x);
    }
    
    traces.push({
      x: xValuesSum,
      y: yValuesSum,
      type: 'scatter',
      mode: 'lines',
      name: 'β(x) = x + x² + x³',
      line: { 
        color: palette.limit.hole, // 红色（突出显示）
        width: 3
      }
    });
    
    // ✅ 添加垂直辅助线（x=0）- 使用动态计算的 Y 范围
    traces.push({
      x: [0, 0],
      y: [auxYMin, auxYMax],
      type: 'scatter',
      mode: 'lines',
      name: 'x = 0',
      line: { 
        color: palette.limit.limitLine, // 金黄色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    // ✅ 添加水平辅助线（y=0，极限值）
    traces.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'lim x→0',
      line: {
        color: palette.limit.limitLine, // 金黄色
        width: 2,
        dash: 'dash'
      }
    });

    // ✅ 添加极限点 (0, 0)
    traces.push({
      x: [0],
      y: [0],
      type: 'scatter',
      mode: 'markers+text',
      name: 'Limit',
      marker: { 
        size: 12, 
        color: palette.limit.hole, // 红色
        symbol: 'circle'
      },
      text: ['lim = 0'],
      textposition: 'top center',
      textfont: {
        size: 14,
        color: palette.limit.hole,
        family: 'Arial, sans-serif'
      }
    });
    
    return traces;
  }, [params]);

  // 参数配置
  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -5,
      max: 5,
      step: 0.5,
      default: [-2, 2]
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
        <SectionTitleH1>Infinitesimal Property 1: Sum</SectionTitleH1>
      </Header>

      <SectionDescription>
        The sum of a finite number of infinitesimals is still an infinitesimal.
        Observe how each individual term (x, x², x³) approaches 0 as x → 0,
        and their sum also approaches 0.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          If α₁(x) = x, α₂(x) = x², α₃(x) = x³ are infinitesimals:<br/><br/>
          Then β(x) = α₁ + α₂ + α₃ = x + x² + x³<br/><br/>
          lim<sub>x→0</sub> β(x) = lim<sub>x→0</sub>(x + x² + x³) = 0
        </Formula>
      </FormulaBox>

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
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Sum of Infinitesimals: x + x² + x³`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfinitesimalSum;

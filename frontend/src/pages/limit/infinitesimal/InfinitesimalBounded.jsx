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
 * Infinitesimal Property 2: Bounded Function × Infinitesimal
 * Shows that cos(x)·x → 0 as x → 0
 */
const InfinitesimalBounded = () => {
  // 参数状态
  const [params, setParams] = useState({
    xRange: [-3, 3],     // X轴范围（围绕x=0）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // 生成连续函数数据（多条曲线）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-3, 3];
    const numPoints = 200;
    
    const traces = [];
    
    // ✅ 先计算所有曲线的 Y 范围，用于确定辅助线的长度
    let minY = Infinity;
    let maxY = -Infinity;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      const yCos = Math.cos(x);
      const yX = x;
      const yProduct = Math.cos(x) * x;
      
      if (yCos < minY) minY = yCos;
      if (yCos > maxY) maxY = yCos;
      if (yX < minY) minY = yX;
      if (yX > maxY) maxY = yX;
      if (yProduct < minY) minY = yProduct;
      if (yProduct > maxY) maxY = yProduct;
    }
    
    // 添加一些边距，确保辅助线稍微超出函数范围
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;
    
    // ✅ 曲线1：有界函数 f(x) = cos(x) - 蓝色虚线
    const xValuesCos = [];
    const yValuesCos = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesCos.push(x);
      yValuesCos.push(Math.cos(x));
    }
    
    traces.push({
      x: xValuesCos,
      y: yValuesCos,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x) = cos(x)',
      line: { 
        color: palette.mainTraces.primary,
        width: 2.5,
        dash: 'dash' // 虚线，表示有界函数
      }
    });
    
    // ✅ 曲线2：无穷小 α(x) = x - 绿色实线
    const xValuesX = [];
    const yValuesX = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesX.push(x);
      yValuesX.push(x);
    }
    
    traces.push({
      x: xValuesX,
      y: yValuesX,
      type: 'scatter',
      mode: 'lines',
      name: 'α(x) = x',
      line: { 
        color: palette.mainTraces.secondary,
        width: 2.5
      }
    });
    
    // ✅ 曲线3：乘积 g(x) = cos(x)·x - 红色实线（主要曲线）
    const xValuesProduct = [];
    const yValuesProduct = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesProduct.push(x);
      yValuesProduct.push(Math.cos(x) * x);
    }
    
    traces.push({
      x: xValuesProduct,
      y: yValuesProduct,
      type: 'scatter',
      mode: 'lines',
      name: 'g(x) = cos(x)·x',
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
      default: [-3, 3]
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
        <SectionTitleH1>Infinitesimal Property 2: Bounded × Infinitesimal</SectionTitleH1>
      </Header>

      <SectionDescription>
        A bounded function multiplied by an infinitesimal is still an infinitesimal.
        Observe how cos(x) oscillates between -1 and 1 (bounded), but when multiplied by x
        (which approaches 0), the product also approaches 0.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          If f(x) = cos(x) is bounded: |cos(x)| ≤ 1<br/>
          And α(x) = x is infinitesimal: lim<sub>x→0</sub> x = 0<br/><br/>
          Then g(x) = f(x)·α(x) = cos(x)·x<br/><br/>
          lim<sub>x→0</sub> g(x) = lim<sub>x→0</sub>(cos(x)·x) = 0
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
            title={`Bounded × Infinitesimal: cos(x)·x`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfinitesimalBounded;

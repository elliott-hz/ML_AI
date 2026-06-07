// UI Pattern: MultiSectionPlot — multiple function sections, each with its own content layout and controls
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import FunctionPlotter from '../../../components/visualization/FunctionPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel
} from '../../../components/common/LayoutStyled';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * 周期性函数子页面 - 展示正弦函数的周期性特性
 */
const PeriodicFunctions = () => {

  // 周期函数参数状态
  const [periodicParams, setPeriodicParams] = useState({ 
    a: 1,              // 振幅
    b: 1,              // 频率
    c: 0,              // 相位
    xRange: [-10, 10], // X轴范围
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // 周期函数参数配置 - 分组版本
  const periodicCoefficientConfig = [
    { name: 'a', label: 'Amplitude (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Frequency (b)', min: 0.1, max: 5, step: 0.1 },
    { name: 'c', label: 'Phase (c)', min: -Math.PI, max: Math.PI, step: 0.1 }
  ];

  const periodicPlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const periodicViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-10, 10] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const periodicLegendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const periodicCommonConfig = [
    ...periodicLegendPositionConfig,
    ...periodicPlotStyleConfig,
    ...periodicViewRangeConfig
  ];

  // ✅ 新增：在页面中定义周期函数的数据生成逻辑
  const generatePeriodicData = useCallback(() => {
    const { a: amplitude, b: frequency, c: phase } = periodicParams;
    const xMin = periodicParams.xRange[0];
    const xMax = periodicParams.xRange[1];
    const numPoints = 500;
    
    // ✅ 新增：格式化数值显示（1位小数）
    const formatNum = (num) => Number(num).toFixed(1);
    
    // 生成主曲线：f(x) = a·sin(bx + c)
    const xValues = [];
    const yValues = [];
    const step = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = amplitude * Math.sin(frequency * x + phase);
      xValues.push(x);
      yValues.push(y);
    }
    
    // 计算周期长度和波峰位置
    const period = 2 * Math.PI / frequency;
    const basePeakX = (Math.PI / 2 - phase) / frequency;
    
    // 找到最接近原点的波峰
    let firstPeakX = basePeakX;
    if (Math.abs(basePeakX) > period / 2) {
      const n = Math.round(-basePeakX / period);
      firstPeakX = basePeakX + n * period;
    }
    
    // 生成周期标记线（垂直辅助线）
    const auxiliaryLines = [];
    let x = firstPeakX;
    
    // 向左扩展
    while (x >= xMin - period) {
      if (x >= xMin && x <= xMax) {
        auxiliaryLines.push({
          x: [x, x],
          y: [-Math.abs(amplitude) - 1, Math.abs(amplitude) + 1],
          type: 'scatter',
          mode: 'lines',
          name: `Peak at x=${formatNum(x)}`,
          line: { 
            color: palette.limit.limitLine,
            width: 1,
            dash: 'dash'
          },
          showlegend: false
        });
      }
      x -= period;
    }

    // 向右扩展
    x = firstPeakX + period;
    while (x <= xMax + period) {
      if (x >= xMin && x <= xMax) {
        auxiliaryLines.push({
          x: [x, x],
          y: [-Math.abs(amplitude) - 1, Math.abs(amplitude) + 1],
          type: 'scatter',
          mode: 'lines',
          name: `Peak at x=${formatNum(x)}`,
          line: {
            color: palette.limit.limitLine,
            width: 1, 
            dash: 'dash' 
          },
          showlegend: false
        });
      }
      x += period;
    }
    
    return [
      {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${formatNum(amplitude)}·sin(${formatNum(frequency)}x + ${formatNum(phase)})`,
        line: { color: palette.mainTraces.primary, width: 2 }
      },
      ...auxiliaryLines
    ];
  }, [periodicParams.a, periodicParams.b, periodicParams.c, periodicParams.xRange, themeMode]);
  
  // ✅ 使用 useMemo 缓存数据
  const traces = useMemo(() => generatePeriodicData(), [generatePeriodicData]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitle>Periodic Functions</SectionTitle>
      </Header>
      
      <SectionDescription>
        Explore periodic behavior in functions. A periodic function repeats its values at regular intervals called the period. 
        The sine function f(x) = a·sin(bx + c) is a classic example of a periodic function.
      </SectionDescription>

      {/* 周期函数部分 */}
      <SectionTitle> Periodic Function: f(x) = a·sin(bx + c)</SectionTitle>
      <SectionDescription>
        Adjust the amplitude (a), frequency (b), and phase (c) to see how they affect the wave pattern. 
        The period T = 2π/b determines how often the function repeats.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 周期函数参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={periodicParams}
              onChange={setPeriodicParams}
              config={periodicCoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={periodicParams}
              onChange={setPeriodicParams}
              config={periodicCommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={traces}
            xRange={periodicParams.xRange}
            title={`Periodic Function: f(x) = ${periodicParams.a.toFixed(1)}·sin(${periodicParams.b.toFixed(1)}x + ${periodicParams.c.toFixed(1)})`}
            showExportButton={false}
            plotStyle={periodicParams.plotStyle}
            aspectRatio={periodicParams.aspectRatio}
            legendPosition={periodicParams.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default PeriodicFunctions;

// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import FunctionPlotter from '../../../components/visualization/FunctionPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, FormulaTitle, Formula
} from '../../../components/common/LayoutStyled';
import { plotStyleConfig, legendPositionConfig } from '../../../constants/basicFunctionConfig';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Inverse Functions 页面 - 反函数可视化
 */
const InverseFunctions = () => {
  const [params, setParams] = useState({
    coefficient: 1,
    xRange: [-5, 5],
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // 参数配置 - 分组版本
  const coefficientConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.1,
      max: 5,
      step: 0.1
    }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -20,
      max: 20,
      step: 1,
      default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  // ✅ 新增：在页面中定义反函数的数据生成逻辑
  const generateInverseData = useCallback(() => {
    const a = params.coefficient;
    const xMin = params.xRange[0];
    const xMax = params.xRange[1];
    const numPoints = 200;
    
    // 原函数: h(t) = a·t²（t ≥ 0）
    const originalT = [];
    const originalH = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = 0 + ((xMax - 0) * i) / numPoints;
      originalT.push(t);
      originalH.push(a * t * t);
    }
    
    // 反函数: t(h) = √(h/a)（h ≥ 0）
    const inverseH = [];
    const inverseT = [];
    for (let i = 0; i <= numPoints; i++) {
      const h = 0 + ((xMax - 0) * i) / numPoints;
      inverseH.push(h);
      inverseT.push(Math.sqrt(h / a));
    }
    
    // 对称轴 y = x
    const lineX = [xMin, xMax];
    const lineY = [xMin, xMax];
    
    return [
      {
        x: originalT,
        y: originalH,
        type: 'scatter',
        mode: 'lines',
        name: `Original: h(t) = ${a.toFixed(1)}t²`,
        line: { color: palette.mainTraces.primary, width: 2 }
      },
      {
        x: inverseH,
        y: inverseT,
        type: 'scatter',
        mode: 'lines',
        name: `Inverse: t(h) = √(h/${a.toFixed(1)})`,
        line: { color: palette.auxTraces.tangent, width: 2 }
      },
      {
        x: lineX,
        y: lineY,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x (symmetry axis)',
        line: {
          color: palette.limit.boundary,
          width: 1,
          dash: 'dash'
        }
      }
    ];
  }, [params.coefficient, params.xRange, themeMode]);
  
  // ✅ 使用 useMemo 缓存数据
  const traces = useMemo(() => generateInverseData(), [generateInverseData]);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/basic-function" />
        <SectionTitleH1>Inverse Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        An inverse function reverses the operation of the original function. 
        If f(x) maps x to y, then f⁻¹(y) maps y back to x. The graphs are symmetric about the line y = x.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Example: Physics Free Fall</FormulaTitle>
        <Formula>
          Original: h = a·t²<br/>
          Inverse: t = √(h/a)
        </Formula>
      </FormulaBox>

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
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* ✅ 修改：传入 data 而非 functionType */}
          <FunctionPlotter
            data={traces}
            xRange={params.xRange}
            title={`Inverse Function: h(t) = ${params.coefficient.toFixed(1)}t² and t(h)`}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InverseFunctions;

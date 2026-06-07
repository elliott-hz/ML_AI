// UI Pattern: StandardSinglePlot — single ContentLayout, one DerivativePlotter
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
import { plotStyleConfig, legendPositionConfig } from '../../../constants/derivativeConfig';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer,
  Header,
  SectionTitleH1,
  SectionDescription,
  ContentLayout,
  ControlsPanel,
  PlotPanel,
  FormulaBox,
  FormulaTitle,
  Formula
} from '../../../components/style/DerivativeStyled';

/**
 * Derivative of Constants: (C)' = 0
 * Shows f(x) = C as a horizontal line and f'(x) = 0 along the x-axis
 */
const DerivativeConstants = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    C: 5,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const formatNum = (num) => Number(num).toFixed(1);

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const generateData = useCallback(() => {
    const C = params.C;
    const [xMin, xMax] = params.xRange;
    const numPoints = 200;
    const step = (xMax - xMin) / numPoints;

    // Main function: f(x) = C
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(C);
    }

    // Derivative: f'(x) = 0
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(0);
    }

    const traces = [];

    // 1. Main function f(x) = C
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: `f(x) = ${C.toFixed(1)}`,
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });

    // 2. Derivative f'(x) = 0
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: "f'(x) = 0",
      line: { color: palette.auxTraces.derivative, width: 2, dash: 'dash' }
    });

    return traces;
  }, [params, palette]);

  const traces = useMemo(() => generateData(), [generateData]);

  const constantConfig = [
    { name: 'C', label: 'C (constant value)', min: -5, max: 5, step: 0.5 }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -10, max: 10, step: 0.5, default: [-5, 5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  // Merge all common controls into one config array
  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
           Back to Derivative
        </BackButton>
        <SectionTitleH1>Derivative of a Constant</SectionTitleH1>
      </Header>

      <SectionDescription>
        The derivative of any constant function is always zero.
        Since a constant function has no change — its slope is flat everywhere —
        the rate of change at every point is zero.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Rule:</FormulaTitle>
        <Formula>
          f(x) = C &nbsp; (C is any constant)<br/><br/>
          f'(x) = (C)' = 0
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Constant Value">
            <ParameterControls parameters={params} onChange={setParams} config={constantConfig} />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={traces}
            xRange={params.xRange}
            title={`Derivative of Constant: C = ${params.C.toFixed(1)}`}
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

export default DerivativeConstants;

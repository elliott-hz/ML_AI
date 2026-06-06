import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '../../../components/derivative/shared/DerivativeStyled';

/**
 * Derivative of arcsin x: (arcsin x)' = 1 / √(1 - x²)
 * Domain: [-1, 1], Range: [-π/2, π/2]
 * Note: x-axis is numeric (input to arcsin), y-axis is in radians (output of arcsin)
 */
const DerivativeArcsin = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    xRange: [-1.5, 1.5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    const traces = [];

    // f(x) = arcsin(x) — defined only on [-1, 1]
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x >= -1 && x <= 1) {
        mainX.push(x);
        mainY.push(Math.asin(x));
      }
    }
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'arcsin x',
      line: { color: '#6366f1', width: 2.5 }
    });

    // f'(x) = 1 / √(1 - x²)
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x > -1 && x < 1) {
        derivX.push(x);
        derivY.push(1 / Math.sqrt(1 - x * x));
      }
    }
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: "1 / \u221A(1 - x\u00B2) (derivative)",
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params.xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = "(arcsin x)' = 1 / \u221A(1 - x\u00B2)";

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -2, max: 2, step: 0.1, default: [-1.5, 1.5]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

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
        <SectionTitleH1>Arcsine Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The derivative of arcsin x is 1/√(1 - x²). The slope increases dramatically near the domain
        boundaries x = ±1, where the derivative approaches infinity, reflecting the vertical tangents of arcsin x.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Arcsine:</FormulaTitle>
        <Formula>
          f(x) = arcsin x &nbsp;&nbsp;x ∈ [-1, 1]<br/><br/>
          f'(x) = 1 / √(1 - x²)
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={traces}
            xRange={params.xRange}
            title={formulaInTitle}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            yTickMode="pi"
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DerivativeArcsin;

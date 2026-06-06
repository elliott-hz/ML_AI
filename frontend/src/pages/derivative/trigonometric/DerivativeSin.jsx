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
 * Derivative of sin x: (sin x)' = cos x
 */
const DerivativeSin = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    piXRange: [-2, 2], // multiples of π
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const xRange = [params.piXRange[0] * Math.PI, params.piXRange[1] * Math.PI];

  const generateData = useCallback(() => {
    const [xMin, xMax] = xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    // f(x) = sin x
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(Math.sin(x));
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'sin x',
      line: { color: '#6366f1', width: 2.5 }
    });

    // f'(x) = cos x
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(Math.cos(x));
    }

    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: 'cos x (derivative)',
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params, xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = '(sin x)\' = cos x';

  const viewRangeConfig = [
    {
      name: 'piXRange', label: 'X (π)', type: 'range',
      min: -4, max: 4, step: 0.25, default: [-2, 2]
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
        <SectionTitleH1>Sine Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The derivative of sin x is cos x. This means the slope of sin x at any point equals the value of cos x at that point.
        Observe how the peaks of sin x align with the zero crossings of its derivative.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Sine:</FormulaTitle>
        <Formula>
          f(x) = sin x<br/><br/>
          f'(x) = cos x
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
            xRange={xRange}
            title={formulaInTitle}
            showExportButton={false}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            xTickMode="pi"
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DerivativeSin;

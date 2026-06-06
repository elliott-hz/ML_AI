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
 * Derivative of ln(x): (ln x)' = 1/x
 */
const DerivativeLn = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    xRange: [0.01, 4],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const xRange = params.xRange;

  const generateData = useCallback(() => {
    const [xMin, xMax] = xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    // f(x) = ln(x)
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(Math.log(x));
    }

    // f'(x) = 1/x
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(1 / x);
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'y = ln x',
      line: { color: '#6366f1', width: 2.5 }
    });

    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: "y' = 1/x",
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params, xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const plotTitle = "(ln x)' = 1/x";

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: 0.01, max: 8, step: 0.1, default: [0.01, 4]
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
        <SectionTitleH1>Natural Logarithm</SectionTitleH1>
      </Header>

      <SectionDescription>
        The natural logarithm ln(<em>x</em>) is the inverse of <em>e</em>ˣ. Its derivative is 1/<em>x</em> —
        a simple reciprocal. Notice the vertical asymptote at <em>x</em> = 0: the slope becomes
        arbitrarily large as <em>x</em> approaches zero from the right.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of ln(x):</FormulaTitle>
        <Formula>
          f(x) = ln(x)<br/><br/>
          f'(x) = 1 / x
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
            title={plotTitle}
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

export default DerivativeLn;

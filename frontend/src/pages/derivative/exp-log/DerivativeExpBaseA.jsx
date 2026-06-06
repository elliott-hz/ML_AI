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
 * Derivative of aˣ: (aˣ)' = aˣ · ln(a)
 */
const DerivativeExpBaseA = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 2,
    xRange: [-2, 2],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const { a } = params;

  const generateData = useCallback(() => {
    const { a, xRange } = params;
    const [xMin, xMax] = xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;
    const lnA = Math.log(a);

    // f(x) = aˣ
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(Math.pow(a, x));
    }

    // f'(x) = aˣ · ln(a)
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(Math.pow(a, x) * lnA);
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: `y = ${a}ˣ`,
      line: { color: '#6366f1', width: 2.5 }
    });

    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: `y' = ${a}ˣ · ln(${a})`,
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params]);

  const traces = useMemo(() => generateData(), [generateData]);

  const plotTitle = `(${a}ˣ)' = ${a}ˣ · ln(${a})`;

  const baseConfig = [
    { name: 'a', label: 'a (base, a > 0)', min: 0.5, max: 5, step: 0.1 }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -5, max: 5, step: 0.25, default: [-2, 2]
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
        <SectionTitleH1>General Exponential Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        For any base <em>a</em> &gt; 0, the derivative of <em>a</em>ˣ is <em>a</em>ˣ · ln(<em>a</em>).
        Unlike <em>e</em>ˣ, the derivative is scaled by ln(<em>a</em>).
        When <em>a</em> &gt; 1 the function grows; when 0 &lt; <em>a</em> &lt; 1 it decays.
        Adjust the base <em>a</em> to see how the slope changes.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of aˣ:</FormulaTitle>
        <Formula>
          f(x) = aˣ<br/><br/>
          f'(x) = aˣ · ln(a)
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Base">
            <ParameterControls parameters={params} onChange={setParams} config={baseConfig} />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={traces}
            xRange={params.xRange}
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

export default DerivativeExpBaseA;

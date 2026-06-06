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
  Formula,
  QuickSetRow,
  QuickBtn
} from '../../../components/derivative/shared/DerivativeStyled';

/**
 * Combined Exponential Functions — general base aˣ with quick-set to eˣ
 * (aˣ)' = aˣ · ln(a). When a = e, (eˣ)' = eˣ.
 */
const ExponentialFunctions = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 2,
    xRange: [-2, 2],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const isNatural = Math.abs(params.a - Math.E) < 0.001;
  const plotTitle = isNatural
    ? "(eˣ)' = eˣ"
    : `(${params.a.toFixed(1)}ˣ)' = ${params.a.toFixed(1)}ˣ · ln(${params.a.toFixed(1)})`;

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;
    const a = params.a;
    const lnA = Math.log(a);

    const mainX = [];
    const mainY = [];
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const ax = Math.pow(a, x);
      mainX.push(x);
      mainY.push(ax);
      derivX.push(x);
      derivY.push(ax * (isNatural ? 1 : lnA));
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: isNatural ? 'eˣ' : `${a.toFixed(1)}ˣ`,
      line: { color: '#6366f1', width: 2.5 }
    });
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: isNatural ? "eˣ (derivative)" : `${a.toFixed(1)}ˣ·ln(${a.toFixed(1)}) (derivative)`,
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });
    return traces;
  }, [params]);

  const traces = useMemo(() => generateData(), [generateData]);

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

  const description = isNatural
    ? 'The natural exponential function eˣ is unique: its derivative equals itself. No scaling factor is needed — the slope at every point is exactly the value of the function at that point.'
    : `For base a = ${params.a.toFixed(1)} > 0, the derivative of aˣ is aˣ · ln(a). Unlike eˣ, the derivative is scaled by ln(a), shifting the growth rate. Drag the base slider to see how the slope changes.`;

  const formulaText = isNatural
    ? 'f(x) = eˣ<br/><br/>f\'(x) = eˣ'
    : `f(x) = ${params.a.toFixed(1)}ˣ<br/><br/>f'(x) = ${params.a.toFixed(1)}ˣ · ln(${params.a.toFixed(1)})`;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
          Back to Derivative
        </BackButton>
        <SectionTitleH1>Exponential Function</SectionTitleH1>
      </Header>

      <SectionDescription>{description}</SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Exponential:</FormulaTitle>
        <Formula dangerouslySetInnerHTML={{ __html: formulaText }} />
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Base">
            <ParameterControls parameters={params} onChange={setParams} config={baseConfig} />
          </ParameterSection>

          <QuickSetRow>
            <span>Quick set:</span>
            <QuickBtn onClick={() => setParams(p => ({ ...p, a: Math.E }))}>
              a = e ({Math.E.toFixed(3)})
            </QuickBtn>
          </QuickSetRow>

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

export default ExponentialFunctions;

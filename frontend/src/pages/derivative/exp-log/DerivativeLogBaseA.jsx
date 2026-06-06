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
 * Derivative of logₐ(x): (logₐ x)' = 1 / (x · ln a)
 */
const DerivativeLogBaseA = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 2,
    xRange: [0.01, 4],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const { a } = params;

  // Convert a number to Unicode subscript (e.g. 2.5 → "₂.₅")
  const toSub = (num) => String(num).replace(/[0-9.-]/g, (c) => {
    if (c === '.') return '.';
    if (c === '-') return '\u208B';
    return String.fromCharCode(0x2080 + parseInt(c));
  });

  const generateData = useCallback(() => {
    const { a, xRange } = params;
    const [xMin, xMax] = xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;
    const lnA = Math.log(a);

    // f(x) = log_a(x) = ln(x) / ln(a)
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(Math.log(x) / lnA);
    }

    // f'(x) = 1 / (x · ln a)
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(1 / (x * lnA));
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: `y = log${toSub(a)}(x)`,
      line: { color: '#6366f1', width: 2.5 }
    });

    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: `y' = 1/(x · ln ${a})`,
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params]);

  const traces = useMemo(() => generateData(), [generateData]);

  const plotTitle = `(log${toSub(a)} x)' = 1 / (x · ln ${a})`;

  const baseConfig = [
    { name: 'a', label: 'a (base, a > 0, a ≠ 1)', min: 0.5, max: 5, step: 0.1 }
  ];

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
        <SectionTitleH1>General Logarithmic Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        For any base <em>a</em> &gt; 0, <em>a</em> ≠ 1, the derivative of logₐ(<em>x</em>) is 1 / (<em>x</em> · ln(<em>a</em>)).
        Notice the vertical asymptote at <em>x</em> = 0: the slope approaches infinity as <em>x</em> approaches zero.
        Adjust the base <em>a</em> to see how the curve and its derivative scale.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of logₐ(x):</FormulaTitle>
        <Formula>
          f(x) = logₐ(x)<br/><br/>
          f'(x) = 1 / (x · ln(a))
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

export default DerivativeLogBaseA;

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
 * Derivative of arcsec x: (arcsec x)' = 1 / (|x| · √(x² - 1))
 * Domain: |x| ≥ 1, Range: [0, π] \ {π/2}
 */
const DerivativeArcsec = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    const traces = [];

    // f(x) = arcsec(x) = arccos(1/x), defined for |x| ≥ 1
    // Left branch: x ≤ -1
    const leftX = [];
    const leftY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x <= -1) {
        leftX.push(x);
        leftY.push(Math.acos(1 / x));
      }
    }
    if (leftX.length > 0) {
      traces.push({
        x: leftX, y: leftY,
        type: 'scatter', mode: 'lines',
        name: 'arcsec x (x ≤ -1)',
        line: { color: '#6366f1', width: 2.5 }
      });
    }

    // Right branch: x ≥ 1
    const rightX = [];
    const rightY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x >= 1) {
        rightX.push(x);
        rightY.push(Math.acos(1 / x));
      }
    }
    if (rightX.length > 0) {
      traces.push({
        x: rightX, y: rightY,
        type: 'scatter', mode: 'lines',
        name: 'arcsec x (x ≥ 1)',
        line: { color: '#6366f1', width: 2.5 }
      });
    }

    // f'(x) = 1 / (|x| · √(x² - 1))
    const derivLeftX = [];
    const derivLeftY = [];
    const derivRightX = [];
    const derivRightY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      if (x < -1) {
        derivLeftX.push(x);
        derivLeftY.push(1 / (Math.abs(x) * Math.sqrt(x * x - 1)));
      } else if (x > 1) {
        derivRightX.push(x);
        derivRightY.push(1 / (Math.abs(x) * Math.sqrt(x * x - 1)));
      }
    }

    traces.push({
      x: derivLeftX, y: derivLeftY,
      type: 'scatter', mode: 'lines',
      name: "1/(|x|\u221A(x\u00B2-1)) (derivative)",
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });
    traces.push({
      x: derivRightX, y: derivRightY,
      type: 'scatter', mode: 'lines',
      name: undefined, // hide duplicate legend entry
      showlegend: false,
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = "(arcsec x)' = 1 / (|x| \u00B7 \u221A(x\u00B2 - 1))";

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -5, max: 5, step: 0.5, default: [-3, 3]
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
        <SectionTitleH1>Arcsecant Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The derivative of arcsec x is 1/(|x|·√(x²-1)). The function is defined only for |x| ≥ 1,
        and its derivative blows up to infinity as x approaches ±1, matching the vertical tangents.
        As x → ±∞, the derivative decays to 0.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Arcsecant:</FormulaTitle>
        <Formula>
          f(x) = arcsec x &nbsp;&nbsp;|x| ≥ 1<br/><br/>
          f'(x) = 1 / (|x| · √(x² - 1))
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

export default DerivativeArcsec;

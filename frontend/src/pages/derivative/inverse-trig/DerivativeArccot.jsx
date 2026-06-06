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
 * Derivative of arccot x: (arccot x)' = -1 / (1 + x²)
 * Domain: (-∞, ∞), Range: (0, π)
 * Note: x-axis is numeric, y-axis is in radians
 */
const DerivativeArccot = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    xRange: [-10, 10],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    const traces = [];

    // f(x) = arccot(x) = π/2 - arctan(x)
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      mainX.push(x);
      mainY.push(Math.PI / 2 - Math.atan(x));
    }
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'arccot x',
      line: { color: '#6366f1', width: 2.5 }
    });

    // f'(x) = -1 / (1 + x²)
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      derivX.push(x);
      derivY.push(-1 / (1 + x * x));
    }
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: "-1 / (1 + x\u00B2) (derivative)",
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params.xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = "(arccot x)' = -1 / (1 + x\u00B2)";

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -20, max: 20, step: 1, default: [-10, 10]
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
        <SectionTitleH1>Arccotangent Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The derivative of arccot x is -1/(1 + x²). Like arctan, arccot is defined for all real numbers,
        but it is strictly decreasing. Its derivative is the negative of the arctan derivative,
        forming an inverted bell shape.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Arccotangent:</FormulaTitle>
        <Formula>
          f(x) = arccot x &nbsp;&nbsp;x ∈ (-∞, ∞)<br/><br/>
          f'(x) = -1 / (1 + x²)
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

export default DerivativeArccot;

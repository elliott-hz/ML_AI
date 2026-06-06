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

const ASYMPTOTE_EPS = 0.05;
const Y_CLAMP = 500;

/**
 * Derivative of csc x: (csc x)' = -csc x · cot x
 */
const DerivativeCsc = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    piXRange: [-2, 2],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const xRange = [params.piXRange[0] * Math.PI, params.piXRange[1] * Math.PI];
  const yRange = [-10, 10];

  const generateData = useCallback(() => {
    const [xMin, xMax] = xRange;
    const numPoints = 800;
    const step = (xMax - xMin) / numPoints;

    // f(x) = csc x = 1/sin x, asymptotes at x = kπ
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const shifted = (x % Math.PI + Math.PI) % Math.PI;
      const minDist = Math.min(shifted, Math.PI - shifted);
      if (minDist < ASYMPTOTE_EPS) {
        mainX.push(null);
        mainY.push(null);
      } else {
        const y = 1 / Math.sin(x);
        if (Math.abs(y) > Y_CLAMP) {
          mainX.push(null);
          mainY.push(null);
        } else {
          mainX.push(x);
          mainY.push(y);
        }
      }
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: 'csc x',
      line: { color: '#6366f1', width: 2.5 }
    });

    // f'(x) = -csc x · cot x
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const shifted = (x % Math.PI + Math.PI) % Math.PI;
      const minDist = Math.min(shifted, Math.PI - shifted);
      if (minDist < ASYMPTOTE_EPS) {
        derivX.push(null);
        derivY.push(null);
      } else {
        const y = -(1 / Math.sin(x)) * (Math.cos(x) / Math.sin(x));
        if (Math.abs(y) > Y_CLAMP) {
          derivX.push(null);
          derivY.push(null);
        } else {
          derivX.push(x);
          derivY.push(y);
        }
      }
    }

    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: '-csc x·cot x (derivative)',
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params, xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const formulaInTitle = '(csc x)\' = -csc x·cot x';

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
        <SectionTitleH1>Cosecant Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        The derivative of csc x is −csc x · cot x. The negative sign flips the slope pattern compared to sec.
        Vertical asymptotes occur at x = kπ, shared by both the function and its derivative.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Cosecant:</FormulaTitle>
        <Formula>
          f(x) = csc x = 1 / sin x<br/><br/>
          f'(x) = −csc x · cot x = −cos x / sin²x
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
            yRange={yRange}
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

export default DerivativeCsc;

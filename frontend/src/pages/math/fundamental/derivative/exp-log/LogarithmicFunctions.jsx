// UI Pattern: StandardSinglePlot (QuickSetRow variant) — base a slider + quick-set e button
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
import { plotStyleConfig, legendPositionConfig } from '../../../constants/derivativeConfig';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import DerivativePlotter from '../../../components/visualization/DerivativePlotter';
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
} from '../../../components/style/DerivativeStyled';

// Convert integer digit to Unicode subscript
const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
function toSub(n) {
  return String(n).replace(/\d/g, (d) => SUB[parseInt(d)]);
}

/**
 * Combined Logarithmic Functions — general base logₐx with quick-set to ln x
 * (logₐx)' = 1 / (x · ln(a)). When a = e, (ln x)' = 1/x.
 */
const LogarithmicFunctions = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    a: 2,
    xRange: [0.01, 4],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const isNatural = Math.abs(params.a - Math.E) < 0.001;
  const aSub = toSub(Math.round(params.a));
  const plotTitle = isNatural
    ? "(ln x)' = 1 / x"
    : `(log${aSub} x)' = 1 / (x · ln ${params.a.toFixed(1)})`;

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

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
      if (x <= 0) continue;
      mainX.push(x);
      mainY.push(isNatural ? Math.log(x) : Math.log(x) / lnA);
      derivX.push(x);
      derivY.push(isNatural ? 1 / x : 1 / (x * lnA));
    }

    const traces = [];
    traces.push({
      x: mainX, y: mainY,
      type: 'scatter', mode: 'lines',
      name: isNatural ? 'f(x) = ln x' : `f(x) = log${aSub} x`,
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });
    traces.push({
      x: derivX, y: derivY,
      type: 'scatter', mode: 'lines',
      name: isNatural ? "f'(x) = 1/x" : `f'(x) = 1/(x·ln ${params.a.toFixed(1)})`,
      line: { color: palette.auxTraces.derivative, width: 2, dash: 'dash' }
    });
    return traces;
  }, [params, palette]);

  const traces = useMemo(() => generateData(), [generateData]);

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

  const isNaturalDescription = 'The natural logarithm ln(x) is the inverse of eˣ. Its derivative is 1/x — a simple reciprocal. Notice the vertical asymptote at x = 0: the slope becomes arbitrarily large as x approaches zero from the right.';
  const generalDescription = `For base a = ${params.a.toFixed(1)} > 0, a ≠ 1, the derivative of log${aSub}(x) is 1/(x·ln(a)). Adjust the base slider to see how the scaling factor ln(a) changes the slope.`;

  const formulaText = isNatural
    ? 'f(x) = ln x<br/><br/>f\'(x) = 1 / x'
    : `f(x) = log${aSub}(x)<br/><br/>f'(x) = 1 / (x · ln ${params.a.toFixed(1)})`;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
          Back to Derivative
        </BackButton>
        <SectionTitleH1>Logarithmic Function</SectionTitleH1>
      </Header>

      <SectionDescription>
        {isNatural ? isNaturalDescription : generalDescription}
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Derivative of Logarithm:</FormulaTitle>
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
          >
            <ParameterControls parameters={params} onChange={setParams} config={[{ name: 'a', label: 'a (base, a > 0, a ≠ 1)', min: 0.5, max: 5, step: 0.1 }]} />
          </DerivativePlotter>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default LogarithmicFunctions;

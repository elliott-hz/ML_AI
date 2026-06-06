// UI Pattern: StandardSinglePlot — single ContentLayout, mu slider for power functions
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
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
 * Derivative of Power Functions: (x^μ)' = μ·x^(μ-1)
 * Shows f(x) = x^μ and f'(x) = μ·x^(μ-1) side by side
 */
const DerivativePowerFunctions = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    mu: 2,
    xRange: [-2, 2],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  // Format a number as Unicode superscript
  const toSuperscript = (val) => {
    const supMap = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻', '.': '·', '+': '⁺'
    };
    return String(val).split('').map(ch => supMap[ch] || ch).join('');
  };

  // Format exponent: integer → superscript, fractional → decimal
  const formatExp = (val) => {
    if (Number.isInteger(val)) {
      if (val === 1) return ''; // x¹ → just x
      return toSuperscript(val);
    }
    return val.toFixed(2);
  };

  // Format coefficient with sign
  const formatCoeff = (val) => {
    if (val === 1) return '';
    if (val === -1) return '-';
    return val.toFixed(1);
  };

  // Build display formula with math format
  const buildFormula = (coeff, xPart, exp) => {
    const c = formatCoeff(coeff);
    return `${c}x${exp}`.trim();
  };

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const generateData = useCallback(() => {
    const mu = params.mu;
    const [xMin, xMax] = params.xRange;
    const numPoints = 500;
    const step = (xMax - xMin) / numPoints;

    // Derivative exponent
    const derivMu = mu - 1;

    // Power function: handle domain restrictions for fractional exponents
    const pow = (x, p) => {
      if (p >= 0) return Math.pow(x, p);
      // For negative exponents, x=0 is undefined
      if (Math.abs(x) < 0.001) return NaN;
      return Math.pow(x, p);
    };

    const traces = [];

    // 1. Main function f(x) = x^μ
    const mainX = [];
    const mainY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = pow(x, mu);
      if (!isNaN(y) && isFinite(y) && Math.abs(y) < 10000) {
        mainX.push(x);
        mainY.push(y);
      } else {
        mainX.push(null);
        mainY.push(null);
      }
    }

    const cleanMainX = [];
    const cleanMainY = [];
    for (let i = 0; i < mainX.length; i++) {
      if (mainX[i] !== null) {
        cleanMainX.push(mainX[i]);
        cleanMainY.push(mainY[i]);
      }
    }

    const muExp = formatExp(mu);
    const muStr = Number.isInteger(mu) && mu === 1 ? '' : (Number.isInteger(mu) ? String(mu) : mu.toFixed(1));
    traces.push({
      x: cleanMainX, y: cleanMainY,
      type: 'scatter', mode: 'lines',
      name: `f(x) = x${muExp}`,
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });

    // 2. Derivative f'(x) = μ·x^(μ-1)
    const derivX = [];
    const derivY = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = mu * pow(x, derivMu);
      if (!isNaN(y) && isFinite(y) && Math.abs(y) < 10000) {
        derivX.push(x);
        derivY.push(y);
      } else {
        derivX.push(null);
        derivY.push(null);
      }
    }

    const cleanDerivX = [];
    const cleanDerivY = [];
    for (let i = 0; i < derivX.length; i++) {
      if (derivX[i] !== null) {
        cleanDerivX.push(derivX[i]);
        cleanDerivY.push(derivY[i]);
      }
    }

    const derivMuExp = formatExp(derivMu);
    traces.push({
      x: cleanDerivX, y: cleanDerivY,
      type: 'scatter', mode: 'lines',
      name: `f'(x) = ${mu}x${derivMuExp}`,
      line: { color: palette.auxTraces.derivative, width: 2, dash: 'dash' }
    });

    return traces;
  }, [params, palette]);

  const traces = useMemo(() => generateData(), [generateData]);

  // Floating formula display
  const mu = params.mu;
  const derivMu = mu - 1;
  const muExp = formatExp(mu);
  const derivMuExp = formatExp(derivMu);
  const formulaInTitle = `(x${muExp})' = ${mu}x${derivMuExp}`;

  const powerConfig = [
    { name: 'mu', label: 'μ (power exponent)', min: -4, max: 4, step: 1 }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -5, max: 5, step: 0.1, default: [-2, 2]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  // Merge all common controls into one config array
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
        <SectionTitleH1>Power Rule</SectionTitleH1>
      </Header>

      <SectionDescription>
        The power rule is one of the most fundamental derivative formulas.
        It works for any real exponent μ — integers, fractions, and negatives alike.
        Drag μ to see how the function and its derivative transform together.
      </SectionDescription>

      <FormulaBox>
        <FormulaTitle>Power Rule:</FormulaTitle>
        <Formula>
          f(x) = x{toSuperscript('μ')}<br/><br/>
          f'(x) = μ · x{toSuperscript('(μ-1)')}<br/><br/>
          Examples: (x²)' = 2x, &nbsp; (x·⁵)' = 0.5x·⁵, &nbsp; (x⁻¹)' = -x⁻²
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Power Exponent">
            <ParameterControls parameters={params} onChange={setParams} config={powerConfig} />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <DerivativePlotter
            data={traces}
            xRange={params.xRange}
            title={`${formulaInTitle}    μ = ${mu.toFixed(1)}`}
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

export default DerivativePowerFunctions;

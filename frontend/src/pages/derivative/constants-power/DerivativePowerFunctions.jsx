import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DerivativePlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const FormulaTitle = styled.h3`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 16px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ControlsPanel = styled.div`
  flex: 0 0 350px;
  min-width: 300px;
`;

const PlotPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

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
      line: { color: '#6366f1', width: 2.5 }
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
      line: { color: '#ef4444', width: 2, dash: 'dash' }
    });

    return traces;
  }, [params]);

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

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min: -5, max: 5, step: 0.1, default: [-2, 2]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
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
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
           Back to Derivative
        </BackButton>
        <Title>Power Rule</Title>
      </Header>

      <Description>
        The power rule is one of the most fundamental derivative formulas.
        It works for any real exponent μ — integers, fractions, and negatives alike.
        Drag μ to see how the function and its derivative transform together.
      </Description>

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

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
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
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '0.25rem'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    color: white;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
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

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.inputBg || '#334155'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 18px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
  font-weight: bold;
`;

const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const ToggleBtn = styled.button`
  padding: 8px ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ $active, theme }) => ($active ? (theme?.colors?.primary || '#6366f1') : 'transparent')};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? (theme?.colors?.primary || '#6366f1') : (theme?.colors?.inputBg || '#334155')};
  }
`;

/**
 * Inverse Trig. Intuitive Limit — overview of inverse trig function behavior
 *
 *   arctan(x):  domain (-∞, +∞), range (-π/2, π/2), horizontal asymptotes
 *   arcsin(x):  domain [-1, 1], range [-π/2, π/2], finite endpoint limits
 *   arccos(x):  domain [-1, 1], range [0, π], finite endpoint limits
 */
const InverseTrigIntuitiveLimit = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({
    coefficient: 1,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('arctan');

  const generateFunctionData = useCallback(() => {
    let [xMin, xMax] = params.xRange || [-5, 5];
    const a = params.coefficient || 1;
    const numPoints = 400;

    const traces = [];

    if (activeFunction === 'arctan') {
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(a * Math.atan(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `${a.toFixed(1)}·arctan(x)`, line: { color: '#6366f1', width: 2.5 }
      });

      const asy = a * Math.PI / 2;
      traces.push({
        x: [xMin, xMax], y: [asy, asy], type: 'scatter', mode: 'lines',
        name: `lim:+${asy.toFixed(2)}`, line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
      traces.push({
        x: [xMin, xMax], y: [-asy, -asy], type: 'scatter', mode: 'lines',
        name: `lim:${(-asy).toFixed(2)}`, line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
    } else {
      xMin = Math.max(-1, xMin);
      xMax = Math.min(1, xMax);
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(activeFunction === 'arcsin' ? a * Math.asin(x) : a * Math.acos(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `${a.toFixed(1)}·${activeFunction}(x)`, line: { color: '#6366f1', width: 2.5 }
      });

      // Domain boundary lines
      const yLo = activeFunction === 'arcsin' ? -a * Math.PI / 2 : 0;
      const yHi = activeFunction === 'arcsin' ? a * Math.PI / 2 : a * Math.PI;
      traces.push({
        x: [-1, -1], y: [yLo - 1.5, yLo + 1.5], type: 'scatter', mode: 'lines',
        name: `x→-1⁺: ${yLo.toFixed(2)}`, line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
      traces.push({
        x: [1, 1], y: [yHi - 1.5, yHi + 1.5], type: 'scatter', mode: 'lines',
        name: `x→1⁻: ${yHi.toFixed(2)}`, line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
    }

    return traces;
  }, [params, activeFunction]);

  const coefficientConfig = [
    { name: 'coefficient', label: 'Coefficient (a)', min: 0.5, max: 5, step: 0.1, type: 'slider' }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    ...(activeFunction === 'arctan'
      ? [{ name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 1, default: [-5, 5] }]
      : [{ name: 'xRange', label: 'X Range', type: 'range', min: -2, max: 2, step: 0.1, default: [-1.5, 1.5] }]
    ),
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  const a = params.coefficient;

  let formulaLines, limitDesc;
  if (activeFunction === 'arctan') {
    const asy = a * Math.PI / 2;
    formulaLines = [`f(x) = ${a.toFixed(1)}·arctan(x)`, `Domain: (-∞, +∞)`, `Range: (${(-asy).toFixed(2)}, ${asy.toFixed(2)})`];
    limitDesc = `The arctangent function approaches horizontal asymptotes at y = ±${asy.toFixed(2)} as x → ±∞. It is the inverse of tan(x) and is defined for all real x.`;
  } else if (activeFunction === 'arcsin') {
    const hi = a * Math.PI / 2;
    const lo = -a * Math.PI / 2;
    formulaLines = [`f(x) = ${a.toFixed(1)}·arcsin(x)`, `Domain: [-1, 1]`, `Range: [${lo.toFixed(2)}, ${hi.toFixed(2)}]`];
    limitDesc = `arcsin(x) is defined only on [-1, 1]. At x = -1, the function reaches its minimum ${lo.toFixed(2)}; at x = 1, its maximum ${hi.toFixed(2)}. These are the finite endpoint limits.`;
  } else {
    const hi = a * Math.PI;
    formulaLines = [`f(x) = ${a.toFixed(1)}·arccos(x)`, `Domain: [-1, 1]`, `Range: [0, ${hi.toFixed(2)}]`];
    limitDesc = `arccos(x) is the inverse of cos(x), defined on [-1, 1]. It decreases from ${hi.toFixed(2)} at x = -1 to 0 at x = 1, with finite endpoint limits.`;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Inverse Trig. — Intuitive Limits</SectionTitle>
      </Header>

      <SectionDescription>
        Observe the domain, range, and boundary behavior of inverse trigonometric functions.
        These functions map real numbers (arctan) or bounded intervals (arcsin, arccos) to angles.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'arctan'} onClick={() => {
          setActiveFunction('arctan');
          setParams(p => ({ ...p, xRange: [-5, 5] }));
        }}>arctan(x)</ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arcsin'} onClick={() => {
          setActiveFunction('arcsin');
          setParams(p => ({ ...p, xRange: [-1.5, 1.5] }));
        }}>arcsin(x)</ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arccos'} onClick={() => {
          setActiveFunction('arccos');
          setParams(p => ({ ...p, xRange: [-1.5, 1.5] }));
        }}>arccos(x)</ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          {formulaLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}{i < formulaLines.length - 1 && <br/>}
            </React.Fragment>
          ))}
        </Formula>
      </FormulaBox>

      <SectionDescription>{limitDesc}</SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Coefficients">
            <ParameterControls parameters={params} onChange={setParams} config={coefficientConfig} />
          </ParameterSection>
          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>
        <PlotPanel>
          <LimitPlotter
            data={generateFunctionData()}
            xRange={activeFunction === 'arctan' ? params.xRange : [-1.5, 1.5]}
            title={`Function: ${activeFunction}(${a.toFixed(1)}x)`}
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

export default InverseTrigIntuitiveLimit;

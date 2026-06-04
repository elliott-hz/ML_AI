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

const LiveValueBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-top: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const LiveValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-family: 'Courier New', monospace;
`;

const LiveValueLabel = styled.span`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
`;

/**
 * Linearity Rule — (u±v)' = u'±v' and (Cu)' = Cu'
 * 3 tabs: Sum / Difference / Constant Multiple
 *
 * u(x) = a + b·x^m
 * v(x) = c + d·x^n
 */
const LinearityRule = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('sum');
  const [params, setParams] = useState({
    a: 2,          // u(x) constant term
    b: 1,          // u(x) coefficient
    m: 3,          // u(x) exponent
    c: 1,          // v(x) constant term
    d: 1,          // v(x) coefficient
    n: 2,          // v(x) exponent
    C: 3,          // constant multiple
    x0: 1,
    xRange: [-5, 5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  // Functions from coefficients
  const uFn = useCallback((x) => params.a + params.b * Math.pow(x, params.m), [params.a, params.b, params.m]);
  const vFn = useCallback((x) => params.c + params.d * Math.pow(x, params.n), [params.c, params.d, params.n]);

  const numDeriv = useCallback((fn, x, h = 1e-6) => {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }, []);

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const x0 = params.x0;
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;

    let combinedFn, combLabel, combColor;
    if (activeTab === 'sum') {
      combinedFn = (x) => uFn(x) + vFn(x);
      combLabel = 'u(x) + v(x)';
      combColor = '#ef4444';
    } else if (activeTab === 'difference') {
      combinedFn = (x) => uFn(x) - vFn(x);
      combLabel = 'u(x) − v(x)';
      combColor = '#ef4444';
    } else {
      const C = params.C;
      combinedFn = (x) => C * uFn(x);
      combLabel = `${C.toFixed(1)}·u(x)`;
      combColor = '#ef4444';
    }

    const genTrace = (fn) => {
      const xs = [], ys = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step;
        const y = fn(x);
        if (isFinite(y) && !isNaN(y) && Math.abs(y) < 10000) {
          xs.push(x);
          ys.push(y);
        }
      }
      return { xs, ys };
    };

    const traces = [];

    // u(x)
    const uData = genTrace(uFn);
    const uLabel = `u(x) = ${params.a.toFixed(1)} + ${params.b.toFixed(1)}x^${params.m.toFixed(1)}`;
    traces.push({
      x: uData.xs, y: uData.ys,
      type: 'scatter', mode: 'lines',
      name: uLabel,
      line: { color: '#6366f1', width: 2.5 }
    });

    // v(x) only for sum/difference
    if (activeTab !== 'constant-multiple') {
      const vData = genTrace(vFn);
      const vLabel = `v(x) = ${params.c.toFixed(1)} + ${params.d.toFixed(1)}x^${params.n.toFixed(1)}`;
      traces.push({
        x: vData.xs, y: vData.ys,
        type: 'scatter', mode: 'lines',
        name: vLabel,
        line: { color: '#22c55e', width: 2.5 }
      });
    }

    // Combined function
    const combData = genTrace(combinedFn);
    traces.push({
      x: combData.xs, y: combData.ys,
      type: 'scatter', mode: 'lines',
      name: combLabel,
      line: { color: combColor, width: 2.5 }
    });

    // Vertical line at x₀
    const allY = [
      ...uData.ys,
      ...(activeTab !== 'constant-multiple' ? genTrace(vFn).ys : []),
      ...combData.ys
    ].filter(y => isFinite(y));
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);
    const pad = (yMax - yMin) * 0.15 || 1;
    traces.push({
      x: [x0, x0], y: [yMin - pad, yMax + pad],
      type: 'scatter', mode: 'lines',
      name: `x₀ = ${x0.toFixed(1)}`,
      line: { color: '#f59e0b', width: 1.5, dash: 'dot' }
    });

    // Tangents at x₀
    const addTangent = (fn, label, color, dash) => {
      const f0 = fn(x0);
      const f1 = numDeriv(fn, x0);
      const tanX = [x0 - 2, x0 + 2];
      const tanY = tanX.map(x => f0 + f1 * (x - x0));
      traces.push({
        x: tanX, y: tanY,
        type: 'scatter', mode: 'lines',
        name: `${label}'(x₀)`,
        line: { color, width: 2, dash: dash || 'dash' }
      });
    };

    addTangent(uFn, "u", '#6366f1');
    if (activeTab !== 'constant-multiple') {
      addTangent(vFn, "v", '#22c55e');
    }
    addTangent(combinedFn, activeTab === 'constant-multiple' ? 'Cu' : activeTab === 'sum' ? 'u+v' : 'u−v', combColor);

    return traces;
  }, [params, activeTab, uFn, vFn, numDeriv]);

  const traces = useMemo(() => generateData(), [generateData]);

  // Live derivative values
  const uPrime = numDeriv(uFn, params.x0);
  const vPrime = activeTab !== 'constant-multiple' ? numDeriv(vFn, params.x0) : NaN;

  let combPrime;
  if (activeTab === 'sum') {
    combPrime = uPrime + vPrime;
  } else if (activeTab === 'difference') {
    combPrime = uPrime - vPrime;
  } else {
    combPrime = params.C * uPrime;
  }

  const tabTitles = {
    sum: 'Sum Rule: (u+v)\' = u\' + v\'',
    difference: 'Difference Rule: (u−v)\' = u\' − v\'',
    'constant-multiple': 'Constant Multiple: (Cu)\' = Cu\''
  };

  const tabDesc = {
    sum: 'The derivative of a sum is the sum of the derivatives. Each function changes independently, so their rates of change add up.',
    difference: 'The derivative of a difference is the difference of the derivatives. Subtraction passes through the derivative linearly.',
    'constant-multiple': 'Scaling a function by a constant C scales its slope by the same factor C. Drag C to see the effect.'
  };

  // Coefficient configs
  const uConfig = [
    { name: 'a', label: 'u(x) constant (a)', min: -5, max: 5, step: 0.1 },
    { name: 'b', label: 'u(x) coeff (b)', min: -3, max: 3, step: 0.1 },
    { name: 'm', label: 'u(x) exponent (m)', min: 1, max: 5, step: 0.5 }
  ];

  const vConfig = activeTab !== 'constant-multiple'
    ? [
        { name: 'c', label: 'v(x) constant (c)', min: -5, max: 5, step: 0.1 },
        { name: 'd', label: 'v(x) coeff (d)', min: -3, max: 3, step: 0.1 },
        { name: 'n', label: 'v(x) exponent (n)', min: 1, max: 5, step: 0.5 }
      ]
    : [];

  const CConfig = activeTab === 'constant-multiple'
    ? [{ name: 'C', label: 'Constant C', min: 0.1, max: 5, step: 0.1 }]
    : [];

  const commonConfig = [
    { name: 'x0', label: 'x₀ (evaluation point)', min: -5, max: 5, step: 0.1 }
  ];

  const viewConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 1, default: [-5, 5] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendConfig = [
    { name: 'legendPosition', label: 'Legend', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const styleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const plotTitle = activeTab === 'sum'
    ? `(u+v)'(x₀) = u'(x₀) + v'(x₀)`
    : activeTab === 'difference'
      ? `(u−v)'(x₀) = u'(x₀) − v'(x₀)`
      : `(Cu)'(x₀) = C · u'(x₀)`;

  const uStr = `${params.a.toFixed(1)} + ${params.b.toFixed(1)}x^${params.m.toFixed(1)}`;
  const vStr = `${params.c.toFixed(1)} + ${params.d.toFixed(1)}x^${params.n.toFixed(1)}`;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/derivative')}>
           Back to Derivative
        </BackButton>
        <Title>Linearity Rule</Title>
      </Header>

      <Description>
        Derivatives are linear: they distribute over addition, subtraction, and constant multiplication.
        This means (u±v)' = u'±v' and (Cu)' = Cu'.
      </Description>

      <ToggleGroup>
        <ToggleBtn $active={activeTab === 'sum'} onClick={() => setActiveTab('sum')}>
          Sum Rule
        </ToggleBtn>
        <ToggleBtn $active={activeTab === 'difference'} onClick={() => setActiveTab('difference')}>
          Difference Rule
        </ToggleBtn>
        <ToggleBtn $active={activeTab === 'constant-multiple'} onClick={() => setActiveTab('constant-multiple')}>
          Constant Multiple
        </ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <FormulaTitle>{tabTitles[activeTab]}</FormulaTitle>
        <Formula>
          u(x) = {uStr}
          {activeTab !== 'constant-multiple' && <><br/>v(x) = {vStr}</>}
          {activeTab === 'constant-multiple' && <><br/>C = {params.C.toFixed(1)}</>}
          <br/><br/>
          {tabDesc[activeTab]}
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title={`u(x) = a + b·x^m`}>
            <ParameterControls parameters={params} onChange={setParams} config={uConfig} />
          </ParameterSection>

          {activeTab !== 'constant-multiple' && (
            <ParameterSection title={`v(x) = c + d·x^n`}>
              <ParameterControls parameters={params} onChange={setParams} config={vConfig} />
            </ParameterSection>
          )}

          {activeTab === 'constant-multiple' && (
            <ParameterSection title="Constant Multiple">
              <ParameterControls parameters={params} onChange={setParams} config={CConfig} />
            </ParameterSection>
          )}

          <ParameterSection title="Evaluation">
            <ParameterControls parameters={params} onChange={setParams} config={commonConfig} />
          </ParameterSection>

          <LiveValueBox>
            <LiveValueRow>
              <LiveValueLabel>u'(x₀) =</LiveValueLabel>
              <span>{isFinite(uPrime) ? uPrime.toFixed(3) : '—'}</span>
            </LiveValueRow>
            {activeTab !== 'constant-multiple' && (
              <LiveValueRow>
                <LiveValueLabel>v'(x₀) =</LiveValueLabel>
                <span>{isFinite(vPrime) ? vPrime.toFixed(3) : '—'}</span>
              </LiveValueRow>
            )}
            <LiveValueRow>
              <LiveValueLabel>
                {activeTab === 'constant-multiple' ? "(Cu)'(x₀) =" : activeTab === 'sum' ? "(u+v)'(x₀) =" : "(u−v)'(x₀) ="}
              </LiveValueLabel>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{isFinite(combPrime) ? combPrime.toFixed(3) : '—'}</span>
            </LiveValueRow>
          </LiveValueBox>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={[...legendConfig, ...styleConfig, ...viewConfig]}
            />
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

export default LinearityRule;

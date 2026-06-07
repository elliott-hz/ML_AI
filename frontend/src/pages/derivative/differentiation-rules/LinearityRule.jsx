// UI Pattern: TabbedFunction — ToggleGroup: 3 tabs (Sum/Difference/ConstantMult)
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';
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
  ToggleGroup,
  ToggleBtn
} from '../../../components/style/DerivativeStyled';

// ─── Unicode superscript ───────────────────────────────────────────
const SUP = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
  '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
  '-': '\u207B', '.': '\u00B7',
  'm': '\u1D50', 'n': '\u207F'
};
const toSup = (s) => String(s).split('').map(c => SUP[c] || c).join('');

const fmtExp = (val) => toSup(val % 1 === 0 ? String(val) : val.toFixed(1));

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
    a: 0,          // u(x) constant term
    b: 1,          // u(x) coefficient
    m: 3,          // u(x) exponent
    c: 0,          // v(x) constant term
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

  // Formatted display helpers
  const uLabelStr = `u(x) = ${params.a.toFixed(1)} + ${params.b.toFixed(1)}x${fmtExp(params.m)}`;
  const vLabelStr = `v(x) = ${params.c.toFixed(1)} + ${params.d.toFixed(1)}x${fmtExp(params.n)}`;

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const generateData = useCallback(() => {
    const [xMin, xMax] = params.xRange;
    const x0 = params.x0;
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;

    let combinedFn, combLabel, combColor;
    if (activeTab === 'sum') {
      combinedFn = (x) => uFn(x) + vFn(x);
      combLabel = 'u(x) + v(x)';
      combColor = palette.auxTraces.combined;
    } else if (activeTab === 'difference') {
      combinedFn = (x) => uFn(x) - vFn(x);
      combLabel = 'u(x) − v(x)';
      combColor = palette.auxTraces.combined;
    } else {
      const C = params.C;
      combinedFn = (x) => C * uFn(x);
      combLabel = `${C.toFixed(1)}·u(x)`;
      combColor = palette.auxTraces.combined;
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
    traces.push({
      x: uData.xs, y: uData.ys,
      type: 'scatter', mode: 'lines',
      name: uLabelStr,
      line: { color: palette.mainTraces.primary, width: 2.5 }
    });

    // v(x) only for sum/difference
    if (activeTab !== 'constant-multiple') {
      const vData = genTrace(vFn);
      traces.push({
        x: vData.xs, y: vData.ys,
        type: 'scatter', mode: 'lines',
        name: vLabelStr,
        line: { color: palette.mainTraces.secondary, width: 2.5 }
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
      line: { color: palette.markers.evalX0, width: 1.5, dash: 'dot' }
    });

    // ── Tangents at x₀ (with slope in legend) ──
    // Compute derivative values first
    const uPrimeVal = numDeriv(uFn, x0);
    const vPrimeVal = activeTab !== 'constant-multiple' ? numDeriv(vFn, x0) : NaN;
    let combPrimeVal;
    if (activeTab === 'sum') {
      combPrimeVal = uPrimeVal + vPrimeVal;
    } else if (activeTab === 'difference') {
      combPrimeVal = uPrimeVal - vPrimeVal;
    } else {
      combPrimeVal = params.C * uPrimeVal;
    }

    const addTangent2 = (fn, label, derivVal, color, dash) => {
      const f0 = fn(x0);
      const f1 = derivVal;
      const xSpan = (xMax - xMin) * 0.8;
      const tanX = [x0 - xSpan / 2, x0 + xSpan / 2];
      const tanY = tanX.map(x => f0 + f1 * (x - x0));
      traces.push({
        x: tanX, y: tanY,
        type: 'scatter', mode: 'lines',
        name: `${label}' = ${isFinite(f1) ? f1.toFixed(1) : '?'}`,
        line: { color, width: 2, dash: dash || 'dash' }
      });
    };

    addTangent2(uFn, 'u', uPrimeVal, palette.mainTraces.primary);
    if (activeTab !== 'constant-multiple') {
      addTangent2(vFn, 'v', vPrimeVal, palette.mainTraces.secondary);
    }
    addTangent2(
      combinedFn,
      activeTab === 'constant-multiple' ? 'Cu' : activeTab === 'sum' ? 'u+v' : 'u−v',
      combPrimeVal,
      combColor
    );

    // ── Marker points at x₀ ──
    traces.push({
      x: [x0], y: [uFn(x0)],
      type: 'scatter', mode: 'markers',
      name: '',
      marker: { color: palette.mainTraces.primary, size: 8, symbol: 'circle' },
      showlegend: false
    });
    if (activeTab !== 'constant-multiple') {
      traces.push({
        x: [x0], y: [vFn(x0)],
        type: 'scatter', mode: 'markers',
        name: '',
        marker: { color: palette.mainTraces.secondary, size: 8, symbol: 'circle' },
        showlegend: false
      });
    }
    traces.push({
      x: [x0], y: [combinedFn(x0)],
      type: 'scatter', mode: 'markers',
      name: '',
      marker: { color: palette.auxTraces.combined, size: 8, symbol: 'circle' },
      showlegend: false
    });

    return traces;
  }, [params, activeTab, uFn, vFn, numDeriv, uLabelStr, vLabelStr, palette]);

  const traces = useMemo(() => generateData(), [generateData]);

  const tabTitles = {
    sum: `Sum Rule: (u+v)' = u' + v'`,
    difference: `Difference Rule: (u−v)' = u' − v'`,
    'constant-multiple': `Constant Multiple: (Cu)' = Cu'`
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
    { name: 'm', label: 'u(x) exponent (m)', min: 1, max: 5, step: 0.1 }
  ];

  const vConfig = activeTab !== 'constant-multiple'
    ? [
        { name: 'c', label: 'v(x) constant (c)', min: -5, max: 5, step: 0.1 },
        { name: 'd', label: 'v(x) coeff (d)', min: -3, max: 3, step: 0.1 },
        { name: 'n', label: 'v(x) exponent (n)', min: 1, max: 5, step: 0.1 }
      ]
    : [];

  const CConfig = activeTab === 'constant-multiple'
    ? [{ name: 'C', label: 'Constant C', min: 0.1, max: 5, step: 0.1 }]
    : [];

  const commonConfig = [
    { name: 'x0', label: 'x₀ (evaluation point)', min: -10, max: 10, step: 0.1 }
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

  const uStr = `${params.a.toFixed(1)} + ${params.b.toFixed(1)}x${fmtExp(params.m)}`;
  const vStr = `${params.c.toFixed(1)} + ${params.d.toFixed(1)}x${fmtExp(params.n)}`;

  const uSectionTitle = `u(x) = a + b·x${toSup('m')}`;
  const vSectionTitle = `v(x) = c + d·x${toSup('n')}`;

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/derivative">
           Back to Derivative
        </BackButton>
        <SectionTitleH1>Linearity Rule</SectionTitleH1>
      </Header>

      <SectionDescription>
        Derivatives are linear: they distribute over addition, subtraction, and constant multiplication.
        This means (u±v)' = u'±v' and (Cu)' = Cu'.
      </SectionDescription>

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
          <ParameterSection title={uSectionTitle}>
            <ParameterControls parameters={params} onChange={setParams} config={uConfig} />
          </ParameterSection>

          {activeTab !== 'constant-multiple' && (
            <ParameterSection title={vSectionTitle}>
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

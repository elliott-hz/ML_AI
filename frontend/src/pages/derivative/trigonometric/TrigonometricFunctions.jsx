// UI Pattern: TabbedFunction — ToggleGroup: 6 trig tabs (sin/cos/tan/cot/sec/csc), shared xRange
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
  ToggleGroup,
  ToggleBtn
} from '../../../components/style/DerivativeStyled';

// Threshold to detect proximity to asymptotes
const ASYMPTOTE_EPS = 0.05;
const Y_CLAMP = 500;

// Module-level color placeholders — replaced by palette at render time
const _MC = '#6366f1';
const _DC = '#ef4444';

/**
 * Trigonometric function tab definitions
 */
const FUNCTIONS = {
  sin: {
    label: 'sin',
    title: 'Sine Function',
    description: 'The derivative of sin x is cos x. The slope of sin x at any point equals the value of cos x at that point. Peaks of sin x align with zero crossings of its derivative.',
    formulaTitle: 'Derivative of Sine:',
    formula: 'f(x) = sin x<br/><br/>f\'(x) = cos x',
    plotTitle: "(sin x)' = cos x",
    mainColor: _MC,
    derivColor: _DC
  },
  cos: {
    label: 'cos',
    title: 'Cosine Function',
    description: 'The derivative of cos x is −sin x. The negative sign reflects the phase shift — the slope of cos x is the negative of sin x at every point.',
    formulaTitle: 'Derivative of Cosine:',
    formula: 'f(x) = cos x<br/><br/>f\'(x) = −sin x',
    plotTitle: "(cos x)' = −sin x",
    mainColor: _MC,
    derivColor: _DC
  },
  tan: {
    label: 'tan',
    title: 'Tangent Function',
    description: 'The derivative of tan x is sec²x, which is always positive where defined. Vertical asymptotes occur at x = π/2 + kπ — both tan x and its derivative blow up there.',
    formulaTitle: 'Derivative of Tangent:',
    formula: 'f(x) = tan x<br/><br/>f\'(x) = sec²x = 1 / cos²x',
    plotTitle: "(tan x)' = sec²x",
    mainColor: _MC,
    derivColor: _DC
  },
  cot: {
    label: 'cot',
    title: 'Cotangent Function',
    description: 'The derivative of cot x is −csc²x, always negative where defined. Vertical asymptotes occur at x = kπ. Unlike tan, the derivative is always below the x-axis.',
    formulaTitle: 'Derivative of Cotangent:',
    formula: 'f(x) = cot x<br/><br/>f\'(x) = −csc²x = −1 / sin²x',
    plotTitle: "(cot x)' = −csc²x",
    mainColor: _MC,
    derivColor: _DC
  },
  sec: {
    label: 'sec',
    title: 'Secant Function',
    description: 'The derivative of sec x is sec x · tan x. The product combines the function itself with the slope pattern of tan. Both share the same vertical asymptotes at x = π/2 + kπ.',
    formulaTitle: 'Derivative of Secant:',
    formula: 'f(x) = sec x = 1 / cos x<br/><br/>f\'(x) = sec x · tan x = sin x / cos²x',
    plotTitle: "(sec x)' = sec x·tan x",
    mainColor: _MC,
    derivColor: _DC
  },
  csc: {
    label: 'csc',
    title: 'Cosecant Function',
    description: 'The derivative of csc x is −csc x · cot x. The negative sign flips the slope pattern compared to sec. Vertical asymptotes occur at x = kπ, shared by both the function and its derivative.',
    formulaTitle: 'Derivative of Cosecant:',
    formula: 'f(x) = csc x = 1 / sin x<br/><br/>f\'(x) = −csc x · cot x = −cos x / sin²x',
    plotTitle: "(csc x)' = −csc x·cot x",
    mainColor: _MC,
    derivColor: _DC
  }
};

// ─── Data generators per function ─────────────────────────────────

function generateSinData(xRange) {
  const [xMin, xMax] = xRange;
  const numPoints = 500;
  const step = (xMax - xMin) / numPoints;
  const mainX = [], mainY = [];
  const derivX = [], derivY = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    mainX.push(x);
    mainY.push(Math.sin(x));
    derivX.push(x);
    derivY.push(Math.cos(x));
  }

  return [
    { x: mainX, y: mainY, type: 'scatter', mode: 'lines', name: 'f(x) = sin x', line: { color: _MC, width: 2.5 } },
    { x: derivX, y: derivY, type: 'scatter', mode: 'lines', name: "f'(x) = cos x", line: { color: _DC, width: 2, dash: 'dash' } }
  ];
}

function generateCosData(xRange) {
  const [xMin, xMax] = xRange;
  const numPoints = 500;
  const step = (xMax - xMin) / numPoints;
  const mainX = [], mainY = [];
  const derivX = [], derivY = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    mainX.push(x);
    mainY.push(Math.cos(x));
    derivX.push(x);
    derivY.push(-Math.sin(x));
  }

  return [
    { x: mainX, y: mainY, type: 'scatter', mode: 'lines', name: 'f(x) = cos x', line: { color: _MC, width: 2.5 } },
    { x: derivX, y: derivY, type: 'scatter', mode: 'lines', name: "f'(x) = −sin x", line: { color: _DC, width: 2, dash: 'dash' } }
  ];
}

function hasAsymptoteAt(x, offset = 0) {
  const shifted = ((x + offset) % Math.PI + Math.PI) % Math.PI;
  return Math.min(shifted, Math.PI - shifted) < ASYMPTOTE_EPS;
}

function generateAsymptoticData(xRange, { fn, derivFn, fnName, derivName, asymptoteOffset = 0 }) {
  const [xMin, xMax] = xRange;
  const numPoints = 800;
  const step = (xMax - xMin) / numPoints;
  const mainX = [], mainY = [];
  const derivX = [], derivY = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    if (hasAsymptoteAt(x, asymptoteOffset)) {
      mainX.push(null); mainY.push(null);
      derivX.push(null); derivY.push(null);
    } else {
      const y = fn(x);
      mainX.push(Math.abs(y) > Y_CLAMP ? null : x);
      mainY.push(Math.abs(y) > Y_CLAMP ? null : y);
      const dy = derivFn(x);
      derivX.push(Math.abs(dy) > Y_CLAMP ? null : x);
      derivY.push(Math.abs(dy) > Y_CLAMP ? null : dy);
    }
  }

  return [
    { x: mainX, y: mainY, type: 'scatter', mode: 'lines', name: fnName, line: { color: _MC, width: 2.5 } },
    { x: derivX, y: derivY, type: 'scatter', mode: 'lines', name: derivName, line: { color: _DC, width: 2, dash: 'dash' } }
  ];
}

function generateTanData(xRange) {
  return generateAsymptoticData(xRange, {
    fn: Math.tan,
    derivFn: (x) => 1 / (Math.cos(x) * Math.cos(x)),
    fnName: 'f(x) = tan x',
    derivName: "f'(x) = sec²x",
    asymptoteOffset: Math.PI / 2
  });
}

function generateCotData(xRange) {
  return generateAsymptoticData(xRange, {
    fn: (x) => Math.cos(x) / Math.sin(x),
    derivFn: (x) => -1 / (Math.sin(x) * Math.sin(x)),
    fnName: 'f(x) = cot x',
    derivName: "f'(x) = −csc²x",
    asymptoteOffset: 0
  });
}

function generateSecData(xRange) {
  return generateAsymptoticData(xRange, {
    fn: (x) => 1 / Math.cos(x),
    derivFn: (x) => (1 / Math.cos(x)) * Math.tan(x),
    fnName: 'f(x) = sec x',
    derivName: "f'(x) = sec x·tan x",
    asymptoteOffset: Math.PI / 2
  });
}

function generateCscData(xRange) {
  return generateAsymptoticData(xRange, {
    fn: (x) => 1 / Math.sin(x),
    derivFn: (x) => -(1 / Math.sin(x)) * (Math.cos(x) / Math.sin(x)),
    fnName: 'f(x) = csc x',
    derivName: "f'(x) = −csc x·cot x",
    asymptoteOffset: 0
  });
}

const DATA_GENERATORS = {
  sin: generateSinData,
  cos: generateCosData,
  tan: generateTanData,
  cot: generateCotData,
  sec: generateSecData,
  csc: generateCscData
};

// Functions with asymptotes use yRange and xTickMode="pi"
const ASYMPTOTIC_FUNCS = new Set(['tan', 'cot', 'sec', 'csc']);

/**
 * Combined Trigonometric Functions — tabbed interface for all 6 trig derivative visualizations
 */
const TrigonometricFunctions = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('sin');
  const [params, setParams] = useState({
    piXRange: [-2, 2],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const fnDef = FUNCTIONS[activeTab];
  const xRange = [params.piXRange[0] * Math.PI, params.piXRange[1] * Math.PI];
  const isAsymptotic = ASYMPTOTIC_FUNCS.has(activeTab);

  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  const generateData = useCallback(() => {
    const traces = DATA_GENERATORS[activeTab](xRange);
    return traces.map(t => ({
      ...t,
      line: { ...t.line, color: t.line?.color === _MC ? palette.mainTraces.primary : palette.auxTraces.derivative }
    }));
  }, [activeTab, xRange, palette]);

  const traces = useMemo(() => generateData(), [generateData]);

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
        <SectionTitleH1>{fnDef.title}</SectionTitleH1>
      </Header>

      <ToggleGroup>
        {Object.keys(FUNCTIONS).map((key) => (
          <ToggleBtn
            key={key}
            $active={activeTab === key}
            onClick={() => setActiveTab(key)}
          >
            {FUNCTIONS[key].label}
          </ToggleBtn>
        ))}
      </ToggleGroup>

      <SectionDescription>{fnDef.description}</SectionDescription>

      <FormulaBox>
        <FormulaTitle>{fnDef.formulaTitle}</FormulaTitle>
        <Formula dangerouslySetInnerHTML={{ __html: fnDef.formula }} />
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
            title={fnDef.plotTitle}
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

export default TrigonometricFunctions;

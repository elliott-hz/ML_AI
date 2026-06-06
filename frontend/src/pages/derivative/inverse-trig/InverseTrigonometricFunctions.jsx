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
  Formula,
  ToggleGroup,
  ToggleBtn
} from '../../../components/derivative/shared/DerivativeStyled';

/**
 * Inverse trigonometric function tab definitions
 */
const FUNCTIONS = {
  arcsin: {
    label: 'arcsin',
    title: 'Arcsine Function',
    description: 'The derivative of arcsin x is 1/√(1 − x²). The slope increases dramatically near the domain boundaries x = ±1, where the derivative approaches infinity, reflecting the vertical tangents of arcsin x.',
    formulaTitle: 'Derivative of Arcsine:',
    formula: 'f(x) = arcsin x &nbsp;&nbsp;x ∈ [−1, 1]<br/><br/>f\'(x) = 1 / √(1 − x²)',
    plotTitle: "(arcsin x)' = 1 / √(1 − x²)",
    xRangeDefault: [-1.5, 1.5],
    xRangeConfig: { min: -2, max: 2, step: 0.1 }
  },
  arccos: {
    label: 'arccos',
    title: 'Arccosine Function',
    description: 'The derivative of arccos x is −1/√(1 − x²). The negative sign makes arccos x strictly decreasing over its domain. Near x = ±1, the derivative blows up to −∞, matching the vertical tangents.',
    formulaTitle: 'Derivative of Arccosine:',
    formula: 'f(x) = arccos x &nbsp;&nbsp;x ∈ [−1, 1]<br/><br/>f\'(x) = −1 / √(1 − x²)',
    plotTitle: "(arccos x)' = −1 / √(1 − x²)",
    xRangeDefault: [-1.5, 1.5],
    xRangeConfig: { min: -2, max: 2, step: 0.1 }
  },
  arctan: {
    label: 'arctan',
    title: 'Arctangent Function',
    description: 'The derivative of arctan x is 1/(1 + x²). Unlike arcsin and arccos, arctan is defined for all real numbers. Its derivative forms a bell-shaped curve that peaks at x = 0 with value 1, and decays to 0 as x → ±∞.',
    formulaTitle: 'Derivative of Arctangent:',
    formula: 'f(x) = arctan x &nbsp;&nbsp;x ∈ (−∞, ∞)<br/><br/>f\'(x) = 1 / (1 + x²)',
    plotTitle: "(arctan x)' = 1 / (1 + x²)",
    xRangeDefault: [-10, 10],
    xRangeConfig: { min: -20, max: 20, step: 1 }
  },
  arccot: {
    label: 'arccot',
    title: 'Arccotangent Function',
    description: 'The derivative of arccot x is −1/(1 + x²). Like arctan, arccot is defined for all real numbers, but it is strictly decreasing. Its derivative is the negative of the arctan derivative, forming an inverted bell shape.',
    formulaTitle: 'Derivative of Arccotangent:',
    formula: 'f(x) = arccot x &nbsp;&nbsp;x ∈ (−∞, ∞)<br/><br/>f\'(x) = −1 / (1 + x²)',
    plotTitle: "(arccot x)' = −1 / (1 + x²)",
    xRangeDefault: [-10, 10],
    xRangeConfig: { min: -20, max: 20, step: 1 }
  },
  arcsec: {
    label: 'arcsec',
    title: 'Arcsecant Function',
    description: 'The derivative of arcsec x is 1/(|x|·√(x²−1)). The function is defined only for |x| ≥ 1, and its derivative blows up to infinity as x approaches ±1, matching the vertical tangents. As x → ±∞, the derivative decays to 0.',
    formulaTitle: 'Derivative of Arcsecant:',
    formula: 'f(x) = arcsec x &nbsp;&nbsp;|x| ≥ 1<br/><br/>f\'(x) = 1 / (|x| · √(x² − 1))',
    plotTitle: "(arcsec x)' = 1 / (|x| · √(x² − 1))",
    xRangeDefault: [-3, 3],
    xRangeConfig: { min: -5, max: 5, step: 0.5 }
  },
  arccsc: {
    label: 'arccsc',
    title: 'Arccosecant Function',
    description: 'The derivative of arccsc x is −1/(|x|·√(x²−1)). It is the negative of the arcsec derivative, making arccsc x strictly decreasing on each branch of its domain |x| ≥ 1.',
    formulaTitle: 'Derivative of Arccosecant:',
    formula: 'f(x) = arccsc x &nbsp;&nbsp;|x| ≥ 1<br/><br/>f\'(x) = −1 / (|x| · √(x² − 1))',
    plotTitle: "(arccsc x)' = −1 / (|x| · √(x² − 1))",
    xRangeDefault: [-3, 3],
    xRangeConfig: { min: -5, max: 5, step: 0.5 }
  }
};

// ─── Data generators ──────────────────────────────────────────────

function generateArcsinData(xRange) {
  const [xMin, xMax] = xRange;
  const n = 500;
  const step = (xMax - xMin) / n;
  const traces = [];

  const mx = [], my = [];
  const dx = [], dy = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + i * step;
    if (x >= -1 && x <= 1) {
      mx.push(x);
      my.push(Math.asin(x));
    }
    if (x > -1 && x < 1) {
      dx.push(x);
      dy.push(1 / Math.sqrt(1 - x * x));
    }
  }
  traces.push({ x: mx, y: my, type: 'scatter', mode: 'lines', name: 'arcsin x', line: { color: '#6366f1', width: 2.5 } });
  traces.push({ x: dx, y: dy, type: 'scatter', mode: 'lines', name: "1 / √(1 − x²)", line: { color: '#ef4444', width: 2, dash: 'dash' } });
  return traces;
}

function generateArccosData(xRange) {
  const [xMin, xMax] = xRange;
  const n = 500;
  const step = (xMax - xMin) / n;
  const traces = [];

  const mx = [], my = [];
  const dx = [], dy = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + i * step;
    if (x >= -1 && x <= 1) {
      mx.push(x);
      my.push(Math.acos(x));
    }
    if (x > -1 && x < 1) {
      dx.push(x);
      dy.push(-1 / Math.sqrt(1 - x * x));
    }
  }
  traces.push({ x: mx, y: my, type: 'scatter', mode: 'lines', name: 'arccos x', line: { color: '#6366f1', width: 2.5 } });
  traces.push({ x: dx, y: dy, type: 'scatter', mode: 'lines', name: "−1 / √(1 − x²)", line: { color: '#ef4444', width: 2, dash: 'dash' } });
  return traces;
}

function generateArctanData(xRange) {
  const [xMin, xMax] = xRange;
  const n = 500;
  const step = (xMax - xMin) / n;
  const traces = [];

  const mx = [], my = [];
  const dx = [], dy = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + i * step;
    mx.push(x);
    my.push(Math.atan(x));
    dx.push(x);
    dy.push(1 / (1 + x * x));
  }
  traces.push({ x: mx, y: my, type: 'scatter', mode: 'lines', name: 'arctan x', line: { color: '#6366f1', width: 2.5 } });
  traces.push({ x: dx, y: dy, type: 'scatter', mode: 'lines', name: "1 / (1 + x²)", line: { color: '#ef4444', width: 2, dash: 'dash' } });
  return traces;
}

function generateArccotData(xRange) {
  const [xMin, xMax] = xRange;
  const n = 500;
  const step = (xMax - xMin) / n;
  const traces = [];

  const mx = [], my = [];
  const dx = [], dy = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + i * step;
    mx.push(x);
    my.push(Math.PI / 2 - Math.atan(x));
    dx.push(x);
    dy.push(-1 / (1 + x * x));
  }
  traces.push({ x: mx, y: my, type: 'scatter', mode: 'lines', name: 'arccot x', line: { color: '#6366f1', width: 2.5 } });
  traces.push({ x: dx, y: dy, type: 'scatter', mode: 'lines', name: "−1 / (1 + x²)", line: { color: '#ef4444', width: 2, dash: 'dash' } });
  return traces;
}

function generateArcsecData(xRange) {
  const [xMin, xMax] = xRange;
  const n = 500;
  const step = (xMax - xMin) / n;
  const traces = [];

  // Main function: left branch (x <= -1) and right branch (x >= 1)
  const leftX = [], leftY = [];
  const rightX = [], rightY = [];
  const dLeftX = [], dLeftY = [];
  const dRightX = [], dRightY = [];

  for (let i = 0; i <= n; i++) {
    const x = xMin + i * step;
    if (x <= -1) {
      leftX.push(x);
      leftY.push(Math.acos(1 / x));
    }
    if (x >= 1) {
      rightX.push(x);
      rightY.push(Math.acos(1 / x));
    }
    if (x < -1) {
      dLeftX.push(x);
      dLeftY.push(1 / (Math.abs(x) * Math.sqrt(x * x - 1)));
    }
    if (x > 1) {
      dRightX.push(x);
      dRightY.push(1 / (Math.abs(x) * Math.sqrt(x * x - 1)));
    }
  }

  traces.push({ x: leftX, y: leftY, type: 'scatter', mode: 'lines', name: 'arcsec x', line: { color: '#6366f1', width: 2.5 } });
  traces.push({ x: rightX, y: rightY, type: 'scatter', mode: 'lines', name: 'arcsec x', line: { color: '#6366f1', width: 2.5 }, showlegend: false });
  traces.push({ x: dLeftX, y: dLeftY, type: 'scatter', mode: 'lines', name: "1 / (|x|·√(x²−1))", line: { color: '#ef4444', width: 2, dash: 'dash' } });
  traces.push({ x: dRightX, y: dRightY, type: 'scatter', mode: 'lines', name: "1 / (|x|·√(x²−1))", line: { color: '#ef4444', width: 2, dash: 'dash' }, showlegend: false });

  return traces;
}

function generateArccscData(xRange) {
  const [xMin, xMax] = xRange;
  const n = 500;
  const step = (xMax - xMin) / n;
  const traces = [];

  const leftX = [], leftY = [];
  const rightX = [], rightY = [];
  const dLeftX = [], dLeftY = [];
  const dRightX = [], dRightY = [];

  for (let i = 0; i <= n; i++) {
    const x = xMin + i * step;
    if (x <= -1) {
      leftX.push(x);
      leftY.push(Math.asin(1 / x));
    }
    if (x >= 1) {
      rightX.push(x);
      rightY.push(Math.asin(1 / x));
    }
    if (x < -1) {
      dLeftX.push(x);
      dLeftY.push(-1 / (Math.abs(x) * Math.sqrt(x * x - 1)));
    }
    if (x > 1) {
      dRightX.push(x);
      dRightY.push(-1 / (Math.abs(x) * Math.sqrt(x * x - 1)));
    }
  }

  traces.push({ x: leftX, y: leftY, type: 'scatter', mode: 'lines', name: 'arccsc x', line: { color: '#6366f1', width: 2.5 } });
  traces.push({ x: rightX, y: rightY, type: 'scatter', mode: 'lines', name: 'arccsc x', line: { color: '#6366f1', width: 2.5 }, showlegend: false });
  traces.push({ x: dLeftX, y: dLeftY, type: 'scatter', mode: 'lines', name: "−1 / (|x|·√(x²−1))", line: { color: '#ef4444', width: 2, dash: 'dash' } });
  traces.push({ x: dRightX, y: dRightY, type: 'scatter', mode: 'lines', name: "−1 / (|x|·√(x²−1))", line: { color: '#ef4444', width: 2, dash: 'dash' }, showlegend: false });

  return traces;
}

const DATA_GENERATORS = {
  arcsin: generateArcsinData,
  arccos: generateArccosData,
  arctan: generateArctanData,
  arccot: generateArccotData,
  arcsec: generateArcsecData,
  arccsc: generateArccscData
};

/**
 * Combined Inverse Trigonometric Functions — tabbed interface for all 6 inverse trig derivative visualizations
 */
const InverseTrigonometricFunctions = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('arcsin');
  const [params, setParams] = useState({
    xRange: [-1.5, 1.5],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const fnDef = FUNCTIONS[activeTab];

  // Reset xRange when tab changes
  const handleTabChange = (key) => {
    const def = FUNCTIONS[key];
    setParams((prev) => ({
      ...prev,
      xRange: def.xRangeDefault
    }));
    setActiveTab(key);
  };

  const generateData = useCallback(() => {
    return DATA_GENERATORS[activeTab](params.xRange);
  }, [activeTab, params.xRange]);

  const traces = useMemo(() => generateData(), [generateData]);

  const { min, max, step } = fnDef.xRangeConfig;
  const viewRangeConfig = [
    {
      name: 'xRange', label: 'X Range', type: 'range',
      min, max, step, default: fnDef.xRangeDefault
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
            onClick={() => handleTabChange(key)}
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
            xRange={params.xRange}
            title={fnDef.plotTitle}
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

export default InverseTrigonometricFunctions;

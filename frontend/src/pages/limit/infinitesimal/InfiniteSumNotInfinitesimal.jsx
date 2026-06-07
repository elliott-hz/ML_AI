// UI Pattern: MultiPlotVertical — 3 independent sections with separate controls + plots
import React, { useState, useMemo, useCallback } from 'react';
import { ASPECT_RATIO_OPTIONS } from '../../../constants/plotThemeConfig';
import LimitPlotter from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel, FormulaBox, Formula
} from '../../../components/limit/shared/LimitStyled';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { getTracePalette } from '../../../constants/plotThemeConfig';

/**
 * Helper function to calculate harmonic number H_n
 */
const harmonicNumber = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += 1 / i;
  }
  return sum;
};

/**
 * Convert a number to Unicode subscript
 * e.g., 10 → '₁₀', 2 → '₂'
 */
const toSubscript = (num) => {
  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '', '4': '₄',
    '5': '₅', '6': '', '7': '₇', '8': '₈', '9': ''
  };
  return String(num).split('').map(digit => subscripts[digit] || digit).join('');
};

/**
 * Infinite Sum Not Necessarily Infinitesimal - Demonstrates that the sum of infinitely many infinitesimals can diverge
 */
const InfiniteSumNotInfinitesimal = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // Separate parameter states for each plot (following OddEvenFunctions pattern)
  const [plot1Params, setPlot1Params] = useState({ 
    xRange: [-2, 2],       // X range for Plot 1
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto',    // Aspect ratio
    legendPosition: 'top-right'
  });

  const [plot2Params, setPlot2Params] = useState({ 
    xRange: [-2, 2],       // X range for Plot 2
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto',    // Aspect ratio
    legendPosition: 'top-right'
  });

  const [plot3Params, setPlot3Params] = useState({ 
    maxN: 50,              // Maximum N for growth curve in Plot 3
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto',    // Aspect ratio
    legendPosition: 'top-right'
  });

  // Generate individual infinitesimals: a_n(x) = x/n
  const generateIndividualTerms = useCallback(() => {
    const termIndices = [1, 2, 3, 5, 10];  // Fixed terms to display

    const traces = [];
    const [xMin, xMax] = plot1Params.xRange || [-2, 2];
    const traceColors = [palette.mainTraces.primary, palette.mainTraces.secondary, palette.mainTraces.tertiary, palette.limit.verticalAsymptote, palette.limit.rightLimit];

    termIndices.forEach((n, idx) => {
      const xValues = [xMin, xMax];
      const yValues = xValues.map(x => x / n);

      // Use HTML sub tags for proper math formatting in Plotly legends
      const formulaText = `a<sub>${n}</sub>(x) = x/${n}`;

      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: formulaText,
        line: { width: 2, color: traceColors[idx % traceColors.length] }
      });
    });
    
    return traces;
  }, [plot1Params.xRange, themeMode]);

  // Generate partial sums: S_N(x) = H_N · x
  const generatePartialSums = useCallback(() => {
    const N_values = [1, 2, 3, 5, 10];  // Fixed partial sums to display

    const traces = [];
    const [xMin, xMax] = plot2Params.xRange || [-2, 2];
    const traceColors = [palette.mainTraces.primary, palette.mainTraces.secondary, palette.mainTraces.tertiary, palette.limit.verticalAsymptote, palette.limit.rightLimit];

    N_values.forEach((N, idx) => {
      const H_N = harmonicNumber(N);
      const xValues = [xMin, xMax];
      const yValues = xValues.map(x => H_N * x);

      // Use HTML sub/sup tags for proper math formatting in Plotly legends
      let formulaText;
      if (N === 1) {
        formulaText = 'S<sub>1</sub>(x) = x';
      } else if (N === 2) {
        formulaText = 'S<sub>2</sub>(x) = x + x/2';
      } else if (N === 3) {
        formulaText = 'S<sub>3</sub>(x) = x + x/2 + x/3';
      } else {
        // Use summation notation with HTML tags
        formulaText = `S<sub>${N}</sub>(x) = Σ<sup>N</sup><sub>k=1</sub> (x/k)`;
      }

      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: formulaText,
        line: { width: 2, color: traceColors[idx % traceColors.length] }
      });
    });
    
    return traces;
  }, [plot2Params.xRange, themeMode]);

  // Generate growth curve: S_N(1) = H_N vs N
  const generateGrowthCurve = useCallback(() => {
    const maxN = plot3Params.maxN || 50;
    
    const nValues = [];
    const sValues = [];
    
    for (let N = 1; N <= maxN; N++) {
      nValues.push(N);
      sValues.push(harmonicNumber(N));
    }
    
    return [{
      x: nValues,
      y: sValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'S<sub>N</sub>(1)',
      line: { width: 2, color: palette.mainTraces.primary },
      marker: { size: 6, color: palette.mainTraces.primary }
    }];
  }, [plot3Params, themeMode]);

  // ✅ Use useMemo to cache data (following OddEvenFunctions pattern)
  const plot1Traces = useMemo(() => generateIndividualTerms(), [generateIndividualTerms]);
  const plot2Traces = useMemo(() => generatePartialSums(), [generatePartialSums]);
  const plot3Traces = useMemo(() => generateGrowthCurve(), [generateGrowthCurve]);

  // Parameter configurations for Plot 1 (removed maxN - fixed terms)
  const plot1ViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-2, 2] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const plot1PlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const plot1LegendConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const plot1CommonConfig = [
    ...plot1LegendConfig,
    ...plot1PlotStyleConfig,
    ...plot1ViewRangeConfig
  ];

  // Parameter configurations for Plot 2 (removed maxN - fixed sums)
  const plot2ViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-2, 2] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const plot2PlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const plot2LegendConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const plot2CommonConfig = [
    ...plot2LegendConfig,
    ...plot2PlotStyleConfig,
    ...plot2ViewRangeConfig
  ];

  // Parameter configurations for Plot 3
  const plot3CoefficientConfig = [
    { name: 'maxN', label: 'Max N for Growth', min: 10, max: 100, step: 10 }
  ];

  const plot3ViewRangeConfig = [
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const plot3PlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const plot3LegendConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const plot3CommonConfig = [
    ...plot3LegendConfig,
    ...plot3PlotStyleConfig,
    ...plot3ViewRangeConfig
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/limit">← Back to Limit</BackButton>
        <SectionTitle>Infinite Sum of Infinitesimals</SectionTitle>
      </Header>
      
      <SectionDescription>
        This example demonstrates that the sum of infinitely many infinitesimals is not necessarily an infinitesimal. 
        While each individual term approaches zero as x → 0, their cumulative sum can diverge to infinity.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          lim<sub>x→0</sub> Σ<sub>n=1</sub><sup>∞</sup> (x/n) = ∞
        </Formula>
      </FormulaBox>
      
      <SectionDescription>
        Observe the three plots below. Plot 1 shows individual terms with decreasing slopes. 
        Plot 2 shows partial sums with increasing slopes. Plot 3 reveals how the sum grows without bound.
      </SectionDescription>

      {/* Plot 1: Individual Infinitesimals */}
      <SectionTitle>Plot 1: Each term is an infinitesimal</SectionTitle>
      <SectionDescription>
        Each individual term a<sub>n</sub>(x) = x/n is an infinitesimal as x → 0. The slopes decrease as n increases.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={plot1Params}
              onChange={setPlot1Params}
              config={plot1CommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={plot1Traces}
            xRange={plot1Params.xRange}
            plotStyle={plot1Params.plotStyle}
            aspectRatio={plot1Params.aspectRatio}
            legendPosition={plot1Params.legendPosition}
            title="Each term is an infinitesimal"
          />
        </PlotPanel>
      </ContentLayout>

      {/* Plot 2: Partial Sums */}
      <SectionTitle style={{ marginTop: '2rem' }}>Plot 2: Sum of Infinitesimals</SectionTitle>
      <SectionDescription>
        The partial sums S<sub>N</sub>(x) = H<sub>N</sub>·x have increasing slopes. Even though we're adding smaller terms, the total grows!
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={plot2Params}
              onChange={setPlot2Params}
              config={plot2CommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={plot2Traces}
            xRange={plot2Params.xRange}
            plotStyle={plot2Params.plotStyle}
            aspectRatio={plot2Params.aspectRatio}
            legendPosition={plot2Params.legendPosition}
            title="Sum of Infinitesimals"
          />
        </PlotPanel>
      </ContentLayout>

      {/* Plot 3: Growth Curve */}
      <SectionTitle style={{ marginTop: '2rem' }}>Plot 3: Growth of Partial Sum at x=1</SectionTitle>
      <SectionDescription>
        At x=1, the partial sum S<sub>N</sub>(1) grows without bound as N increases. This proves that infinitely many infinitesimals can sum to infinity.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={plot3Params}
              onChange={setPlot3Params}
              config={plot3CoefficientConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={plot3Params}
              onChange={setPlot3Params}
              config={plot3CommonConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={plot3Traces}
            xRange={[1, plot3Params.maxN]}
            plotStyle={plot3Params.plotStyle}
            aspectRatio={plot3Params.aspectRatio}
            legendPosition={plot3Params.legendPosition}
            title={`Growth of Partial Sum at x=1`}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfiniteSumNotInfinitesimal;

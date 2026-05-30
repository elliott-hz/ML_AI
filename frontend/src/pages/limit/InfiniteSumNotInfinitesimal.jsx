import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter from '../../components/visualization/LimitPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';

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
  const navigate = useNavigate();
  
  // Separate parameter states for each plot (following OddEvenFunctions pattern)
  const [plot1Params, setPlot1Params] = useState({ 
    xRange: [-2, 2],       // X range for Plot 1
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto'    // Aspect ratio
  });

  const [plot2Params, setPlot2Params] = useState({ 
    xRange: [-2, 2],       // X range for Plot 2
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto'    // Aspect ratio
  });

  const [plot3Params, setPlot3Params] = useState({ 
    maxN: 50,              // Maximum N for growth curve in Plot 3
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto'    // Aspect ratio
  });

  // Generate individual infinitesimals: a_n(x) = x/n
  const generateIndividualTerms = useCallback(() => {
    const termIndices = [1, 2, 3, 5, 10];  // Fixed terms to display
    
    const traces = [];
    const [xMin, xMax] = plot1Params.xRange || [-2, 2];
    
    termIndices.forEach(n => {
      const xValues = [xMin, xMax];
      const yValues = xValues.map(x => x / n);
      
      // ✅ 使用Unicode下标和简洁的分数形式
      const formulaText = `a${toSubscript(n)}(x) = x/${n}`;
      
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: formulaText,
        line: { width: 2 }
      });
    });
    
    return traces;
  }, [plot1Params.xRange]);

  // Generate partial sums: S_N(x) = H_N · x
  const generatePartialSums = useCallback(() => {
    const N_values = [1, 2, 3, 5, 10];  // Fixed partial sums to display
    
    const traces = [];
    const [xMin, xMax] = plot2Params.xRange || [-2, 2];
    
    N_values.forEach(N => {
      const H_N = harmonicNumber(N);
      const xValues = [xMin, xMax];
      const yValues = xValues.map(x => H_N * x);
      
      // ✅ 使用Unicode下标和求和符号，避免长表达式
      let formulaText;
      if (N === 1) {
        formulaText = 'S₁(x) = x';
      } else if (N === 2) {
        formulaText = 'S₂(x) = x + x/2';
      } else if (N === 3) {
        formulaText = 'S₃(x) = x + x/2 + x/3';
      } else {
        // 使用求和符号表示，避免过长
        formulaText = `S${toSubscript(N)}(x) = Σᵏ₌₁ᴺ (x/k), N=${N}`;
      }
      
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: formulaText,
        line: { width: 2 }
      });
    });
    
    return traces;
  }, [plot2Params.xRange]);

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
      name: 'S_N(1)',
      line: { width: 2 },
      marker: { size: 6 }
    }];
  }, [plot3Params]);

  // ✅ Use useMemo to cache data (following OddEvenFunctions pattern)
  const plot1Traces = useMemo(() => generateIndividualTerms(), [generateIndividualTerms]);
  const plot2Traces = useMemo(() => generatePartialSums(), [generatePartialSums]);
  const plot3Traces = useMemo(() => generateGrowthCurve(), [generateGrowthCurve]);

  // Parameter configurations for Plot 1 (removed maxN - fixed terms)
  const plot1ViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-2, 2] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  const plot1PlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  // Parameter configurations for Plot 2 (removed maxN - fixed sums)
  const plot2ViewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-2, 2] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  const plot2PlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  // Parameter configurations for Plot 3
  const plot3CoefficientConfig = [
    { name: 'maxN', label: 'Max N for Growth', min: 10, max: 100, step: 10 }
  ];

  const plot3ViewRangeConfig = [
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  const plot3PlotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
          ← Back to Limit
        </BackButton>
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
        Each individual term aₙ(x) = x/n is an infinitesimal as x → 0. The slopes decrease as n increases.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={plot1Params}
              onChange={setPlot1Params}
              config={plot1PlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={plot1Params}
              onChange={setPlot1Params}
              config={plot1ViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <LimitPlotter
            data={plot1Traces}
            xRange={plot1Params.xRange}
            plotStyle={plot1Params.plotStyle}
            aspectRatio={plot1Params.aspectRatio}
            title="Each term is an infinitesimal"
          />
        </PlotPanel>
      </ContentLayout>

      {/* Plot 2: Partial Sums */}
      <SectionTitle style={{ marginTop: '2rem' }}>Plot 2: Sum of Infinitesimals</SectionTitle>
      <SectionDescription>
        The partial sums S_N(x) = H_N·x have increasing slopes. Even though we're adding smaller terms, the total grows!
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={plot2Params}
              onChange={setPlot2Params}
              config={plot2PlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={plot2Params}
              onChange={setPlot2Params}
              config={plot2ViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <LimitPlotter
            data={plot2Traces}
            xRange={plot2Params.xRange}
            plotStyle={plot2Params.plotStyle}
            aspectRatio={plot2Params.aspectRatio}
            title="Sum of Infinitesimals"
          />
        </PlotPanel>
      </ContentLayout>

      {/* Plot 3: Growth Curve */}
      <SectionTitle style={{ marginTop: '2rem' }}>Plot 3: Growth of Partial Sum at x=1</SectionTitle>
      <SectionDescription>
        At x=1, the partial sum S_N(1) grows without bound as N increases. This proves that infinitely many infinitesimals can sum to infinity.
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

          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={plot3Params}
              onChange={setPlot3Params}
              config={plot3PlotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={plot3Params}
              onChange={setPlot3Params}
              config={plot3ViewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <LimitPlotter
            data={plot3Traces}
            xRange={[1, plot3Params.maxN]}
            plotStyle={plot3Params.plotStyle}
            aspectRatio={plot3Params.aspectRatio}
            title={`Growth of Partial Sum at x=1`}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfiniteSumNotInfinitesimal;

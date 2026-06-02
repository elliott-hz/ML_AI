import React, { useState, useMemo, useCallback } from 'react';
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

/**
 * Quotient of Infinitesimals Not Necessarily Infinitesimal - Demonstrates that the quotient of two infinitesimals can be infinitesimal, infinity, or a finite value
 */
const QuotientOfInfinitesimals = () => {
  const navigate = useNavigate();
  
  // Separate parameter states for each plot
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
    xRange: [-2, 2],       // X range for Plot 3
    plotStyle: 'medium',   // Plot style
    aspectRatio: 'auto',    // Aspect ratio
    legendPosition: 'top-right'
  });

  // Generate Plot 1 data: x²/2x → 0 (infinitesimal)
  const generatePlot1Data = useCallback(() => {
    const [xMin, xMax] = plot1Params.xRange || [-2, 2];
    const numPoints = 500;
    
    const traces = [];
    
    // Numerator: f(x) = x²
    const xValues1 = [];
    const yValues1 = [];
    const step1 = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue; // Skip near zero to avoid division issues
      xValues1.push(x);
      yValues1.push(x * x);
    }
    
    traces.push({
      x: xValues1,
      y: yValues1,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x) = x²',
      line: { width: 2, color: '#6366f1' }
    });
    
    // Denominator: g(x) = 2x
    const xValues2 = [];
    const yValues2 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues2.push(x);
      yValues2.push(2 * x);
    }
    
    traces.push({
      x: xValues2,
      y: yValues2,
      type: 'scatter',
      mode: 'lines',
      name: 'g(x) = 2x',
      line: { width: 2, color: '#8b5cf6' }
    });
    
    // Quotient: f(x)/g(x) = x²/2x = x/2
    const xValues3 = [];
    const yValues3 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues3.push(x);
      yValues3.push(x / 2);
    }
    
    traces.push({
      x: xValues3,
      y: yValues3,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)/g(x) = x/2 → 0',
      line: { width: 3, color: '#ef4444' }
    });
    
    return traces;
  }, [plot1Params.xRange]);

  // Generate Plot 2 data: 2x/x² → ∞ (infinity)
  const generatePlot2Data = useCallback(() => {
    const [xMin, xMax] = plot2Params.xRange || [-2, 2];
    const numPoints = 500;
    
    const traces = [];
    
    // Numerator: f(x) = 2x
    const xValues1 = [];
    const yValues1 = [];
    const step1 = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues1.push(x);
      yValues1.push(2 * x);
    }
    
    traces.push({
      x: xValues1,
      y: yValues1,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x) = 2x',
      line: { width: 2, color: '#6366f1' }
    });
    
    // Denominator: g(x) = x²
    const xValues2 = [];
    const yValues2 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues2.push(x);
      yValues2.push(x * x);
    }
    
    traces.push({
      x: xValues2,
      y: yValues2,
      type: 'scatter',
      mode: 'lines',
      name: 'g(x) = x²',
      line: { width: 2, color: '#8b5cf6' }
    });
    
    // ✅ Quotient: f(x)/g(x) = 2x/x² = 2/x
    // Split into two parts to avoid connecting -∞ to +∞ at x=0
    
    // Left side (x < 0): 2/x → -∞
    const xValues3Left = [];
    const yValues3Left = [];
    
    for (let i = 0; i <= numPoints / 2; i++) {
      const x = xMin + i * step1;
      if (x >= -0.01) break; // Stop before reaching 0
      const y = 2 / x;
      // Clip extreme values for better visualization
      if (y > -100 && y < 100) {
        xValues3Left.push(x);
        yValues3Left.push(y);
      }
    }
    
    traces.push({
      x: xValues3Left,
      y: yValues3Left,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)/g(x) = 2/x → -∞ (left)',
      line: { width: 3, color: '#ef4444' },
      visible: true
    });
    
    // Right side (x > 0): 2/x → +∞
    const xValues3Right = [];
    const yValues3Right = [];
    
    for (let i = Math.floor(numPoints / 2); i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (x <= 0.01) continue; // Skip until past 0
      const y = 2 / x;
      // Clip extreme values for better visualization
      if (y > -100 && y < 100) {
        xValues3Right.push(x);
        yValues3Right.push(y);
      }
    }
    
    traces.push({
      x: xValues3Right,
      y: yValues3Right,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)/g(x) = 2/x → +∞ (right)',
      line: { width: 3, color: '#ef4444' },
      visible: true
    });
    
    return traces;
  }, [plot2Params.xRange]);

  // Generate Plot 3 data: x/2x → 1/2 (finite value)
  const generatePlot3Data = useCallback(() => {
    const [xMin, xMax] = plot3Params.xRange || [-2, 2];
    const numPoints = 500;
    
    const traces = [];
    
    // Numerator: f(x) = x
    const xValues1 = [];
    const yValues1 = [];
    const step1 = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues1.push(x);
      yValues1.push(x);
    }
    
    traces.push({
      x: xValues1,
      y: yValues1,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x) = x',
      line: { width: 2, color: '#6366f1' }
    });
    
    // Denominator: g(x) = 2x
    const xValues2 = [];
    const yValues2 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues2.push(x);
      yValues2.push(2 * x);
    }
    
    traces.push({
      x: xValues2,
      y: yValues2,
      type: 'scatter',
      mode: 'lines',
      name: 'g(x) = 2x',
      line: { width: 2, color: '#8b5cf6' }
    });
    
    // Quotient: f(x)/g(x) = x/2x = 1/2
    const xValues3 = [];
    const yValues3 = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step1;
      if (Math.abs(x) < 0.01) continue;
      xValues3.push(x);
      yValues3.push(0.5);
    }
    
    traces.push({
      x: xValues3,
      y: yValues3,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)/g(x) = 1/2',
      line: { width: 3, color: '#ef4444' }
    });
    
    return traces;
  }, [plot3Params.xRange]);

  // ✅ Use useMemo to cache data
  const plot1Traces = useMemo(() => generatePlot1Data(), [generatePlot1Data]);
  const plot2Traces = useMemo(() => generatePlot2Data(), [generatePlot2Data]);
  const plot3Traces = useMemo(() => generatePlot3Data(), [generatePlot3Data]);

  // Parameter configurations for all plots
  const viewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5, default: [-2, 2] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
          ← Back to Limit
        </BackButton>
        <SectionTitle>Quotient of Infinitesimals</SectionTitle>
      </Header>
      
      <SectionDescription>
        This example demonstrates that the quotient of two infinitesimals is not necessarily an infinitesimal. 
        The result depends on the relative speeds at which the numerator and denominator approach zero.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          lim<sub>x→0</sub> f(x)/g(x) = ? (depends on convergence speed)
        </Formula>
      </FormulaBox>
      
      <SectionDescription>
        Observe the three cases below. Each plot shows the numerator (blue), denominator (purple), and their quotient (red).
      </SectionDescription>

      {/* Plot 1: Quotient → Infinitesimal */}
      <SectionTitle>Plot 1: Quotient → Infinitesimal (0)</SectionTitle>
      <SectionDescription>
        When f(x) approaches 0 faster than g(x), the quotient approaches 0. Here f(x) = x² approaches 0 faster than g(x) = 2x.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={plot1Params}
              onChange={setPlot1Params}
              config={commonParamsConfig}
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
            title="lim(x→0) x²/2x = 0 (infinitesimal)"
          />
        </PlotPanel>
      </ContentLayout>

      {/* Plot 2: Quotient → Infinity */}
      <SectionTitle style={{ marginTop: '2rem' }}>Plot 2: Quotient → Infinity (∞)</SectionTitle>
      <SectionDescription>
        When g(x) approaches 0 faster than f(x), the quotient approaches infinity. Here g(x) = x² approaches 0 faster than f(x) = 2x.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={plot2Params}
              onChange={setPlot2Params}
              config={commonParamsConfig}
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
            title="lim(x→0) 2x/x² = ∞ (infinity)"
          />
        </PlotPanel>
      </ContentLayout>

      {/* Plot 3: Quotient → Finite Value */}
      <SectionTitle style={{ marginTop: '2rem' }}>Plot 3: Quotient → Finite Value (1/2)</SectionTitle>
      <SectionDescription>
        When f(x) and g(x) approach 0 at the same speed, the quotient approaches a non-zero finite value. Here both are linear functions.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={plot3Params}
              onChange={setPlot3Params}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={plot3Traces}
            xRange={plot3Params.xRange}
            plotStyle={plot3Params.plotStyle}
            aspectRatio={plot3Params.aspectRatio}
            legendPosition={plot3Params.legendPosition}
            title="lim(x→0) x/2x = 1/2 (finite value)"
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default QuotientOfInfinitesimals;

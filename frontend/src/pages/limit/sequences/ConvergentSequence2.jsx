import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../components/visualization/LimitPlotter';
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

const FunctionSection = styled.div`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  box-shadow: ${({ theme }) => theme?.shadows?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
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
 * Convergent Sequence 2 - u_n = n/(n+1) → 1
 */
const ConvergentSequence2 = () => {
  const navigate = useNavigate();
  
  const [params, setParams] = useState({ 
    maxN: 50,          // 显示的项数
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成离散序列数据
  const generateSequenceData = useCallback(() => {
    const maxN = params.maxN || 50;
    
    const nValues = [];
    const uValues = [];
    
    for (let n = 0; n <= maxN; n++) {
      nValues.push(n);
      uValues.push(n / (n + 1));
    }
    
    const traces = [{
      x: nValues,
      y: uValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'uₙ',
      line: { 
        color: '#6366f1', 
        width: 2,
        shape: 'spline'
      },
      marker: { 
        size: 8, 
        color: '#6366f1',
        symbol: 'circle'
      }
    }];
    
    // ✅ 添加收敛辅助线（y=1）
    traces.push({
      x: [0, maxN],
      y: [1, 1],
      type: 'scatter',
      mode: 'lines',
      name: 'lim: 1',
      line: { 
        color: '#ffd700', // 金黄色，会被 styledData 自动调整为主题色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    return traces;
  }, [params]);

  // 生成连续原函数数据
  const generateFunctionData = useCallback(() => {
    const maxN = Math.min(params.maxN, 20);
    const numPoints = 200;
    
    const xValues = [];
    const yValues = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = 0 + (maxN * i) / numPoints;
      xValues.push(x);
      yValues.push(x / (x + 1));
    }
    
    return [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)',
      line: { 
        color: '#6366f1', 
        width: 2.5
      }
    }];
  }, [params]);

  // 参数配置 - 分组版本
  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 100, step: 10 },
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

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
          ← Back to Limit
        </BackButton>
        <SectionTitle>Convergent Sequence: Rational Approach</SectionTitle>
      </Header>

      <SectionDescription>
        This sequence demonstrates how a rational function approaches its horizontal asymptote.
        The terms approach 1 from below, getting closer but never exceeding it.
      </SectionDescription>

      <SectionTitle>Sequence: u<sub>n</sub> = n/(n+1)</SectionTitle>

      <FormulaBox>
        <Formula>
          lim<sub>n→</sub> <span style={{ fontSize: '24px' }}>n/(n+1)</span> = 1
        </Formula>
      </FormulaBox>

      <SectionDescription>
        Observe how the sequence approaches 1 as n increases.
        Each term is slightly less than 1, but the difference becomes negligible for large n.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={generateSequenceData()}
            xRange={[0, params.maxN]}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
            title={`Sequence: uₙ = n/(n+1)`}
          />

          {/* 原函数图像 */}
          <div style={{ marginTop: '1rem' }}>
            <LimitPlotter
              data={generateFunctionData()}
              xRange={[0, Math.min(params.maxN, 20)]}
              title={`Original Function: f(x) = x/(x+1)`}
              plotStyle={params.plotStyle}
              aspectRatio={params.aspectRatio}
              legendPosition={params.legendPosition}
            />
          </div>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ConvergentSequence2;

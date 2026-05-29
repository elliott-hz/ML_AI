import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SequencePlotter from '../../components/visualization/SequencePlotter';
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
    maxN: 20           // 显示的项数
  });

  // 参数配置 - 分组版本
  const viewRangeConfig = [
    { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 200, step: 10 }
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
          lim<sub>n→∞</sub> <span style={{ fontSize: '24px' }}>n/(n+1)</span> = 1
        </Formula>
      </FormulaBox>
      
      <SectionDescription>
        Observe how the sequence approaches 1 as n increases. 
        Each term is slightly less than 1, but the difference becomes negligible for large n.
      </SectionDescription>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={viewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <SequencePlotter
            sequenceType="convergent2"
            parameters={params}
            title="Sequence: u<sub>n</sub> = n/(n+1)"
            showLimitLine={true}
            limitValue={1}
          />
          
          {/* 原函数图像 */}
          <div style={{ marginTop: '1rem' }}>
            <SequencePlotter
              sequenceType="original_function"
              parameters={{ funcName: 'rational', maxN: Math.min(params.maxN, 50) }}
              xRange={[0, Math.min(params.maxN, 50)]}
              yRange={[0, 1.2]}
              title={`Original Function: f(x) = x/(x+1)`}
            />
          </div>
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default ConvergentSequence2;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SequencePlotter from '../../components/visualization/SequencePlotter';
import ParameterControls from '../../components/visualization/ParameterControls';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
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
  border-left: 4px solid #ef4444;
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const Formula = styled.code`
  color: #ef4444;
  font-size: 18px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
  font-weight: bold;
`;

/**
 * Divergent Sequence 1 - u_n = n² → ∞
 */
const DivergentSequence1 = () => {
  const navigate = useNavigate();
  
  const [params, setParams] = useState({ 
    maxN: 20           // 显示的项数
  });

  const paramConfig = [
    { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 50, step: 5 }
  ];

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
        ← Back to Limit
      </BackButton>

      <SectionTitle>Divergent Sequence: Quadratic Growth</SectionTitle>
      <SectionDescription>
        This sequence demonstrates unbounded growth. As n increases, the terms grow quadratically 
        and approach infinity. There is no finite limit.
      </SectionDescription>

      <FunctionSection>
        <SectionTitle>Sequence: u<sub>n</sub> = n²</SectionTitle>
        
        <FormulaBox>
          <Formula>
            lim<sub>n→∞</sub> <span style={{ fontSize: '24px' }}>n²</span> = +∞
          </Formula>
        </FormulaBox>
        
        <SectionDescription>
          Observe how rapidly the sequence grows. The quadratic nature means each term 
          increases much faster than the previous one, leading to divergence.
        </SectionDescription>
        
        <ContentLayout>
          <ControlsPanel>
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={paramConfig}
            />
          </ControlsPanel>
          
          <PlotPanel>
            <SequencePlotter
              sequenceType="divergent1"
              parameters={params}
              title="Sequence: u<sub>n</sub> = n²"
              showLimitLine={false}
            />
            
            {/* 原函数图像 */}
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '0.5rem' }}>
                Original Function: f(x) = x²
              </h4>
              <SequencePlotter
                sequenceType="original_function"
                parameters={{ funcName: 'quadratic', maxN: Math.min(params.maxN, 20) }}
                xRange={[0, Math.min(params.maxN, 20)]}
                yRange={[0, Math.pow(Math.min(params.maxN, 20), 2)]}
                title=""
              />
            </div>
          </PlotPanel>
        </ContentLayout>
      </FunctionSection>
    </PageContainer>
  );
};

export default DivergentSequence1;

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
 * Convergent Sequence 1 - u_n = 1/3^n → 0
 */
const ConvergentSequence1 = () => {
  const navigate = useNavigate();
  
  const [params, setParams] = useState({ 
    base: 3,           // 底数
    maxN: 20           // 显示的项数
  });

  const paramConfig = [
    { name: 'base', label: 'Base (a)', min: 2, max: 10, step: 1 },
    { name: 'maxN', label: 'Number of Terms (N)', min: 10, max: 100, step: 5 }
  ];

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
        ← Back to Limit
      </BackButton>

      <SectionTitle>Convergent Sequence: Exponential Decay</SectionTitle>
      <SectionDescription>
        This sequence demonstrates exponential decay. As n increases, the terms rapidly approach zero. 
        The larger the base, the faster the convergence.
      </SectionDescription>

      <FunctionSection>
        <SectionTitle>Sequence: u<sub>n</sub> = 1/a<sup>n</sup></SectionTitle>
        
        <FormulaBox>
          <Formula>
            lim<sub>n→∞</sub> <span style={{ fontSize: '24px' }}>1/a<sup>n</sup></span> = 0
          </Formula>
        </FormulaBox>
        
        <SectionDescription>
          Adjust the base (a) to see how it affects the rate of convergence. 
          Larger bases result in faster decay toward zero.
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
              sequenceType="convergent1"
              parameters={params}
              title={`Sequence: u<sub>n</sub> = 1/${params.base}<sup>n</sup>`}
              showLimitLine={true}
              limitValue={0}
            />
            
            {/* 原函数图像 */}
            <div style={{ marginTop: '1rem' }}>
              <SequencePlotter
                sequenceType="original_function"
                parameters={{ funcName: 'exponential_decay', base: params.base, maxN: Math.min(params.maxN, 20) }}
                xRange={[0, Math.min(params.maxN, 20)]}
                yRange={[0, 1]}
                title={`Original Function: f(x) = 1/${params.base}<sup>x</sup>`}
              />
            </div>
          </PlotPanel>
        </ContentLayout>
      </FunctionSection>
    </PageContainer>
  );
};

export default ConvergentSequence1;

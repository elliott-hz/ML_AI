import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter from '../../components/visualization/LimitPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => `${theme?.spacing?.sm || '0.5rem'} ${theme?.spacing?.md || '1rem'}`};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateX(-2px);
  }
`;

const SectionTitle = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const Description = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  font-family: 'Courier New', monospace;
  font-size: 18px;
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  
  sub, sup {
    font-size: 0.75em;
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ControlsPanel = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  height: fit-content;
`;

const ParameterSection = styled.div`
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PlotPanel = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

/**
 * Infinitesimal Constant Multiple Property Page
 * Property 3: Constant × infinitesimal is still an infinitesimal
 */
const InfinitesimalConstant = () => {
  const navigate = useNavigate();
  
  const [params, setParams] = useState({
    constant: 5,
    xRange: [-2, 2],
    yRange: [-10, 10],
    plotStyle: 'medium',
    aspectRatio: 'auto'
  });

  const paramConfig = [
    { name: 'constant', label: 'Constant c', type: 'slider', min: 1, max: 10, step: 0.5 }
  ];

  const viewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -5, max: 5, step: 0.5 },
    { name: 'yRange', label: 'Y Range', type: 'range', min: -20, max: 20, step: 1 },
    { name: 'plotStyle', label: 'Line Style', type: 'select', options: ['thin', 'medium', 'thick', 'larger'] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
          ← Back to Limit
        </BackButton>
        <SectionTitle>Infinitesimal Property 3: Constant Multiple</SectionTitle>
      </Header>

      <Description>
        <strong>Property:</strong> If c is a constant and α(x) → 0, then c·α(x) → 0.
      </Description>

      <FormulaBox>
        <div>α(x) = x is infinitesimal as x → 0</div>
        <div style={{ marginTop: '1rem' }}>
          c = {params.constant} (adjustable constant)
        </div>
        <div style={{ marginTop: '1rem' }}>
          Then g(x) = c·x = {params.constant}·x → 0 as x → 0
        </div>
        <div style={{ marginTop: '1rem', fontSize: '14px', color: '#94a3b8' }}>
          Note: Scaling by any finite constant doesn't change the infinitesimal nature
        </div>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Parameters">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={paramConfig}
            />
          </ParameterSection>
          
          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={viewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <LimitPlotter
            sequenceType="original_function"
            parameters={{ ...params, funcName: 'infinitesimal_constant' }}
            xRange={params.xRange}
            title={`Constant × Infinitesimal: ${params.constant}·x`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            showAuxiliaryLines={true}
            auxiliaryX={0}
            auxiliaryY={0}
            showPoints={[
              { x: 0, y: 0, label: 'lim = 0' }
            ]}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfinitesimalConstant;

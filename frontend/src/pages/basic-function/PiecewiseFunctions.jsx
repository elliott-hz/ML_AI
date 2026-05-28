import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter from '../../components/visualization/FunctionPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const FormulaTitle = styled.h3`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 16px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
`;

/**
 * Piecewise Functions 页面 - 分段函数可视化
 */
const PiecewiseFunctions = () => {
  const navigate = useNavigate();
  
  const [params, setParams] = useState({
    coefficient: 1
  });

  const paramConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.1,
      max: 5,
      step: 0.1
    }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
           Back to Basic Function
        </BackButton>
        <Title>Piecewise Function</Title>
      </Header>

      <Description>
        A piecewise function is defined by different expressions on different intervals of the domain. 
        Adjust the coefficient to see how it affects the shape of each piece.
      </Description>

      <FormulaBox>
        <FormulaTitle>Example Function:</FormulaTitle>
        <Formula>
          f(x) = {'{'}<br/>
          &nbsp;&nbsp;a·√x, &nbsp;x ≥ 0<br/>
          &nbsp;&nbsp;-a·x, &nbsp;x &lt; 0<br/>
          {'}'}
        </Formula>
      </FormulaBox>

      <ParameterControls
        parameters={params}
        onChange={setParams}
        config={paramConfig}
      />
      
      <FunctionPlotter
        functionType="piecewise"
        parameters={params}
        xRange={[-5, 5]}
        yRange={[-5, 10]}
        title="Piecewise Function: f(x)"
        showExportButton={true}
      />
    </PageContainer>
  );
};

export default PiecewiseFunctions;

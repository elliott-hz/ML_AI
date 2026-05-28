import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter from '../../components/visualization/FunctionPlotter';
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

/**
 * 奇偶性函数子页面 - 展示奇函数和偶函数的特性
 */
const OddEvenFunctions = () => {
  const navigate = useNavigate();
  
  // 奇函数参数状态
  const [oddParams, setOddParams] = useState({ a: 1 });
  
  // 偶函数参数状态
  const [evenParams, setEvenParams] = useState({ a: 1 });

  // 奇函数参数配置
  const oddParamConfig = [
    { name: 'a', label: 'Coefficient (a)', min: -5, max: 5, step: 0.1 }
  ];

  // 偶函数参数配置
  const evenParamConfig = [
    { name: 'a', label: 'Coefficient (a)', min: -5, max: 5, step: 0.1 }
  ];

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
        ← Back to Basic Function
      </BackButton>

      <SectionTitle>Odd & Even Functions</SectionTitle>
      <SectionDescription>
        Explore the symmetry properties of functions. An odd function satisfies f(-x) = -f(x) and is symmetric about the origin. 
        An even function satisfies f(-x) = f(x) and is symmetric about the y-axis.
      </SectionDescription>

      {/* 奇函数部分 */}
      <FunctionSection>
        <SectionTitle> Odd Function: f(x) = ax³</SectionTitle>
        <SectionDescription>
          Odd functions are symmetric about the origin. When you rotate the graph 180° around the origin, it looks the same.
        </SectionDescription>
        
        <ParameterControls
          parameters={oddParams}
          onChange={setOddParams}
          config={oddParamConfig}
        />
        
        <FunctionPlotter
          functionType="odd"
          parameters={oddParams}
          xRange={[-5, 5]}
          yRange={[-50, 50]}
          title="Odd Function: f(x) = ax³"
          showExportButton={true}
        />
      </FunctionSection>

      {/* 偶函数部分 */}
      <FunctionSection>
        <SectionTitle>🟣 Even Function: f(x) = ax²</SectionTitle>
        <SectionDescription>
          Even functions are symmetric about the y-axis. The left side is a mirror image of the right side.
        </SectionDescription>
        
        <ParameterControls
          parameters={evenParams}
          onChange={setEvenParams}
          config={evenParamConfig}
        />
        
        <FunctionPlotter
          functionType="even"
          parameters={evenParams}
          xRange={[-5, 5]}
          yRange={[-10, 50]}
          title="Even Function: f(x) = ax²"
          showExportButton={true}
        />
      </FunctionSection>
    </PageContainer>
  );
};

export default OddEvenFunctions;

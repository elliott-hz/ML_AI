import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardGrid from '../../../components/CardGrid';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 32px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
`;

const GroupTitle = styled.h2`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 24px;
  font-weight: 600;
  margin-top: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding-left: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const FeatureButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme?.colors?.cardBg || '#1e293b'}, ${({ theme }) => theme?.colors?.inputBg || '#334155'});
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const ButtonTitle = styled.h3`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 20px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

const ButtonDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 14px;
  line-height: 1.5;
`;

/**
 * IntegralFunction 主页面 — Integral Function and Anti-Derivative
 */
const IntegralFunction = () => {
  const navigate = useNavigate();

  const definitionCards = [
    {
      id: 'geometric-meaning',
      title: 'Geometric Meaning of Integral Function',
      description: 'Explore how φ(x) = ∫ₐˣ f(t) dt accumulates area under the curve — visualize the relationship between f(t) and its integral function.',
      path: '/mathematics/2-calculus/integral-function/geometric-meaning'
    }
  ];

  const antiDerivativeCards = [
    {
      id: 'fundamental-theorem',
      title: 'Fundamental Theorem of Calculus',
      description: 'Verify FTC Parts 1 & 2: φ\'(x) = f(x) and ∫ₐᵇ f = F(b) − F(a) — see how differentiation and integration are inverse operations.',
      path: '/mathematics/2-calculus/integral-function/fundamental-theorem'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Integral Function</Title>
        <Subtitle>
          The integral function φ(x) = ∫ₐˣ f(t) dt generalizes the concept of a definite integral
          by treating the upper limit as a variable. This leads to the fundamental theorem of calculus,
          which connects integration and differentiation.
        </Subtitle>
      </Header>

      <GroupTitle>Integral Function Definition</GroupTitle>
      <CardGrid>
        {definitionCards.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => navigate(feature.path)}
          >
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>

      <GroupTitle>Anti-Derivative</GroupTitle>
      <CardGrid>
        {antiDerivativeCards.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => navigate(feature.path)}
          >
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>
    </PageContainer>
  );
};

export default IntegralFunction;

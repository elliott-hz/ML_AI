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
 * DefiniteIntegral 主页面 — Definition of Definite Integral and Its Properties
 */
const DefiniteIntegral = () => {
  const navigate = useNavigate();

  // Group 1: Definition
  const definitionCards = [
    {
      id: 'definition-via-limit',
      title: 'Definition of the Definite Integral',
      description: 'The definite integral as the limit of Riemann sums — visualize how left, right, and midpoint sums all converge to the same value as the partition norm λ → 0.',
      path: '/mathematics/2-calculus/definite-integral/definition-via-limit'
    }
  ];

  // Group 2: Properties
  const propertiesCards = [
    {
      id: 'sum-difference',
      title: 'Sum & Difference Property',
      description: '∫[f(x) ± g(x)]dx = ∫f(x)dx ± ∫g(x)dx — linearity of the definite integral with respect to addition and subtraction.',
      path: '/mathematics/2-calculus/definite-integral/sum-or-difference'
    },
    {
      id: 'constant-multiple',
      title: 'Constant Multiple Property',
      description: '∫k·f(x)dx = k·∫f(x)dx — a constant factor can be moved outside the integral, scaling the area by the same factor.',
      path: '/mathematics/2-calculus/definite-integral/constant-multiple'
    },
    {
      id: 'integral-additivity',
      title: 'Integral Additivity (Interval)',
      description: '∫ₐᵇf + ∫ᵇᶜf = ∫ₐᶜf — the total area over [a, c] equals the sum of the areas over [a, b] and [b, c].',
      path: '/mathematics/2-calculus/definite-integral/integral-additivity'
    },
    {
      id: 'sign-preserving',
      title: 'Sign Preserving Property',
      description: 'If f(x) ≥ g(x) on [a, b], then ∫f ≥ ∫g — the larger function has a larger (or equal) integral.',
      path: '/mathematics/2-calculus/definite-integral/sign-preserving'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Definite Integral</Title>
        <Subtitle>
          The definite integral is a fundamental concept in calculus that measures
          the signed area under a curve. It is defined as the limit of Riemann sums,
          and its properties make it a powerful tool for computation and analysis.
        </Subtitle>
      </Header>

      {/* Group 1: Definition */}
      <GroupTitle>Definition of Definite Integral</GroupTitle>
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

      {/* Group 2: Properties */}
      <GroupTitle>Properties of Definite Integral</GroupTitle>
      <CardGrid>
        {propertiesCards.map((feature) => (
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

export default DefiniteIntegral;

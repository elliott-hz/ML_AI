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
 * DerivativeLocalApproximation 主页面
 */
const DerivativeLocalApproximation = () => {
  const navigate = useNavigate();

  const motivationCards = [
    {
      id: 'first-order-approximation',
      title: 'First-Order Approximation',
      description: 'Approximate eˣ by 1+x and ln(1+x) by x near x=0 — see how the tangent line (linear approximation) captures function behavior in a tiny neighborhood.',
      path: '/mathematics/3-taylor-formula/derivative-local-approximation/first-order-approximation'
    }
  ];

  const secondOrderCards = [
    {
      id: 'first-vs-second-order',
      title: 'First vs Second Order Approximation',
      description: 'The 1st derivative tells you whether f is increasing or decreasing; the 2nd derivative reveals whether the curve is bowl up or bowl down — together they build toward polynomial approximation.',
      path: '/mathematics/3-taylor-formula/derivative-local-approximation/first-vs-second-order'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Derivative Local Approximation</Title>
        <Subtitle>
          Enter polynomial approximation through the lens of derivatives. Starting with linear
          (first-order) approximation using tangent lines, then moving to second-order to see
          how curvature refines the picture — laying the groundwork for Taylor polynomials.
        </Subtitle>
      </Header>

      <GroupTitle>Motivation</GroupTitle>
      <CardGrid>
        {motivationCards.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => navigate(feature.path)}
          >
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>

      <GroupTitle>Polynomial Approximation of One Point</GroupTitle>
      <CardGrid>
        {secondOrderCards.map((feature) => (
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

export default DerivativeLocalApproximation;

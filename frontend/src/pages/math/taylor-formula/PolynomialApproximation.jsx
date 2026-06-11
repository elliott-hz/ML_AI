import React from 'react';
import styled from 'styled-components';

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

const PlaceholderBox = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme?.colors?.cardBg || '#1e293b'}, ${({ theme }) => theme?.colors?.inputBg || '#334155'});
  border: 2px dashed ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  margin-top: 2rem;
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 18px;
  font-style: italic;
`;

/**
 * PolynomialApproximation 主页面 — Polynomial Approximation
 */
const PolynomialApproximation = () => {
  return (
    <PageContainer>
      <Header>
        <Title>Polynomial Approximation</Title>
        <Subtitle>
          Approximating functions using polynomials. Polynomial approximation is the foundation
          of Taylor series — representing complex functions as simpler polynomial expressions
          that are easier to analyze and compute.
        </Subtitle>
      </Header>
      <PlaceholderBox>
        <PlaceholderText>Content coming soon...</PlaceholderText>
      </PlaceholderBox>
    </PageContainer>
  );
};

export default PolynomialApproximation;

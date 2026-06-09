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
 * Summation 主页面 — 求和（积分）概念入门
 */
const Summation = () => {
  const navigate = useNavigate();

  // Group 1: Motivation
  const motivationCards = [
    {
      id: 'area-under-curve',
      title: 'Area under the curve',
      description: 'Introduction to the concept of area under a curve — the fundamental motivation for integration.',
      path: '/mathematics/2-calculus/summation/area-under-curve'
    }
  ];

  // Group 2: Summation
  const summationCards = [
    {
      id: 'finity-partition',
      title: 'Finity Partition',
      description: 'Approximating area using finite partitions — rectangles and the Riemann sum approach.',
      path: '/mathematics/2-calculus/summation/finity-partition'
    },
    {
      id: 'limit-approximation',
      title: 'Limit Approximation',
      description: 'Taking the limit of the partition to obtain the exact area — the definite integral.',
      path: '/mathematics/2-calculus/summation/limit-approximation'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Summation</Title>
        <Subtitle>
          Summation is the foundation of integration. By partitioning a region and summing
          contributions, we can approximate — and in the limit, exactly compute — areas,
          volumes, and accumulated quantities.
        </Subtitle>
      </Header>

      {/* Group 1: Motivation */}
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

      {/* Group 2: Summation */}
      <GroupTitle>Summation</GroupTitle>
      <CardGrid>
        {summationCards.map((feature) => (
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

export default Summation;

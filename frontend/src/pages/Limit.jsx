import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1200px;
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

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const FeatureButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme?.colors?.cardBg || '#1e293b'}, ${({ theme }) => theme?.colors?.inputBg || '#334155'});
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme?.colors?.primary || '#6366f1'}, ${({ theme }) => theme?.colors?.secondary || '#06b6d4'});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};

    &::before {
      transform: scaleX(1);
    }
  }
`;

const ButtonIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
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
 * Limit 主页面 - 展示数列极限的两个主要方向
 */
const Limit = () => {
  const navigate = useNavigate();

  // Group 1: Sequence's Convergence
  const convergentSequences = [
    {
      id: 'convergent-1',
      icon: '',
      title: 'Sequence: 1/3^n → 0',
      description: 'Explore exponential decay. Visualize how u_n = 1/3^n converges to 0 as n approaches infinity.',
      path: '/mathematics/1-fundamentals/limit/convergent-1'
    },
    {
      id: 'convergent-2',
      icon: '',
      title: 'Sequence: n/(n+1) → 1',
      description: 'Understand rational convergence. See how u_n = n/(n+1) approaches 1 from below.',
      path: '/mathematics/1-fundamentals/limit/convergent-2'
    }
  ];

  // Group 2: Sequence's Divergence
  const divergentSequences = [
    {
      id: 'divergent-1',
      icon: '',
      title: 'Sequence: n² → ∞',
      description: 'Study quadratic divergence. Observe how u_n = n² grows without bound.',
      path: '/mathematics/1-fundamentals/limit/divergent-1'
    },
    {
      id: 'divergent-2',
      icon: '',
      title: 'Sequence: (-1)^n (Oscillating)',
      description: 'Examine oscillating behavior. Visualize how u_n = (-1)^n alternates between -1 and 1.',
      path: '/mathematics/1-fundamentals/limit/divergent-2'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Sequence Limits</Title>
        <Subtitle>
          Explore the behavior of sequences as n approaches infinity. 
          Visualize both convergent sequences (approaching a limit) and divergent sequences (growing without bound or oscillating).
        </Subtitle>
      </Header>

      {/* Group 1: Sequence's Convergence */}
      <GroupTitle>Sequence's Convergence</GroupTitle>
      <ButtonGrid>
        {convergentSequences.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            <ButtonIcon>{feature.icon}</ButtonIcon>
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </ButtonGrid>

      {/* Group 2: Sequence's Divergence */}
      <GroupTitle>Sequence's Divergence</GroupTitle>
      <ButtonGrid>
        {divergentSequences.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            <ButtonIcon>{feature.icon}</ButtonIcon>
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </ButtonGrid>
    </PageContainer>
  );
};

export default Limit;

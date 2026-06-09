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
 * Continuity 主页面 - 展示函数连续性的可视化
 */
const Continuity = () => {
  const navigate = useNavigate();

  // Group 1: Continuity Basics
  const continuityBasics = [
    {
      id: 'continuity-of-function',
      icon: '',
      title: 'Continuity of a Function',
      description: 'Explore the definition of continuity. Visualize how Δx → 0 implies Δy → 0 for f(x) = ax + b. Adjust the reference point x₀ and Δx to observe the relationship.',
      path: '/mathematics/1-fundamentals/continuity/continuity-of-function'
    }
  ];

  // Group 2: Discontinuity Points
  const discontinuityPoints = [
    {
      id: 'undefined',
      icon: '',
      title: 'f(x) Not Defined at x₀',
      description: 'Removable discontinuity. f(x) = (x²-a²)/(x-a) is undefined at x=a, but the limit exists. Adjust a to move the hole.',
      path: '/mathematics/1-fundamentals/continuity/discontinuity-undefined'
    },
    {
      id: 'jump',
      icon: '',
      title: 'Limit Does Not Exist at x₀ (Jump)',
      description: 'Jump discontinuity. Piecewise function with different left and right limits at x₀. Adjust L, R, and x₀.',
      path: '/mathematics/1-fundamentals/continuity/discontinuity-jump'
    },
    {
      id: 'removable-value',
      icon: '',
      title: 'lim f(x) ≠ f(x₀)',
      description: 'Removable discontinuity. The limit exists and f(x₀) is defined, but they differ. Adjust a, b, x₀, and the isolated value c.',
      path: '/mathematics/1-fundamentals/continuity/discontinuity-removable'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Continuity</Title>
        <Subtitle>
          Explore the concept of continuity in functions.
          Visualize how small changes in input lead to small changes in output,
          and understand the formal definition through interactive demonstrations.
        </Subtitle>
      </Header>

      {/* Group 1: Continuity Basics */}
      <GroupTitle>Continuity Basics</GroupTitle>
      <CardGrid>
        {continuityBasics.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            <ButtonIcon>{feature.icon}</ButtonIcon>
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>

      {/* Group 2: Discontinuity Points */}
      <GroupTitle>Discontinuity Points</GroupTitle>
      <CardGrid>
        {discontinuityPoints.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            <ButtonIcon>{feature.icon}</ButtonIcon>
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>
    </PageContainer>
  );
};

export default Continuity;

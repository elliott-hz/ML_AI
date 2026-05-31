import React from 'react';
import { useNavigate } from 'react-router-dom';
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
 * Derivative 主页面 - 展示导数概念的可视化
 */
const Derivative = () => {
  const navigate = useNavigate();

  // Group 1: Motivation of the Derivative
  const motivation = [
    {
      id: 'avg-instant-velocity',
      icon: '',
      title: 'Average Velocity → Instantaneous Velocity',
      description: 'Explore the origin of the derivative through motion. Watch how the average velocity over an interval converges to the instantaneous velocity as Δt → 0.',
      path: '/mathematics/1-fundamentals/derivative/avg-instant-velocity'
    }
  ];

  // Group 2: Basic Derivative Formulas - Constants and Power Functions
  const basicFormulas = [
    {
      id: 'constants',
      icon: 'C',
      title: 'Constants',
      description: 'The derivative of any constant is zero — no change means zero slope everywhere. See the flat line and its zero derivative.',
      path: '/mathematics/1-fundamentals/derivative/constants'
    },
    {
      id: 'power-functions',
      icon: 'x^μ',
      title: 'Power Functions',
      description: 'The power rule for any real exponent μ — integers, fractions, and negatives. Drag μ to watch the function and its derivative transform.',
      path: '/mathematics/1-fundamentals/derivative/power-functions'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Derivative</Title>
        <Subtitle>
          The derivative measures how a function changes at a single point.
          It is defined as the limit of the average rate of change as the interval shrinks to zero.
          Interactive visualizations reveal both the intuition and the mechanics.
        </Subtitle>
      </Header>

      {/* Group 1: Motivation of the Derivative */}
      <GroupTitle>Motivation of the Derivative</GroupTitle>
      <ButtonGrid>
        {motivation.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            {/* <ButtonIcon>{feature.icon}</ButtonIcon> */}
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </ButtonGrid>

      {/* Group 2: Basic Derivative Formulas */}
      <GroupTitle>Basic Derivative Formulas — Constants and Power Functions</GroupTitle>
      <ButtonGrid>
        {basicFormulas.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            {/* <ButtonIcon>{feature.icon}</ButtonIcon> */}
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </ButtonGrid>
    </PageContainer>
  );
};

export default Derivative;

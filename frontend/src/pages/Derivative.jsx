import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardGrid from '../components/CardGrid';

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
      icon: 'x\u1D45C',
      title: 'Power Functions',
      description: 'The power rule for any real exponent μ — integers, fractions, and negatives. Drag μ to watch the function and its derivative transform.',
      path: '/mathematics/1-fundamentals/derivative/power-functions'
    }
  ];

  // Group 3: Trigonometric and Inverse Trig. Functions
  const trigAndInverseTrigFormulas = [
    {
      id: 'trigonometric',
      icon: 'trig',
      title: 'Trigonometric Functions',
      description: 'Derivatives of sin x, cos x, tan x, cot x, sec x, and csc x — explore each with an interactive tab-based interface.',
      path: '/mathematics/1-fundamentals/derivative/trigonometric'
    },
    {
      id: 'inverse-trigonometric',
      icon: 'inv-trig',
      title: 'Inverse Trigonometric Functions',
      description: 'Derivatives of arcsin x, arccos x, arctan x, arccot x, arcsec x, and arccsc x — switch between functions with a tab bar.',
      path: '/mathematics/1-fundamentals/derivative/inverse-trigonometric'
    }
  ];

  // Group 4: Exponential and Logarithmic Functions
  const expLogFormulas = [
    {
      id: 'exponential',
      icon: 'aˣ',
      title: 'Exponential Functions',
      description: 'Derivatives of aˣ and eˣ. Adjust the base with a slider and quick-set to e to compare general vs. natural exponential.',
      path: '/mathematics/1-fundamentals/derivative/exponential'
    },
    {
      id: 'logarithmic',
      icon: 'logₐ',
      title: 'Logarithmic Functions',
      description: 'Derivatives of logₐx and ln x. Adjust the base with a slider and quick-set to e to compare general vs. natural logarithm.',
      path: '/mathematics/1-fundamentals/derivative/logarithmic'
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
      <CardGrid>
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
      </CardGrid>

      {/* Group 2: Basic Derivative Formulas */}
      <GroupTitle>Constants and Power Functions</GroupTitle>
      <CardGrid>
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
      </CardGrid>

      {/* Group 3: Trigonometric and Inverse Trig. Functions */}
      <GroupTitle>Trigonometric and Inverse Trig. Functions</GroupTitle>
      <CardGrid>
        {trigAndInverseTrigFormulas.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>

      {/* Group 4: Basic Derivative Formulas — Exponential and Logarithmic Functions */}
      <GroupTitle>Exponential and Logarithmic Functions</GroupTitle>
      <CardGrid>
        {expLogFormulas.map((feature) => (
          <FeatureButton
            key={feature.id}
            onClick={() => handleFeatureClick(feature.path)}
          >
            {/* <ButtonIcon>{feature.icon}</ButtonIcon> */}
            <ButtonTitle>{feature.title}</ButtonTitle>
            <ButtonDescription>{feature.description}</ButtonDescription>
          </FeatureButton>
        ))}
      </CardGrid>

      {/* Group 5: Differentiation Rules */}
      <GroupTitle>Differentiation Rules</GroupTitle>
      <CardGrid>
        <FeatureButton onClick={() => navigate('/mathematics/1-fundamentals/derivative/linearity-rule')}>
          <ButtonTitle>Linearity Rule</ButtonTitle>
          <ButtonDescription>
            (u±v)' = u'±v' and (Cu)' = Cu'. Derivatives distribute over addition, subtraction,
            and constant multiplication — the foundation of linearity in calculus.
          </ButtonDescription>
        </FeatureButton>
        <FeatureButton onClick={() => navigate('/mathematics/1-fundamentals/derivative/product-rule')}>
          <ButtonTitle>Product Rule</ButtonTitle>
          <ButtonDescription>
            (uv)' = u'v + uv'. Visualized through rectangle area expansion: when both sides grow,
            the total area increase splits into three regions.
          </ButtonDescription>
        </FeatureButton>
        <FeatureButton onClick={() => navigate('/mathematics/1-fundamentals/derivative/quotient-rule')}>
          <ButtonTitle>Quotient Rule</ButtonTitle>
          <ButtonDescription>
            (u/v)' = (u'v − uv') / v². Seen geometrically as height = area ÷ width —
            numerator grows with u, shrinks with v, and v² dilutes the change.
          </ButtonDescription>
        </FeatureButton>
        <FeatureButton onClick={() => navigate('/mathematics/1-fundamentals/derivative/chain-rule')}>
          <ButtonTitle>Chain Rule</ButtonTitle>
          <ButtonDescription>
            dy/dx = dy/dz · dz/dx. Changes cascade through each layer — the foundation
            of backpropagation in neural networks.
          </ButtonDescription>
        </FeatureButton>
      </CardGrid>
    </PageContainer>
  );
};

export default Derivative;

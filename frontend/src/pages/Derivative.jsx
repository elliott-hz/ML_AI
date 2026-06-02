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
      icon: 'x\u1D45C',
      title: 'Power Functions',
      description: 'The power rule for any real exponent μ — integers, fractions, and negatives. Drag μ to watch the function and its derivative transform.',
      path: '/mathematics/1-fundamentals/derivative/power-functions'
    }
  ];

  // Group 3: Basic Derivative Formulas — Trigonometric Functions
  const trigFormulas = [
    {
      id: 'sin',
      icon: 'sin',
      title: '(sin x)\' = cos x',
      description: 'The derivative of sin x is cos x. Peaks of sin align with zero-crossings of cos.',
      path: '/mathematics/1-fundamentals/derivative/sin'
    },
    {
      id: 'cos',
      icon: 'cos',
      title: '(cos x)\' = −sin x',
      description: 'The derivative of cos x is −sin x. The negative sign reflects the phase shift.',
      path: '/mathematics/1-fundamentals/derivative/cos'
    },
    {
      id: 'tan',
      icon: 'tan',
      title: '(tan x)\' = sec²x',
      description: 'The derivative of tan x is sec²x — always positive where defined. Watch the vertical asymptotes.',
      path: '/mathematics/1-fundamentals/derivative/tan'
    },
    {
      id: 'cot',
      icon: 'cot',
      title: '(cot x)\' = −csc²x',
      description: 'The derivative of cot x is −csc²x — always negative where defined. Asymptotes at x = kπ.',
      path: '/mathematics/1-fundamentals/derivative/cot'
    },
    {
      id: 'sec',
      icon: 'sec',
      title: '(sec x)\' = sec x · tan x',
      description: 'The derivative of sec x is sec x · tan x. Shared asymptotes at x = π/2 + kπ.',
      path: '/mathematics/1-fundamentals/derivative/sec'
    },
    {
      id: 'csc',
      icon: 'csc',
      title: '(csc x)\' = −csc x · cot x',
      description: 'The derivative of csc x is −csc x · cot x. The negative sign flips the slope pattern.',
      path: '/mathematics/1-fundamentals/derivative/csc'
    }
  ];

  // Group 4: Basic Derivative Formulas — Exponential and Logarithmic Functions
  const expLogFormulas = [
    {
      id: 'exp-base-a',
      icon: 'aˣ',
      title: "(aˣ)' = aˣ ln a",
      description: 'For any base a > 0, the derivative scales by ln(a). Drag a to see how growth rate changes.',
      path: '/mathematics/1-fundamentals/derivative/exp-base-a'
    },
    {
      id: 'exp-e',
      icon: 'eˣ',
      title: "(eˣ)' = eˣ",
      description: "The natural exponential eˣ is its own derivative — slope equals value everywhere.",
      path: '/mathematics/1-fundamentals/derivative/exp-e'
    },
    {
      id: 'log-base-a',
      icon: 'logₐ',
      title: "(logₐ x)' = 1 / (x ln a)",
      description: 'The general log derivative. Asymptote at x = 0, slope decays as 1/x.',
      path: '/mathematics/1-fundamentals/derivative/log-base-a'
    },
    {
      id: 'ln',
      icon: 'ln',
      title: "(ln x)' = 1/x",
      description: "The natural log's derivative is ln'(x) = 1/x — slope equals the reciprocal.",
      path: '/mathematics/1-fundamentals/derivative/ln'
    }
  ];

  // Group 5: Inverse Trigonometric Functions
  const inverseTrigFormulas = [
    {
      id: 'arcsin',
      icon: 'arcsin',
      title: "(arcsin x)' = 1 / \u221A(1 - x\u00B2)",
      description: 'The derivative of arcsin x grows large near x = ±1, reflecting the vertical tangents at the domain boundaries.',
      path: '/mathematics/1-fundamentals/derivative/arcsin'
    },
    {
      id: 'arccos',
      icon: 'arccos',
      title: "(arccos x)' = \u22121 / \u221A(1 - x\u00B2)",
      description: 'The derivative of arccos x is always negative, making the function strictly decreasing over its domain.',
      path: '/mathematics/1-fundamentals/derivative/arccos'
    },
    {
      id: 'arctan',
      icon: 'arctan',
      title: "(arctan x)' = 1 / (1 + x\u00B2)",
      description: 'The derivative of arctan x forms a bell curve peaking at 1. It is defined for all real x.',
      path: '/mathematics/1-fundamentals/derivative/arctan'
    },
    {
      id: 'arccot',
      icon: 'arccot',
      title: "(arccot x)' = \u22121 / (1 + x\u00B2)",
      description: 'The derivative of arccot x is always negative, the mirror of arctan\'s derivative.',
      path: '/mathematics/1-fundamentals/derivative/arccot'
    },
    {
      id: 'arcsec',
      icon: 'arcsec',
      title: "(arcsec x)' = 1 / (|x| \u00B7 \u221A(x\u00B2 \u2212 1))",
      description: 'The derivative of arcsec x is defined only for |x| > 1, with vertical asymptotes at x = ±1.',
      path: '/mathematics/1-fundamentals/derivative/arcsec'
    },
    {
      id: 'arccsc',
      icon: 'arccsc',
      title: "(arccsc x)' = \u22121 / (|x| \u00B7 \u221A(x\u00B2 \u2212 1))",
      description: 'The derivative of arccsc x is the negative of arcsec\'s derivative, defined for |x| > 1.',
      path: '/mathematics/1-fundamentals/derivative/arccsc'
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
      <GroupTitle>Constants and Power Functions</GroupTitle>
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

      {/* Group 3: Basic Derivative Formulas — Trigonometric Functions */}
      <GroupTitle>Trigonometric Functions</GroupTitle>
      <ButtonGrid>
        {trigFormulas.map((feature) => (
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

      {/* Group 4: Basic Derivative Formulas — Exponential and Logarithmic Functions */}
      <GroupTitle>Exponential and Logarithmic Functions</GroupTitle>
      <ButtonGrid>
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
      </ButtonGrid>

      {/* Group 5: Basic Derivative Formulas — Inverse Trigonometric Functions */}
      <GroupTitle>Inverse Trigonometric Functions</GroupTitle>
      <ButtonGrid>
        {inverseTrigFormulas.map((feature) => (
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

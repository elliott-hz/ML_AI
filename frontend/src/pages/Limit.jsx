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

const MathFormula = styled.span`
  sub, sup {
    font-size: 0.75em;
  }
  sup {
    vertical-align: super;
  }
  sub {
    vertical-align: sub;
  }
`;

const ButtonDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 14px;
  line-height: 1.5;
  margin-top: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

/**
 * Limit 主页面 - 展示数列极限的两个主要方向
 */
const Limit = () => {
  const navigate = useNavigate();

  // Group 1 & 2: Sequences (Convergent & Divergent)
  const sequences = [
    {
      id: 'convergent-1',
      icon: '',
      title: (
        <MathFormula>
          Sequence: u<sub>n</sub> = 1/a<sup>n</sup> → 0
        </MathFormula>
      ),
      description: 'Explore exponential decay. Visualize how u_n = 1/a^n converges to 0 as n approaches infinity.',
      path: '/mathematics/1-fundamentals/limit/convergent-1'
    },
    {
      id: 'convergent-2',
      icon: '',
      title: (
        <MathFormula>
          Sequence: u<sub>n</sub> = n/(n+1) → 1
        </MathFormula>
      ),
      description: 'Understand rational convergence. See how u_n = n/(n+1) approaches 1 from below.',
      path: '/mathematics/1-fundamentals/limit/convergent-2'
    },
    {
      id: 'divergent-1',
      icon: '',
      title: (
        <MathFormula>
          Sequence: u<sub>n</sub> = n² → ∞
        </MathFormula>
      ),
      description: 'Study quadratic divergence. Observe how u_n = n² grows without bound.',
      path: '/mathematics/1-fundamentals/limit/divergent-1'
    },
    {
      id: 'divergent-2',
      icon: '',
      title: (
        <MathFormula>
          Sequence: u<sub>n</sub> = sin(n) (Oscillating)
        </MathFormula>
      ),
      description: 'Examine oscillating behavior. Visualize how u_n = sin(n) oscillates indefinitely without converging.',
      path: '/mathematics/1-fundamentals/limit/divergent-2'
    }
  ];

  // Group 2: Elementary Functions Limits
  const elementaryFunctions = [
    {
      id: 'exponential',
      icon: '',
      title: (
        <MathFormula>
          Function: y = a·e<sup>-x</sup> → 0 (x→+)
        </MathFormula>
      ),
      description: 'Explore exponential decay limit. See how y = a·e^(-x) approaches 0 as x → +∞.',
      path: '/mathematics/1-fundamentals/limit/exponential'
    },
    {
      id: 'reciprocal',
      icon: '',
      title: (
        <MathFormula>
          Function: y = a/x → 0 (x→)
        </MathFormula>
      ),
      description: 'Understand reciprocal function limit. Visualize how y = a/x converges to 0 as x → ±.',
      path: '/mathematics/1-fundamentals/limit/reciprocal'
    },
    {
      id: 'arctan',
      icon: '',
      title: (
        <MathFormula>
          Function: y = a·arctan(x) → -a·π/2 (x→-)
        </MathFormula>
      ),
      description: 'Study arctangent function limit. Observe how y = a·arctan(x) approaches -a·π/2 as x → -.',
      path: '/mathematics/1-fundamentals/limit/arctan'
    }
  ];

  // Group 3: One-Sided & Two-Sided Limits
  const oneSidedTwoSidedLimits = [
    {
      id: 'one-sided',
      icon: '',
      title: (
        <MathFormula>
          One-Sided Limit: lim<sub>x→0⁻</sub> ≠ lim<sub>x→0</sub>
        </MathFormula>
      ),
      description: 'Piecewise function showing different left and right limits at x=0. Left limit = -1, Right limit = +1.',
      path: '/mathematics/1-fundamentals/limit/one-sided'
    },
    {
      id: 'two-sided',
      icon: '',
      title: (
        <MathFormula>
          Two-Sided Limit: lim<sub>x→1⁻</sub> = lim<sub>x→1</sub> = 2
        </MathFormula>
      ),
      description: 'Rational function showing equal left and right limits at x=1. Removable discontinuity with limit = 2.',
      path: '/mathematics/1-fundamentals/limit/two-sided'
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

      {/* Group 1: Sequences (Convergent & Divergent) */}
      <GroupTitle>Sequences (Convergent & Divergent)</GroupTitle>
      <ButtonGrid>
        {sequences.map((feature) => (
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

      {/* Group 2: Elementary Functions Limits */}
      <GroupTitle>Elementary Functions Limits</GroupTitle>
      <ButtonGrid>
        {elementaryFunctions.map((feature) => (
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

      {/* Group 3: One-Sided & Two-Sided Limits */}
      <GroupTitle>One-Sided & Two-Sided Limits</GroupTitle>
      <ButtonGrid>
        {oneSidedTwoSidedLimits.map((feature) => (
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

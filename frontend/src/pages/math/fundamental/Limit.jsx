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
  margin-top: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

/**
 * Limit 主页面 - 展示数列极限的两个主要方向
 */
const Limit = () => {
  const navigate = useNavigate();

  // Group 1: Sequences (Convergent & Divergent)
  const sequences = [
    {
      id: 'convergent-1',
      icon: '',
      title: 'Exponential Decay Sequence',
      description: 'Explore exponential decay. Visualize how u_n = 1/a^n converges to 0 as n approaches infinity.',
      path: '/mathematics/1-fundamentals/limit/convergent-1'
    },
    {
      id: 'convergent-2',
      icon: '',
      title: 'Rational Sequence',
      description: 'Understand rational convergence. See how u_n = n/(n+1) approaches 1 from below.',
      path: '/mathematics/1-fundamentals/limit/convergent-2'
    },
    {
      id: 'divergent-1',
      icon: '',
      title: 'Quadratic Divergence',
      description: 'Study quadratic divergence. Observe how u_n = n² grows without bound.',
      path: '/mathematics/1-fundamentals/limit/divergent-1'
    },
    {
      id: 'divergent-2',
      icon: '',
      title: 'Oscillating Sequence',
      description: 'Examine oscillating behavior. Visualize how u_n = sin(n) oscillates indefinitely without converging.',
      path: '/mathematics/1-fundamentals/limit/divergent-2'
    }
  ];

  // Group 2: Elementary Functions Limits
  const elementaryFunctions = [
    // ── Intuitive limits (function behavior overview) ──
    {
      id: 'trigonometric-intuitive',
      icon: '',
      title: 'Trigonometric Intuitive Limits',
      description: 'Visually explore sin/cos/tan behavior: bounded oscillation, vertical asymptotes, and why limits at infinity do not exist.',
      path: '/mathematics/1-fundamentals/limit/trigonometric-intuitive'
    },
    {
      id: 'inverse-trig-intuitive',
      icon: '',
      title: 'Inverse Trig. Intuitive Limits',
      description: 'Observe arctan horizontal asymptotes at ±π/2, and the domain/range boundaries of arcsin and arccos.',
      path: '/mathematics/1-fundamentals/limit/inverse-trig-intuitive'
    },
    // ── Classic limits (exact ratios at x → 0) ──
    {
      id: 'exponential',
      icon: '',
      title: 'Exponential Function Limit',
      description: 'Explore limits of a·bˣ. For b > 1, the function approaches 0 as x → −∞; for 0 < b < 1, it approaches 0 as x → +∞.',
      path: '/mathematics/1-fundamentals/limit/exponential'
    },
    {
      id: 'logarithmic',
      icon: '',
      title: 'Logarithmic Function Limit',
      description: 'Explore logarithmic function limit. See how y = log_b(x) approaches -∞ as x → 0⁺ and +∞ as x → +∞.',
      path: '/mathematics/1-fundamentals/limit/logarithmic'
    },
    {
      id: 'power-function',
      icon: '',
      title: 'Power Function Limit',
      description: 'Explore power function limits y = a·xⁿ. For n < 0, converges to 0 as x → ±∞; for n > 0, converges to 0 as x → 0.',
      path: '/mathematics/1-fundamentals/limit/power-function'
    },
    {
      id: 'trigonometric',
      icon: '',
      title: 'Trigonometric Classic Limits',
      description: 'The foundational limits sin(kx)/(kx) → 1, tan(kx)/(kx) → 1, and (1−cos(kx))/(kx)² → ½ at x → 0.',
      path: '/mathematics/1-fundamentals/limit/trigonometric'
    },
    {
      id: 'inverse-trigonometric',
      icon: '',
      title: 'Inverse Trig. Classic Limits',
      description: 'The equivalent asymptotic limits: arcsin(kx)/(kx) → 1, arctan(kx)/(kx) → 1, and (arccos(kx)−π/2)/(kx) → −1.',
      path: '/mathematics/1-fundamentals/limit/inverse-trigonometric'
    }
  ];

  // Group 3: One-Sided & Two-Sided Limits
  const oneSidedTwoSidedLimits = [
    {
      id: 'one-sided',
      icon: '',
      title: 'One-Sided Limit',
      description: 'Piecewise function showing different left and right limits at x=0. Left limit = -1, Right limit = +1.',
      path: '/mathematics/1-fundamentals/limit/one-sided'
    },
    {
      id: 'two-sided',
      icon: '',
      title: 'Two-Sided Limit',
      description: 'Rational function showing equal left and right limits at x=1. Removable discontinuity with limit = 2.',
      path: '/mathematics/1-fundamentals/limit/two-sided'
    }
  ];

  // Group 4: Infinitesimal Properties (Three Still + Two Not Necessarily)
  const infinitesimalProperties = [
    {
      id: 'sum-property',
      icon: '',
      title: 'Finite Sum of Infinitesimals (Still Infinitesimal)',
      description: 'Finite sum of infinitesimals is still infinitesimal. Example: x + x² + x³ → 0 as x → 0.',
      path: '/mathematics/1-fundamentals/limit/infinitesimal-sum'
    },
    {
      id: 'bounded-product',
      icon: '',
      title: 'Bounded × Infinitesimal (Still Infinitesimal)',
      description: 'Bounded function times infinitesimal is still infinitesimal. Example: cos(x)·x → 0 as x → 0.',
      path: '/mathematics/1-fundamentals/limit/infinitesimal-bounded'
    },
    {
      id: 'constant-multiple',
      icon: '',
      title: 'Constant × Infinitesimal (Still Infinitesimal)',
      description: 'Constant multiple of infinitesimal is still infinitesimal. Adjust c to see scaling effect.',
      path: '/mathematics/1-fundamentals/limit/infinitesimal-constant'
    },
    {
      id: 'infinite-sum',
      icon: '',
      title: 'Infinite Sum (Not Necessarily)',
      description: 'Infinite sum of infinitesimals is not necessarily infinitesimal. Harmonic series example: Σ(1/n) diverges.',
      path: '/mathematics/1-fundamentals/limit/infinite-sum-not-infinitesimal'
    },
    {
      id: 'quotient',
      icon: '',
      title: 'Quotient of Infinitesimals (Not Necessarily)',
      description: 'Quotient of infinitesimals can be 0, ∞, or finite value depending on convergence speed.',
      path: '/mathematics/1-fundamentals/limit/quotient-of-infinitesimals'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Limits</Title>
        <Subtitle>
          A limit describes the value that a function or sequence approaches as the input approaches a certain point.
          Explore convergent and divergent sequences, elementary function limits, one-sided and two-sided limits,
          and the properties of infinitesimals through interactive visualizations.
        </Subtitle>
      </Header>

      {/* Group 1: Sequences (Convergent & Divergent) */}
      <GroupTitle>Sequences (Convergent & Divergent)</GroupTitle>
      <CardGrid>
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
      </CardGrid>

      {/* Group 2: Elementary Functions Limits */}
      <GroupTitle>Elementary Functions Limits</GroupTitle>
      <CardGrid>
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
      </CardGrid>

      {/* Group 3: One-Sided & Two-Sided Limits */}
      <GroupTitle>One-Sided & Two-Sided Limits</GroupTitle>
      <CardGrid>
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
      </CardGrid>

      {/* Group 4: Infinitesimal Properties */}
      <GroupTitle>Infinitesimal Properties</GroupTitle>
      <CardGrid>
        {infinitesimalProperties.map((feature) => (
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

export default Limit;

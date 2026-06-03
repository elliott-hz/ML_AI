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
 * Basic Function 主页面 - 展示函数特性的五个主要方向
 */
const BasicFunction = () => {
  const navigate = useNavigate();

  // Group 1: Elementary Functions
  const elementaryFunctions = [
    {
      id: 'power-function',
      icon: '',
      title: 'Power Function',
      description: 'Visualize power functions y = xⁿ through geometric representations — line, square, cube, and reciprocal. Adjust x and n to see real-time changes.',
      path: '/mathematics/1-fundamentals/basic-function/power-function'
    },
    {
      id: 'trigonometric-ratios',
      icon: '',
      title: 'Trigonometric Ratios',
      description: 'Explore the six trigonometric ratios (sin, cos, tan, cot, sec, csc) through an interactive right triangle. Drag point C to see how the ratios change in real time.',
      path: '/mathematics/1-fundamentals/basic-function/trigonometric-ratios'
    },
    {
      id: 'exponential',
      icon: '',
      title: 'Exponential Function',
      description: 'Understand exponential growth and decay through y = a·bˣ. See how each unit step multiplies the output by the base b — the essence of exponential behavior.',
      path: '/mathematics/1-fundamentals/basic-function/exponential'
    },
    {
      id: 'logarithmic',
      icon: '',
      title: 'Logarithmic Function',
      description: 'The inverse of exponential: y = log_b(x) answers "how many times to multiply b to reach x?" Essential for cross-entropy loss, information entropy, and log transformations.',
      path: '/mathematics/1-fundamentals/basic-function/logarithmic'
    }
  ];

  // Group 2: Function Relationships
  const functionRelationships = [
    {
      id: 'reciprocal',
      icon: '',
      title: 'Reciprocal Function',
      description: 'Relationship between f(x) and 1/f(x). When f(x) is large, its reciprocal is small — explore the vertical asymptote, horizontal asymptote, and self-reciprocal point.',
      path: '/mathematics/1-fundamentals/basic-function/reciprocal'
    },
    {
      id: 'piecewise',
      icon: '',
      title: 'Piecewise Function',
      description: 'Relationship between different x-intervals and their corresponding expressions. The same variable x is mapped to different formulas depending on its domain range.',
      path: '/mathematics/1-fundamentals/basic-function/piecewise'
    },
    {
      id: 'inverse',
      icon: '',
      title: 'Inverse Function',
      description: 'Relationship between f(x) and its inverse f⁻¹(x). If f maps x → y, then f⁻¹ maps y → x. The graphs are symmetric about y = x.',
      path: '/mathematics/1-fundamentals/basic-function/inverse'
    }
  ];

  // Group 3: Function Properties
  const functionProperties = [
    {
      id: 'odd-even',
      icon: '',
      title: 'Odd & Even Functions',
      description: 'Explore the symmetry properties of functions. Visualize odd functions (f(-x) = -f(x), symmetric about origin) and even functions (f(-x) = f(x), symmetric about y-axis).',
      path: '/mathematics/1-fundamentals/basic-function/odd-even'
    },
    {
      id: 'periodic',
      icon: '',
      title: 'Periodic Functions',
      description: 'Understand periodic behavior in functions. Adjust amplitude, frequency, and phase to see how they affect wave patterns. f(x) = a·sin(bx + c).',
      path: '/mathematics/1-fundamentals/basic-function/periodic'
    },
    {
      id: 'monotonicity',
      icon: '',
      title: 'Monotonicity',
      description: 'Study increasing and decreasing functions. Visualize how slope affects monotonic behavior: f(x) = ax + b (increasing) or f(x) = -ax + b (decreasing).',
      path: '/mathematics/1-fundamentals/basic-function/monotonicity'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Basic Function Properties</Title>
        <Subtitle>
          Explore the fundamental characteristics of mathematical functions through interactive visualizations. 
          Adjust parameters in real-time and observe how they affect function behavior.
        </Subtitle>
      </Header>

      {/* Group 1: Elementary Functions */}
      <GroupTitle>Elementary Functions</GroupTitle>
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

      {/* Group 2: Function Relationships */}
      <GroupTitle>Function Relationships</GroupTitle>
      <CardGrid>
        {functionRelationships.map((feature) => (
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

      {/* Group 3: Function Properties */}
      <GroupTitle>Function Properties</GroupTitle>
      <CardGrid>
        {functionProperties.map((feature) => (
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

export default BasicFunction;

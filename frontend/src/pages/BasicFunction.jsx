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

  // Group 1: Function Types
  const functionTypes = [
    {
      id: 'piecewise',
      icon: '',
      title: 'Piecewise Function',
      description: 'Explore functions defined by different expressions on different intervals. Visualize f(x) = {√x, x ≥ 0; -x, x < 0}.',
      path: '/mathematics/1-fundamentals/basic-function/piecewise'
    },
    {
      id: 'inverse',
      icon: '',
      title: 'Inverse Function',
      description: 'Understand the relationship between a function and its inverse. See how h = ½gt² relates to t = √(2h/g).',
      path: '/mathematics/1-fundamentals/basic-function/inverse'
    }
  ];

  // Group 2: Function Properties
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

      {/* Group 1: Function Types */}
      <GroupTitle>Function Types</GroupTitle>
      <ButtonGrid>
        {functionTypes.map((feature) => (
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

      {/* Group 2: Function Properties */}
      <GroupTitle>Function Properties</GroupTitle>
      <ButtonGrid>
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
      </ButtonGrid>
    </PageContainer>
  );
};

export default BasicFunction;

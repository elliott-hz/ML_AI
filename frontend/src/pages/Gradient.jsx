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
 * PartialDerivative 主页面 — 展示偏导数的概念和可视化
 */
const PartialDerivative = () => {
  const navigate = useNavigate();

  // Group 1: Motivation of Partial Derivative
  const motivation = [
    {
      id: 'unary',
      icon: '',
      title: 'Unary Function: y = x²',
      description: 'A single-variable function has exactly one input: y = f(x). When x changes, y changes — there is only one path to follow. See the tangent, the projection lines, and the derivative f\'(x) = 2x.',
      path: '/mathematics/1-fundamentals/derivative/partial-derivative/unary'
    },
    {
      id: 'binary',
      icon: '',
      title: 'Binary Function: z = x² + y²',
      description: 'A two-variable function has two independent inputs: z = f(x, y). z changes when either x changes or y changes. Explore the 3D paraboloid with point A and its projections onto coordinate planes.',
      path: '/mathematics/1-fundamentals/derivative/partial-derivative/binary'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Partial Derivative</Title>
        <Subtitle>
          For functions of multiple variables, the partial derivative measures how the function
          changes when <em>one</em> variable changes while the others are held constant.
          The notation ∂f/∂x (\"partial f over partial x\") emphasizes that we are only looking
          at the contribution of x, treating all other inputs as frozen.
        </Subtitle>
      </Header>

      {/* Group 1: Motivation of Partial Derivative */}
      <GroupTitle>Motivation of Partial Derivative</GroupTitle>
      <CardGrid>
        {motivation.map((feature) => (
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

export default PartialDerivative;

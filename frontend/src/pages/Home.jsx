import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${theme.spacing.xxl} 0;
  background: ${theme.colors.gradient};
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.glow};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xxl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  transition: all ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.gradient};
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: ${theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

const QuickStartSection = styled.section`
  margin-top: ${theme.spacing.xxl};
  padding: ${theme.spacing.xl};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.lg};
`;

const StepList = styled.ol`
  list-style: none;
  counter-reset: step-counter;
`;

const StepItem = styled.li`
  counter-increment: step-counter;
  padding: ${theme.spacing.lg} 0;
  border-bottom: 1px solid ${theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: counter(step-counter);
    display: inline-block;
    width: 40px;
    height: 40px;
    background: ${theme.colors.primary};
    color: ${theme.colors.textPrimary};
    border-radius: ${theme.borderRadius.round};
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    margin-right: ${theme.spacing.md};
  }
`;

const StepContent = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const StepTitle = styled.h4`
  font-size: 1.1rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs};
`;

const StepDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Welcome to AI Knowledge System</HeroTitle>
        <HeroSubtitle>
          An interactive learning platform for mastering Artificial Intelligence concepts through theory and practice
        </HeroSubtitle>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>📚</FeatureIcon>
          <FeatureTitle>Comprehensive Knowledge Base</FeatureTitle>
          <FeatureDescription>
            Access structured learning materials covering Mathematics, Deep Learning, and Machine Learning topics.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🎨</FeatureIcon>
          <FeatureTitle>Interactive Visualizations</FeatureTitle>
          <FeatureDescription>
            Explore dynamic 2D/3D plots and real-time model training demonstrations to understand abstract concepts.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>⚡</FeatureIcon>
          <FeatureTitle>Hands-on Experiments</FeatureTitle>
          <FeatureDescription>
            Practice with live model training, parameter tuning, and see results in real-time through WebSocket updates.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <QuickStartSection>
        <SectionTitle>Quick Start Guide</SectionTitle>
        <StepList>
          <StepItem>
            <StepContent>
              <StepTitle>Select a Topic</StepTitle>
              <StepDescription>
                Choose from Mathematics, Deep Learning, or Machine Learning using the top navigation menu.
              </StepDescription>
            </StepContent>
          </StepItem>
          <StepItem>
            <StepContent>
              <StepTitle>Browse Modules</StepTitle>
              <StepDescription>
                Click on a module to view available subtopics in the left sidebar.
              </StepDescription>
            </StepContent>
          </StepItem>
          <StepItem>
            <StepContent>
              <StepTitle>Learn & Explore</StepTitle>
              <StepDescription>
                Dive into interactive content, visualizations, and practical experiments.
              </StepDescription>
            </StepContent>
          </StepItem>
        </StepList>
      </QuickStartSection>
    </HomeContainer>
  );
};

export default Home;

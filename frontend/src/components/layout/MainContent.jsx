import styled from 'styled-components';

const MainContent = styled.main`
  margin-left: 280px;
  margin-top: 60px;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: calc(100vh - 60px);
  background: ${({ theme }) => theme.colors.background};
  transition: background-color 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 240px;
    padding: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: 480px) {
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export default MainContent;

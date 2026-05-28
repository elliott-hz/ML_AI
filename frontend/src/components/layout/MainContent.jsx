import styled from 'styled-components';
import { theme } from '../../styles/theme';

const MainContent = styled.main`
  margin-left: 280px;
  margin-top: 60px;
  padding: ${theme.spacing.xl};
  min-height: calc(100vh - 60px);
  background: ${theme.colors.background};
  
  @media (max-width: 768px) {
    margin-left: 240px;
    padding: ${theme.spacing.lg};
  }
  
  @media (max-width: 480px) {
    margin-left: 0;
    padding: ${theme.spacing.md};
  }
`;

export default MainContent;

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledBackBtn = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

/**
 * Shared BackButton — navigates to a given route.
 *
 * @param {string} to  - Route to navigate to
 * @param {React.ReactNode} [children] - Button label (default: '← Back to Basic Function')
 */
export default function BackButton({ to, children = '← Back to Basic Function' }) {
  const navigate = useNavigate();
  return <StyledBackBtn onClick={() => navigate(to)}>{children}</StyledBackBtn>;
}

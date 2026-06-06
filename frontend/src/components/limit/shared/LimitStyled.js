// Re-export common layout components (shared across modules)
export {
  PageContainer,
  Header,
  SectionTitle,
  SectionTitleH1,
  SectionDescription,
  ContentLayout,
  ControlsPanel,
  PlotPanel,
  FormulaBox,
  FormulaTitle,
  Formula
} from '../../common/LayoutStyled';

import styled from 'styled-components';

/* ---- Pattern B: DualSequencePlot ---- */
export const FunctionSection = styled.div`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  padding: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  box-shadow: ${({ theme }) => theme?.shadows?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
`;

/* ---- Pattern D: ToggleSelector ---- */
export const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

export const ToggleBtn = styled.button`
  padding: 8px ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ $active, theme }) => ($active ? (theme?.colors?.primary || '#6366f1') : 'transparent')};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? (theme?.colors?.primary || '#6366f1') : (theme?.colors?.inputBg || '#334155')};
  }
`;

/* ---- Quick-set buttons (ExponentialFunctionLimit, LogarithmicFunctionLimit) ---- */
export const QuickSetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
`;

export const QuickBtn = styled.button`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  cursor: pointer;
  font-size: 13px;
  font-family: monospace;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    color: #fff;
  }
`;

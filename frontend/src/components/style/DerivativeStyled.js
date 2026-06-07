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
  Formula,
  FunctionSection,
  QuickSetRow,
  QuickBtn
} from '../common/LayoutStyled';

import styled from 'styled-components';

/* ---- ToggleSelector (Pattern D) ---- */
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

/* ---- Dual-plot layout ---- */
export const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  margin-top: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

/* ---- Live evaluation controls ---- */
export const Label = styled.label`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  margin-bottom: 4px;
  display: block;
`;

export const FuncInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme?.colors?.inputBg || '#334155'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#475569'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

export const LiveValueBox = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-top: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

export const LiveValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-family: 'Courier New', monospace;
`;

export const LiveValueLabel = styled.span`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
`;

/* ---- Controls bar for function input sections ---- */
export const ControlsBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  flex-wrap: wrap;

  & > * {
    flex: 1;
    min-width: 280px;
  }
`;

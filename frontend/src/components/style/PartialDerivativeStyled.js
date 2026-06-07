// Re-export common layout components (shared across all modules)
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

/* ---- Plot grid for dual-plot layouts ---- */
export const PlotGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  margin-top: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

/* ---- Controls bar for grouping parameter sections ---- */
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

/* ---- Live evaluation display ---- */
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

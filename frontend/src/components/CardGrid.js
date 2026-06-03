import styled from 'styled-components';

/**
 * CardGrid – flexbox-based card grid that guarantees the last row is always filled.
 *
 * Unlike `repeat(auto-fit, minmax(…, 1fr))` (CSS Grid), flex items with
 * `flex: 1 1 0; min-width: …` grow equally on every row, so a partial last row
 * (e.g. 2 out of 4 columns) still stretches to fill the container width.
 */
const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  & > * {
    flex: 1 1 0;
    min-width: ${({ $min }) => $min || '300px'};
  }
`;

export default CardGrid;

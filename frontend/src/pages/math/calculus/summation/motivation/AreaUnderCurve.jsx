// UI Pattern: StandardSinglePlot — placeholder
import React from 'react';
import { useThemeMode } from '../../../../../hooks/useThemeMode';
import { getTracePalette } from '../../../../../constants/plotThemeConfig';
import BackButton from '../../../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitleH1, SectionDescription
} from '../../../../../components/common/LayoutStyled';

/**
 * AreaUnderCurve — Blank placeholder page
 */
const AreaUnderCurve = () => {
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/2-calculus/summation">
          ← Back to Summation
        </BackButton>
        <SectionTitleH1>Area under the curve</SectionTitleH1>
      </Header>
      <SectionDescription>
        Coming soon: visualize the area under a curve as the foundation of integration.
      </SectionDescription>
    </PageContainer>
  );
};

export default AreaUnderCurve;

import React from 'react';
import styled from 'styled-components';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import menuConfig from '../../config/menuConfig';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Layout = ({ children }) => {
  const [activeLevel1, setActiveLevel1] = React.useState(null);
  const [activeLevel2, setActiveLevel2] = React.useState(null);

  const handleLevel1Click = (level1Id) => {
    setActiveLevel1(level1Id);
    // 自动选择第一个二级菜单
    const level1 = menuConfig.menu.find((item) => item.id === level1Id);
    if (level1 && level1.children && level1.children.length > 0) {
      setActiveLevel2(level1.children[0].id);
    }
  };

  const handleLevel2Click = (level2Id) => {
    setActiveLevel2(level2Id);
  };

  return (
    <LayoutContainer>
      <TopNav
        menuData={menuConfig.menu}
        activeLevel1={activeLevel1}
        activeLevel2={activeLevel2}
        onLevel1Click={handleLevel1Click}
        onLevel2Click={handleLevel2Click}
      />
      <Sidebar menuData={menuConfig.menu} activeLevel2={activeLevel2} />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default Layout;

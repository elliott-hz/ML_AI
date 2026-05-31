import React from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [activeLevel1, setActiveLevel1] = React.useState(null);
  const [activeLevel2, setActiveLevel2] = React.useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  // 根据当前 URL 路径自动设置 activeLevel1 和 activeLevel2
  React.useEffect(() => {
    const currentPath = location.pathname;
    
    // 遍历菜单配置，找到匹配的路径
    for (const level1 of menuConfig.menu) {
      if (level1.children) {
        for (const level2 of level1.children) {
          if (level2.children) {
            for (const level3 of level2.children) {
              // 检查三级菜单路径
              if (currentPath === level3.path || currentPath.startsWith(level3.path + '/')) {
                setActiveLevel1(level1.id);
                setActiveLevel2(level2.id);
                return;
              }
            }
          }
          // 检查二级菜单路径（如果没有三级菜单）
          if (currentPath === level2.path) {
            setActiveLevel1(level1.id);
            setActiveLevel2(level2.id);
            return;
          }
        }
      }
    }
  }, [location.pathname]);

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

  const handleSidebarCollapseChange = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
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
      <Sidebar 
        menuData={menuConfig.menu} 
        activeLevel2={activeLevel2} 
        onCollapseChange={handleSidebarCollapseChange}
      />
      <MainContent $sidebarCollapsed={isSidebarCollapsed}>{children}</MainContent>
    </LayoutContainer>
  );
};

export default Layout;

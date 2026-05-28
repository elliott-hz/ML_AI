import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TopNavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-right: ${({ theme }) => theme.spacing.xxl};
`;

const MenuList = styled.ul`
  display: flex;
  list-style: none;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const MenuItem = styled.li`
  position: relative;
`;

const MenuButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) => $active ? theme.colors.surfaceLight : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.95rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-width: 280px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: translateY(${({ $visible }) => ($visible ? 0 : '-10px')});
  transition: all ${({ theme }) => theme.transitions.normal};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) => $active ? theme.colors.surfaceLight : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  text-align: left;
  font-size: 0.9rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ThemeToggleButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TopNav = ({ menuData, activeLevel1, activeLevel2, onLevel1Click, onLevel2Click }) => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [themeMode, setThemeMode] = useState(() => {
    return window.currentThemeMode || 'dark';
  });

  // 监听主题变化
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMode = window.currentThemeMode;
      if (currentMode && currentMode !== themeMode) {
        setThemeMode(currentMode);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [themeMode]);

  const handleThemeToggle = () => {
    if (window.toggleTheme) {
      window.toggleTheme();
    }
  };

  return (
    <TopNavContainer>
      <Logo>AI Knowledge System</Logo>
      <MenuList>
        {menuData.map((level1) => (
          <MenuItem
            key={level1.id}
            onMouseEnter={() => setHoveredMenu(level1.id)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <MenuButton
              $active={activeLevel1 === level1.id}
              onClick={() => onLevel1Click(level1.id)}
            >
              {level1.name}
            </MenuButton>
            <Dropdown $visible={hoveredMenu === level1.id}>
              {level1.children?.map((level2) => (
                <DropdownItem
                  key={level2.id}
                  $active={activeLevel2 === level2.id}
                  onClick={() => onLevel2Click(level2.id)}
                >
                  {level2.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </MenuItem>
        ))}
      </MenuList>
      
      {/* Theme Toggle Button */}
      <ThemeToggleButton onClick={handleThemeToggle}>
        {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </ThemeToggleButton>
    </TopNavContainer>
  );
};

export default TopNav;

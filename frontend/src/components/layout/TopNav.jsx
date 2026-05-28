import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const TopNavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.xl};
  z-index: ${theme.zIndex.sticky};
  box-shadow: ${theme.shadows.md};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: ${theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-right: ${theme.spacing.xxl};
`;

const MenuList = styled.ul`
  display: flex;
  list-style: none;
  gap: ${theme.spacing.sm};
  flex: 1;
`;

const MenuItem = styled.li`
  position: relative;
`;

const MenuButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${({ $active }) => $active ? theme.colors.surfaceLight : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.95rem;
  font-weight: 500;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.surfaceLight};
    color: ${theme.colors.textPrimary};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${theme.spacing.xs};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  min-width: 280px;
  box-shadow: ${theme.shadows.lg};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: translateY(${({ $visible }) => ($visible ? 0 : '-10px')});
  transition: all ${theme.transitions.normal};
  z-index: ${theme.zIndex.dropdown};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${({ $active }) => $active ? theme.colors.surfaceLight : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  text-align: left;
  font-size: 0.9rem;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.surfaceLight};
    color: ${theme.colors.textPrimary};
  }
`;

const TopNav = ({ menuData, activeLevel1, activeLevel2, onLevel1Click, onLevel2Click }) => {
  const [hoveredMenu, setHoveredMenu] = React.useState(null);

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
    </TopNavContainer>
  );
};

export default TopNav;

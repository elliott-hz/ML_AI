import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  width: 280px;
  height: calc(100vh - 60px);
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  
  @media (max-width: 768px) {
    width: 240px;
  }
`;

const SidebarTitle = styled.h3`
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MenuItemList = styled.ul`
  list-style: none;
`;

const MenuItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MenuLink = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) => $active ? `${theme.colors.primary}15` : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  text-align: left;
  font-size: 0.9rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
    border-left-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const Sidebar = ({ menuData, activeLevel2 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 查找当前激活的二级菜单
  const activeModule = React.useMemo(() => {
    for (const level1 of menuData) {
      const found = level1.children?.find((level2) => level2.id === activeLevel2);
      if (found) return found;
    }
    return null;
  }, [menuData, activeLevel2]);

  if (!activeModule) {
    return (
      <SidebarContainer>
        <EmptyState>
          Select a module from the top menu to view topics
        </EmptyState>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <SidebarTitle>{activeModule.name}</SidebarTitle>
      <MenuItemList>
        {activeModule.children?.map((level3) => (
          <MenuItem key={level3.id}>
            <MenuLink
              $active={location.pathname === level3.path}
              onClick={() => navigate(level3.path)}
            >
              {level3.name}
            </MenuLink>
          </MenuItem>
        ))}
      </MenuItemList>
    </SidebarContainer>
  );
};

export default Sidebar;

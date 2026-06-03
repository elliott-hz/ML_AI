import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  width: ${({ $collapsed }) => $collapsed ? '50px' : '280px'};
  height: calc(100vh - 60px);
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: ${({ $collapsed }) => $collapsed ? '50px' : '240px'};
  }

  /* Hide scrollbar when collapsed */
  &::-webkit-scrollbar {
    width: ${({ $collapsed }) => $collapsed ? '0' : '6px'};
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

// ── Collapsed sidebar letter buttons ──────────────────

const CollapsedIconList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
`;

const IconButtonWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, theme }) => $active ? `${theme.colors.primary}20` : 'transparent'};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textMuted};
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    border-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const CollapseButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// ── Get first letter for collapsed button ──────────────

const getFirstLetter = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const Sidebar = ({ menuData, activeLevel2, onCollapseChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState(null);

  // 查找当前激活的二级菜单
  const activeModule = React.useMemo(() => {
    for (const level1 of menuData) {
      const found = level1.children?.find((level2) => level2.id === activeLevel2);
      if (found) return found;
    }
    return null;
  }, [menuData, activeLevel2]);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  if (!activeModule) {
    return (
      <SidebarContainer $collapsed={isCollapsed}>
        {!isCollapsed && (
          <EmptyState>
            Select a module from the top menu to view topics
          </EmptyState>
        )}
        <CollapseButton onClick={handleToggleCollapse} title={isCollapsed ? "Expand" : "Collapse"}>
          {isCollapsed ? '▶' : '◀'}
        </CollapseButton>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer $collapsed={isCollapsed}>
      {isCollapsed ? (
        // ── Collapsed: letter buttons ──
        <>
          <CollapsedIconList>
            {activeModule.children?.map((level3) => (
              <IconButtonWrapper
                key={level3.id}
                onMouseEnter={() => setHoveredItem(level3.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <IconButton
                  $active={location.pathname === level3.path}
                  onClick={() => navigate(level3.path)}
                >
                  {getFirstLetter(level3.name)}
                </IconButton>
                <span
                  style={{
                    position: 'absolute',
                    left: '44px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: theme.colors.textPrimary,
                    color: theme.colors.surface,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    opacity: hoveredItem === level3.id ? 1 : 0,
                    visibility: hoveredItem === level3.id ? 'visible' : 'hidden',
                    transition: 'all 0.15s ease',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {level3.name}
                </span>
              </IconButtonWrapper>
            ))}
          </CollapsedIconList>
          <CollapseButton onClick={handleToggleCollapse} title="Expand">
            ▶
          </CollapseButton>
        </>
      ) : (
        // ── Expanded: full text menu ──
        <>
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
          <CollapseButton onClick={handleToggleCollapse} title="Collapse">
            ◀
          </CollapseButton>
        </>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;

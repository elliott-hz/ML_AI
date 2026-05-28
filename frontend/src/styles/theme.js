import { createGlobalStyle } from 'styled-components';

// Dark Theme (AI Style)
export const darkTheme = {
  mode: 'dark',
  colors: {
    // AI 科技风格配色
    primary: '#6366f1',        // Indigo - 主色调
    primaryDark: '#4f46e5',    // Deep Indigo
    secondary: '#06b6d4',      // Cyan - 辅助色
    accent: '#8b5cf6',         // Purple - 强调色
    
    // 背景色
    background: '#0f172a',     // Dark slate
    surface: '#1e293b',        // Slate 800
    surfaceLight: '#334155',   // Slate 700
    cardBg: '#1e293b',         // Card background (same as surface)
    inputBg: '#334155',        // Input background (same as surfaceLight)
    
    // 文字颜色
    textPrimary: '#f8fafc',    // Slate 50
    textSecondary: '#cbd5e1',  // Slate 300
    textMuted: '#94a3b8',      // Slate 400
    
    // 状态色
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // 边框和分割线
    border: '#334155',
    divider: '#475569',
    
    // 渐变
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    gradientHover: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// Light Theme
export const lightTheme = {
  mode: 'light',
  colors: {
    // Primary colors remain the same for brand consistency
    primary: '#6366f1',        // Indigo - 主色调
    primaryDark: '#4f46e5',    // Deep Indigo
    secondary: '#06b6d4',      // Cyan - 辅助色
    accent: '#8b5cf6',         // Purple - 强调色
    
    // 背景色 - 浅色主题
    background: '#ffffff',     // White
    surface: '#f8fafc',        // Slate 50
    surfaceLight: '#e2e8f0',   // Slate 200
    cardBg: '#ffffff',         // White
    inputBg: '#f1f5f9',        // Slate 100
    
    // 文字颜色 - 深色文字
    textPrimary: '#0f172a',    // Slate 900
    textSecondary: '#475569',  // Slate 600
    textMuted: '#94a3b8',      // Slate 400
    
    // 状态色
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // 边框和分割线
    border: '#e2e8f0',
    divider: '#cbd5e1',
    
    // 渐变
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    gradientHover: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// Default export for backward compatibility
export const theme = darkTheme;

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    
    /* CSS Variables for inline styles */
    --theme-background: ${({ theme }) => theme.colors.background};
    --theme-surface: ${({ theme }) => theme.colors.surface};
    --theme-surface-light: ${({ theme }) => theme.colors.surfaceLight};
    --theme-card-bg: ${({ theme }) => theme.colors.cardBg};
    --theme-input-bg: ${({ theme }) => theme.colors.inputBg};
    --theme-text-primary: ${({ theme }) => theme.colors.textPrimary};
    --theme-text-secondary: ${({ theme }) => theme.colors.textSecondary};
    --theme-text-muted: ${({ theme }) => theme.colors.textMuted};
    --theme-border: ${({ theme }) => theme.colors.border};
    --theme-divider: ${({ theme }) => theme.colors.divider};
    --theme-primary: ${({ theme }) => theme.colors.primary};
    --theme-secondary: ${({ theme }) => theme.colors.secondary};
    --theme-accent: ${({ theme }) => theme.colors.accent};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceLight};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.colors.divider};
    }
  }
`;

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle, darkTheme, lightTheme } from './styles/theme';
import AppRoutes from './routes/AppRoutes';

function App() {
  // 从 localStorage 读取主题，默认为 dark
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'dark';
  });

  // 根据 themeMode 选择主题
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  // 切换主题函数
  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    window.dispatchEvent(new CustomEvent('qwen-theme-change', { detail: newMode }));
  };

  // 将 toggleTheme 函数暴露给全局，供其他组件使用
  useEffect(() => {
    window.toggleTheme = toggleTheme;
    window.currentThemeMode = themeMode;
    
    return () => {
      delete window.toggleTheme;
      delete window.currentThemeMode;
    };
  }, [themeMode]);

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

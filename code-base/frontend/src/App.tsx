import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { Header, Sidebar } from './components/Layout';
import Home from './pages/Home';
import KnowledgePage from './pages/KnowledgePage';
import './styles/global.css';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout>
          <Sidebar />
          <Content style={{ padding: '0', background: '#f0f2f5' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/modules/:module" element={<Home />} />
              <Route path="/modules/:module/:topic" element={<KnowledgePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

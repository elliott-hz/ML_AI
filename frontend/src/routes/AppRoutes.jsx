import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import BasicFunction from '../pages/BasicFunction';
import OddEvenFunctions from '../pages/basic-function/OddEvenFunctions';
import PeriodicFunctions from '../pages/basic-function/PeriodicFunctions';
import MonotonicityFunctions from '../pages/basic-function/MonotonicityFunctions';

// 动态导入页面组件的辅助函数
const importPageComponent = (componentName) => {
  // 这里可以根据 component name 动态导入对应的页面组件
  // 目前先返回 null，后续扩展时实现
  return null;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* 首页路由 */}
        <Route path="/" element={<Home />} />
        
        {/* 数学模块 - Basic Function 主页面 */}
        <Route path="/mathematics/1-fundamentals/basic-function" element={<BasicFunction />} />
        
        {/* 数学模块 - Basic Function 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/basic-function/odd-even" element={<OddEvenFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/periodic" element={<PeriodicFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/monotonicity" element={<MonotonicityFunctions />} />
        
        {/* 其他数学模块路由 - 示例 */}
        <Route path="/mathematics/1-fundamentals/limit" element={<div>Limit Page - Coming Soon</div>} />
        <Route path="/mathematics/1-fundamentals/continuity" element={<div>Continuity Page - Coming Soon</div>} />
        <Route path="/mathematics/2-calculus/derivative" element={<div>Derivative Page - Coming Soon</div>} />
        
        {/* 深度学习模块路由 - 示例 */}
        <Route path="/deep-learning/1-neural-networks/perceptron" element={<div>Perceptron Page - Coming Soon</div>} />
        
        {/* 机器学习模块路由 - 示例 */}
        <Route path="/machine-learning/1-supervised/linear-regression" element={<div>Linear Regression Page - Coming Soon</div>} />
        
        {/* 404 重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import BasicFunction from '../pages/BasicFunction';
import Limit from '../pages/Limit';
import OddEvenFunctions from '../pages/basic-function/OddEvenFunctions';
import PeriodicFunctions from '../pages/basic-function/PeriodicFunctions';
import MonotonicityFunctions from '../pages/basic-function/MonotonicityFunctions';
import PiecewiseFunctions from '../pages/basic-function/PiecewiseFunctions';
import InverseFunctions from '../pages/basic-function/InverseFunctions';
import ConvergentSequence1 from '../pages/limit/ConvergentSequence1';
import ConvergentSequence2 from '../pages/limit/ConvergentSequence2';
import DivergentSequence1 from '../pages/limit/DivergentSequence1';
import DivergentSequence2 from '../pages/limit/DivergentSequence2';
import ExponentialFunctionLimit from '../pages/limit/ExponentialFunctionLimit';
import ReciprocalFunctionLimit from '../pages/limit/ReciprocalFunctionLimit';
import ArctanFunctionLimit from '../pages/limit/ArctanFunctionLimit';
import OneSidedLimit from '../pages/limit/OneSidedLimit';
import TwoSidedLimit from '../pages/limit/TwoSidedLimit';
import InfinitesimalSum from '../pages/limit/InfinitesimalSum';
import InfinitesimalBounded from '../pages/limit/InfinitesimalBounded';
import InfinitesimalConstant from '../pages/limit/InfinitesimalConstant';

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
        <Route path="/mathematics/1-fundamentals/basic-function/piecewise" element={<PiecewiseFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/inverse" element={<InverseFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/odd-even" element={<OddEvenFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/periodic" element={<PeriodicFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/monotonicity" element={<MonotonicityFunctions />} />
        
        {/* 数学模块 - Limit 主页面 */}
        <Route path="/mathematics/1-fundamentals/limit" element={<Limit />} />
        
        {/* 数学模块 - Limit 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/convergent-1" element={<ConvergentSequence1 />} />
        <Route path="/mathematics/1-fundamentals/limit/convergent-2" element={<ConvergentSequence2 />} />
        <Route path="/mathematics/1-fundamentals/limit/divergent-1" element={<DivergentSequence1 />} />
        <Route path="/mathematics/1-fundamentals/limit/divergent-2" element={<DivergentSequence2 />} />
        
        {/* 数学模块 - Elementary Functions Limits 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/exponential" element={<ExponentialFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/reciprocal" element={<ReciprocalFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/arctan" element={<ArctanFunctionLimit />} />
        
        {/* 数学模块 - One-Sided & Two-Sided Limits 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/one-sided" element={<OneSidedLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/two-sided" element={<TwoSidedLimit />} />
        
        {/* 数学模块 - Infinitesimal Properties (Three Still) 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/infinitesimal-sum" element={<InfinitesimalSum />} />
        <Route path="/mathematics/1-fundamentals/limit/infinitesimal-bounded" element={<InfinitesimalBounded />} />
        <Route path="/mathematics/1-fundamentals/limit/infinitesimal-constant" element={<InfinitesimalConstant />} />
        
        {/* 其他数学模块路由 - 示例 */}
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

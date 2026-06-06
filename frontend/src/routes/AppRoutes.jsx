import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import BasicFunction from '../pages/BasicFunction';
import Limit from '../pages/Limit';
import PiecewiseFunctions from '../pages/basic-function/function-relationship/PiecewiseFunctions';
import PowerFunction from '../pages/basic-function/elementary/PowerFunction';
import ExponentialFunction from '../pages/basic-function/elementary/ExponentialFunction';
import LogarithmicFunction from '../pages/basic-function/elementary/LogarithmicFunction';
import InverseFunctions from '../pages/basic-function/function-relationship/InverseFunctions';
import ReciprocalFunctions from '../pages/basic-function/function-relationship/ReciprocalFunctions';
import OddEvenFunctions from '../pages/basic-function/function-properties/OddEvenFunctions';
import PeriodicFunctions from '../pages/basic-function/function-properties/PeriodicFunctions';
import MonotonicityFunctions from '../pages/basic-function/function-properties/MonotonicityFunctions';
import TrigonometricRatios from '../pages/basic-function/elementary/TrigonometricRatios';
import InverseTrigonometricRatios from '../pages/basic-function/elementary/InverseTrigonometricRatios';
import ConvergentSequence1 from '../pages/limit/sequences/ConvergentSequence1';
import ConvergentSequence2 from '../pages/limit/sequences/ConvergentSequence2';
import DivergentSequence1 from '../pages/limit/sequences/DivergentSequence1';
import DivergentSequence2 from '../pages/limit/sequences/DivergentSequence2';
import ExponentialFunctionLimit from '../pages/limit/elementary-functions/ExponentialFunctionLimit';
import LogarithmicFunctionLimit from '../pages/limit/elementary-functions/LogarithmicFunctionLimit';
import TrigonometricFunctionLimit from '../pages/limit/elementary-functions/TrigonometricFunctionLimit';
import PowerFunctionLimit from '../pages/limit/elementary-functions/PowerFunctionLimit';
import TrigonometricIntuitiveLimit from '../pages/limit/elementary-functions/TrigonometricIntuitiveLimit';
import InverseTrigIntuitiveLimit from '../pages/limit/elementary-functions/InverseTrigIntuitiveLimit';
import InverseTrigonometricLimit from '../pages/limit/elementary-functions/InverseTrigonometricLimit';
import OneSidedLimit from '../pages/limit/one-two-sided/OneSidedLimit';
import TwoSidedLimit from '../pages/limit/one-two-sided/TwoSidedLimit';
import InfinitesimalSum from '../pages/limit/infinitesimal/InfinitesimalSum';
import InfinitesimalBounded from '../pages/limit/infinitesimal/InfinitesimalBounded';
import InfinitesimalConstant from '../pages/limit/infinitesimal/InfinitesimalConstant';
import InfiniteSumNotInfinitesimal from '../pages/limit/infinitesimal/InfiniteSumNotInfinitesimal';
import QuotientOfInfinitesimals from '../pages/limit/infinitesimal/QuotientOfInfinitesimals';
import DiscontinuityUndefined from '../pages/continuity/discontinuity-points/DiscontinuityUndefined';
import DiscontinuityJump from '../pages/continuity/discontinuity-points/DiscontinuityJump';
import DiscontinuityRemovable from '../pages/continuity/discontinuity-points/DiscontinuityRemovable';
import Continuity from '../pages/Continuity';
import ContinuityOfFunction from '../pages/continuity/continuity-basics/ContinuityOfFunction';
import Derivative from '../pages/Derivative';
import AverageInstantaneousVelocity from '../pages/derivative/avg-instant-velocity/AverageInstantaneousVelocity';
import DerivativeConstants from '../pages/derivative/constants-power/DerivativeConstants';
import DerivativePowerFunctions from '../pages/derivative/constants-power/DerivativePowerFunctions';
import TrigonometricFunctions from '../pages/derivative/trigonometric/TrigonometricFunctions';
import InverseTrigonometricFunctions from '../pages/derivative/inverse-trig/InverseTrigonometricFunctions';
import ExponentialFunctions from '../pages/derivative/exp-log/ExponentialFunctions';
import LogarithmicFunctions from '../pages/derivative/exp-log/LogarithmicFunctions';
import LinearityRule from '../pages/derivative/differentiation-rules/LinearityRule';
import ProductRule from '../pages/derivative/differentiation-rules/ProductRule';
import QuotientRule from '../pages/derivative/differentiation-rules/QuotientRule';
import ChainRule from '../pages/derivative/differentiation-rules/ChainRule';

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
        <Route path="/mathematics/1-fundamentals/basic-function/power-function" element={<PowerFunction />} />
        <Route path="/mathematics/1-fundamentals/basic-function/exponential" element={<ExponentialFunction />} />
        <Route path="/mathematics/1-fundamentals/basic-function/logarithmic" element={<LogarithmicFunction />} />
        <Route path="/mathematics/1-fundamentals/basic-function/piecewise" element={<PiecewiseFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/inverse" element={<InverseFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/reciprocal" element={<ReciprocalFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/odd-even" element={<OddEvenFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/periodic" element={<PeriodicFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/monotonicity" element={<MonotonicityFunctions />} />
        <Route path="/mathematics/1-fundamentals/basic-function/trigonometric-ratios" element={<TrigonometricRatios />} />
        <Route path="/mathematics/1-fundamentals/basic-function/inverse-trigonometric-ratios" element={<InverseTrigonometricRatios />} />
        
        {/* 数学模块 - Limit 主页面 */}
        <Route path="/mathematics/1-fundamentals/limit" element={<Limit />} />
        
        {/* 数学模块 - Limit 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/convergent-1" element={<ConvergentSequence1 />} />
        <Route path="/mathematics/1-fundamentals/limit/convergent-2" element={<ConvergentSequence2 />} />
        <Route path="/mathematics/1-fundamentals/limit/divergent-1" element={<DivergentSequence1 />} />
        <Route path="/mathematics/1-fundamentals/limit/divergent-2" element={<DivergentSequence2 />} />
        
        {/* 数学模块 - Elementary Functions Limits 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/exponential" element={<ExponentialFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/logarithmic" element={<LogarithmicFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/trigonometric" element={<TrigonometricFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/power-function" element={<PowerFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/trigonometric-intuitive" element={<TrigonometricIntuitiveLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/inverse-trig-intuitive" element={<InverseTrigIntuitiveLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/inverse-trigonometric" element={<InverseTrigonometricLimit />} />
        
        {/* 数学模块 - One-Sided & Two-Sided Limits 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/one-sided" element={<OneSidedLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/two-sided" element={<TwoSidedLimit />} />
        
        {/* 数学模块 - Infinitesimal Properties (Three Still) 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/infinitesimal-sum" element={<InfinitesimalSum />} />
        <Route path="/mathematics/1-fundamentals/limit/infinitesimal-bounded" element={<InfinitesimalBounded />} />
        <Route path="/mathematics/1-fundamentals/limit/infinitesimal-constant" element={<InfinitesimalConstant />} />
        
        {/* 数学模块 - Infinitesimal Properties (Not Necessarily) 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/limit/infinite-sum-not-infinitesimal" element={<InfiniteSumNotInfinitesimal />} />
        <Route path="/mathematics/1-fundamentals/limit/quotient-of-infinitesimals" element={<QuotientOfInfinitesimals />} />
        
        {/* 数学模块 - Discontinuity Points 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/continuity/discontinuity-undefined" element={<DiscontinuityUndefined />} />
        <Route path="/mathematics/1-fundamentals/continuity/discontinuity-jump" element={<DiscontinuityJump />} />
        <Route path="/mathematics/1-fundamentals/continuity/discontinuity-removable" element={<DiscontinuityRemovable />} />

        {/* 数学模块 - Continuity 主页面 */}
        <Route path="/mathematics/1-fundamentals/continuity" element={<Continuity />} />

        {/* 数学模块 - Continuity 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/continuity/continuity-of-function" element={<ContinuityOfFunction />} />

        {/* 数学模块 - Derivative 主页面 */}
        <Route path="/mathematics/1-fundamentals/derivative" element={<Derivative />} />

        {/* 数学模块 - Derivative 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/derivative/avg-instant-velocity" element={<AverageInstantaneousVelocity />} />
        <Route path="/mathematics/1-fundamentals/derivative/constants" element={<DerivativeConstants />} />
        <Route path="/mathematics/1-fundamentals/derivative/power-functions" element={<DerivativePowerFunctions />} />
        <Route path="/mathematics/1-fundamentals/derivative/trigonometric" element={<TrigonometricFunctions />} />
        <Route path="/mathematics/1-fundamentals/derivative/inverse-trigonometric" element={<InverseTrigonometricFunctions />} />
        <Route path="/mathematics/1-fundamentals/derivative/exponential" element={<ExponentialFunctions />} />
        <Route path="/mathematics/1-fundamentals/derivative/logarithmic" element={<LogarithmicFunctions />} />

        {/* 数学模块 - Differentiation Rules */}
        <Route path="/mathematics/1-fundamentals/derivative/linearity-rule" element={<LinearityRule />} />
        <Route path="/mathematics/1-fundamentals/derivative/product-rule" element={<ProductRule />} />
        <Route path="/mathematics/1-fundamentals/derivative/quotient-rule" element={<QuotientRule />} />
        <Route path="/mathematics/1-fundamentals/derivative/chain-rule" element={<ChainRule />} />

        {/* 其他数学模块路由 - 示例 */}
        <Route path="/mathematics/2-calculus/summation" element={<div>Summation Page - Coming Soon</div>} />

        {/* 其他数学模块路由 - 示例 */}
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

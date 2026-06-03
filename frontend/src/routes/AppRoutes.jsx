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
import ReciprocalFunctionLimit from '../pages/limit/elementary-functions/ReciprocalFunctionLimit';
import ArctanFunctionLimit from '../pages/limit/elementary-functions/ArctanFunctionLimit';
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
import DerivativeSin from '../pages/derivative/trigonometric/DerivativeSin';
import DerivativeCos from '../pages/derivative/trigonometric/DerivativeCos';
import DerivativeTan from '../pages/derivative/trigonometric/DerivativeTan';
import DerivativeCot from '../pages/derivative/trigonometric/DerivativeCot';
import DerivativeSec from '../pages/derivative/trigonometric/DerivativeSec';
import DerivativeCsc from '../pages/derivative/trigonometric/DerivativeCsc';
import DerivativeExpBaseA from '../pages/derivative/exp-log/DerivativeExpBaseA';
import DerivativeExpE from '../pages/derivative/exp-log/DerivativeExpE';
import DerivativeLogBaseA from '../pages/derivative/exp-log/DerivativeLogBaseA';
import DerivativeLn from '../pages/derivative/exp-log/DerivativeLn';
import DerivativeArcsin from '../pages/derivative/inverse-trig/DerivativeArcsin';
import DerivativeArccos from '../pages/derivative/inverse-trig/DerivativeArccos';
import DerivativeArctan from '../pages/derivative/inverse-trig/DerivativeArctan';
import DerivativeArccot from '../pages/derivative/inverse-trig/DerivativeArccot';
import DerivativeArcsec from '../pages/derivative/inverse-trig/DerivativeArcsec';
import DerivativeArccsc from '../pages/derivative/inverse-trig/DerivativeArccsc';

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
        <Route path="/mathematics/1-fundamentals/limit/reciprocal" element={<ReciprocalFunctionLimit />} />
        <Route path="/mathematics/1-fundamentals/limit/arctan" element={<ArctanFunctionLimit />} />
        
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
        <Route path="/mathematics/1-fundamentals/derivative/sin" element={<DerivativeSin />} />
        <Route path="/mathematics/1-fundamentals/derivative/cos" element={<DerivativeCos />} />
        <Route path="/mathematics/1-fundamentals/derivative/tan" element={<DerivativeTan />} />
        <Route path="/mathematics/1-fundamentals/derivative/cot" element={<DerivativeCot />} />
        <Route path="/mathematics/1-fundamentals/derivative/sec" element={<DerivativeSec />} />
        <Route path="/mathematics/1-fundamentals/derivative/csc" element={<DerivativeCsc />} />
        <Route path="/mathematics/1-fundamentals/derivative/exp-base-a" element={<DerivativeExpBaseA />} />
        <Route path="/mathematics/1-fundamentals/derivative/exp-e" element={<DerivativeExpE />} />
        <Route path="/mathematics/1-fundamentals/derivative/log-base-a" element={<DerivativeLogBaseA />} />
        <Route path="/mathematics/1-fundamentals/derivative/ln" element={<DerivativeLn />} />
        <Route path="/mathematics/1-fundamentals/derivative/arcsin" element={<DerivativeArcsin />} />
        <Route path="/mathematics/1-fundamentals/derivative/arccos" element={<DerivativeArccos />} />
        <Route path="/mathematics/1-fundamentals/derivative/arctan" element={<DerivativeArctan />} />
        <Route path="/mathematics/1-fundamentals/derivative/arccot" element={<DerivativeArccot />} />
        <Route path="/mathematics/1-fundamentals/derivative/arcsec" element={<DerivativeArcsec />} />
        <Route path="/mathematics/1-fundamentals/derivative/arccsc" element={<DerivativeArccsc />} />

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

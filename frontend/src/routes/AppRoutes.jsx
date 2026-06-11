import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/math/fundamental/Home';
import BasicFunction from '../pages/math/fundamental/BasicFunction';
import Limit from '../pages/math/fundamental/Limit';
import PiecewiseFunctions from '../pages/math/fundamental/basic-function/function-relationship/PiecewiseFunctions';
import PowerFunction from '../pages/math/fundamental/basic-function/elementary/PowerFunction';
import ExponentialFunction from '../pages/math/fundamental/basic-function/elementary/ExponentialFunction';
import LogarithmicFunction from '../pages/math/fundamental/basic-function/elementary/LogarithmicFunction';
import InverseFunctions from '../pages/math/fundamental/basic-function/function-relationship/InverseFunctions';
import ReciprocalFunctions from '../pages/math/fundamental/basic-function/function-relationship/ReciprocalFunctions';
import OddEvenFunctions from '../pages/math/fundamental/basic-function/function-properties/OddEvenFunctions';
import PeriodicFunctions from '../pages/math/fundamental/basic-function/function-properties/PeriodicFunctions';
import MonotonicityFunctions from '../pages/math/fundamental/basic-function/function-properties/MonotonicityFunctions';
import TrigonometricRatios from '../pages/math/fundamental/basic-function/elementary/TrigonometricRatios';
import InverseTrigonometricRatios from '../pages/math/fundamental/basic-function/elementary/InverseTrigonometricRatios';
import ConvergentSequence1 from '../pages/math/fundamental/limit/sequences/ConvergentSequence1';
import ConvergentSequence2 from '../pages/math/fundamental/limit/sequences/ConvergentSequence2';
import DivergentSequence1 from '../pages/math/fundamental/limit/sequences/DivergentSequence1';
import DivergentSequence2 from '../pages/math/fundamental/limit/sequences/DivergentSequence2';
import ExponentialFunctionLimit from '../pages/math/fundamental/limit/elementary-functions/ExponentialFunctionLimit';
import LogarithmicFunctionLimit from '../pages/math/fundamental/limit/elementary-functions/LogarithmicFunctionLimit';
import TrigonometricFunctionLimit from '../pages/math/fundamental/limit/elementary-functions/TrigonometricFunctionLimit';
import PowerFunctionLimit from '../pages/math/fundamental/limit/elementary-functions/PowerFunctionLimit';
import TrigonometricIntuitiveLimit from '../pages/math/fundamental/limit/elementary-functions/TrigonometricIntuitiveLimit';
import InverseTrigIntuitiveLimit from '../pages/math/fundamental/limit/elementary-functions/InverseTrigIntuitiveLimit';
import InverseTrigonometricLimit from '../pages/math/fundamental/limit/elementary-functions/InverseTrigonometricLimit';
import OneSidedLimit from '../pages/math/fundamental/limit/one-two-sided/OneSidedLimit';
import TwoSidedLimit from '../pages/math/fundamental/limit/one-two-sided/TwoSidedLimit';
import InfinitesimalSum from '../pages/math/fundamental/limit/infinitesimal/InfinitesimalSum';
import InfinitesimalBounded from '../pages/math/fundamental/limit/infinitesimal/InfinitesimalBounded';
import InfinitesimalConstant from '../pages/math/fundamental/limit/infinitesimal/InfinitesimalConstant';
import InfiniteSumNotInfinitesimal from '../pages/math/fundamental/limit/infinitesimal/InfiniteSumNotInfinitesimal';
import QuotientOfInfinitesimals from '../pages/math/fundamental/limit/infinitesimal/QuotientOfInfinitesimals';
import DiscontinuityUndefined from '../pages/math/fundamental/continuity/discontinuity-points/DiscontinuityUndefined';
import DiscontinuityJump from '../pages/math/fundamental/continuity/discontinuity-points/DiscontinuityJump';
import DiscontinuityRemovable from '../pages/math/fundamental/continuity/discontinuity-points/DiscontinuityRemovable';
import Continuity from '../pages/math/fundamental/Continuity';
import ContinuityOfFunction from '../pages/math/fundamental/continuity/continuity-basics/ContinuityOfFunction';
import Derivative from '../pages/math/fundamental/Derivative';
import AverageInstantaneousVelocity from '../pages/math/fundamental/derivative/avg-instant-velocity/AverageInstantaneousVelocity';
import DerivativeConstants from '../pages/math/fundamental/derivative/constants-power/DerivativeConstants';
import DerivativePowerFunctions from '../pages/math/fundamental/derivative/constants-power/DerivativePowerFunctions';
import TrigonometricFunctions from '../pages/math/fundamental/derivative/trigonometric/TrigonometricFunctions';
import InverseTrigonometricFunctions from '../pages/math/fundamental/derivative/inverse-trig/InverseTrigonometricFunctions';
import ExponentialFunctions from '../pages/math/fundamental/derivative/exp-log/ExponentialFunctions';
import LogarithmicFunctions from '../pages/math/fundamental/derivative/exp-log/LogarithmicFunctions';
import LinearityRule from '../pages/math/fundamental/derivative/differentiation-rules/LinearityRule';
import ProductRule from '../pages/math/fundamental/derivative/differentiation-rules/ProductRule';
import ReciprocalRule from '../pages/math/fundamental/derivative/differentiation-rules/ReciprocalRule';
import QuotientRule from '../pages/math/fundamental/derivative/differentiation-rules/QuotientRule';
import ChainRule from '../pages/math/fundamental/derivative/differentiation-rules/ChainRule';
import Gradient from '../pages/math/fundamental/Gradient';
import MotivationUnary from '../pages/math/fundamental/gradient/partial-derivative/MotivationUnary';
import MotivationBinary from '../pages/math/fundamental/gradient/partial-derivative/MotivationBinary';
import PartialDerivativePage from '../pages/math/fundamental/gradient/partial-derivative/PartialDerivative';
import DirectionalDerivative from '../pages/math/fundamental/gradient/directional-derivative/DirectionalDerivative';
import GradientVector from '../pages/math/fundamental/gradient/gradient/GradientVector';

// 数学模块 - Calculus / Summation
import Summation from '../pages/math/calculus/Summation';
import AreaUnderCurve from '../pages/math/calculus/summation/motivation/AreaUnderCurve';
import RiemannSum from '../pages/math/calculus/summation/summation/RiemannSum';

// 数学模块 - Calculus / Differential
import Differential from '../pages/math/calculus/Differential';
import GeometricMeaningOfDifferential from '../pages/math/calculus/differential/differential/GeometricMeaningOfDifferential';

// 数学模块 - Calculus / Definite Integral
import DefiniteIntegral from '../pages/math/calculus/DefiniteIntegral';
import IntegralDefinitionViaLimit from '../pages/math/calculus/definite-integral/definition/IntegralDefinitionViaLimit';
import SumOrDifferenceProperty from '../pages/math/calculus/definite-integral/properties/SumOrDifferenceProperty';
import ConstantMultipleProperty from '../pages/math/calculus/definite-integral/properties/ConstantMultipleProperty';
import IntegralAdditivityProperty from '../pages/math/calculus/definite-integral/properties/IntegralAdditivityProperty';
import SignPreservingProperty from '../pages/math/calculus/definite-integral/properties/SignPreservingProperty';

// 数学模块 - Calculus / Integral Function
import IntegralFunction from '../pages/math/calculus/IntegralFunction';
import GeometricMeaning from '../pages/math/calculus/integral-function/GeometricMeaning';
import FundamentalTheorem from '../pages/math/calculus/integral-function/anti-derivative/FundamentalTheorem';

// 数学模块 - Taylor Formula and Lagrange
import PolynomialApproximation from '../pages/math/taylor-formula/PolynomialApproximation';
import TaylorPolynomial from '../pages/math/taylor-formula/TaylorPolynomial';
import LagrangeMultiplier from '../pages/math/taylor-formula/LagrangeMultiplier';

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
        <Route path="/mathematics/1-fundamentals/gradient" element={<Gradient />} />

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
        <Route path="/mathematics/1-fundamentals/derivative/reciprocal-rule" element={<ReciprocalRule />} />
        <Route path="/mathematics/1-fundamentals/derivative/quotient-rule" element={<QuotientRule />} />
        <Route path="/mathematics/1-fundamentals/derivative/chain-rule" element={<ChainRule />} />

        {/* 数学模块 - Gradient / Partial Derivative 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/1-fundamentals/gradient/partial-derivative/unary" element={<MotivationUnary />} />
        <Route path="/mathematics/1-fundamentals/gradient/partial-derivative/binary" element={<MotivationBinary />} />
        <Route path="/mathematics/1-fundamentals/gradient/partial-derivative" element={<PartialDerivativePage />} />
        <Route path="/mathematics/1-fundamentals/gradient/directional-derivative" element={<DirectionalDerivative />} />
        <Route path="/mathematics/1-fundamentals/gradient/gradient-vector" element={<GradientVector />} />

        {/* 数学模块 - Calculus / Summation 主页面 */}
        <Route path="/mathematics/2-calculus/summation" element={<Summation />} />

        {/* 数学模块 - Calculus / Summation 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/2-calculus/summation/area-under-curve" element={<AreaUnderCurve />} />
        <Route path="/mathematics/2-calculus/summation/riemann-sum" element={<RiemannSum />} />

        {/* 数学模块 - Calculus / Differential 主页面 */}
        <Route path="/mathematics/2-calculus/differential" element={<Differential />} />

        {/* 数学模块 - Calculus / Differential 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/2-calculus/differential/geometric-meaning" element={<GeometricMeaningOfDifferential />} />

        {/* 数学模块 - Calculus / Definite Integral 主页面 */}
        <Route path="/mathematics/2-calculus/definite-integral" element={<DefiniteIntegral />} />

        {/* 数学模块 - Calculus / Definite Integral 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/2-calculus/definite-integral/definition-via-limit" element={<IntegralDefinitionViaLimit />} />
        <Route path="/mathematics/2-calculus/definite-integral/sum-or-difference" element={<SumOrDifferenceProperty />} />
        <Route path="/mathematics/2-calculus/definite-integral/constant-multiple" element={<ConstantMultipleProperty />} />
        <Route path="/mathematics/2-calculus/definite-integral/integral-additivity" element={<IntegralAdditivityProperty />} />
        <Route path="/mathematics/2-calculus/definite-integral/sign-preserving" element={<SignPreservingProperty />} />

        {/* 数学模块 - Calculus / Integral Function 主页面 */}
        <Route path="/mathematics/2-calculus/integral-function" element={<IntegralFunction />} />

        {/* 数学模块 - Calculus / Integral Function 四级子页面（不在菜单中显示） */}
        <Route path="/mathematics/2-calculus/integral-function/geometric-meaning" element={<GeometricMeaning />} />
        <Route path="/mathematics/2-calculus/integral-function/fundamental-theorem" element={<FundamentalTheorem />} />

        {/* 数学模块 - Taylor Formula and Lagrange */}
        <Route path="/mathematics/3-taylor-formula/polynomial-approximation" element={<PolynomialApproximation />} />
        <Route path="/mathematics/3-taylor-formula/taylor-polynomial" element={<TaylorPolynomial />} />
        <Route path="/mathematics/3-taylor-formula/lagrange-multiplier" element={<LagrangeMultiplier />} />

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

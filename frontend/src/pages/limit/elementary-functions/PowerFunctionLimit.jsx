import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '0.25rem'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    color: white;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const ContentLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ControlsPanel = styled.div`
  flex: 0 0 350px;
  min-width: 300px;
`;

const PlotPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme?.colors?.inputBg || '#334155'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
`;

const Formula = styled.code`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 18px;
  font-family: 'Courier New', monospace;
  display: block;
  line-height: 1.8;
  font-weight: bold;
`;

/**
 * Power Function Limit - f(x) = a·xⁿ
 *
 *   n > 0:  lim(x→0)   a·xⁿ = 0
 *   n = 0:  f(x) = a (constant), limit everywhere = a
 *   n < 0:  lim(x→±∞) a·xⁿ = 0
 */
const PowerFunctionLimit = () => {
  const navigate = useNavigate();

  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,       // 系数 a
    exponent: -1,         // 指数 n (默认 -1，与原倒函数一致)
    xRange: [-10, 10],    // X轴范围
    plotStyle: 'medium',  // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 判断 n 是否为整数（或接近整数）
  const isIntegerExp = Math.abs(params.exponent - Math.round(params.exponent)) < 1e-9;

  // 生成连续函数数据
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-10, 10];
    const a = params.coefficient || 1;
    const n = params.exponent || -1;
    const integerExp = Math.abs(n - Math.round(n)) < 1e-9;
    const nRound = Math.round(n);
    const numPoints = 400;

    const traces = [];

    // 根据指数类型决定如何采样
    if (integerExp && nRound >= 0) {
      // ── 非负整数指数：全域定义，一条曲线 ──
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(a * Math.pow(x, nRound));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `${a.toFixed(1)}·x^${nRound}`,
        line: { color: '#6366f1', width: 2.5 }
      });
    } else if (integerExp && nRound < 0) {
      // ── 负整数指数：分两支（x<0 和 x>0），避免 x=0 ──
      // 负半轴
      if (xMin < 0) {
        const xN = [], yN = [];
        for (let i = 0; i <= numPoints / 2; i++) {
          const x = xMin + ((Math.min(0, xMax) - xMin) * i) / (numPoints / 2);
          if (Math.abs(x) > 0.01) {
            xN.push(x);
            yN.push(a * Math.pow(x, nRound));
          }
        }
        if (xN.length > 0) {
          traces.push({
            x: xN, y: yN, type: 'scatter', mode: 'lines',
            name: `${a.toFixed(1)}·x^${nRound}`,
            line: { color: '#6366f1', width: 2.5 }
          });
        }
      }
      // 正半轴
      if (xMax > 0) {
        const xP = [], yP = [];
        for (let i = 0; i <= numPoints / 2; i++) {
          const x = Math.max(0, xMin) + ((xMax - Math.max(0, xMin)) * i) / (numPoints / 2);
          if (Math.abs(x) > 0.01) {
            xP.push(x);
            yP.push(a * Math.pow(x, nRound));
          }
        }
        if (xP.length > 0) {
          traces.push({
            x: xP, y: yP, type: 'scatter', mode: 'lines',
            name: `${a.toFixed(1)}·x^${nRound}`,
            line: { color: '#6366f1', width: 2.5 }
          });
        }
      }
    } else if (n > 0) {
      // ── 正非整数指数：x ≥ 0 ──
      const xValues = [];
      const yValues = [];
      const start = Math.max(0, xMin);
      for (let i = 0; i <= numPoints; i++) {
        const x = start + ((xMax - start) * i) / numPoints;
        if (x >= 0) {
          xValues.push(x);
          yValues.push(a * Math.pow(x, n));
        }
      }
      if (xValues.length > 0) {
        traces.push({
          x: xValues, y: yValues, type: 'scatter', mode: 'lines',
          name: `${a.toFixed(1)}·x^${n.toFixed(1)}`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    } else {
      // ── 负非整数指数：x > 0 ──
      const xValues = [];
      const yValues = [];
      const start = Math.max(0.001, xMin);
      for (let i = 0; i <= numPoints; i++) {
        const x = start + ((xMax - start) * i) / numPoints;
        if (x > 0) {
          xValues.push(x);
          yValues.push(a * Math.pow(x, n));
        }
      }
      if (xValues.length > 0) {
        traces.push({
          x: xValues, y: yValues, type: 'scatter', mode: 'lines',
          name: `${a.toFixed(1)}·x^${n.toFixed(1)}`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // ✅ 极限参考线
    let limitValue;
    let limitLabel;
    if (n > 0) {
      limitValue = 0;
      limitLabel = 'lim(x→0): 0';
    } else if (n === 0) {
      limitValue = a;
      limitLabel = 'lim: ' + a.toFixed(1);
    } else {
      limitValue = 0;
      limitLabel = 'lim(x→±∞): 0';
    }

    const plotMin = Math.min(...traces.flatMap(t => t.y.filter(v => isFinite(v))), 0);
    const plotMax = Math.max(...traces.flatMap(t => t.y.filter(v => isFinite(v))), 1);
    const yPad = (plotMax - plotMin) * 0.15 || 1;

    traces.push({
      x: [xMin, xMax],
      y: [limitValue, limitValue],
      type: 'scatter',
      mode: 'lines',
      name: limitLabel,
      line: {
        color: '#ffd700',
        width: 2,
        dash: 'dash'
      }
    });

    // 指数 < 0 时显示垂直渐近线 x=0
    if (n < 0) {
      traces.push({
        x: [0, 0],
        y: [plotMin - yPad, plotMax + yPad],
        type: 'scatter',
        mode: 'lines',
        name: 'x = 0',
        line: {
          color: '#ef4444',
          width: 1.5,
          dash: 'dot'
        }
      });
    }

    return traces;
  }, [params]);

  // 参数配置
  const functionConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.5,
      max: 5,
      step: 0.1,
      type: 'slider'
    },
    {
      name: 'exponent',
      label: 'Exponent (n)',
      min: -3,
      max: 3,
      step: 0.1,
      type: 'slider'
    }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -10,
      max: 10,
      step: 1,
      default: [-10, 10]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig
  ];

  const a = params.coefficient;
  const n = params.exponent;

  // 指数显示格式
  const expDisplay = isIntegerExp ? String(Math.round(n)) : n.toFixed(1);

  // 极限描述
  let limitDesc;
  if (n > 0) {
    limitDesc = `As x → 0, f(x) → 0`;
  } else if (n === 0) {
    limitDesc = `f(x) = ${a.toFixed(1)} (constant) — limit everywhere = ${a.toFixed(1)}`;
  } else {
    limitDesc = `As x → ±∞, f(x) → 0`;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Elementary Function: Power Function</SectionTitle>
      </Header>

      <SectionDescription>
        Explore how power functions behave at their limits. The exponent n determines whether
        the function converges to 0 as x → 0 (n &gt; 0) or as x → ±∞ (n &lt; 0).
      </SectionDescription>

      <SectionTitle>Function: y = a·x<sup>n</sup></SectionTitle>

      <FormulaBox>
        <Formula>
          f(x) = {a.toFixed(1)}·x<sup>{expDisplay}</sup><br/>
          {limitDesc}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {n > 0 && `With n = ${n.toFixed(1)} > 0, the function passes through the origin.
          As x → 0, f(x) → 0. Adjust the coefficient and exponent to see different power-law behaviors.`}
        {n === 0 && 'The exponent is zero, so f(x) is constant. The limit equals the constant value everywhere.'}
        {n < 0 && `With n = ${n.toFixed(1)} < 0, the function has a vertical asymptote at x = 0.
          As x → ±∞, f(x) → 0. This is the reciprocal-like behavior.`}
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={functionConfig}
            />
          </ParameterSection>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = ${a.toFixed(1)}·x^${expDisplay}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default PowerFunctionLimit;

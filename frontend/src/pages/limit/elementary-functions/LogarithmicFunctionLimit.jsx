import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';

const SUBSCRIPT_MAP = {
  '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
  '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089',
  'e': '\u2091'
};
const toSub = (s) => String(s).split('').map(c => SUBSCRIPT_MAP[c] || c).join('');

// Format base for display: integer uses subscript ("₂"), decimal uses "_{3.5}" notation
const fmtBaseDisplay = (b) => {
  const isE = Math.abs(b - Math.E) < 1e-9;
  if (isE) return { raw: 'e', sub: toSub('e'), short: 'e' };
  const intVal = Math.round(b);
  const isInt = Math.abs(b - intVal) < 1e-9;
  if (isInt) {
    const raw = String(intVal);
    return { raw, sub: toSub(raw), short: raw };
  }
  const raw = b.toFixed(1);
  // decimal bases: use subscript for digits, keep '.' as regular period
  const sub = String(raw).split('').map(c => SUBSCRIPT_MAP[c] || c).join('');
  return { raw, sub, short: raw };
};

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

const QuickSetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94a3b8'};
`;

const QuickBtn = styled.button`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
  cursor: pointer;
  font-size: 13px;
  font-family: monospace;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    color: #fff;
  }
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
 * Logarithmic Function Limit - y = log_b(x), lim(x→0⁺) = -∞, lim(x→+∞) = +∞
 */
const LogarithmicFunctionLimit = () => {
  const navigate = useNavigate();

  // 参数状态
  const [params, setParams] = useState({
    base: 2,             // 底数 b
    xRange: [0.01, 8],   // X轴范围（log 定义域为 x > 0）
    plotStyle: 'medium',  // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成连续函数数据（注意：定义域 x > 0）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [0.01, 8];
    const base = params.base || 2;
    const numPoints = 200;
    const bd = fmtBaseDisplay(base);

    const xValues = [];
    const yValues = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      if (x <= 0) continue;
      xValues.push(x);
      yValues.push(Math.log(x) / Math.log(base));
    }

    const traces = [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: `log${bd.sub}(x)`,
      line: {
        color: '#6366f1',
        width: 2.5
      }
    }];

    // ✅ 添加水平趋向参考线（y=0）
    traces.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'y = 0',
      line: {
        color: '#ffd700',
        width: 1.5,
        dash: 'dash'
      }
    });

    return traces;
  }, [params]);

  // 参数配置
  const baseConfig = [
    {
      name: 'base',
      label: 'Base (b)',
      min: 0.3,
      max: 5,
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
      min: 0.01,
      max: 10,
      step: 0.5,
      default: [0.01, 8]
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

  const b = params.base;
  const bd = fmtBaseDisplay(b);
  const baseLabel = bd.raw;
  const baseForDisplay = b;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Logarithmic — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Observe how the logarithmic function behaves as x approaches 0⁺ and +∞.
        Notice the vertical asymptote at x = 0 and the function's unbounded growth as x → +∞.
      </SectionDescription>

      <SectionTitle>Function: y = log<sub>b</sub>(x)</SectionTitle>

      <FormulaBox>
        <Formula>
          f(x) = log<sub>{baseLabel}</sub>(x)<br/>
          As x → 0⁺, f(x) → −∞ &nbsp;|&nbsp; As x → +∞, f(x) → +∞
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {params.base > 1
          ? 'The function increases monotonically for b > 1. As x approaches 0 from the right, the function dives to −∞ along the vertical asymptote.'
          : 'The function decreases monotonically for 0 < b < 1. As x approaches 0 from the right, the function rises to +∞ along the vertical asymptote.'}
        {' '}Adjust the base (b) and X range to explore different behaviors.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={baseConfig}
            />
          </ParameterSection>

          <QuickSetRow>
            <span>Quick set:</span>
            <QuickBtn onClick={() => setParams(p => ({ ...p, base: Math.E }))}>
              b = e ({Math.E.toFixed(3)})
            </QuickBtn>
          </QuickSetRow>

          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* 只显示原函数图 */}
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Function: f(x) = log${bd.sub}(x)`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default LogarithmicFunctionLimit;

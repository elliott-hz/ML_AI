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

const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const ToggleBtn = styled.button`
  padding: 8px ${({ theme }) => theme?.spacing?.md || '1rem'};
  background: ${({ $active, theme }) => ($active ? (theme?.colors?.primary || '#6366f1') : 'transparent')};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? (theme?.colors?.primary || '#6366f1') : (theme?.colors?.inputBg || '#334155')};
  }
`;

/**
 * Inverse Trigonometric Limit - limits of arcsin(x), arccos(x), arctan(x)
 *
 *   arctan(x):  lim(x→±∞) arctan(x) = ±π/2  (horizontal asymptotes)
 *   arcsin(x):  lim(x→-1⁺) arcsin(x) = -π/2, lim(x→1⁻) arcsin(x) = π/2
 *   arccos(x):  lim(x→-1⁺) arccos(x) = π,   lim(x→1⁻) arccos(x) = 0
 */
const InverseTrigonometricLimit = () => {
  const navigate = useNavigate();

  // 参数状态
  const [params, setParams] = useState({
    coefficient: 1,        // 系数
    xRange: [-5, 5],       // X轴范围（默认适合 arctan）
    plotStyle: 'medium',   // Plot 样式档位
    aspectRatio: 'auto',   // 显示比例
    legendPosition: 'top-right'
  });

  const [activeFunction, setActiveFunction] = useState('arctan');

  // 生成连续函数数据
  const generateFunctionData = useCallback(() => {
    let [xMin, xMax] = params.xRange || [-5, 5];
    const a = params.coefficient || 1;
    const numPoints = 400;

    const traces = [];

    if (activeFunction === 'arctan') {
      // ── arctan(x): 全域定义，有水平渐近线 ──
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(a * Math.atan(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `${a.toFixed(1)}·arctan(x)`,
        line: { color: '#6366f1', width: 2.5 }
      });

      // 水平渐近线 ±a·π/2
      const asy = a * Math.PI / 2;
      traces.push({
        x: [xMin, xMax], y: [asy, asy], type: 'scatter', mode: 'lines',
        name: `lim(x→+∞): +${asy.toFixed(2)}`,
        line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
      traces.push({
        x: [xMin, xMax], y: [-asy, -asy], type: 'scatter', mode: 'lines',
        name: `lim(x→-∞): ${(-asy).toFixed(2)}`,
        line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
    } else if (activeFunction === 'arcsin') {
      // ── arcsin(x): 定义域 [-1, 1] ──
      xMin = Math.max(-1, xMin);
      xMax = Math.min(1, xMax);
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(a * Math.asin(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `${a.toFixed(1)}·arcsin(x)`,
        line: { color: '#6366f1', width: 2.5 }
      });

      // 边界极限值
      const upper = a * Math.PI / 2;
      const lower = -a * Math.PI / 2;
      // 垂直边界线 x = -1
      traces.push({
        x: [-1, -1], y: [lower - 0.3, lower + 0.3], type: 'scatter', mode: 'lines',
        name: `lim(x→-1⁺): ${lower.toFixed(2)}`,
        line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
      // 垂直边界线 x = 1
      traces.push({
        x: [1, 1], y: [upper - 0.3, upper + 0.3], type: 'scatter', mode: 'lines',
        name: `lim(x→1⁻): ${upper.toFixed(2)}`,
        line: { color: '#ffd700', width: 2, dash: 'dash' }
      });

      // x=0 参考线
      traces.push({
        x: [-1, 1], y: [0, 0], type: 'scatter', mode: 'lines',
        name: 'y = 0',
        line: { color: 'rgba(148,163,184,0.4)', width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
    } else {
      // ── arccos(x): 定义域 [-1, 1] ──
      xMin = Math.max(-1, xMin);
      xMax = Math.min(1, xMax);
      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + ((xMax - xMin) * i) / numPoints;
        xValues.push(x);
        yValues.push(a * Math.acos(x));
      }
      traces.push({
        x: xValues, y: yValues, type: 'scatter', mode: 'lines',
        name: `${a.toFixed(1)}·arccos(x)`,
        line: { color: '#6366f1', width: 2.5 }
      });

      // 边界极限值
      const upper = a * Math.PI;
      const lower = 0;
      // 垂直边界线
      traces.push({
        x: [-1, -1], y: [upper - 0.3, upper + 0.3], type: 'scatter', mode: 'lines',
        name: `lim(x→-1⁺): ${(a * Math.PI).toFixed(2)}`,
        line: { color: '#ffd700', width: 2, dash: 'dash' }
      });
      traces.push({
        x: [1, 1], y: [-0.3, 0.3], type: 'scatter', mode: 'lines',
        name: `lim(x→1⁻): 0`,
        line: { color: '#ffd700', width: 2, dash: 'dash' }
      });

      // x=0 参考线
      traces.push({
        x: [-1, 1], y: [0, 0], type: 'scatter', mode: 'lines',
        name: 'y = 0',
        line: { color: 'rgba(148,163,184,0.4)', width: 1, dash: 'dot' },
        hoverinfo: 'skip', showlegend: false
      });
    }

    return traces;
  }, [params, activeFunction]);

  // 参数配置
  const coefficientConfig = [
    {
      name: 'coefficient',
      label: 'Coefficient (a)',
      min: 0.5,
      max: 5,
      step: 0.1,
      type: 'slider'
    }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = (() => {
    if (activeFunction === 'arctan') {
      return [{
        name: 'xRange',
        label: 'X Range',
        type: 'range',
        min: -10,
        max: 10,
        step: 1,
        default: [-5, 5]
      }];
    }
    // arcsin / arccos: 固定范围 [-1, 1]，使用虚拟 range 控件（不可调的显示）
    return [{
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -1,
      max: 1,
      step: 0.1,
      default: [-1, 1]
    }];
  })();

  const viewRangeExtra = [
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
  ];

  const legendPositionConfig = [
    { name: 'legendPosition', label: 'Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
  ];

  const commonParamsConfig = [
    ...legendPositionConfig,
    ...plotStyleConfig,
    ...viewRangeConfig,
    ...viewRangeExtra
  ];

  const a = params.coefficient;

  // 根据 activeFunction 生成显示内容
  const functionName = activeFunction === 'arctan' ? 'arctan' : activeFunction === 'arcsin' ? 'arcsin' : 'arccos';
  const fnDisplay = `${a.toFixed(1)}·${functionName}(x)`;

  let formulaLines;
  let description;

  if (activeFunction === 'arctan') {
    const asy = a * Math.PI / 2;
    formulaLines = [
      `f(x) = ${a.toFixed(1)}·arctan(x)`,
      `As x → +∞, f(x) → +${asy.toFixed(2)}`,
      `As x → -∞, f(x) → ${(-asy).toFixed(2)}`
    ];
    description = `The arctangent function has two horizontal asymptotes at y = ±${asy.toFixed(2)}.
      As x → +∞ the curve approaches the upper asymptote, and as x → -∞ it approaches the lower one.
      This is the classic S-shaped inverse tangent curve.`;
  } else if (activeFunction === 'arcsin') {
    const upper = a * Math.PI / 2;
    const lower = -a * Math.PI / 2;
    formulaLines = [
      `f(x) = ${a.toFixed(1)}·arcsin(x)`,
      `As x → -1⁺, f(x) → ${lower.toFixed(2)}`,
      `As x → 1⁻,  f(x) → ${upper.toFixed(2)}`
    ];
    description = `The arcsin function is defined only on the domain x ∈ [-1, 1].
      At x = -1, the function reaches its minimum ${lower.toFixed(2)}, and at x = 1, its maximum ${upper.toFixed(2)}.
      These are the endpoint limits of the function.`;
  } else {
    const upper = a * Math.PI;
    formulaLines = [
      `f(x) = ${a.toFixed(1)}·arccos(x)`,
      `As x → -1⁺, f(x) → ${upper.toFixed(2)}`,
      `As x → 1⁻,  f(x) → 0`
    ];
    description = `The arccos function is defined on the domain x ∈ [-1, 1].
      Unlike arcsin, it decreases from ${upper.toFixed(2)} at x = -1 to 0 at x = 1.
      It is a decreasing function with finite endpoint limits.`;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>Inverse Trig. — Limit Visualization</SectionTitle>
      </Header>

      <SectionDescription>
        Explore the limit behavior of inverse trigonometric functions. Each function approaches
        finite values at the boundaries of its domain.
      </SectionDescription>

      <SectionTitle>Function:</SectionTitle>

      <ToggleGroup>
        <ToggleBtn $active={activeFunction === 'arctan'} onClick={() => {
          setActiveFunction('arctan');
          setParams(p => ({ ...p, xRange: [-5, 5] }));
        }}>
          arctan(x)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arcsin'} onClick={() => {
          setActiveFunction('arcsin');
          setParams(p => ({ ...p, xRange: [-1, 1] }));
        }}>
          arcsin(x)
        </ToggleBtn>
        <ToggleBtn $active={activeFunction === 'arccos'} onClick={() => {
          setActiveFunction('arccos');
          setParams(p => ({ ...p, xRange: [-1, 1] }));
        }}>
          arccos(x)
        </ToggleBtn>
      </ToggleGroup>

      <FormulaBox>
        <Formula>
          {formulaLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < formulaLines.length - 1 && <br/>}
            </React.Fragment>
          ))}
        </Formula>
      </FormulaBox>

      <SectionDescription>
        {description}
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={coefficientConfig}
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
            xRange={activeFunction === 'arctan' ? params.xRange : [-1, 1]}
            title={`Function: f(x) = ${fnDisplay}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InverseTrigonometricLimit;

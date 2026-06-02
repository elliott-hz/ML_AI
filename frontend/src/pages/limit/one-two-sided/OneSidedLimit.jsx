import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter, { ASPECT_RATIO_OPTIONS } from '../../components/visualization/LimitPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';

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
 * One-Sided Limit - Piecewise function showing left and right limits are different
 * f(x) = { x-1, x < 0; 0, x = 0; x+1, x > 0 }
 */
const OneSidedLimit = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    xRange: [-2, 2],     // X轴范围（围绕x=0）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto',  // 显示比例 (auto, 16:9, 4:3)
    legendPosition: 'top-right'
  });

  // 生成连续函数数据（分段函数，不连接）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-2, 2];
    const numPoints = 100;
    
    const traces = [];
    
    // ✅ 先计算函数的 Y 范围，用于确定垂直辅助线的长度
    let minY = Infinity;
    let maxY = -Infinity;
    
    // 遍历 X 范围，计算函数的最小和最大值
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      if (Math.abs(x) > 0.01) { // 避免接近 0
        let y;
        if (x < 0) {
          y = x - 1; // f(x) = x-1 for x < 0
        } else {
          y = x + 1; // f(x) = x+1 for x > 0
        }
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    
    // 添加一些边距，确保辅助线稍微超出函数范围
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;
    
    // ✅ 第一部分：左半部分 f(x) = x - 1, x < 0
    if (xMin < 0) {
      const xValuesLeft = [];
      const yValuesLeft = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((Math.min(0, xMax) - xMin) * i) / (numPoints / 2);
        if (x < -0.01) { // 避免接近 0
          xValuesLeft.push(x);
          yValuesLeft.push(x - 1);
        }
      }
      
      if (xValuesLeft.length > 0) {
        traces.push({
          x: xValuesLeft,
          y: yValuesLeft,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x) = x-1 (x<0)',
          line: { 
            color: '#6366f1', 
            width: 2.5
          }
        });
      }
    }
    
    // ✅ 第二部分：右半部分 f(x) = x + 1, x > 0
    if (xMax > 0) {
      const xValuesRight = [];
      const yValuesRight = [];
      
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = Math.max(0, xMin) + ((xMax - Math.max(0, xMin)) * i) / (numPoints / 2);
        if (x > 0.01) { // 避免接近 0
          xValuesRight.push(x);
          yValuesRight.push(x + 1);
        }
      }
      
      if (xValuesRight.length > 0) {
        traces.push({
          x: xValuesRight,
          y: yValuesRight,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x) = x+1 (x>0)',
          line: { 
            color: '#6366f1', 
            width: 2.5
          }
        });
      }
    }
    
    // ✅ 添加垂直辅助线（x=0，跳跃点）- 使用动态计算的 Y 范围
    traces.push({
      x: [0, 0],
      y: [auxYMin, auxYMax],
      type: 'scatter',
      mode: 'lines',
      name: 'x=0',
      line: { 
        color: '#ffd700', // 金黄色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    // ✅ 添加左极限点 (0, -1)
    traces.push({
      x: [0],
      y: [-1],
      type: 'scatter',
      mode: 'markers+text',
      name: 'Left limit',
      marker: { 
        size: 10, 
        color: '#ef4444', // 红色
        symbol: 'circle-open'
      },
      text: ['Left: -1'],
      textposition: 'bottom right',
      textfont: {
        size: 12,
        color: '#ef4444'
      }
    });
    
    // ✅ 添加右极限点 (0, 1)
    traces.push({
      x: [0],
      y: [1],
      type: 'scatter',
      mode: 'markers+text',
      name: 'Right limit',
      marker: { 
        size: 10, 
        color: '#10b981', // 绿色
        symbol: 'circle-open'
      },
      text: ['Right: +1'],
      textposition: 'top right',
      textfont: {
        size: 12,
        color: '#10b981'
      }
    });
    
    return traces;
  }, [params]);

  // 参数配置
  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
  ];

  const viewRangeConfig = [
    {
      name: 'xRange',
      label: 'X Range',
      type: 'range',
      min: -5,
      max: 5,
      step: 0.5,
      default: [-2, 2]
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

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
           Back to Limit
        </BackButton>
        <SectionTitle>One-Sided Limit</SectionTitle>
      </Header>

      <SectionDescription>
        Explore one-sided limits using a piecewise function.
        Observe how the left-hand limit and right-hand limit approach different values as x → 0.
      </SectionDescription>

      <SectionTitle>Piecewise Function Example</SectionTitle>

      <FormulaBox>
        <Formula>
          f(x) = &#123;<br/>
          &nbsp;&nbsp;x - 1, &nbsp;&nbsp;x &lt; 0<br/>
          &nbsp;&nbsp;0, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x = 0<br/>
          &nbsp;&nbsp;x + 1, &nbsp;&nbsp;x &gt; 0<br/>
          &#125;
        </Formula>
      </FormulaBox>

      <SectionDescription>
        <strong>Left-hand limit:</strong> lim<sub>x→0⁻</sub> f(x) = -1 (using x - 1)<br/>
        <strong>Right-hand limit:</strong> lim<sub>x→0⁺</sub> f(x) = +1 (using x + 1)<br/><br/>
        Since the left and right limits are <strong>not equal</strong>, the two-sided limit does not exist at x = 0.
      </SectionDescription>

      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="General Settings">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={commonParamsConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          {/* 显示原函数图，带辅助线和关键点（分段函数不连接） */}
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Piecewise Function: Left ≠ Right Limit`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default OneSidedLimit;

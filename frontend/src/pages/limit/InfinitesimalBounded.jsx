import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LimitPlotter from '../../components/visualization/LimitPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => `${theme?.spacing?.sm || '0.5rem'} ${theme?.spacing?.md || '1rem'}`};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateX(-2px);
  }
`;

const SectionTitle = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
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

/**
 * Infinitesimal Property 2: Bounded Function × Infinitesimal
 * Shows that cos(x)·x → 0 as x → 0
 */
const InfinitesimalBounded = () => {
  const navigate = useNavigate();
  
  // 参数状态
  const [params, setParams] = useState({
    xRange: [-3, 3],     // X轴范围（围绕x=0）
    plotStyle: 'medium', // Plot 样式档位
    aspectRatio: 'auto'  // 显示比例 (auto, 16:9, 4:3)
  });

  // 生成连续函数数据（多条曲线）
  const generateFunctionData = useCallback(() => {
    const [xMin, xMax] = params.xRange || [-3, 3];
    const numPoints = 200;
    
    const traces = [];
    
    // ✅ 先计算所有曲线的 Y 范围，用于确定辅助线的长度
    let minY = Infinity;
    let maxY = -Infinity;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      const yCos = Math.cos(x);
      const yX = x;
      const yProduct = Math.cos(x) * x;
      
      if (yCos < minY) minY = yCos;
      if (yCos > maxY) maxY = yCos;
      if (yX < minY) minY = yX;
      if (yX > maxY) maxY = yX;
      if (yProduct < minY) minY = yProduct;
      if (yProduct > maxY) maxY = yProduct;
    }
    
    // 添加一些边距，确保辅助线稍微超出函数范围
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;
    
    // ✅ 曲线1：有界函数 f(x) = cos(x) - 蓝色虚线
    const xValuesCos = [];
    const yValuesCos = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesCos.push(x);
      yValuesCos.push(Math.cos(x));
    }
    
    traces.push({
      x: xValuesCos,
      y: yValuesCos,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x) = cos(x)',
      line: { 
        color: '#6366f1', // 蓝色
        width: 2.5,
        dash: 'dash' // 虚线，表示有界函数
      }
    });
    
    // ✅ 曲线2：无穷小 α(x) = x - 绿色实线
    const xValuesX = [];
    const yValuesX = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesX.push(x);
      yValuesX.push(x);
    }
    
    traces.push({
      x: xValuesX,
      y: yValuesX,
      type: 'scatter',
      mode: 'lines',
      name: 'α(x) = x',
      line: { 
        color: '#10b981', // 绿色
        width: 2.5
      }
    });
    
    // ✅ 曲线3：乘积 g(x) = cos(x)·x - 红色实线（主要曲线）
    const xValuesProduct = [];
    const yValuesProduct = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      xValuesProduct.push(x);
      yValuesProduct.push(Math.cos(x) * x);
    }
    
    traces.push({
      x: xValuesProduct,
      y: yValuesProduct,
      type: 'scatter',
      mode: 'lines',
      name: 'g(x) = cos(x)·x',
      line: { 
        color: '#ef4444', // 红色（突出显示）
        width: 3
      }
    });
    
    // ✅ 添加垂直辅助线（x=0）- 使用动态计算的 Y 范围
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
    
    // ✅ 添加水平辅助线（y=0，极限值）
    traces.push({
      x: [xMin, xMax],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'lim: 0',
      line: { 
        color: '#ffd700', // 金黄色
        width: 2, 
        dash: 'dash' 
      }
    });
    
    // ✅ 添加极限点 (0, 0)
    traces.push({
      x: [0],
      y: [0],
      type: 'scatter',
      mode: 'markers+text',
      name: 'Limit',
      marker: { 
        size: 12, 
        color: '#ef4444', // 红色
        symbol: 'circle'
      },
      text: ['lim = 0'],
      textposition: 'top center',
      textfont: {
        size: 14,
        color: '#ef4444',
        family: 'Arial, sans-serif'
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
      default: [-3, 3]
    },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3'] }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/limit')}>
          ← Back to Limit
        </BackButton>
        <SectionTitle>Infinitesimal Property 2: Bounded × Infinitesimal</SectionTitle>
      </Header>
      
      <SectionDescription>
        A bounded function multiplied by an infinitesimal is still an infinitesimal. 
        Observe how cos(x) oscillates between -1 and 1 (bounded), but when multiplied by x 
        (which approaches 0), the product also approaches 0.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          If f(x) = cos(x) is bounded: |cos(x)| ≤ 1<br/>
          And α(x) = x is infinitesimal: lim<sub>x→0</sub> x = 0<br/><br/>
          Then g(x) = f(x)·α(x) = cos(x)·x<br/><br/>
          lim<sub>x→0</sub> g(x) = lim<sub>x→0</sub>(cos(x)·x) = 0
        </Formula>
      </FormulaBox>
      
      <ContentLayout>
        <ControlsPanel>
          {/* 参数分组 */}
          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={plotStyleConfig}
            />
          </ParameterSection>

          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={viewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>
        
        <PlotPanel>
          <LimitPlotter
            data={generateFunctionData()}
            xRange={params.xRange}
            title={`Bounded × Infinitesimal: cos(x)·x`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default InfinitesimalBounded;

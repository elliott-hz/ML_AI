# 页面布局标准模板 (Page Layout Templates)

本文档定义了项目中所有页面的标准布局结构，作为开发新页面的参考模板。

---

## 📋 目录

1. [Main Page (主页面) 模板](#1-main-page-主页面-模板)
2. [Subpage (子页面) 模板](#2-subpage-子页面-模板)
3. [参数控制区域规范](#3-参数控制区域规范)
4. [绘图组件 Props 规范](#4-绘图组件-props-规范)
5. [主题兼容性要求](#5-主题兼容性要求)
6. [快速检查清单](#6-快速检查清单)

---

## 1. Main Page (主页面) 模板

### 适用场景
- Dashboard / 概览页面
- 功能导航页面
- 示例：`Home.jsx`, `BasicFunction.jsx`, `Limit.jsx`

### 标准代码结构

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// ========== Styled Components ==========

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--theme-text-primary);
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: var(--theme-text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
`;

// ========== Component ==========

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Header 区域 */}
      <Header>
        <Title>页面标题</Title>
        <Description>
          页面描述文本，简要说明本页面的功能和内容。
        </Description>
      </Header>

      {/* 内容卡片网格 */}
      <CardGrid>
        <FeatureCard onClick={() => navigate('/path/to/subpage')}>
          <CardTitle>功能卡片标题</CardTitle>
          <CardDescription>功能描述文本</CardDescription>
        </FeatureCard>
        
        {/* 更多卡片... */}
      </CardGrid>
    </PageContainer>
  );
};

export default MainPage;
```

### 关键要素说明

| 组件 | 用途 | 注意事项 |
|------|------|----------|
| `PageContainer` | 最外层容器 | 设置 `max-width` 和 `padding` |
| `Header` | 标题和描述区域 | 包含 `Title` 和 `Description` |
| `CardGrid` | 响应式卡片网格 | 使用 CSS Grid，自动适配屏幕宽度 |
| `FeatureCard` | 功能卡片 | 带 hover 效果和点击跳转 |

---

## 2. Subpage (子页面) 模板

### 适用场景
- 详细功能展示页面
- 交互式可视化页面
- 示例：`PiecewiseFunctions.jsx`, `ConvergentSequence1.jsx`

### 标准代码结构

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter from '../../components/visualization/FunctionPlotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';

// ========== Styled Components ==========

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--theme-button-bg);
  color: var(--theme-button-text);
  border: 1px solid var(--theme-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background: var(--theme-button-hover);
  }
`;

const SectionTitle = styled.h1`
  font-size: 1.8rem;
  color: var(--theme-text-primary);
  flex: 1;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FormulaBox = styled.div`
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Formula = styled.div`
  font-size: 1.2rem;
  color: var(--theme-text-primary);
  font-family: 'Courier New', monospace;
  text-align: center;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ControlsPanel = styled.div`
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
`;

const PlotPanel = styled.div`
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  padding: 1.5rem;
`;

// ========== Component ==========

const Subpage = () => {
  const navigate = useNavigate();
  
  // 1. 状态管理
  const [params, setParams] = useState({
    coefficient: 1,      // 函数系数
    plotStyle: 'medium', // Plot 样式 (thin/medium/thick)
    xRange: [-10, 10],   // 视图范围
  });

  // 2. 参数配置
  const coefficientConfig = [
    { name: 'coefficient', label: 'Coefficient (a)', min: 0.1, max: 5, step: 0.1 }
  ];

  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick'] }
  ];

  const viewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-10, 10] }
  ];

  return (
    <PageContainer>
      {/* 1. Header 区域 */}
      <Header>
        <BackButton onClick={() => navigate('/parent/page/path')}>
          ← Back to Parent Page
        </BackButton>
        <SectionTitle>子页面标题</SectionTitle>
      </Header>

      {/* 2. 描述区域 */}
      <SectionDescription>
        页面功能描述，解释本页面的数学概念或功能特性。
      </SectionDescription>

      {/* 3. 公式展示区域（可选） */}
      <FormulaBox>
        <Formula>
          f(x) = a·x² + b·x + c
        </Formula>
      </FormulaBox>

      {/* 4. 主要内容区域：左侧控制面板 + 右侧绘图区域 */}
      <ContentLayout>
        {/* 左侧：参数控制面板 */}
        <ControlsPanel>
          {/* 分组 1: Function Coefficients */}
          <ParameterSection title="Function Coefficients">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={coefficientConfig}
            />
          </ParameterSection>

          {/* 分组 2: Plot Style（所有 Plot 必须包含） */}
          <ParameterSection title="Plot Style">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={plotStyleConfig}
            />
          </ParameterSection>

          {/* 分组 3: Auxiliary Lines（仅当有辅助线时显示） */}
          {/* <ParameterSection title="Auxiliary Lines">
            <ParameterControls ... />
          </ParameterSection> */}

          {/* 分组 4: View Range（所有 Plot 必须包含） */}
          <ParameterSection title="View Range">
            <ParameterControls
              parameters={params}
              onChange={setParams}
              config={viewRangeConfig}
            />
          </ParameterSection>
        </ControlsPanel>

        {/* 右侧：绘图区域 */}
        <PlotPanel>
          <FunctionPlotter
            functionType="example"
            parameters={params}
            yRange={[-10, 10]}
            title="Example Function"
            showExportButton={false}
            plotStyle={params.plotStyle}  // 传递 plotStyle
          />
          
          {/* 可选：额外的对比图表 */}
          {/* <div style={{ marginTop: '1rem' }}>
            <FunctionPlotter ... />
          </div> */}
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default Subpage;
```

### 布局结构示意图

```
┌─────────────────────────────────────────────┐
│  PageContainer                               │
│  ┌───────────────────────────────────────┐  │
│  │  Header                                │  │
│  │  [← Back Button]  [Section Title]     │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  SectionDescription                    │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  FormulaBox (Optional)                 │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  ContentLayout                         │  │
│  │  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │Controls  │  │   PlotPanel      │  │  │
│  │  │Panel     │  │                  │  │  │
│  │  │(350px)   │  │  FunctionPlotter │  │  │
│  │  │          │  │                  │  │  │
│  │  │• Func    │  │                  │  │  │
│  │  │• Style   │  │                  │  │  │
│  │  │• Aux     │  │                  │  │  │
│  │  │• View    │  │                  │  │  │
│  │  └──────────┘  └──────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 3. 参数控制区域规范

### 标准分组顺序

所有子页面的参数控制区域必须按以下顺序组织（**仅展示实际存在的组**）：

#### 1️⃣ Function Coefficients (函数系数)
- **条件**: 当 Plot 包含函数系数时显示
- **内容**: `a`, `b`, `c`, `n`, `base`, `slope`, `offset` 等系数调整
- **示例配置**:
  ```javascript
  const coefficientConfig = [
    { name: 'a', label: 'Amplitude (a)', min: 0.1, max: 5, step: 0.1 },
    { name: 'b', label: 'Frequency (b)', min: 0.1, max: 5, step: 0.1 }
  ];
  ```

#### 2️⃣ Plot Style (全局样式) - **必须包含**
- **条件**: 所有 Plot 组件必须包含此分组
- **内容**: 一键切换细/中/粗三种样式档位
- **固定配置**:
  ```javascript
  const plotStyleConfig = [
    { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick'] }
  ];
  ```
- **效果**: 同时影响函数线、辅助线、散点大小、字体大小

#### 3️⃣ Auxiliary Lines (辅助线) - **条件性显示**
- **条件**: 仅当 Plot 中包含辅助点或辅助线元素时显示
- **内容**: Sample Point, Point Size, Line Color, Line Width, Line Type
- **示例配置**:
  ```javascript
  const auxiliaryConfig = [
    { name: 'samplePoint', label: 'Sample Point (x)', min: 0.5, max: 4, step: 0.1 },
    { name: 'pointSize', label: 'Point Size', min: 5, max: 20, step: 1 }
  ];
  ```

#### 4️⃣ View Range (视图范围) - **必须包含**
- **条件**: 所有 Plot 组件必须包含此分组
- **内容**: X Range (或 maxN for sequences)
- **示例配置**:
  ```javascript
  const viewRangeConfig = [
    { name: 'xRange', label: 'X Range', type: 'range', min: -20, max: 20, step: 1, default: [-10, 10] }
  ];
  ```

### 实施原则

✅ **动态显示**: 仅展示当前页面实际使用的参数组，避免空白卡片  
✅ **统一命名**: 所有子页面使用上述标准英文标题  
✅ **组件化**: 使用 `ParameterSection` 组件包裹每个分组  
✅ **顺序一致**: 严格按照上述顺序排列分组  

---

## 4. 绘图组件 Props 规范

### FunctionPlotter Props

```typescript
interface FunctionPlotterProps {
  functionType: string;              // 函数类型标识 (e.g., 'odd', 'even', 'periodic')
  parameters: object;                // 动态参数对象
  xRange?: [number, number];         // X轴范围（可选，默认从 parameters 读取）
  yRange: [number, number];          // Y轴范围（必须）
  title: string;                     // 图表标题
  showExportButton?: boolean;        // 是否显示导出按钮（默认 true）
  plotStyle: 'thin' | 'medium' | 'thick';  // 全局样式档位（必须）
}
```

### SequencePlotter Props

```typescript
interface SequencePlotterProps {
  sequenceType: string;              // 数列类型标识 (e.g., 'convergent1', 'divergent2')
  parameters: object;                // 动态参数对象
  xRange?: [number, number];         // X轴范围（可选）
  yRange?: [number, number];         // Y轴范围（可选，自动计算）
  title: string;                     // 图表标题
  showLimitLine?: boolean;           // 是否显示极限线（收敛数列）
  limitValue?: number;               // 极限值（收敛数列）
  showOriginalFunction?: boolean;    // 是否显示原函数对比
  plotStyle: 'thin' | 'medium' | 'thick';  // 全局样式档位（必须）
}
```

### 使用示例

```jsx
// FunctionPlotter 示例
<FunctionPlotter
  functionType="periodic"
  parameters={params}
  yRange={[-6, 6]}
  title="Periodic Function: f(x) = a·sin(bx + c)"
  showExportButton={false}
  plotStyle={params.plotStyle}
/>

// SequencePlotter 示例
<SequencePlotter
  sequenceType="convergent1"
  parameters={params}
  plotStyle={params.plotStyle}
  title={`Sequence: uₙ = 1/${params.base}ⁿ`}
  showLimitLine={true}
  limitValue={0}
/>
```

---

## 5. 主题兼容性要求

### CSS 变量使用规范

所有颜色必须使用 CSS 变量，禁止硬编码颜色值：

| CSS 变量 | 用途 | 示例 |
|----------|------|------|
| `--theme-text-primary` | 主要文本颜色 | 标题、重要信息 |
| `--theme-text-secondary` | 次要文本颜色 | 描述、说明文字 |
| `--theme-card-bg` | 卡片背景色 | ControlsPanel, PlotPanel |
| `--theme-border` | 边框颜色 | 所有容器边框 |
| `--theme-button-bg` | 按钮背景色 | BackButton, 操作按钮 |
| `--theme-button-text` | 按钮文本颜色 | 按钮文字 |
| `--theme-button-hover` | 按钮悬停背景 | hover 状态 |

### Plotly 图表主题处理

⚠️ **重要**: Plotly 的 layout 配置对象**不支持**动态解析 CSS 变量字符串。

**正确做法**:
```javascript
const [themeMode, setThemeMode] = useState(() => {
  return localStorage.getItem('themeMode') || 'dark';
});

const isDark = themeMode === 'dark';

const layout = {
  xaxis: {
    tickfont: { 
      color: isDark ? '#94a3b8' : '#475569'  // 直接计算具体颜色值
    }
  }
};
```

**错误做法**:
```javascript
const layout = {
  xaxis: {
    tickfont: { 
      color: 'var(--theme-text-secondary)'  // ❌ Plotly 无法解析
    }
  }
};
```

### 主题切换监听

在可视化组件中必须监听主题变化并强制重绘：

```javascript
useEffect(() => {
  const handleThemeChange = () => {
    const newMode = localStorage.getItem('themeMode') || 'dark';
    setThemeMode(newMode);
  };

  const intervalId = setInterval(handleThemeChange, 100);
  return () => clearInterval(intervalId);
}, []);
```

---

## 6. 快速检查清单

创建新页面时，请逐项确认：

### ✅ Main Page 检查项
- [ ] 使用 `PageContainer` 作为最外层容器
- [ ] 包含 `Header`（标题 + 描述）
- [ ] 使用 `CardGrid` 实现响应式卡片布局
- [ ] 卡片具有 hover 效果和点击跳转功能
- [ ] 所有颜色使用 CSS 变量

### ✅ Subpage 检查项
- [ ] 包含 `BackButton` 返回父页面
- [ ] 使用两栏布局（`ControlsPanel` + `PlotPanel`）
- [ ] 响应式设计（小屏幕 <1024px 自动切换单栏）
- [ ] 参数控制区域按标准分组顺序
- [ ] 所有 Plot 组件接收 `plotStyle` 属性
- [ ] 所有颜色使用 CSS 变量
- [ ] 测试 Light/Dark 主题切换是否正常

### ✅ 代码质量检查项
- [ ] 导入语句完整且正确
- [ ] Styled Components 命名清晰（使用语义化名称）
- [ ] 状态管理合理（`useState`）
- [ ] 参数配置数组格式正确
- [ ] 无硬编码颜色值（除 Plotly 内部计算外）
- [ ] 注释清晰（特别是数学公式部分）
- [ ] 通过 `get_problems` 验证无语法错误

### ✅ 功能测试检查项
- [ ] 返回按钮能正确跳转到父页面
- [ ] 参数调整能实时更新图表
- [ ] Plot Style 切换能同步影响所有视觉元素
- [ ] 视图范围调整不会导致图表崩溃
- [ ] 导出功能（如启用）能正常工作
- [ ] 在不同屏幕尺寸下布局正常

---

## 7. 常见错误与最佳实践

### ❌ 错误做法 vs ✅ 正确做法

#### 布局结构

❌ **不要将所有内容放在一个外层容器中**
```jsx
<FunctionSection>
  <ControlsPanel>...</ControlsPanel>
  <PlotPanel>...</PlotPanel>
</FunctionSection>
```

✅ **ControlsPanel 和 PlotPanel 应该是兄弟节点**
```jsx
<ContentLayout>
  <ControlsPanel>...</ControlsPanel>
  <PlotPanel>...</PlotPanel>
</ContentLayout>
```

#### 颜色使用

❌ **不要硬编码颜色**
```jsx
color: '#6366f1'
background: '#ffffff'
```

✅ **使用 CSS 变量**
```jsx
color: var(--theme-text-primary)
background: var(--theme-card-bg)
```

#### Plot Style 传递

❌ **不要忘记传递 plotStyle**
```jsx
<FunctionPlotter parameters={params} />
```

✅ **始终传递 plotStyle**
```jsx
<FunctionPlotter parameters={params} plotStyle={params.plotStyle} />
```

#### 参数分组

❌ **不要混合所有参数在一个卡片中**
```jsx
<ParameterSection title="Parameters">
  <ParameterControls config={[...allParams]} />
</ParameterSection>
```

✅ **按功能分组**
```jsx
<ParameterSection title="Function Coefficients">
  <ParameterControls config={coefficientConfig} />
</ParameterSection>
<ParameterSection title="Plot Style">
  <ParameterControls config={plotStyleConfig} />
</ParameterSection>
```

---

## 8. 参考示例

### Main Page 示例文件
- `/frontend/src/pages/Home.jsx`
- `/frontend/src/pages/BasicFunction.jsx`
- `/frontend/src/pages/Limit.jsx`

### Subpage 示例文件
- `/frontend/src/pages/basic-function/PiecewiseFunctions.jsx`
- `/frontend/src/pages/basic-function/InverseFunctions.jsx`
- `/frontend/src/pages/basic-function/OddEvenFunctions.jsx`
- `/frontend/src/pages/basic-function/PeriodicFunctions.jsx`
- `/frontend/src/pages/basic-function/MonotonicityFunctions.jsx`
- `/frontend/src/pages/limit/ConvergentSequence1.jsx`
- `/frontend/src/pages/limit/ConvergentSequence2.jsx`
- `/frontend/src/pages/limit/DivergentSequence1.jsx`
- `/frontend/src/pages/limit/DivergentSequence2.jsx`

---

## 📝 更新记录

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2026-05-29 | 1.0 | 初始版本，定义 Main Page 和 Subpage 标准模板 |

---

**维护者**: AI Development Team  
**最后更新**: 2026-05-29

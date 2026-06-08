# AI Knowledge Management System - Frontend

## 📖 简介

AI 知识管理系统的前端应用，采用 React + Vite 构建，通过三级菜单架构组织数学、深度学习和机器学习等主题的知识内容。

## ⚙️ 技术栈

- **Framework**: React 18.x
- **Language**: JavaScript (ES6+)
- **Styling**: Styled Components
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Routing**: React Router v6

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/            # 共享 styled 布局组件 (LayoutStyled.js)
│   │   ├── layout/            # 全局布局
│   │   │   ├── Layout.jsx         # 主布局 (TopNav + Sidebar + MainContent)
│   │   │   ├── TopNav.jsx         # 顶部导航栏（L1 一级菜单 + L2 下拉）
│   │   │   ├── Sidebar.jsx        # 左侧边栏（L3 三级菜单，可折叠）
│   │   │   ├── MainContent.jsx    # 主内容区（自适应 sidebar 宽度）
│   │   │   └── BackButton.jsx     # 返回按钮（共享组件）
│   │   ├── visualization/     # 可视化 / 绘图组件
│   │   │   ├── FunctionPlotter.jsx          # 通用函数绘图器
│   │   │   ├── DerivativePlotter.jsx        # 导数专用绘图器
│   │   │   ├── LimitPlotter.jsx             # 极限专用绘图器
│   │   │   ├── ContinuityPlotter.jsx        # 连续性专用绘图器
│   │   │   ├── PartialDerivativePlotter.jsx # 偏导数绘图器 (2D)
│   │   │   ├── Plotter3D.jsx                # 通用 3D 场景绘图器 (surface/scatter3d/…)
│   │   │   ├── ParameterControls.jsx        # 参数控制面板 (滑块/输入框/下拉/开关)
│   │   │   ├── ParameterSection.jsx         # 参数分区容器
│   │   │   ├── Cube3D.jsx                   # 3D 立方体 (Plotly mesh3d, 定制)
│   │   │   └── Box3D.jsx                    # 3D 矩形盒 (Plotly mesh3d, 定制)
│   │   ├── derivative/        # 导数模块共享组件
│   │   ├── limit/shared/      # 极限模块共享 styled 布局
│   │   └── style/             # 导数模块共享 styled 布局 (DerivativeStyled)
│   ├── config/
│   │   ├── menuConfig.js      # 菜单配置入口 (re-export JSON)
│   │   └── menuConfig.json    # 菜单数据 (L1 → L2 → L3 树形结构)
│   ├── constants/             # 模块配置常量
│   │   ├── plotThemeConfig.js           # 绘图主题 (getPlotLayout, getTracePalette, ASPECT_RATIO_OPTIONS)
│   │   ├── basicFunctionConfig.js       # 基本函数模块配置
│   │   ├── limitConfig.js               # 极限模块配置
│   │   ├── continuityConfig.js          # 连续性模块配置
│   │   ├── derivativeConfig.js          # 导数模块配置
│   │   └── partialDerivativeConfig.js   # 偏导数模块配置
│   ├── hooks/
│   │   ├── useThemeMode.js    # 主题模式 hook (dark/light + 跨标签同步)
│   │   └── useSplitter.js     # 可拖拽分屏 hook (双图布局)
│   ├── pages/                 # 5 个知识模块 (共 ~44 个可视化子页面)
│   │   ├── basic-function/    # 基本函数 (11 子页面)
│   │   ├── limit/             # 极限     (13 子页面)
│   │   ├── continuity/        # 连续性   (4 子页面)
│   │   ├── derivative/        # 导数     (11 子页面)
│   │   └── partial-derivative/# 偏导数   (2 子页面)
│   ├── routes/
│   │   └── AppRoutes.jsx      # 路由定义 (扁平结构，虚拟层级路径)
│   ├── styles/
│   │   └── theme.js           # 主题配置 (darkTheme, lightTheme, GlobalStyle)
│   ├── utils/
│   │   └── annotationUtils.js # 绘图注释工具函数
│   ├── App.jsx                # 根组件 (ThemeProvider + BrowserRouter)
│   └── main.jsx               # 入口文件
├── public/
├── package.json
└── vite.config.js
```

---

## 🏗️ 架构模式

本项目采用**模块化知识可视化架构**，5 个数学模块（基本函数、极限、连续性、导数、偏导数）共享统一的设计模式。

### 三层 UI 模式

所有 ~44 个子页面均采用以下三种 UI 模式之一：

#### 1. StandardSinglePlot — 标准单图模式

```
┌─────────────────────────────────────────┐
│  Header (BackButton + Title)            │
├─────────────────────────────────────────┤
│  FormulaBox (公式 / 定义)                │
├────────────────┬────────────────────────┤
│  ControlsPanel │  PlotPanel             │
│  (350px 固定)  │  (flex: 1)             │
│                │                        │
│  ParameterSection                      │
│  ├─ Param 1    │  FunctionPlotter /     │
│  ├─ Param 2    │  DerivativePlotter /   │
│  └─ ...        │  LimitPlotter /        │
│                │  ContinuityPlotter      │
│  ParameterSection                      │
│  └─ General    │                        │
└────────────────┴────────────────────────┘
```

**使用场景**: 大多数子页面（Exponential, Logarithmic, Piecewise, Inverse, Reciprocal, Discontinuity*, Infinitesimal*, 等）

**依赖链**:
```
PageComponent
  ├── BackButton           (react-router-dom useNavigate)
  ├── LayoutStyled          (styled-components, 10+ 命名导出)
  │     PageContainer, Header, SectionTitleH1, SectionDescription,
  │     ContentLayout, ControlsPanel, PlotPanel,
  │     FormulaBox, FormulaTitle, Formula, QuickSetRow, QuickBtn
  ├── ParameterControls     (react-range Range 组件)
  ├── ParameterSection      (styled-components)
  ├── <Module>Plotter       (plotly.js, useThemeMode, getPlotLayout, getTracePalette)
  ├── <module>Config        (plotStyleConfig, legendPositionConfig, commonParamsConfig)
  ├── useThemeMode          (localStorage + custom events 跨标签同步)
  └── getTracePalette       (plotThemeConfig, 语义颜色映射)
```

#### 2. SplitPlotWithControls — 双图分屏模式

```
┌──────────────────────────────────────────────┐
│  Header (BackButton + Title)                 │
├──────────────────────────────────────────────┤
│  ControlsBar (滑块 + 开关 + 下拉)             │
├──────────────────────────────────────────────┤
│  RatiosBar (数据卡片行)                       │
├──────────────────────┬───────────────────────┤
│  左图 (PlotInner)     │  右图 (PlotHalf)      │
│  aspect-ratio: 1     │  flex: 1              │
│  ┌────────────────┐  │  ┌──────────────────┐ │
│  │  FunctionPlotter│  │  │ FunctionPlotter  │ │
│  │  / Cube3D      │  │  │                  │ │
│  │  / Box3D       │  │  │                  │ │
│  └────────────────┘  │  └──────────────────┘ │
│  ← Resizer (拖拽) →  │                       │
└──────────────────────┴───────────────────────┘
```

**使用场景**: PowerFunction, TrigonometricRatios, InverseTrigonometricRatios

**额外依赖**: `useSplitter` (拖拽分屏 hook), `Cube3D` / `Box3D` (Plotly mesh3d 几何体), 原始 `styled-components` (内联样式)

#### 3. MultiSectionPlot — 多段垂直堆叠模式

```
┌─────────────────────────────────────────┐
│  Header + Description                   │
├─────────────────────────────────────────┤
│  Section 1: 递增函数                     │
│  ┌──────────────┬──────────────────────┐ │
│  │  Controls    │  Plot                │ │
│  └──────────────┴──────────────────────┘ │
├─────────────────────────────────────────┤
│  Section 2: 递减函数                     │
│  ┌──────────────┬──────────────────────┐ │
│  │  Controls    │  Plot                │ │
│  └──────────────┴──────────────────────┘ │
└─────────────────────────────────────────┘
```

**使用场景**: OddEvenFunctions, PeriodicFunctions, MonotonicityFunctions, ProductRule 等对比类页面

**额外依赖**: `FunctionSection` (来自 LayoutStyled 的卡片容器)

---

### 共享基础设施

#### 绘图器组件 (Plotter)

5 个专用绘图器共享统一的 API 设计：

| 组件 | 用途 | 2D/3D | 特殊能力 |
|---|---|---|---|
| `FunctionPlotter` | 通用 2D 函数图 | 2D | π-tick 模式, 样式档位, 图例定位 |
| `DerivativePlotter` | 导数图 (f + f') | 2D | π-tick, 辅助迹线颜色 |
| `LimitPlotter` | 极限图 | 2D | 极限语义颜色 (leftLimit, rightLimit, asymptote) |
| `ContinuityPlotter` | 连续性图 | 2D | 断点标记 (hole, jump) |
| `PartialDerivativePlotter` | 偏导数图 | 2D | π-tick, 投影线注释 |

**3D 场景绘图器**（独立于 2D plotter 体系）：

| 组件 | 用途 | 依赖 | 场景 |
|---|---|---|---|
| `Plotter3D` | 通用 3D 场景 (surface, scatter3d, mesh3d, ...) | `scene` 对象 (xRange, yRange, zRange, camera, aspectratio) | 偏导数、方向导数、梯度等 |
| `Cube3D` | 立方体 mesh3d (定制) | Plotly mesh3d 直接 渲染 | n=2 时 x²·y=1 |
| `Box3D` | 矩形盒 mesh3d (定制) | Plotly mesh3d 直接渲染 | n=-2 时 x²·y=1 |

**共同接口 (2D Plotters)**: `{ data, xRange, yRange?, title, showExportButton, plotStyle, aspectRatio, legendPosition }`
**Plotter3D 接口**: `{ data, scene (required), title, showExportButton, plotStyle, legendPosition }`

**共同行为**:
- 首次渲染 `Plotly.newPlot`，后续 `Plotly.react`（保留相机/布局状态）
- `useThemeMode()` → `getPlotLayout(themeMode)` → 响应式背景/网格/坐标轴色
- `plotStyle` 映射到 `{ lineWidth, pointSize, fontSize }` 四档 (thin/medium/thick/extra-thick)
- `aspectRatio` 通过 CSS `aspect-ratio` 控制容器比例
- 全屏切换按钮 + 可选 PNG 导出

#### 主题与颜色系统 (plotThemeConfig.js)

```
plotThemeConfig.js  ← 单一颜色真相源
  ├── L1: ASPECT_RATIO_OPTIONS (共享常量)
  ├── L2: getPlotLayout(themeMode) → { plot_bgcolor, gridcolor, axisColor, ... }
  └── L3: getTracePalette(themeMode) → {
        mainTraces:  { primary, secondary, tertiary }    # 主题无关品牌色
        auxTraces:   { derivative, secant, tangent, ... } # 辅助虚线
        markers:     { pointA, pointB, evalX0, ... }     # 标记点
        limit:       { limitLine, leftLimit, rightLimit, hole, ... }
        surface:     { colorscale, planeProjection, contour }
        fills:       { primary, secondary, accent, ... }
        text:        { annotation, muted, formula }
      }
```

所有绘图器和页面组件从 `getTracePalette(themeMode)` 获取颜色，禁止硬编码 hex 值。

#### 参数控制系统

```
ParameterSection (分区容器, styled-components)
  └── ParameterControls (参数控件, react-range)
        ├── type: slider+input  (默认) — 滑块 + 数字输入联动
        ├── type: range         (react-range Range 双滑块)
        ├── type: select        (下拉框)
        └── type: toggle        (ON/OFF 开关)
```

每个模块通过 config 数组声明参数：
```js
{ name: 'x0', label: 'x₀', min: -3, max: 3, step: 0.1 }           // 滑块
{ name: 'plotStyle', label: 'Plot Style', type: 'select', options: [...] }  // 下拉
{ name: 'xRange', label: 'X Range', type: 'range', min: -10, max: 10, step: 1, default: [-3, 3] }  // 双滑块
```

#### 导航系统

```
menuConfig.json (树形数据)
  └── menu[].children[].children[] → path + component 映射
       │
       ├── TopNav:     L1 hover → L2 dropdown
       ├── Sidebar:    L3 文本列表 / 折叠后首字母图标
       └── AppRoutes:  L4 子页面路由 (不在菜单中显示，通过页面内卡片网格导航)
```

---

### 页面组件标准骨架

```jsx
// UI Pattern: <PatternName> — <brief description>
import React, { useState, useMemo, useCallback } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getTracePalette, ASPECT_RATIO_OPTIONS } from '../../constants/plotThemeConfig';
import <Module>Plotter from '../../components/visualization/<Module>Plotter';
import ParameterControls from '../../components/visualization/ParameterControls';
import ParameterSection from '../../components/visualization/ParameterSection';
import BackButton from '../../components/layout/BackButton';
import { /* styled components */ } from '../../components/common/LayoutStyled';
import { /* config */ } from '../../constants/<module>Config';

const PageName = () => {
  // 1. State: 函数参数 + 视图参数
  const [params, setParams] = useState({ ... });

  // 2. Theme
  const themeMode = useThemeMode();
  const palette = getTracePalette(themeMode);

  // 3. Data generation (useCallback → useMemo)
  const generateData = useCallback(() => {
    // 计算 trace 数组 (纯 JS，不使用外部数学库)
    return [ { x, y, type: 'scatter', ... } ];
  }, [params, themeMode]);
  const traces = useMemo(() => generateData(), [generateData]);

  // 4. Render
  return (
    <PageContainer>
      <Header>
        <BackButton to="..." />
        <SectionTitleH1>Title</SectionTitleH1>
      </Header>
      <SectionDescription>...</SectionDescription>
      <FormulaBox>...</FormulaBox>
      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="...">
            <ParameterControls parameters={params} onChange={setParams} config={...} />
          </ParameterSection>
        </ControlsPanel>
        <PlotPanel>
          <<Module>Plotter data={traces} ... />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};
```

### 设计原则

1. **数据与渲染分离**: 页面负责数据生成（纯 JS 数学计算），绘图器负责 Plotly 渲染
2. **主题感知**: 所有颜色通过 `getTracePalette(themeMode)` 统一获取，支持 dark/light 无缝切换
3. **无第三方数学库**: 所有函数计算使用原生 JavaScript (`Math.sin`, `Math.pow`, `Math.log` 等)
4. **配置驱动**: 参数控制面板通过声明式 config 数组定义，控件类型由 `type` 字段决定
5. **模块隔离**: 每个模块有独立的 constants 文件、专用绘图器、共享 styled 布局组件

---

## 📐 新增内容指南

当需要在项目中新增三级菜单项或子页面时，按以下三种场景操作。

### 三种新增场景

| Scenario | 说明 | 示例 |
|---|---|---|
| **A: 新 L3 模块** | 新增一个完整的三级菜单项（hub 页 + 子页面目录） | 在 "Calculus" 下新增 "Integration" |
| **B: 新子页面分组** | 在现有 L3 模块中新增一组子页面 | 在 "Derivative" 中新增 "Higher Order Derivatives" 分组 |
| **C: 单个子页面** | 在现有分组中追加一个子页面 | 在 "Differentiation Rules" 分组中新增 "Power Rule" |

---

### Scenario A: 新 L3 模块（最完整流程）

**必须新建的文件——每个 L3 模块必备：**

| # | 文件 | 作用 | 依赖 |
|---|---|---|---|
| 1 | `src/pages/<TopicName>.jsx` | Hub 页（卡片网格导航） | `CardGrid`（唯一共享导入），内联 styled-components |
| 2 | `src/pages/<topic-name>/` | 子页面目录（N 个 .jsx） | `LayoutStyled`、`ParameterControls`、`ParameterSection`、`BackButton`、`useThemeMode`、`getTracePalette`、模块 config、**模块专属绘图器** |
| 3 | `src/constants/<topicName>Config.js` | 模块配置常量 | 导出 `plotStyleConfig`、`legendPositionConfig`、可选的 `commonParamsConfig` |
| 4 | `src/components/visualization/<TopicName>Plotter.jsx` | **模块专属绘图器（必建）** | 以 `FunctionPlotter` 为基础模版，复制后按需定制；依赖 `plotly.js`、`useThemeMode`、`getPlotLayout`、`getTracePalette` |

**必须修改的文件：**

| # | 文件 | 修改内容 |
|---|---|---|
| 5 | `src/routes/AppRoutes.jsx` | import hub 页 + 所有子页面，添加 `<Route>` 条目 |
| 6 | `src/config/menuConfig.json` | 在对应 L2 的 `children` 数组中添加 L3 条目 |

**无需修改** `TopNav.jsx`、`Sidebar.jsx`、`Layout.jsx` — 它们自动从 `menuConfig.json` 读取数据。

**L3 模块的完整依赖链（子页面角度）：**

```
子页面 (src/pages/<topic>/<SubPage>.jsx)
  ├── BackButton               → react-router-dom useNavigate
  ├── LayoutStyled              → styled-components (10+ 命名导出)
  ├── ParameterControls         → react-range Range 组件
  ├── ParameterSection          → styled-components
  ├── <TopicName>Plotter        → plotly.js + useThemeMode + getPlotLayout + getTracePalette
  │     （以 FunctionPlotter 为模版新建，每个 L3 模块一个）
  ├── <topicName>Config         → plotStyleConfig, legendPositionConfig, commonParamsConfig
  ├── useThemeMode              → localStorage + custom events 跨标签同步
  └── getTracePalette           → plotThemeConfig 语义颜色
```

**关于绘图器（Plotter）：**

每个 L3 模块**必须**有自己的绘图器组件（放置于 `src/components/visualization/`），即使最初与 `FunctionPlotter` 完全一致也要独立创建。原因：
- 模块间绘图逻辑独立演进，互不影响
- 后续可添加模块专属的布局、颜色语义、注释、3D 支持等
- 现已有 5 个模块绘图器：`FunctionPlotter`、`LimitPlotter`、`ContinuityPlotter`、`DerivativePlotter`、`PartialDerivativePlotter`
- 3D 场景使用 `Plotter3D`（通用 surface/scatter3d 场景），`Cube3D` 和 `Box3D` 是 mesh3d 定制组件，不可替代 Plotter3D

新建绘图器时：直接复制 `FunctionPlotter.jsx`，重命名组件，子页面改引用即可。API 接口保持一致。


### Scenario B: 在现有 L3 中新增子页面分组

| # | 操作 | 文件 |
|---|---|---|
| 1 | **新建** | `src/pages/<topic>/<new-group>/<NewPage>.jsx`（每个子页面一个文件） |
| 2 | **修改** | `src/routes/AppRoutes.jsx` — 添加 import + `<Route>` |
| 3 | **修改** | `src/pages/<TopicName>.jsx` — 添加新 `<GroupTitle>` + `<CardGrid>` 及对应的数据数组 |


### Scenario C: 在现有分组中新增单个子页面

| # | 操作 | 文件 |
|---|---|---|
| 1 | **新建** | `src/pages/<topic>/<existing-group>/<NewPage>.jsx` |
| 2 | **修改** | `src/routes/AppRoutes.jsx` — 添加 import + `<Route>` |
| 3 | **修改** | `src/pages/<TopicName>.jsx` — 在对应分组的卡片数组中追加一个对象 |


### 关键原则

1. **菜单是数据驱动的**: `menuConfig.json` 是唯一菜单数据源，`TopNav`、`Sidebar`、`Layout` 均从中读取。
2. **Hub 页面风格统一**: 所有 L3 hub 页使用内联 styled-components + `CardGrid`，参考 `BasicFunction.jsx`、`Derivative.jsx`、`PartialDerivative.jsx`。
3. **每个 L3 模块必有专属绘图器**: 以 `FunctionPlotter` 为模版复制新建，不跨模块共用绘图器。
4. **子页面使用共享布局**: 通过 `LayoutStyled`、`ParameterControls`、`ParameterSection` 复用 UI，专注数据生成逻辑。
5. **颜色通过 palette 获取**: 所有颜色从 `getTracePalette(themeMode)` 获取，禁止硬编码 hex 值。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

# AI Knowledge System - Frontend

## 技术栈

- **Framework**: React 18.x
- **Language**: JavaScript (ES6+)
- **Styling**: Styled Components
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Build Tool**: Vite (with hot reload)
- **Routing**: React Router v6

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   └── layout/         # 布局组件
│   │       ├── Layout.jsx      # 主布局容器
│   │       ├── TopNav.jsx      # 顶部导航栏（二级菜单）
│   │       ├── Sidebar.jsx     # 左侧边栏（三级菜单）
│   │       └── MainContent.jsx # 主内容区域
│   ├── config/             # 配置文件
│   │   └── menuConfig.json # 菜单配置（统一管理一、二、三级菜单）
│   ├── pages/              # 页面组件
│   │   └── Home.jsx        # 首页
│   ├── routes/             # 路由配置
│   │   └── AppRoutes.jsx   # 路由定义
│   ├── styles/             # 样式文件
│   │   └── theme.js        # 主题配置（AI 风格深色主题）
│   ├── App.jsx             # 根组件
│   └── main.jsx            # 入口文件
├── public/                 # 静态资源
├── package.json
└── vite.config.js
```

## 菜单系统架构

### 三级菜单结构

1. **一级菜单** (Top Navigation): Mathematics, Deep Learning, Machine Learning
2. **二级菜单** (Dropdown): 模块列表，如 "1_Fundamentals of Advanced Math"
3. **三级菜单** (Sidebar): 具体主题，如 "1_1_basic function"

所有菜单配置统一在 `src/config/menuConfig.json` 中管理。

### 菜单配置示例

```json
{
  "id": "mathematics",
  "name": "Mathematics",
  "children": [
    {
      "id": "math_1",
      "name": "1_Fundamentals of Advanced Math",
      "children": [
        {
          "id": "math_1_1",
          "name": "1_1_basic function",
          "path": "/mathematics/1-fundamentals/basic-function",
          "component": "BasicFunction"
        }
      ]
    }
  ]
}
```

## 开发指南

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

### 代码质量工具

- ESLint + Prettier 已配置
- 运行 lint: `npm run lint`

## 主题设计

采用 AI 科技风格的深色主题：

- **主色调**: Indigo (#6366f1)
- **辅助色**: Cyan (#06b6d4)
- **强调色**: Purple (#8b5cf6)
- **背景**: Dark Slate (#0f172a)
- **渐变**: Indigo → Purple → Cyan

支持响应式设计，适配移动端、平板和桌面端。

## 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/routes/AppRoutes.jsx` 中添加路由
3. 如需添加到菜单，更新 `src/config/menuConfig.json`

## 响应式断点

- 移动端: < 480px
- 平板: 480px - 768px
- 桌面: > 768px

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
│   ├── components/          # 可复用组件
│   │   └── layout/         # 布局组件
│   │       ├── Layout.jsx      # 主布局容器
│   │       ├── TopNav.jsx      # 顶部导航栏（一级、二级菜单）
│   │       ├── Sidebar.jsx     # 左侧边栏（三级菜单）
│   │       └── MainContent.jsx # 主内容区域
│   ├── config/             # 配置文件
│   │   └── menuConfig.js   # 菜单配置（统一管理一、二、三级菜单）
│   ├── pages/              # 页面组件
│   │   └── Home.jsx        # 首页示例
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

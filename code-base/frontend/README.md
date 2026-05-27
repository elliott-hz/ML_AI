# AI Knowledge System - Frontend

React-based frontend for the AI Knowledge Learning System.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Ant Design** for UI components
- **React Router** for navigation
- **Plotly.js** and **Three.js** for visualizations
- **Axios** for API calls

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout/       # Header, Sidebar
│   └── Common/       # Shared components
├── pages/            # Page components
│   ├── Home.tsx
│   └── KnowledgePage.tsx
├── visualizations/   # Visualization components
│   ├── MathViz/     # Math visualizations
│   ├── ModelViz/    # Model visualizations
│   └── DataViz/     # Data visualizations
├── services/         # API services
├── styles/           # Global styles
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Key Features

- ✅ Two-level menu system (Module → Topic)
- ✅ Dynamic routing
- ✅ Responsive design
- ✅ Interactive visualizations (coming soon)
- ✅ Real-time training monitoring (coming soon)

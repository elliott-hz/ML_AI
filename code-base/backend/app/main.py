from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import knowledge, experiments, visualizations

app = FastAPI(
    title="AI Knowledge Learning System API",
    description="Backend API for AI Knowledge Learning Platform",
    version="1.0.0"
)

# CORS配置 - 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(knowledge.router, prefix="/api/knowledge", tags=["knowledge"])
app.include_router(experiments.router, prefix="/api/experiments", tags=["experiments"])
app.include_router(visualizations.router, prefix="/api/visualizations", tags=["visualizations"])

@app.get("/")
async def root():
    return {
        "message": "AI Knowledge Learning System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

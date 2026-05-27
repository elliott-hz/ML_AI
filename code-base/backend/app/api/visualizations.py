from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter()

class FunctionPlotRequest(BaseModel):
    """函数绘图请求"""
    function_type: str  # 'even', 'odd', 'symmetry', 'increasing', 'decreasing'
    parameters: Dict[str, float]
    x_min: float = -10.0
    x_max: float = 10.0
    num_points: int = 1000

class FunctionConfig(BaseModel):
    """函数配置信息"""
    function_type: str
    name: str
    description: str
    default_params: Dict[str, float]
    param_ranges: Dict[str, Dict[str, float]]

# 函数类型配置
FUNCTION_CONFIGS = {
    "even": FunctionConfig(
        function_type="even",
        name="Even Function (f(-x) = f(x))",
        description="Symmetric about the y-axis",
        default_params={"a": 1.0, "b": 0.0, "c": 0.0},
        param_ranges={
            "a": {"min": -5.0, "max": 5.0, "step": 0.1},
            "b": {"min": -10.0, "max": 10.0, "step": 0.5},
            "c": {"min": -10.0, "max": 10.0, "step": 0.5}
        }
    ),
    "odd": FunctionConfig(
        function_type="odd",
        name="Odd Function (f(-x) = -f(x))",
        description="Symmetric about the origin",
        default_params={"a": 1.0, "b": 0.0},
        param_ranges={
            "a": {"min": -5.0, "max": 5.0, "step": 0.1},
            "b": {"min": -10.0, "max": 10.0, "step": 0.5}
        }
    ),
    "symmetry": FunctionConfig(
        function_type="symmetry",
        name="Symmetric Function",
        description="Function with specific symmetry properties",
        default_params={"a": 1.0, "h": 0.0, "k": 0.0},
        param_ranges={
            "a": {"min": -5.0, "max": 5.0, "step": 0.1},
            "h": {"min": -10.0, "max": 10.0, "step": 0.5},
            "k": {"min": -10.0, "max": 10.0, "step": 0.5}
        }
    ),
    "increasing": FunctionConfig(
        function_type="increasing",
        name="Monotonically Increasing Function",
        description="Function that always increases",
        default_params={"a": 1.0, "b": 0.0},
        param_ranges={
            "a": {"min": 0.1, "max": 5.0, "step": 0.1},
            "b": {"min": -10.0, "max": 10.0, "step": 0.5}
        }
    ),
    "decreasing": FunctionConfig(
        function_type="decreasing",
        name="Monotonically Decreasing Function",
        description="Function that always decreases",
        default_params={"a": 1.0, "b": 0.0},
        param_ranges={
            "a": {"min": 0.1, "max": 5.0, "step": 0.1},
            "b": {"min": -10.0, "max": 10.0, "step": 0.5}
        }
    ),
}

@router.get("/function/config/{function_type}")
async def get_function_config(function_type: str):
    """获取函数配置信息"""
    if function_type not in FUNCTION_CONFIGS:
        raise HTTPException(status_code=404, detail=f"Function type '{function_type}' not found")
    return FUNCTION_CONFIGS[function_type]

@router.get("/function/all-configs")
async def get_all_function_configs():
    """获取所有函数配置"""
    return list(FUNCTION_CONFIGS.values())

@router.post("/function/plot")
async def plot_function(request: FunctionPlotRequest):
    """
    生成函数图像（可选功能，用于保存图片）
    注意：主要使用前端实时渲染，此接口仅用于需要保存图片的场景
    """
    # 这里可以实现使用matplotlib生成图片并保存的逻辑
    # 但目前我们主要使用前端Plotly.js进行实时渲染
    return {
        "message": "Use frontend Plotly.js for real-time rendering",
        "function_type": request.function_type,
        "parameters": request.parameters,
        "x_range": [request.x_min, request.x_max]
    }

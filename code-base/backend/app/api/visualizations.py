from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/{topic}/{image_name}")
async def get_visualization_image(topic: str, image_name: str):
    """获取可视化图片"""
    # 实际项目中需要实现文件查找和返回逻辑
    image_path = f"generated-images/{topic}/{image_name}"
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(image_path, media_type="image/png")

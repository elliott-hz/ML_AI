from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class TrainingRequest(BaseModel):
    model_type: str
    hyperparameters: dict
    dataset: Optional[str] = "default"

class TrainingStatus(BaseModel):
    experiment_id: str
    status: str  # 'pending', 'running', 'completed', 'failed'
    epoch: Optional[int] = None
    total_epochs: Optional[int] = None
    metrics: Optional[dict] = None

# Mock training service
@router.post("/train")
async def start_training(request: TrainingRequest):
    """启动模型训练任务"""
    return {
        "experiment_id": "exp_001",
        "status": "started",
        "message": "Training started"
    }

@router.get("/status/{experiment_id}")
async def get_training_status(experiment_id: str):
    """获取训练任务状态"""
    return TrainingStatus(
        experiment_id=experiment_id,
        status="running",
        epoch=5,
        total_epochs=20,
        metrics={"loss": 0.5, "accuracy": 0.85}
    )

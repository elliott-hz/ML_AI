from fastapi import APIRouter, HTTPException
from app.models.knowledge import KnowledgeModule, KnowledgeTopic, ModuleList, TopicList
from app.services.knowledge_service import KnowledgeService

router = APIRouter()

@router.get("/modules", response_model=ModuleList)
async def get_modules():
    """获取所有知识模块列表"""
    try:
        modules = KnowledgeService.get_all_modules()
        return ModuleList(modules=modules)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/modules/{module_id}/topics", response_model=TopicList)
async def get_topics(module_id: str):
    """获取指定模块的所有主题"""
    try:
        topics = KnowledgeService.get_topics_by_module(module_id)
        return TopicList(topics=topics)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/modules/{module_id}/{topic_id}", response_model=KnowledgeTopic)
async def get_topic(module_id: str, topic_id: str):
    """获取特定主题的详细内容"""
    try:
        topic = KnowledgeService.get_topic(module_id, topic_id)
        return topic
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

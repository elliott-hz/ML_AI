from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class KnowledgeModule(BaseModel):
    id: str
    name: str
    description: str
    topics: List[str]

class KnowledgeTopic(BaseModel):
    id: str
    module: str
    title: str
    content: str
    type: str  # 'mathematics', 'model', 'algorithm'
    slide_url: Optional[str] = None
    image_url: Optional[str] = None

class ModuleList(BaseModel):
    modules: List[KnowledgeModule]

class TopicList(BaseModel):
    topics: List[KnowledgeTopic]

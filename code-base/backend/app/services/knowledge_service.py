from typing import List
from app.models.knowledge import KnowledgeModule, KnowledgeTopic

# Mock data - 实际项目中应该从数据库读取
MODULES = [
    KnowledgeModule(
        id="mathematics",
        name="Mathematics",
        description="Fundamental mathematical concepts",
        topics=["advanced-math", "linear-algebra", "probability"]
    ),
    KnowledgeModule(
        id="deep-learning",
        name="Deep Learning",
        description="Modern deep learning architectures",
        topics=["alexnet", "resnet", "transformer"]
    ),
    KnowledgeModule(
        id="machine-learning",
        name="Machine Learning",
        description="Classic machine learning algorithms",
        topics=["svm", "decision-tree", "ensemble"]
    ),
]

TOPICS_DB = {
    "mathematics-advanced-math": KnowledgeTopic(
        id="advanced-math",
        module="mathematics",
        title="Advanced Mathematics",
        content="# Advanced Mathematics\n\nContent coming soon...",
        type="mathematics"
    ),
    "deep-learning-alexnet": KnowledgeTopic(
        id="alexnet",
        module="deep-learning",
        title="AlexNet",
        content="# AlexNet\n\nContent coming soon...",
        type="model"
    ),
}

class KnowledgeService:
    @staticmethod
    def get_all_modules() -> List[KnowledgeModule]:
        return MODULES
    
    @staticmethod
    def get_module_by_id(module_id: str) -> KnowledgeModule:
        for module in MODULES:
            if module.id == module_id:
                return module
        raise ValueError(f"Module {module_id} not found")
    
    @staticmethod
    def get_topics_by_module(module_id: str) -> List[KnowledgeTopic]:
        module = KnowledgeService.get_module_by_id(module_id)
        return [
            TOPICS_DB[f"{module_id}-{topic}"] 
            for topic in module.topics 
            if f"{module_id}-{topic}" in TOPICS_DB
        ]
    
    @staticmethod
    def get_topic(module_id: str, topic_id: str) -> KnowledgeTopic:
        key = f"{module_id}-{topic_id}"
        if key not in TOPICS_DB:
            raise ValueError(f"Topic {topic_id} not found in module {module_id}")
        return TOPICS_DB[key]

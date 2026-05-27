from typing import List
from app.models.knowledge import KnowledgeModule, KnowledgeTopic

# Mock data - 实际项目中应该从数据库读取
MODULES = [
    KnowledgeModule(
        id="mathematics",
        name="Mathematics",
        description="Fundamental mathematical concepts",
        topics=[
            "1_Fundamentals of Advanced Math",
            "2_calculus",
            "3_Taylor Formula and Lagrange",
            "4_Linear Algebra",
            "5_Eigenvalues and Eigenvectors",
            "6_Random Variable",
            "7_Probability Theory Basics",
            "8_Probability Distribution"
        ]
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
    # Mathematics - Fundamentals of Advanced Math
    "mathematics-1_Fundamentals of Advanced Math": KnowledgeTopic(
        id="1_Fundamentals of Advanced Math",
        module="mathematics",
        title="1. Fundamentals of Advanced Math",
        content="# Fundamentals of Advanced Math\n\nThis module covers fundamental concepts including functions, their properties, and characteristics.",
        type="mathematics",
        visualizations={
            "functions": {
                "title": "Function Properties Visualization",
                "description": "Interactive visualization of function properties including even-odd, symmetry, and monotonicity",
                "endpoint": "/api/visualizations/function/plot"
            }
        }
    ),
    
    # Deep Learning topics
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
        topics = []
        for topic_id in module.topics:
            key = f"{module_id}-{topic_id}"
            if key in TOPICS_DB:
                topics.append(TOPICS_DB[key])
            else:
                # Create default topic if not exists
                topics.append(KnowledgeTopic(
                    id=topic_id,
                    module=module_id,
                    title=topic_id.replace('_', ' ').replace('-', ' '),
                    content=f"# {topic_id}\n\nContent coming soon...",
                    type="mathematics" if module_id == "mathematics" else "algorithm"
                ))
        return topics
    
    @staticmethod
    def get_topic(module_id: str, topic_id: str) -> KnowledgeTopic:
        key = f"{module_id}-{topic_id}"
        if key not in TOPICS_DB:
            # Return default topic
            return KnowledgeTopic(
                id=topic_id,
                module=module_id,
                title=topic_id.replace('_', ' ').replace('-', ' '),
                content=f"# {topic_id}\n\nContent coming soon...",
                type="mathematics" if module_id == "mathematics" else "algorithm"
            )
        return TOPICS_DB[key]

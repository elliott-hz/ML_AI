import api from './api';

export interface KnowledgeModule {
  id: string;
  name: string;
  description: string;
  topics: string[];
}

export interface KnowledgeTopic {
  id: string;
  module: string;
  title: string;
  content: string;
  type: 'mathematics' | 'model' | 'algorithm';
  slideUrl?: string;
  imageUrl?: string;
}

// Get all modules
export const getModules = (): Promise<KnowledgeModule[]> => {
  return api.get('/knowledge/modules');
};

// Get topics by module
export const getTopicsByModule = (moduleId: string): Promise<KnowledgeTopic[]> => {
  return api.get(`/knowledge/modules/${moduleId}/topics`);
};

// Get specific topic content
export const getTopicContent = (moduleId: string, topicId: string): Promise<KnowledgeTopic> => {
  return api.get(`/knowledge/modules/${moduleId}/${topicId}`);
};

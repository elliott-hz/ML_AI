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
  visualizations?: Record<string, any>;
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

// Visualization APIs
export interface FunctionConfig {
  function_type: string;
  name: string;
  description: string;
  default_params: Record<string, number>;
  param_ranges: Record<string, { min: number; max: number; step: number }>;
}

// Get function configuration
export const getFunctionConfig = (functionType: string): Promise<FunctionConfig> => {
  return api.get(`/visualizations/function/config/${functionType}`);
};

// Get all function configurations
export const getAllFunctionConfigs = (): Promise<FunctionConfig[]> => {
  return api.get('/visualizations/function/all-configs');
};

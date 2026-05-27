import React, { useEffect, useState } from 'react';
import { Typography, Spin, Alert, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import './KnowledgePage.css';

const { Title, Paragraph } = Typography;

const KnowledgePage: React.FC = () => {
  const { module, topic } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: 从后端API获取知识点内容
    const fetchKnowledgeContent = async () => {
      setLoading(true);
      try {
        // const response = await fetch(`/api/knowledge/${module}/${topic}`);
        // const data = await response.json();
        // setContent(data.content);
        
        // 临时示例内容
        setContent(`# ${topic?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

## Introduction

This is a placeholder for the **${topic}** knowledge module. 

## Content

The actual content will be loaded from the backend API once implemented.

## Visualization

Interactive visualizations will be rendered here based on the topic type.
        `);
      } catch (err) {
        setError('Failed to load knowledge content');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeContent();
  }, [module, topic]);

  if (loading) {
    return (
      <div className="knowledge-page loading">
        <Spin size="large" tip="Loading content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="knowledge-page error">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="knowledge-page">
      <div className="knowledge-content">
        <Markdown>{content}</Markdown>
      </div>
      
      {/* TODO: 根据知识点类型渲染不同的可视化组件 */}
      <div className="visualization-area">
        {/* <MathViz /> for mathematics topics */}
        {/* <ModelViz /> for deep learning topics */}
      </div>
    </div>
  );
};

export default KnowledgePage;

import React, { useEffect, useState } from 'react';
import { Typography, Spin, Alert, Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { FunctionPlotter } from '../visualizations/MathViz';
import './KnowledgePage.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const KnowledgePage: React.FC = () => {
  const { module, topic } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  // 判断是否需要显示函数可视化
  const shouldShowFunctionViz = () => {
    return topic?.includes('Fundamentals of Advanced Math') || 
           topic?.includes('functions') ||
           module === 'mathematics';
  };

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

## Interactive Visualization

Use the visualization tab below to explore function properties with adjustable parameters.
        `);
        
        // 如果是数学基础模块，显示可视化
        if (shouldShowFunctionViz()) {
          setShowVisualization(true);
        }
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
      {showVisualization ? (
        <Tabs defaultActiveKey="visualization" className="knowledge-tabs">
          <TabPane tab="Interactive Visualization" key="visualization">
            <FunctionPlotter functionType="even" />
          </TabPane>
          <TabPane tab="Documentation" key="documentation">
            <div className="knowledge-content">
              <Markdown>{content}</Markdown>
            </div>
          </TabPane>
        </Tabs>
      ) : (
        <div className="knowledge-content">
          <Markdown>{content}</Markdown>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;

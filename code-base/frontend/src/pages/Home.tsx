import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, ExperimentOutlined, CodeOutlined } from '@ant-design/icons';
import './Home.css';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Mathematics',
      description: 'Fundamental mathematical concepts including calculus, linear algebra, and probability theory',
      icon: <BookOutlined />,
      path: '/modules/mathematics',
      topics: ['Advanced Math', 'Linear Algebra', 'Probability'],
    },
    {
      title: 'Deep Learning',
      description: 'Modern deep learning architectures and techniques for computer vision and NLP',
      icon: <ExperimentOutlined />,
      path: '/modules/deep-learning',
      topics: ['AlexNet', 'ResNet', 'Transformer'],
    },
    {
      title: 'Machine Learning',
      description: 'Classic machine learning algorithms and their practical applications',
      icon: <CodeOutlined />,
      path: '/modules/machine-learning',
      topics: ['SVM', 'Decision Tree', 'Ensemble Methods'],
    },
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <Title level={1}>AI Knowledge Learning System</Title>
        <Paragraph className="hero-description">
          Interactive platform for learning AI concepts with dynamic visualizations, 
          hands-on experiments, and comprehensive lecture materials.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="modules-grid">
        {modules.map((module) => (
          <Col xs={24} sm={24} md={12} lg={8} key={module.path}>
            <Card
              hoverable
              className="module-card"
              onClick={() => handleModuleClick(module.path)}
              cover={
                <div className="module-icon">
                  {React.cloneElement(module.icon as React.ReactElement, { 
                    style: { fontSize: 64 } 
                  })}
                </div>
              }
            >
              <Card.Meta
                title={module.title}
                description={
                  <>
                    <Paragraph>{module.description}</Paragraph>
                    <div className="module-topics">
                      <strong>Topics:</strong>
                      <ul>
                        {module.topics.map(topic => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;

import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOutlined, ExperimentOutlined } from '@ant-design/icons';
import './Header.css';

const { Header: AntHeader } = AntLayout;

interface HeaderProps {
  collapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/modules/mathematics',
      icon: <BookOutlined />,
      label: 'Mathematics',
      children: [
        { key: '/modules/mathematics/advanced-math', label: 'Advanced Math' },
        { key: '/modules/mathematics/linear-algebra', label: 'Linear Algebra' },
        { key: '/modules/mathematics/probability', label: 'Probability' },
      ],
    },
    {
      key: '/modules/deep-learning',
      icon: <ExperimentOutlined />,
      label: 'Deep Learning',
      children: [
        { key: '/modules/deep-learning/alexnet', label: 'AlexNet' },
        { key: '/modules/deep-learning/resnet', label: 'ResNet' },
        { key: '/modules/deep-learning/transformer', label: 'Transformer' },
      ],
    },
    {
      key: '/modules/machine-learning',
      icon: <ExperimentOutlined />,
      label: 'Machine Learning',
      children: [
        { key: '/modules/machine-learning/svm', label: 'SVM' },
        { key: '/modules/machine-learning/decision-tree', label: 'Decision Tree' },
        { key: '/modules/machine-learning/ensemble', label: 'Ensemble Methods' },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntHeader className="header">
      <div className="header-logo">
        <h1 style={{ color: 'white', margin: 0 }}>AI Knowledge System</h1>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        items={menuItems}
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        style={{ flex: 1, minWidth: 0 }}
      />
    </AntHeader>
  );
};

export default Header;

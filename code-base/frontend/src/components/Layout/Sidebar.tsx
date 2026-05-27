import React, { useState } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = AntLayout;

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { module } = useParams();

  // 根据当前模块动态生成二级菜单
  const getMenuItems = () => {
    const menuConfig: Record<string, any[]> = {
      mathematics: [
        { key: '/modules/mathematics/advanced-math', label: 'Advanced Math' },
        { key: '/modules/mathematics/linear-algebra', label: 'Linear Algebra' },
        { key: '/modules/mathematics/probability', label: 'Probability' },
      ],
      'deep-learning': [
        { key: '/modules/deep-learning/alexnet', label: 'AlexNet' },
        { key: '/modules/deep-learning/resnet', label: 'ResNet' },
        { key: '/modules/deep-learning/transformer', label: 'Transformer' },
      ],
      'machine-learning': [
        { key: '/modules/machine-learning/svm', label: 'SVM' },
        { key: '/modules/machine-learning/decision-tree', label: 'Decision Tree' },
        { key: '/modules/machine-learning/ensemble', label: 'Ensemble Methods' },
      ],
    };

    return module ? menuConfig[module] || [] : [];
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider width={240} className="sidebar">
      <div className="sidebar-title">
        {module ? module.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') : 'Select a Module'}
      </div>
      <Menu
        mode="inline"
        items={getMenuItems()}
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;

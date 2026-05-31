import React from 'react';
import styled from 'styled-components';

/**
 * 参数分区组件 - 用于将参数按功能分组显示
 * @param {string} title - 分区标题
 * @param {ReactNode} children - 分区内容（通常是 ParameterControls）
 */
const ParameterSection = ({ title, children }) => {
  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <SectionContent>{children}</SectionContent>
    </SectionContainer>
  );
};

// 分区容器样式
const SectionContainer = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '8px'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.75rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '0.75rem'};
  box-shadow: ${({ theme }) => theme?.shadows?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};

  &:last-child {
    margin-bottom: 0;
  }
`;

// 分区标题样式
const SectionTitle = styled.h4`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme?.spacing?.sm || '0.75rem'} 0;
  padding-bottom: ${({ theme }) => theme?.spacing?.xs || '0.5rem'};
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
`;

// 分区内容样式
const SectionContent = styled.div`
  /* 内容区域由子组件控制 */
`;

export default ParameterSection;

import React from 'react';

/**
 * 参数控制面板组件 - 滑块和输入框双联动
 * @param {object} parameters - 当前参数值对象
 * @param {function} onChange - 参数变化回调函数
 * @param {array} config - 参数配置数组 [{name, label, min, max, step}]
 */
const ParameterControls = ({ parameters, onChange, config }) => {
  // 处理滑块变化
  const handleSliderChange = (paramName, value) => {
    const numValue = parseFloat(value);
    onChange({ ...parameters, [paramName]: numValue });
  };

  // 处理输入框变化
  const handleInputChange = (paramName, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({ ...parameters, [paramName]: numValue });
    }
  };

  // 容器样式
  const containerStyle = {
    background: '#1e293b',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  };

  const titleStyle = {
    color: '#f8fafc',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '1rem'
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem'
  };

  const labelStyle = {
    color: '#cbd5e1',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '80px'
  };

  const sliderStyle = {
    flex: 1,
    height: '6px',
    background: '#334155',
    borderRadius: '3px',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none'
  };

  const inputStyle = {
    width: '80px',
    padding: '0.25rem 0.5rem',
    background: '#334155',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: '#f8fafc',
    fontSize: '14px',
    textAlign: 'center',
    outline: 'none'
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>️ Parameters</h3>
      {config.map((param) => (
        <div key={param.name} style={rowStyle}>
          <label style={labelStyle}>{param.label}</label>
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={parameters[param.name] || 0}
            onChange={(e) => handleSliderChange(param.name, e.target.value)}
            style={sliderStyle}
          />
          <input
            type="number"
            min={param.min}
            max={param.max}
            step={param.step}
            value={parameters[param.name] || 0}
            onChange={(e) => handleInputChange(param.name, e.target.value)}
            style={inputStyle}
          />
        </div>
      ))}
    </div>
  );
};

export default ParameterControls;

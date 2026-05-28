import React from 'react';
import { Range } from 'react-range';

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

  // 处理下拉框变化
  const handleSelectChange = (paramName, value) => {
    onChange({ ...parameters, [paramName]: value });
  };

  // 处理范围滑块变化（双滑块）
  const handleRangeChange = (paramName, values) => {
    onChange({ ...parameters, [paramName]: values });
  };

  return (
    <div style={{
      /* 移除了背景、圆角、padding、marginBottom、boxShadow */
      /* 这些由外层 ParameterSection 提供 */
    }}>
      {/* 自定义滑块样式 */}
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: var(--theme-border, #334155);
          border-radius: 3px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--theme-primary, #6366f1);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin-top: -5px;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--theme-primary, #6366f1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
          border-radius: 3px;
        }
        
        input[type="range"]::-moz-range-track {
          height: 6px;
          background: transparent;
          border-radius: 3px;
        }
      `}</style>
      
      {config.map((param) => (
        <div key={param.name} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <label style={{
            color: 'var(--theme-text-secondary, #cbd5e1)',
            fontSize: '14px',
            fontWeight: '500',
            minWidth: '80px'
          }}>{param.label}</label>
          
          {param.type === 'select' ? (
            // 下拉框类型
            <select
              value={parameters[param.name] || param.options[0]}
              onChange={(e) => handleSelectChange(param.name, e.target.value)}
              style={{
                width: '120px',
                padding: '0.25rem 0.5rem',
                background: 'var(--theme-input-bg, #334155)',
                border: '1px solid var(--theme-border, #334155)',
                borderRadius: '4px',
                color: 'var(--theme-text-primary, #f8fafc)',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {param.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : param.type === 'range' ? (
            // 范围滑块类型（使用 react-range）
            <div style={{ flex: 1 }}>
              <Range
                step={param.step}
                min={param.min}
                max={param.max}
                values={parameters[param.name] || param.default}
                onChange={(values) => handleRangeChange(param.name, values)}
                renderTrack={({ props, children }) => {
                  const { key, ...restProps } = props;
                  return (
                    <div
                      key={key}
                      {...restProps}
                      style={{
                        ...restProps.style,
                        height: '6px',
                        width: '100%',
                        background: 'var(--theme-border, #334155)',
                        borderRadius: '3px'
                      }}
                    >
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props, index }) => {
                  const { key, ...restProps } = props;
                  return (
                    <div
                      key={key}
                      {...restProps}
                      style={{
                        ...restProps.style,
                        height: '16px',
                        width: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--theme-primary, #6366f1)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    />
                  );
                }}
              />
              
              {/* 显示当前值 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <span style={{ 
                  color: 'var(--theme-text-primary, #f8fafc)', 
                  fontSize: '12px', 
                  minWidth: '40px', 
                  textAlign: 'center' 
                }}>
                  {(parameters[param.name] || param.default)[0].toFixed(1)}
                </span>
                <span style={{ 
                  color: 'var(--theme-text-secondary, #cbd5e1)', 
                  fontSize: '12px' 
                }}>↔</span>
                <span style={{ 
                  color: 'var(--theme-text-primary, #f8fafc)', 
                  fontSize: '12px', 
                  minWidth: '40px', 
                  textAlign: 'center' 
                }}>
                  {(parameters[param.name] || param.default)[1].toFixed(1)}
                </span>
              </div>
            </div>

          ) : (
            // 滑块 + 输入框类型
            <>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={parameters[param.name] !== undefined ? parameters[param.name] : 0}
                onChange={(e) => handleSliderChange(param.name, e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min={param.min}
                max={param.max}
                step={param.step}
                value={parameters[param.name] !== undefined ? parameters[param.name] : 0}
                onChange={(e) => handleInputChange(param.name, e.target.value)}
                style={{
                  width: '80px',
                  padding: '0.25rem 0.5rem',
                  background: 'var(--theme-input-bg, #334155)',
                  border: '1px solid var(--theme-border, #334155)',
                  borderRadius: '4px',
                  color: 'var(--theme-text-primary, #f8fafc)',
                  fontSize: '14px',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParameterControls;

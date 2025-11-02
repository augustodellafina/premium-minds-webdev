import React, { forwardRef } from 'react';
import './Input.scss';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'medium',
  variant = 'default',
  leftIcon,
  rightIcon,
  fullWidth = false,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = [
    'input',
    `input--${size}`,
    `input--${variant}`,
    error ? 'input--error' : '',
    disabled ? 'input--disabled' : '',
    fullWidth ? 'input--full-width' : '',
    leftIcon ? 'input--has-left-icon' : '',
    rightIcon ? 'input--has-right-icon' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-field">
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label}
          {required && <span className="input-field__required" aria-label="obrigatório">*</span>}
        </label>
      )}
      
      <div className="input-field__wrapper">
        {leftIcon && (
          <div className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required ? 'true' : 'false'}
          aria-describedby={
            error || helperText ? `${inputId}-message` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div
          id={`${inputId}-message`}
          className={`input-field__message ${
            error ? 'input-field__message--error' : 'input-field__message--helper'
          }`}
          role={error ? 'alert' : 'status'}
          aria-live="polite"
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
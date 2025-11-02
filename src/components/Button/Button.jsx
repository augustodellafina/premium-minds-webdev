import { forwardRef } from 'react';
import './Button.scss';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props 
}, ref) => {
  const buttonClass = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      {leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
      <span className="btn__text">{children}</span>
      {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
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
  'aria-label': ariaLabel,
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
      aria-label={ariaLabel || (loading ? 'A processar' : undefined)}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {leftIcon && <span className="btn__icon btn__icon--left" aria-hidden="true">{leftIcon}</span>}
      <span className="btn__text">{children}</span>
      {rightIcon && <span className="btn__icon btn__icon--right" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
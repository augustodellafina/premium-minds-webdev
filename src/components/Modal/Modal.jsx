import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  ...props 
}) => {
  // Don't render if not open
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const modalClasses = [
    'modal',
    `modal--${size}`,
    className
  ].filter(Boolean).join(' ');

  // Use portal to render modal at body level
  return ReactDOM.createPortal(
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      {...props}
    >
      <div className={modalClasses}>
        <div className="modal__header">
          {title && (
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
          )}
          
          {showCloseButton && (
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Fechar modal"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
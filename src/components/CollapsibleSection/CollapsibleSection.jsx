import { useState, useId } from 'react';
import './CollapsibleSection.scss';

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const titleId = useId();

  return (
    <div className="collapsible-section">
      <button
        type="button"
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={titleId}
      >
        <h3>{title}</h3>
        <span className={`icon ${isOpen ? 'open' : ''}`} aria-hidden="true">
          {isOpen ? 'Fechar' : 'Abrir'}
        </span>
      </button>
      {isOpen && (
        <div 
          className="collapsible-content" 
          id={contentId}
          role="region"
          aria-labelledby={titleId}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;
export { CollapsibleSection };

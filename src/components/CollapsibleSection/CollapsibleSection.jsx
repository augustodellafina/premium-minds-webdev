import { useState } from 'react';
import './CollapsibleSection.scss';

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-section">
      <button
        type="button"
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3>{title}</h3>
        <span className={`icon ${isOpen ? 'open' : ''}`}>{isOpen ? 'Fechar' : 'Abrir'}</span>
      </button>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
}

export default CollapsibleSection;
export { CollapsibleSection };

import './Checkbox.scss';

import React, { useMemo } from 'react';

export function Checkbox({ label, checked, onChange }) {
  const id = useMemo(() => label.replace(/\s/g, '-').toLowerCase(), [label]);
  
  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
        id={id}
      />
      <label 
        htmlFor={id} 
        className="checkbox-label"
      >
        {label}
      </label>
    </div>
  );
}

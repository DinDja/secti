// src/components/HudBorder.js
import React from 'react';

const HudBorder = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    {children}
  </div>
);

export default HudBorder;
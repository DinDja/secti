// src/components/SectiLogo.jsimport React from 'react';

const SectiLogo = ({ size = 'medium', className = '' }) => (
  <img
    src="/img/sectiLogo.jpg"
    alt="SECTI Logo"
    className={`secti-logo secti-logo-${size} ${className}`}
  />
);

export default SectiLogo;
// src/components/DigitalBackground.js
import React from 'react';

const DigitalBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-100"></div>
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply filter pointer-events-none animate-blob"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply filter pointer-events-none animate-blob animation-delay-2000"></div>
  </div>
);

export default DigitalBackground;
import React from 'react';

const RenderSelect = ({ label, field, options, required = false, value = '', onChange, onFocus, onBlur, disabled = false }) => (
  <div className="group mb-5">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center">
        <label className={`text-[10px] uppercase font-bold tracking-widest ${disabled ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </label>
        {required && !disabled && <span className="ml-1 text-red-500 text-xs">*</span>}
      </div>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full h-10 border border-slate-200 rounded-lg text-sm font-sans p-2 outline-none transition-all shadow-sm ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
    >
      <option value="" disabled>Selecione uma opção...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default RenderSelect;
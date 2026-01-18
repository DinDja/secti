import React from 'react';

const RenderInput = ({ label, field, placeholder = "Preencher...", height = "h-12", required = false, value = '', onChange, onFocus, onBlur, disabled = false }) => (
  <div className="group mb-5">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center">
        <label className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${disabled ? 'text-slate-400' : 'text-slate-500 group-focus-within:text-blue-500'}`}>
          {label}
        </label>
        {required && !disabled && <span className="ml-1 text-red-500 text-xs">*</span>}
      </div>
    </div>
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full ${height === 'h-12' ? 'h-10 pt-2' : height} border border-slate-200 rounded-lg text-sm font-sans p-3 outline-none transition-all resize-none custom-scrollbar shadow-sm ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-slate-400'}`}
        placeholder={disabled ? "Campo bloqueado para edição" : placeholder}
      />
    </div>
  </div>
);

export default RenderInput;
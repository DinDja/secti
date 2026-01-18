// src/components/DeckNavigation.js

import React from 'react';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { DECKS } from '../utils/decks';
import SectiLogo from './SectiLogo';

const DeckNavigation = ({ currentDeck, setCurrentDeck }) => {
  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="sticky top-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Navegação
            </h3>
          </div>
          <div className="space-y-2">
            {DECKS.map((deck, idx) => (
              <button
                key={deck.id}
                onClick={() => setCurrentDeck(idx)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${currentDeck === idx
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${currentDeck === idx ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    {React.cloneElement(deck.icon, {
                      className: `w-3.5 h-3.5 ${currentDeck === idx ? 'text-blue-600' : 'text-slate-400'}`
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold">{deck.nome}</div>
                    <div className="text-[10px] text-slate-500 truncate">{deck.desc}</div>
                  </div>
                  {currentDeck === idx && (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-slate-200/50 p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Progresso
          </h3>
          <div className="space-y-3">
            {DECKS.map((deck, idx) => (
              <div key={deck.id} className="flex items-center justify-between">
                <div className="text-xs text-slate-600">{deck.nome.split('. ')[1] || deck.nome}</div>
                <div className={`w-8 h-2 rounded-full ${idx <= currentDeck ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Completude:</span>
              <span className="font-bold text-blue-600">{Math.round((currentDeck + 1) / DECKS.length * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckNavigation;
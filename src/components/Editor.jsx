import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Info, AlertCircle,
  BookOpen, CheckCircle2, Save, Send, X,
  Target, Users2, MapPin, Cpu, ClipboardList,
  Calendar, DollarSign, TrendingUp, BarChart3,
  RotateCcw, ShieldAlert, Lock
} from 'lucide-react';
import HudBorder from './HudBorder';
import SectiLogo from './SectiLogo';
import DeckNavigation from './DeckNavigation';
import RenderInput from './RenderInput';
import RenderSelect from './RenderSelect';
import { DECKS } from '../utils/decks';
import { HELP_TEXT } from '../utils/helpText';

const Editor = ({ currentProject, updateField, setCurrentDeck, currentDeck, setView, saveProject }) => {
  const [deckInfoVisible, setDeckInfoVisible] = useState(false);
  const [activeHelp, setActiveHelp] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const isReadOnly = currentProject.status && currentProject.status !== 'Em Rascunho';

  const handleFieldFocus = (field) => {
    if (!isReadOnly && HELP_TEXT[field]) setActiveHelp(HELP_TEXT[field]);
  };

  const handleFieldBlur = () => setActiveHelp(null);

  const triggerSave = () => {
    if (isReadOnly) return;
    setModalMode('confirmSave');
  };

  const triggerFinalize = () => {
    if (isReadOnly) return;
    setModalMode('confirmFinalize');
  };

  const executeAction = async (isFinalizing = false) => {
    const status = isFinalizing ? 'Em Análise' : null;
    setModalMode(null);
    await saveProject(status);
    setModalMode(isFinalizing ? 'successFinalize' : 'successSave');
    if (!isFinalizing) {
      setTimeout(() => setModalMode(null), 2000);
    }
  };

  const renderDeckContent = () => {
    switch (currentDeck) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 md:col-span-2">
              <RenderSelect
                label="Natureza da Proposta" field="natureza" options={[{ value: 'projeto', label: 'Projeto' }, { value: 'programa', label: 'Programa' }]} required
                value={currentProject.natureza} onChange={(val) => updateField('natureza', val)} onFocus={() => handleFieldFocus('natureza')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <RenderInput
                label="Título do Programa/Projeto" field="titulo" placeholder="Insira o título oficial" required
                value={currentProject.titulo} onChange={(val) => updateField('titulo', val)} onFocus={() => handleFieldFocus('titulo')} onBlur={handleFieldBlur}
                disabled={isReadOnly}
              />
            </div>
            <RenderInput
              label="Instituição Proponente" field="instituicao" required
              value={currentProject.instituicao} onChange={(val) => updateField('instituicao', val)} onFocus={() => handleFieldFocus('instituicao')} onBlur={handleFieldBlur}
              disabled={isReadOnly}
            />
            <RenderInput
              label="Unidade Executora" field="unidade" placeholder="Ex: Coordenação Técnica" required
              value={currentProject.unidade} onChange={(val) => updateField('unidade', val)} onFocus={() => handleFieldFocus('unidade')} onBlur={handleFieldBlur}
              disabled={isReadOnly}
            />
            <RenderInput
              label="Parceiros" field="parceiros"
              value={currentProject.parceiros} onChange={(val) => updateField('parceiros', val)} onFocus={() => handleFieldFocus('parceiros')} onBlur={handleFieldBlur}
              disabled={isReadOnly}
            />
            <RenderInput
              label="Período de Execução" field="periodo" placeholder="Ex: 12 meses" required
              value={currentProject.periodo} onChange={(val) => updateField('periodo', val)} onFocus={() => handleFieldFocus('periodo')} onBlur={handleFieldBlur}
              disabled={isReadOnly}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <RenderInput label="Caracterização do Contexto" field="contexto" height="h-32" required value={currentProject.contexto} onChange={(val) => updateField('contexto', val)} onFocus={() => handleFieldFocus('contexto')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Problema ou Demanda" field="problemaDemanda" height="h-28" required value={currentProject.problemaDemanda} onChange={(val) => updateField('problemaDemanda', val)} onFocus={() => handleFieldFocus('problemaDemanda')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Evidências" field="evidencias" height="h-24" value={currentProject.evidencias} onChange={(val) => updateField('evidencias', val)} onFocus={() => handleFieldFocus('evidencias')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Justificativa" field="justificativa" height="h-28" required value={currentProject.justificativa} onChange={(val) => updateField('justificativa', val)} onFocus={() => handleFieldFocus('justificativa')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Marcos Legais" field="marcosLegais" height="h-24" value={currentProject.marcosLegais} onChange={(val) => updateField('marcosLegais', val)} onFocus={() => handleFieldFocus('marcosLegais')} onBlur={handleFieldBlur} disabled={isReadOnly} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <RenderInput label="Objetivo Geral" field="objetivoGeral" height="h-24" required value={currentProject.objetivoGeral} onChange={(val) => updateField('objetivoGeral', val)} onFocus={() => handleFieldFocus('objetivoGeral')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Objetivos Específicos" field="objetivosEspecificos" height="h-32" required value={currentProject.objetivosEspecificos} onChange={(val) => updateField('objetivosEspecificos', val)} onFocus={() => handleFieldFocus('objetivosEspecificos')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Público Atendido" field="publicoAlvo" height="h-20" required value={currentProject.publicoAlvo} onChange={(val) => updateField('publicoAlvo', val)} onFocus={() => handleFieldFocus('publicoAlvo')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Perfil do Público" field="perfilPublico" height="h-20" value={currentProject.perfilPublico} onChange={(val) => updateField('perfilPublico', val)} onFocus={() => handleFieldFocus('perfilPublico')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RenderInput label="Local de Execução" field="localExecucao" required value={currentProject.localExecucao} onChange={(val) => updateField('localExecucao', val)} onFocus={() => handleFieldFocus('localExecucao')} onBlur={handleFieldBlur} disabled={isReadOnly} />
              <RenderSelect label="Escala" field="escala" options={[{ value: 'local', label: 'Local' }, { value: 'estadual', label: 'Estadual' }]} required value={currentProject.escala} onChange={(val) => updateField('escala', val)} onFocus={() => handleFieldFocus('escala')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <RenderInput label="Descrição das Ações" field="descricaoAcoes" height="h-32" required value={currentProject.descricaoAcoes} onChange={(val) => updateField('descricaoAcoes', val)} onFocus={() => handleFieldFocus('descricaoAcoes')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Plano de Ação Detalhado" field="planoAcao" height="h-40" value={currentProject.planoAcao} onChange={(val) => updateField('planoAcao', val)} onFocus={() => handleFieldFocus('planoAcao')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Cronograma" field="cronograma" height="h-32" value={currentProject.cronograma} onChange={(val) => updateField('cronograma', val)} onFocus={() => handleFieldFocus('cronograma')} onBlur={handleFieldBlur} disabled={isReadOnly} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <RenderInput label="Recursos Humanos" field="recursosHumanos" height="h-28" required value={currentProject.recursosHumanos} onChange={(val) => updateField('recursosHumanos', val)} onFocus={() => handleFieldFocus('recursosHumanos')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Recursos Materiais" field="recursosMateriais" height="h-28" value={currentProject.recursosMateriais} onChange={(val) => updateField('recursosMateriais', val)} onFocus={() => handleFieldFocus('recursosMateriais')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Recursos Financeiros" field="recursosFinanceiros" height="h-24" value={currentProject.recursosFinanceiros} onChange={(val) => updateField('recursosFinanceiros', val)} onFocus={() => handleFieldFocus('recursosFinanceiros')} onBlur={handleFieldBlur} disabled={isReadOnly} />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <RenderInput label="Resultados Esperados" field="resultadosEsperados" height="h-32" required value={currentProject.resultadosEsperados} onChange={(val) => updateField('resultadosEsperados', val)} onFocus={() => handleFieldFocus('resultadosEsperados')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Indicadores de Processo" field="indicadoresProcesso" height="h-24" value={currentProject.indicadoresProcesso} onChange={(val) => updateField('indicadoresProcesso', val)} onFocus={() => handleFieldFocus('indicadoresProcesso')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Indicadores de Resultado" field="indicadoresResultado" height="h-24" value={currentProject.indicadoresResultado} onChange={(val) => updateField('indicadoresResultado', val)} onFocus={() => handleFieldFocus('indicadoresResultado')} onBlur={handleFieldBlur} disabled={isReadOnly} />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <RenderInput label="Sustentabilidade" field="sustentabilidade" height="h-28" value={currentProject.sustentabilidade} onChange={(val) => updateField('sustentabilidade', val)} onFocus={() => handleFieldFocus('sustentabilidade')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Riscos e Mitigação" field="riscos" height="h-28" value={currentProject.riscos} onChange={(val) => updateField('riscos', val)} onFocus={() => handleFieldFocus('riscos')} onBlur={handleFieldBlur} disabled={isReadOnly} />
            <RenderInput label="Referências" field="referencias" height="h-32" value={currentProject.referencias} onChange={(val) => updateField('referencias', val)} onFocus={() => handleFieldFocus('referencias')} onBlur={handleFieldBlur} disabled={isReadOnly} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8 relative pb-20 lg:pb-0">

      {/* MODAL SYSTEM - RESPONSIVE */}
      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-t-3xl md:rounded-[2rem] w-full max-w-sm shadow-2xl border border-white animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />

            {modalMode === 'confirmSave' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Save size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase mb-2">Salvar Alterações?</h3>
                <p className="text-sm text-slate-500 mb-6">Confirmar a gravação dos dados atuais no sistema?</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => setModalMode(null)} className="flex-1 py-4 md:py-3 text-xs font-bold uppercase text-slate-400">Voltar</button>
                  <button onClick={() => executeAction(false)} className="flex-1 py-4 md:py-3 bg-blue-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg">Confirmar</button>
                </div>
              </div>
            )}

            {modalMode === 'confirmFinalize' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase mb-2">Finalizar Proposta?</h3>
                <p className="text-sm text-slate-500 mb-6">Ao enviar para análise, a edição será bloqueada permanentemente.</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => setModalMode(null)} className="flex-1 py-4 md:py-3 text-xs font-bold uppercase text-slate-400">Revisar</button>
                  <button onClick={() => executeAction(true)} className="flex-1 py-4 md:py-3 bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg">Enviar Agora</button>
                </div>
              </div>
            )}

            {(modalMode === 'successSave' || modalMode === 'successFinalize') && (
              <div className="text-center py-4 animate-in zoom-in-95">
                <div className={`w-16 h-16 ${modalMode === 'successSave' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {modalMode === 'successSave' ? <CheckCircle2 size={40} /> : <Send size={40} />}
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase">Operação Concluída</h3>
                <p className="text-xs text-slate-500">O sistema processou os dados com sucesso.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE STEPS - NAV BAR */}
      <div className="lg:w-72">
        <DeckNavigation currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} />
      </div>

      <div className="flex-1 px-4 lg:px-0">
        <HudBorder className="bg-white border border-slate-100 rounded-2xl lg:rounded-3xl shadow-xl p-4 md:p-8 flex flex-col relative min-h-[calc(100vh-16rem)]">

          {isReadOnly && (
            <div className="absolute top-0 left-0 right-0 bg-slate-800 text-white py-2 px-4 flex items-center justify-center gap-2 z-20">
              <Lock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Visualização em modo de leitura</span>
            </div>
          )}

          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-slate-100 ${isReadOnly ? 'mt-8' : ''}`}>
            <div className="flex items-center gap-3">
              <SectiLogo size="medium" />
              <div>
                <h2 className="text-lg font-black text-slate-800 uppercase leading-none">
                  Módulo {currentDeck + 1}
                </h2>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter mt-1">{DECKS[currentDeck].nome}</p>
              </div>
            </div>

            {!isReadOnly && (
              <button
                onClick={triggerSave}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95"
              >
                <Save size={16} /> Salvar Progresso
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-visible">
            <div className="mb-8">
              <button
                onClick={() => setDeckInfoVisible(!deckInfoVisible)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${DECKS[currentDeck].color.replace('text-', 'bg-')} bg-opacity-10`}>
                    <BookOpen size={18} className={DECKS[currentDeck].color} />
                  </div>
                  <span className="text-xs font-black text-slate-700 uppercase">Instruções de Preenchimento</span>
                </div>
                <ChevronRight size={18} className={`text-slate-400 transition-transform ${deckInfoVisible ? 'rotate-90' : ''}`} />
              </button>

              {deckInfoVisible && (
                <div className="mt-2 p-4 text-xs text-slate-600 bg-white border border-slate-100 rounded-xl leading-relaxed animate-in fade-in slide-in-from-top-1">
                  {DECKS[currentDeck].deckInfo}
                </div>
              )}
            </div>

            {renderDeckContent()}
          </div>

          {/* ACTIONS FOOTER */}
          <div className="mt-12 pt-6 border-t border-slate-100">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2 order-2 md:order-1">
                <div className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded border border-slate-200">
                  Status: {currentProject.status || 'Rascunho'}
                </div>
              </div>
              <div className="flex gap-2 order-1 md:order-2">
                {currentDeck > 0 && (
                  <button onClick={() => setCurrentDeck(currentDeck - 1)} className="flex-1 md:flex-none px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase active:scale-95 transition-all">
                    Anterior
                  </button>
                )}
                {currentDeck < DECKS.length - 1 ? (
                  <button onClick={() => setCurrentDeck(currentDeck + 1)} className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95 transition-all">
                    Próximo
                  </button>
                ) : (
                  <button
                    onClick={triggerFinalize}
                    disabled={isReadOnly}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase shadow-lg transition-all active:scale-95 ${isReadOnly ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white'}`}
                  >
                    Finalizar e Enviar
                  </button>
                )}
              </div>
            </div>
          </div>
        </HudBorder>
      </div>

      {/* TACTICAL GUIDANCE (HELP TOOLTIP) - ADAPTED FOR MOBILE */}
      <div className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-50 border border-slate-700 transition-all duration-300 transform ${activeHelp ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg"><Info className="w-5 h-5 text-blue-400" /></div>
          <div>
            <div className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-1">Orientações Técnicas</div>
            <div className="text-xs font-bold mb-1">{activeHelp?.text}</div>
            {activeHelp?.sub && <div className="text-[10px] text-slate-400 leading-tight">{activeHelp.sub}</div>}
          </div>
          <button onClick={() => setActiveHelp(null)} className="ml-auto text-slate-500 hover:text-white"><X size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
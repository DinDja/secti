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

      {/* HELP CARD - TOP RIGHT POSITION */}
      <div 
        className={`fixed top-6 right-6 z-[110] transition-all duration-500 transform ${activeHelp ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}
      >
        <div 
          className="relative w-[330px] h-[80px] rounded-lg bg-white shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex items-center justify-around gap-[15px] px-[15px] py-[10px] overflow-hidden border border-slate-50"
        >
          {/* Wave Background */}
          <svg 
            className="absolute rotate-90 -left-[31px] top-[32px] w-[80px] fill-[#4777ff3a]" 
            viewBox="0 0 1440 320" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"></path>
          </svg>

          {/* Icon */}
          <div className="w-[35px] h-[35px] flex items-center justify-center bg-[#4777ff48] rounded-full ml-2 shrink-0">
            <svg className="w-[17px] h-[17px] text-[#124fff]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"></path>
              <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"></path>
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center items-start grow overflow-hidden">
            <p className="text-[#124fff] text-base font-bold m-0 leading-tight  w-full">
              {activeHelp?.text || 'Dica Técnica'}
            </p>
            <p className="text-sm text-slate-500 m-0 leading-tight  w-full">
              {activeHelp?.sub || 'Informação relevante para este campo'}
            </p>
          </div>

          {/* Close Icon */}
          <svg 
            onClick={() => setActiveHelp(null)}
            className="w-[18px] h-[18px] text-slate-400 cursor-pointer hover:text-slate-600 transition-colors shrink-0" 
            viewBox="0 0 15 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"></path>
          </svg>
        </div>
      </div>

      {/* MODAL SYSTEM */}
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

      {/* NAVIGATION BAR */}
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
    </div>
  );
};

export default Editor;
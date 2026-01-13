import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileText, Download, ChevronRight, 
  ChevronLeft, CheckCircle2, Globe, Mail, 
  Building2, Microscope, ClipboardCheck, BookOpen,
  User, Hash, ArrowRight, Lock, Target, Layers
} from 'lucide-react';

const SYSTEM_LOGO = 'https://yt3.googleusercontent.com/Hsou_iacREhlofNDcucMU1sulad_5S8JRzH8tjQZoCtTa2Pe7z-EGJWrC3rzUj5fEMGw6kRW1EU=s900-c-k-c0x00ffffff-no-rj';

const DECKS = [
  { nome: 'Capa', icon: <Building2 className="w-4 h-4" /> },
  { nome: 'Fundamentação', range: [0, 4], icon: <BookOpen className="w-4 h-4" /> },
  { nome: 'Engenharia', range: [5, 9], icon: <Microscope className="w-4 h-4" /> },
  { nome: 'Estratégia', range: [10, 14], icon: <Globe className="w-4 h-4" /> },
  { nome: 'Conclusão', range: [15, 19], icon: <ClipboardCheck className="w-4 h-4" /> }
];

const App = () => {
  const [loading, setLoading] = useState(false);
  const [libReady, setLibReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [formData, setFormData] = useState({
    numeroNota: '',
    assunto: '',
    tecnicoResponsavel: '',
    setor: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    perguntas: Array.from({ length: 20 }, (_, i) => ({
      pergunta: [
        "Natureza da Proposição", "Justificativa Técnica", "Objetivos da Proposta", "Público-alvo e Abrangência", "Recursos e Infraestrutura",
        "Análise de Viabilidade", "Metodologia de Implementação", "Cronograma de Atividades", "Mapeamento de Riscos", "Estratégia de Mitigação",
        "Impacto Socioeconômico Estadual", "Alinhamento com o PPA", "Articulação Interinstitucional", "Marcos Legais e Propriedade", "Sustentabilidade do Projeto",
        "Indicadores de Sucesso", "Monitoramento e Avaliação", "Estimativa Orçamentária", "Conclusão e Parecer Técnico", "Considerações Finais"
      ][i] || `Tópico de Análise ${i + 1}`,
      resposta: ''
    }))
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => setLibReady(true);
    document.body.appendChild(script);
  }, []);

  const handleLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setAuthenticated(true);
      setUserEmail(provider === 'google' ? 'analista.gov@gmail.com' : 'tecnico.secti@outlook.com');
      setLoading(false);
    }, 1200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (index, value) => {
    const newPerguntas = [...formData.perguntas];
    newPerguntas[index].resposta = value;
    setFormData(prev => ({ ...prev, perguntas: newPerguntas }));
  };

  const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));

  const generatePDF = async () => {
    if (!window.jspdf || !window.jspdf.jsPDF || isDownloading) return;

    try {
      setIsDownloading(true);
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(0, 70, 145);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setFillColor(209, 36, 33);
      doc.rect(0, 45, pageWidth, 2, 'F');

      try {
        const logoData = await toDataURL(SYSTEM_LOGO);
        doc.addImage(logoData, 'JPEG', 15, 7, 30, 30);
      } catch (e) {
        doc.setTextColor(255, 255, 255);
        doc.text("SECTI-BA", 20, 25);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('GOVERNO DO ESTADO DA BAHIA', 55, 22);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('SECRETARIA DE CIÊNCIA, TECNOLOGIA E INOVAÇÃO - SECTI', 55, 30);

      doc.setTextColor(0, 70, 145);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTA TÉCNICA', pageWidth / 2, 85, { align: 'center' });
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.text(`Identificação: ${formData.numeroNota || 'NT-SECTI-BA-2026'}`, pageWidth / 2, 95, { align: 'center' });

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const assuntoLines = doc.splitTextToSize(formData.assunto.toUpperCase() || 'ASSUNTO DA ANÁLISE', pageWidth - 60);
      doc.text(assuntoLines, pageWidth / 2, 115, { align: 'center' });

      doc.setDrawColor(220, 220, 220);
      doc.line(40, 140, pageWidth - 40, 140);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('RESPONSÁVEL TÉCNICO:', 40, 160);
      doc.setFont('helvetica', 'bold');
      doc.text(formData.tecnicoResponsavel.toUpperCase() || 'NOME DO ANALISTA', 40, 167);

      doc.setFont('helvetica', 'normal');
      doc.text('SETOR DE ORIGEM:', 40, 180);
      doc.setFont('helvetica', 'bold');
      doc.text(formData.setor.toUpperCase() || 'GABINETE / SECTI', 40, 187);

      doc.setFont('helvetica', 'normal');
      doc.text('DATA DE EMISSÃO:', 40, 200);
      doc.setFont('helvetica', 'bold');
      doc.text(new Date(formData.dataEmissao).toLocaleDateString('pt-BR'), 40, 207);

      doc.addPage();
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RELATÓRIO DE ANÁLISE TÉCNICA', 20, 20);
      doc.setDrawColor(209, 36, 33);
      doc.line(20, 25, 60, 25);

      let yPos = 40;
      doc.setFontSize(10);

      formData.perguntas.forEach((item, index) => {
        const pLines = doc.splitTextToSize(`${String(index + 1).padStart(2, '0')}. ${item.pergunta.toUpperCase()}`, pageWidth - 40);
        const rLines = doc.splitTextToSize(item.resposta || 'Nada consta.', pageWidth - 40);
        const spaceNeeded = (pLines.length * 6) + (rLines.length * 5) + 15;

        if (yPos + spaceNeeded > pageHeight - 30) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 70, 145);
        doc.text(pLines, 20, yPos);
        yPos += (pLines.length * 5) + 3;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(rLines, 20, yPos);
        yPos += (rLines.length * 5) + 12;
      });

      setTimeout(() => {
        doc.save(`NT_SECTI_BAHIA_${formData.numeroNota.replace(/\//g, '-') || 'REGISTRO'}.pdf`);
        setIsDownloading(false);
      }, 3500);
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-all duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <style>{customStyles}</style>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className={`absolute top-0 left-0 w-full h-full ${isDark ? 'bg-[radial-gradient(circle_at_20%_20%,#1e3a8a_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_20%_20%,#bfdbfe_0%,transparent_50%)]'}`}></div>
        </div>

        <div className={`relative w-full max-w-[480px] border rounded-[2.5rem] p-8 md:p-14 shadow-2xl transition-all duration-500 overflow-hidden ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
          <div className="absolute top-6 right-6 scale-[0.55]">
            <div className="toggleWrapper">
              <input className="input" id="dn" type="checkbox" checked={!isDark} onChange={toggleTheme} />
              <label className="toggle" htmlFor="dn">
                <span className="toggle__handler">
                  <span className="crater crater--1"></span>
                  <span className="crater crater--2"></span>
                  <span className="crater crater--3"></span>
                </span>
                <span className="star star--1"></span>
                <span className="star star--2"></span>
                <span className="star star--3"></span>
                <span className="star star--4"></span>
                <span className="star star--5"></span>
                <span className="star star--6"></span>
              </label>
            </div>
          </div>

          <div className="mb-12 text-center">
            <div className="inline-block relative p-1.5 rounded-full bg-gradient-to-tr from-[#004691] to-[#D12421] mb-8 group">
              <img 
                src={SYSTEM_LOGO} 
                alt="Logo SECTI" 
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-slate-900 object-cover bg-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full border-4 border-slate-900">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter italic">SECTI-BA</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Gabinete de Tecnologia</p>
          </div>

          <div className="space-y-4">
            <div className={`p-1 rounded-2xl transition-all ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => handleLogin('google')} 
                className={`group w-full flex items-center justify-between font-black py-5 px-8 rounded-xl transition-all active:scale-[0.98] ${isDark ? 'bg-slate-950 text-white hover:bg-black' : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200'}`}
              >
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-[#D12421]" />
                  <span className="text-[10px] uppercase tracking-widest">Acesso via Google</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>

            <div className={`p-1 rounded-2xl transition-all ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => handleLogin('outlook')} 
                className={`group w-full flex items-center justify-between font-black py-5 px-8 rounded-xl transition-all active:scale-[0.98] ${isDark ? 'bg-blue-800 text-white hover:bg-blue-700' : 'bg-[#004691] text-white hover:opacity-90'}`}
              >
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest">Acesso Outlook</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-slate-600">
            <Lock className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Sessão Criptografada</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-all duration-500 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      <style>{customStyles}</style>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <header className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 mb-8 md:mb-12 border-b pb-8 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-4 md:gap-6">
            <img src={SYSTEM_LOGO} alt="Logo" className="w-14 h-14 md:w-20 md:h-20 rounded-2xl object-cover bg-white border border-slate-800 shadow-xl" />
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>SECTI-BA</h1>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 truncate max-w-[150px]">{userEmail}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="scale-50 origin-left md:origin-right">
              <div className="toggleWrapper">
                <input className="input" id="dn_header" type="checkbox" checked={!isDark} onChange={toggleTheme} />
                <label className="toggle" htmlFor="dn_header">
                  <span className="toggle__handler">
                    <span className="crater crater--1"></span>
                    <span className="crater crater--2"></span>
                    <span className="crater crater--3"></span>
                  </span>
                  <span className="star star--1"></span>
                  <span className="star star--2"></span>
                  <span className="star star--3"></span>
                  <span className="star star--4"></span>
                  <span className="star star--5"></span>
                  <span className="star star--6"></span>
                </label>
              </div>
            </div>

            <nav className={`w-full md:w-auto flex gap-1 p-1 rounded-2xl border overflow-x-auto no-scrollbar transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              {DECKS.map((deck, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentDeck(idx)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    currentDeck === idx ? 'bg-[#004691] text-white shadow-xl' : 'text-slate-500 hover:text-blue-500'
                  }`}
                >
                  {deck.icon} <span className="hidden sm:inline">{deck.nome}</span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="min-h-[400px]">
          {currentDeck === 0 ? (
            <section className={`p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-[10px] font-black mb-8 md:mb-12 flex items-center gap-4 text-blue-500 uppercase tracking-[0.2em]">
                <User className="w-5 h-5" /> Protocolo de Identificação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Expediente</label>
                  <input type="text" name="numeroNota" value={formData.numeroNota} onChange={handleInputChange} 
                    className={`w-full border rounded-xl p-5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all text-sm font-bold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    placeholder="NT 056/2026-SECTI" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Técnico Analista</label>
                  <input type="text" name="tecnicoResponsavel" value={formData.tecnicoResponsavel} onChange={handleInputChange}
                    className={`w-full border rounded-xl p-5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all text-sm font-bold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    placeholder="Nome Completo" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Assunto Principal</label>
                  <textarea name="assunto" value={formData.assunto} onChange={handleInputChange}
                    className={`w-full border rounded-xl p-5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all min-h-[100px] font-bold resize-none text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    placeholder="Descrição formal do objeto..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Coordenação</label>
                  <input type="text" name="setor" value={formData.setor} onChange={handleInputChange}
                    className={`w-full border rounded-xl p-5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all text-sm font-bold ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    placeholder="Setor Interno" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Data</label>
                  <input type="date" name="dataEmissao" value={formData.dataEmissao} onChange={handleInputChange}
                    className={`w-full border rounded-xl p-5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-bold text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                </div>
              </div>
            </section>
          ) : (
            <section className={`p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h2 className="text-[10px] font-black flex items-center gap-4 text-blue-500 uppercase tracking-[0.2em]">
                  {DECKS[currentDeck].icon} {DECKS[currentDeck].nome}
                </h2>
                <div className="flex items-center gap-4">
                  <div className={`h-1.5 w-32 md:w-48 rounded-full overflow-hidden transition-colors ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(formData.perguntas.filter(p => p.resposta).length / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 whitespace-nowrap">
                    {Math.round((formData.perguntas.filter(p => p.resposta).length / 20) * 100)}%
                  </span>
                </div>
              </div>
              <div className="space-y-8">
                {formData.perguntas.slice(DECKS[currentDeck].range[0], DECKS[currentDeck].range[1] + 1).map((item, idx) => {
                  const actualIndex = DECKS[currentDeck].range[0] + idx;
                  
                  if (actualIndex === 0) {
                    return (
                      <div key={actualIndex} className={`p-6 md:p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-950/40 border-slate-800 hover:border-blue-500/20' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="space-y-6">
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-3">
                            <Hash className="w-3 h-3" /> {actualIndex + 1}. {item.pergunta}
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                              onClick={() => handleAnswerChange(0, 'Projeto')}
                              className={`relative group p-6 rounded-2xl border-2 transition-all text-left ${formData.perguntas[0].resposta === 'Projeto' ? 'border-blue-600 bg-blue-600/5 shadow-lg' : 'border-transparent hover:border-blue-500/30'}`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${formData.perguntas[0].resposta === 'Projeto' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-blue-500'}`}>
                                  <Target className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className={`font-black text-sm uppercase tracking-wider mb-1 ${formData.perguntas[0].resposta === 'Projeto' ? 'text-blue-500' : 'text-slate-300'}`}>Projeto</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">Ação com início e fim determinados, focada em entregar um resultado específico e temporário.</p>
                                </div>
                              </div>
                            </button>

                            <button 
                              onClick={() => handleAnswerChange(0, 'Programa')}
                              className={`relative group p-6 rounded-2xl border-2 transition-all text-left ${formData.perguntas[0].resposta === 'Programa' ? 'border-[#D12421] bg-red-600/5 shadow-lg' : 'border-transparent hover:border-red-500/30'}`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${formData.perguntas[0].resposta === 'Programa' ? 'bg-[#D12421] text-white' : 'bg-slate-800/50 text-red-500'}`}>
                                  <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className={`font-black text-sm uppercase tracking-wider mb-1 ${formData.perguntas[0].resposta === 'Programa' ? 'text-red-500' : 'text-slate-300'}`}>Programa</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">Conjunto articulado de projetos e outras ações, visando objetivos de longo prazo e continuidade.</p>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={actualIndex} className={`p-6 md:p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-950/40 border-slate-800 hover:border-blue-500/30' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="space-y-5">
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-3">
                          <Hash className="w-3 h-3" /> {actualIndex + 1}. {item.pergunta}
                        </span>
                        <textarea value={item.resposta} onChange={(e) => handleAnswerChange(actualIndex, e.target.value)}
                          className={`w-full border rounded-2xl p-6 min-h-[140px] focus:ring-1 focus:ring-blue-500/40 outline-none resize-none transition-all text-sm leading-relaxed font-medium ${isDark ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}
                          placeholder="Fundamentação técnica do analista..." />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        <footer className="mt-8 md:mt-16 flex flex-col md:flex-row justify-between items-center gap-6 pb-24">
          <div className="flex w-full md:w-auto gap-3 md:gap-4">
            <button onClick={() => setCurrentDeck(prev => Math.max(0, prev - 1))} disabled={currentDeck === 0}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 border px-8 py-5 rounded-2xl font-black text-[9px] uppercase transition-all disabled:opacity-20 shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <button onClick={() => setCurrentDeck(prev => Math.min(DECKS.length - 1, prev + 1))} disabled={currentDeck === DECKS.length - 1}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 border px-8 py-5 rounded-2xl font-black text-[9px] uppercase transition-all disabled:opacity-20 shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center">
            <div className="container" onClick={generatePDF}>
              <label className="label">
                <input type="checkbox" className="input" checked={isDownloading} readOnly />
                <span className="circle">
                  <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19V5m0 14-4-4m4 4 4-4"></path>
                  </svg>
                  <div className="square"></div>
                </span>
                <p className="title">Download</p>
                <p className="title">Concluído</p>
              </label>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const customStyles = `
/* Theme Toggle Styles */
.toggleWrapper { overflow: hidden; color: white; position: relative; }
.toggleWrapper .input { position: absolute; left: -99em; }
.toggle { cursor: pointer; display: inline-block; position: relative; width: 90px; height: 50px; background-color: #83d8ff; border-radius: 84px; transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95); }
.toggle__handler { display: inline-block; position: relative; z-index: 1; top: 3px; left: 3px; width: 44px; height: 44px; background-color: #ffcf96; border-radius: 50px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55); transform: rotate(-45deg); }
.toggle__handler .crater { position: absolute; background-color: #e8cda5; opacity: 0; transition: opacity 200ms ease-in-out; border-radius: 100%; }
.toggle__handler .crater--1 { top: 18px; left: 10px; width: 4px; height: 4px; }
.toggle__handler .crater--2 { top: 28px; left: 22px; width: 6px; height: 6px; }
.toggle__handler .crater--3 { top: 10px; left: 25px; width: 8px; height: 8px; }
.star { position: absolute; background-color: #fff; transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95); border-radius: 50%; }
.star--1 { top: 10px; left: 35px; z-index: 0; width: 30px; height: 3px; }
.star--2 { top: 18px; left: 28px; z-index: 1; width: 30px; height: 3px; }
.star--3 { top: 27px; left: 40px; z-index: 0; width: 30px; height: 3px; }
.star--4, .star--5, .star--6 { opacity: 0; transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95); }
.star--4 { top: 16px; left: 11px; z-index: 0; width: 2px; height: 2px; transform: translate3d(3px, 0, 0); }
.star--5 { top: 32px; left: 17px; z-index: 0; width: 3px; height: 3px; transform: translate3d(3px, 0, 0); }
.star--6 { top: 36px; left: 28px; z-index: 0; width: 2px; height: 2px; transform: translate3d(3px, 0, 0); }
.input:checked + .toggle { background-color: #749dd6; }
.input:checked + .toggle .toggle__handler { background-color: #ffe5b5; transform: translate3d(40px, 0, 0) rotate(0); }
.input:checked + .toggle .toggle__handler .crater { opacity: 1; }
.input:checked + .toggle .star--1 { width: 2px; height: 2px; }
.input:checked + .toggle .star--2 { width: 4px; height: 4px; transform: translate3d(-5px, 0, 0); }
.input:checked + .toggle .star--3 { width: 2px; height: 2px; transform: translate3d(-7px, 0, 0); }
.input:checked + .toggle .star--4, .input:checked + .toggle .star--5, .input:checked + .toggle .star--6 { opacity: 1; transform: translate3d(0, 0, 0); }

/* Download Button Styles Refined */
.container { display: flex; justify-content: center; align-items: center; }
.label { background-color: transparent; border: 2px solid #004691; display: flex; align-items: center; border-radius: 50px; width: 185px; cursor: pointer; transition: all 0.4s ease; padding: 5px; position: relative; }
.label::before { content: ""; position: absolute; top: 0; bottom: 0; left: 0; right: 0; background-color: #fff; width: 8px; height: 8px; transition: all 0.4s ease; border-radius: 100%; margin: auto; opacity: 0; visibility: hidden; }
.label .input { display: none; }
.label .title { font-size: 13px; font-weight: 900; text-transform: uppercase; color: #004691; transition: all 0.4s ease; position: absolute; left: 65px; bottom: 19px; width: 100px; text-align: left; }
.label .title:last-child { opacity: 0; visibility: hidden; }
.label .circle { height: 45px; width: 45px; min-width: 45px; border-radius: 50%; background-color: #004691; display: flex; justify-content: center; align-items: center; transition: all 0.4s ease; position: relative; overflow: hidden; }
.label .circle .icon { color: #fff; width: 22px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); transition: all 0.4s ease; }
.label .circle .square { aspect-ratio: 1; width: 12px; border-radius: 2px; background-color: #fff; opacity: 0; visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); transition: all 0.4s ease; }
.label .circle::before { content: ""; position: absolute; left: 0; top: 0; background-color: #D12421; width: 100%; height: 0; transition: all 0.4s ease; }
.label:has(.input:checked) { width: 57px; animation: installed 0.4s ease 3.5s forwards; }
.label:has(.input:checked)::before { animation: rotate 3s ease-in-out 0.4s forwards; }
.label .input:checked + .circle { animation: pulse 1s forwards, circleDelete 0.2s ease 3.5s forwards; rotate: 180deg; }
.label .input:checked + .circle::before { animation: installing 3s ease-in-out forwards; }
.label .input:checked + .circle .icon { opacity: 0; visibility: hidden; }
.label .input:checked ~ .circle .square { opacity: 1; visibility: visible; }
.label .input:checked ~ .title { opacity: 0; visibility: hidden; }
.label .input:checked ~ .title:last-child { animation: showInstalledMessage 0.4s ease 3.5s forwards; color: #23ae23; left: 56px; }
@keyframes pulse { 0% { scale: 0.95; box-shadow: 0 0 0 0 rgba(0, 70, 145, 0.7); } 70% { scale: 1; box-shadow: 0 0 0 16px rgba(0, 70, 145, 0); } 100% { scale: 0.95; box-shadow: 0 0 0 0 rgba(0, 70, 145, 0); } }
@keyframes installing { from { height: 0; } to { height: 100%; } }
@keyframes rotate { 0% { transform: rotate(-90deg) translate(27px) rotate(0); opacity: 1; visibility: visible; } 99% { transform: rotate(270deg) translate(27px) rotate(270deg); opacity: 1; visibility: visible; } 100% { opacity: 0; visibility: hidden; } }
@keyframes installed { 100% { width: 160px; border-color: rgb(35, 174, 35); } }
@keyframes circleDelete { 100% { opacity: 0; visibility: hidden; } }
@keyframes showInstalledMessage { 100% { opacity: 1; visibility: visible; } }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default App;
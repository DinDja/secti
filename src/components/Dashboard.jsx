import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Check,
  Users,
  Bookmark,
  FolderOpen,
  Eye,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Filter,
  ShieldCheck,
  Download,
  X,
  FileSpreadsheet,
  Settings,
  Trash2
} from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import AnimatedButton from './AnimatedButton';
import HudBorder from './HudBorder';
import SectiLogo from './SectiLogo';
import { EMPTY_PROJECT } from '../utils/constants';

const Dashboard = ({ setView, setCurrentProject, setCurrentDeck, projects, user }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.role === 'admin';

  const myProjects = useMemo(() => {
    const base = isAdmin 
      ? projects 
      : projects.filter(p => p.userId === user?.uid);
    
    return base.filter(p => 
      p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, isAdmin, user?.uid, searchTerm]);

  useEffect(() => {
    if (isAdmin) {
      const fetchTotalUsers = async () => {
        try {
          const snap = await getDocs(collection(db, 'users'));
          setTotalUsers(snap.size);
        } catch (error) {
          console.error("Erro no escaneamento:", error);
        }
      };
      fetchTotalUsers();
    }
  }, [isAdmin]);

  const formatUpdateDate = (timestamp) => {
    if (!timestamp) return 'Sem registro';
    if (timestamp.seconds) {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(new Date(timestamp.seconds * 1000));
    }
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Data Inválida' : 
      new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
  };

  const exportToExcel = () => {
    const header = [
      ["RELATÓRIO DE DIRETRIZES E PROJETOS - SECTI.OS"],
      ["GERADO EM:", new Date().toLocaleString('pt-BR')],
      [""], 
      ["ID", "TÍTULO DO PROJETO", "RESPONSÁVEL", "EMAIL", "NATUREZA", "STATUS ATUAL", "ÚLTIMA ATUALIZAÇÃO"]
    ];

    const rows = myProjects.map((p, index) => [
      index + 1,
      p.titulo?.toUpperCase() || 'SEM TÍTULO',
      p.responsavel?.toUpperCase() || 'NÃO INFORMADO',
      p.email?.toLowerCase() || '-',
      p.natureza?.toUpperCase() || '-',
      p.status?.toUpperCase() || 'RASCUNHO',
      formatUpdateDate(p.updatedAt)
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...header, ...rows]);

    worksheet['!cols'] = [
      { wch: 5 },  
      { wch: 50 }, 
      { wch: 35 }, 
      { wch: 40 }, 
      { wch: 15 }, 
      { wch: 20 }, 
      { wch: 25 }, 
    ];

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SectiOS_Radar");

    XLSX.writeFile(workbook, `SECTI_RELATORIO_${new Date().getTime()}.xlsx`);
  };

  const initiateStatusChange = (projectId, newStatus) => {
    if (!projectId) return;
    setPendingUpdate({ id: projectId, status: newStatus });
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingUpdate?.id) return;
    try {
      const projectRef = doc(db, 'projects', pendingUpdate.id);
      await updateDoc(projectRef, {
        status: pendingUpdate.status,
        updatedAt: new Date()
      });
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setPendingUpdate(null);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error("Erro na manobra:", error);
    }
  };

  const initiateDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete?.id) return;
    try {
      await deleteDoc(doc(db, 'projects', projectToDelete.id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado': return 'bg-emerald-500';
      case 'Em Análise': return 'bg-blue-500';
      case 'Revisão Necessária': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 md:pb-10 px-4 md:px-0 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4">
          <div className="bg-white p-8 rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-amber-50 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Confirmar Curso?</h3>
              <p className="text-slate-500 mt-2 mb-8">Alterar status para <span className="font-bold text-slate-900">{pendingUpdate?.status}</span>?</p>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={confirmStatusChange} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">Confirmar</button>
                <button onClick={() => setShowConfirmModal(false)} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest active:scale-95 transition-all">Abortar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4">
          <div className="bg-white p-8 rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 border-t-8 border-rose-500">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-rose-50 rounded-full mb-4">
                <Trash2 className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Apagar Projeto?</h3>
              <p className="text-slate-500 mt-2 mb-8">Esta ação removerá <span className="font-bold text-slate-900">{projectToDelete?.titulo}</span> permanentemente da frota.</p>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={confirmDelete} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">Excluir Agora</button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest active:scale-95 transition-all">Manter</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[310] animate-in slide-in-from-top-full">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="bg-emerald-500 p-1 rounded-full"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Atualizado com Sucesso</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-3">
          <SectiLogo size="small" className="md:hidden" />
          <SectiLogo size="large" className="hidden md:block" />
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none title">INFO<span>.SECTI</span></h1>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{isAdmin ? 'Painel de controle' : 'Meus Projetos'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <AnimatedButton onClick={() => { setCurrentProject({...EMPTY_PROJECT, responsavel: user.name, email: user.email, userId: user.uid}); setView('editor'); }} text="Novo" />
          </div>
        </div>
      </div>

      <div className="top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 flex gap-4 items-center">
        <div className="input-container flex-1 md:flex-none">
          <input 
            type="text" 
            className="input" 
            placeholder="RASTREAR PROJETO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="icon"> 
            <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <path opacity="1" d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path opacity="1" d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path opacity="1" d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path> 
              </g>
            </svg>
          </span>
        </div>
        <button className="bg-white border-[2.5px] border-black p-[7px] md:hidden">
          <Filter className="w-5 h-5 text-black" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
        <HudBorder className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Documentos</div>
          <div className="text-3xl md:text-5xl font-black text-slate-900">{myProjects.length}</div>
        </HudBorder>
        <HudBorder className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
          <div className="text-blue-500 text-[9px] font-black uppercase tracking-widest mb-1">{isAdmin ? 'Técnicos' : 'Em Análise'}</div>
          <div className="text-3xl md:text-5xl font-black text-slate-900">{isAdmin ? totalUsers : myProjects.filter(p => p.status === 'Em Análise').length}</div>
        </HudBorder>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Radar de Atividade</h2>
          <div className="button-container scale-[0.6] origin-right md:scale-[0.75]">
            <button className="brutalist-button excel-variant" onClick={exportToExcel}>
              <div className="excel-logo">
                <FileSpreadsheet className="excel-icon" />
              </div>
              <div className="button-text">
                <span>GERAR</span>
                <span>PLANILHA</span>
              </div>
            </button>
          </div>
        </div>

        {myProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((project) => (
              <div key={project.id || Math.random()} className="secti-card">
                <div className="background"></div>
                
                <div className="card-content relative z-10">
                  <div className="flex justify-between items-start pointer-events-none">
                    <div className={`${getStatusColor(project.status)} text-[8px] font-black uppercase px-2 py-1 rounded-md text-white tracking-widest pointer-events-auto`}>
                      {project.status}
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={(e) => { 
                          e.preventDefault();
                          e.stopPropagation(); 
                          initiateDelete(project); 
                        }}
                        className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-lg active:scale-90 pointer-events-auto relative z-[50]"
                        title="Eliminar Alvo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-black text-white uppercase text-sm leading-tight drop-shadow-md">
                      {project.titulo || 'Projeto Fantasma'}
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] text-white/70 font-bold uppercase mt-2">
                      <Users className="w-3 h-3" /> {project.responsavel}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-white/50 font-black uppercase mt-1">
                      <Clock className="w-3 h-3" /> {formatUpdateDate(project.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="box box1 z-20" onClick={() => { setCurrentProject(project); setView('editor'); }}>
                  <span className="icon-card"><Eye className="icon-svg" /></span>
                </div>

                <div className="box box2 z-20" onClick={exportToExcel}>
                  <span className="icon-card"><FileSpreadsheet className="icon-svg" /></span>
                </div>

                <div className="box box3 z-20">
                  {isAdmin ? (
                    <select 
                      onChange={(e) => initiateStatusChange(project.id, e.target.value)}
                      className="bg-transparent border-none text-[8px] font-black uppercase text-white outline-none w-full text-center"
                      value={project.status}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option className="text-slate-900" value="Em Rascunho">Rascunho</option>
                      <option className="text-slate-900" value="Em Análise">Análise</option>
                      <option className="text-slate-900" value="Revisão Necessária">Revisão</option>
                      <option className="text-slate-900" value="Aprovado">Aprovar</option>
                    </select>
                  ) : (
                    <span className="icon-card"><ShieldCheck className="icon-svg" /></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-30">
            <LayoutDashboard className="w-12 h-12 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Nenhum sinal no radar</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <button 
          onClick={() => { setCurrentProject({...EMPTY_PROJECT, responsavel: user.name, email: user.email, userId: user.uid}); setView('editor'); }}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all border-4 border-white"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
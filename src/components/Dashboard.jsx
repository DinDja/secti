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
  X
} from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import AnimatedButton from './AnimatedButton';
import HudBorder from './HudBorder';
import SectiLogo from './SectiLogo';
import { DECKS } from '../utils/decks';
import { EMPTY_PROJECT } from '../utils/constants';

const Dashboard = ({ setView, setCurrentProject, setCurrentDeck, projects, user }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Aprovado': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'Em Análise': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Revisão Necessária': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 md:pb-10 px-4 md:px-0 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4">
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

      {showSuccessModal && (
        <div className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[210] animate-in slide-in-from-top-full">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="bg-emerald-500 p-1 rounded-full"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Missão Atualizada com Sucesso</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-3">
          <SectiLogo size="small" className="md:hidden" />
          <SectiLogo size="large" className="hidden md:block" />
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">SECTI.OS</h1>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{isAdmin ? 'Painel de controle' : 'Meus Projetos'}</p>
          </div>
        </div>
        <div className="hidden md:block">
          <AnimatedButton onClick={() => { setCurrentProject({...EMPTY_PROJECT, responsavel: user.name, email: user.email, userId: user.uid}); setView('editor'); }} text="Novo Projeto" />
        </div>
      </div>

      <div className=" top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rastrear projeto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
          />
        </div>
        <button className="bg-white border border-slate-200 p-3.5 rounded-2xl md:hidden">
          <Filter className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
        <HudBorder className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Documentos</div>
          <div className="text-3xl md:text-5xl font-black text-slate-900">{myProjects.length}</div>
        </HudBorder>
        <HudBorder className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-1">Aprovados</div>
          <div className="text-3xl md:text-5xl font-black text-slate-900">{myProjects.filter(p => p.status === 'Aprovado').length}</div>
        </HudBorder>
        <HudBorder className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
          <div className="text-blue-500 text-[9px] font-black uppercase tracking-widest mb-1">{isAdmin ? 'Usuários' : 'Em Análise'}</div>
          <div className="text-3xl md:text-5xl font-black text-slate-900">{isAdmin ? totalUsers : myProjects.filter(p => p.status === 'Em Análise').length}</div>
        </HudBorder>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Radar de Atividade</h2>
        {myProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProjects.map((project) => (
              <div key={project.id || Math.random()} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(project.status)}`}>
                    {project.status}
                  </div>
                  <button onClick={() => { setCurrentProject(project); setView('editor'); }} className="text-slate-300 group-hover:text-blue-600 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-black text-slate-800 uppercase text-sm mb-1 leading-tight">{project.titulo || 'Projeto Fantasma'}</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <Users className="w-3 h-3" /> {project.responsavel}
                </div>
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                    <select 
                      onChange={(e) => initiateStatusChange(project.id, e.target.value)}
                      className="flex-1 bg-slate-50 border-none text-[10px] font-black uppercase py-2 px-3 rounded-xl outline-none"
                      value={project.status}
                    >
                      <option value="Em Rascunho">Rascunho</option>
                      <option value="Em Análise">Análise</option>
                      <option value="Revisão Necessária">Revisão</option>
                      <option value="Aprovado">Aprovar</option>
                    </select>
                  </div>
                )}
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
import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, ClipboardCheck, LogOut,
  ChevronLeft, ChevronRight, FolderOpen, User
} from 'lucide-react';
import SectiLogo from './SectiLogo';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  view,
  setView,
  projects,
  setCurrentProject,
  setCurrentDeck,
  setAuthenticated,
  user
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleLogout = () => {
    setAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  const visibleProjects = isAdmin
    ? projects
    : projects.filter(p => p.userId === user?.uid);

  const totalPages = Math.ceil(visibleProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = visibleProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <aside style={{ height: '100%' }} className={`relative z-30 flex flex-col border-r border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-500 shadow-xl ${sidebarOpen ? 'w-72' : 'w-20'}`}>

      <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-white/50">
        <div className={`flex items-center gap-3 transition-all ${!sidebarOpen && 'justify-center w-full'}`}>
          <SectiLogo size="medium" className={sidebarOpen ? "" : "mx-auto"} />
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none title">INFO<span>.SECTI</span></h1>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Estrutura de Projetos</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-24 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-blue-50 transition-colors z-50"
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      <div className="flex-1 py-4 overflow-y-auto no-scrollbar flex flex-col">
        <nav className="px-3 space-y-1">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all border border-transparent group ${view === 'dashboard'
              ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm'
              : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
              }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>}
          </button>

          <div className="px-3 py-2">
            {sidebarOpen && (
              <div className="flex justify-between items-center mb-4 mt-6">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {isAdmin ? "Global" : "Meus Documentos"}
                </div>
                {totalPages > 1 && (
                  <div className="flex gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-0.5 rounded border border-slate-200 disabled:opacity-30 hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={10} />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-0.5 rounded border border-slate-200 disabled:opacity-30 hover:bg-white transition-colors"
                    >
                      <ChevronRight size={10} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {paginatedProjects.map((p, index) => (
                <div
                  key={p.id || `sidebar-p-${index}`}
                  onClick={() => {
                    setCurrentProject(p);
                    setView('editor');
                    setCurrentDeck(0);
                  }}
                  className={`group relative p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-md cursor-pointer transition-all ${!sidebarOpen && 'justify-center flex'}`}
                  title={!sidebarOpen ? p.titulo : ""}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.status === 'Aprovado' ? 'bg-emerald-400' :
                      p.status === 'Em Análise' ? 'bg-blue-400' :
                        p.status === 'Revisão Necessária' ? 'bg-rose-400' : 'bg-slate-300'
                      }`}></div>

                    {sidebarOpen && (
                      <div className="overflow-hidden flex-1">
                        <div className="text-xs font-bold text-slate-700 group-hover:text-blue-600 truncate transition-colors">
                          {p.titulo || 'Missão sem Título'}
                        </div>
                        <div className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                          <span className={`px-1 rounded ${p.natureza === 'projeto' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                            {p.natureza}
                          </span>
                          <span>•</span>
                          <span className="truncate">{p.status || 'Rascunho'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {visibleProjects.length === 0 && sidebarOpen && (
                <div className="flex flex-col items-center py-8 px-2 text-center opacity-40">
                  <FolderOpen className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter italic">Nenhum sinal no radar</p>
                </div>
              )}
            </div>

            {sidebarOpen && totalPages > 1 && (
              <div className="mt-2 text-[9px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                Página {currentPage} de {totalPages}
              </div>
            )}
          </div>
        </nav>

        {sidebarOpen && (
          <div className="mt-auto px-3 pt-4 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 px-3">Manual de Bordo</div>
            <a href="#" className="flex items-center gap-3 p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-xs font-medium">
              <FileText className="w-4 h-4" />
              <span>Manual do Usuário</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-xs font-medium">
              <ClipboardCheck className="w-4 h-4" />
              <span>Modelo Oficial</span>
            </a>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0 w-10 h-10">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full border-2 border-white shadow-sm object-cover bg-slate-200"
                />
              ) : (
                <div className="w-full h-full rounded-full border-2 border-white shadow-sm bg-slate-200 flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">
                  {user?.name || "Navegador"}
                </div>
                <div className={`text-[8px] inline-block px-1 rounded font-black uppercase mt-0.5 ${isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {user?.role || "user"}
                </div>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {!sidebarOpen && (
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Encerrar Sessão"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
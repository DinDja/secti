import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  User
} from 'lucide-react';
import SectiLogo from './SectiLogo';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  view,
  setView,
  projects = [],
  setCurrentProject,
  setCurrentDeck,
  setAuthenticated,
  user
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isAdmin = user?.role === 'admin';

  const visibleProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    if (isAdmin) return projects;
    return projects.filter((p) => p?.userId === user?.uid);
  }, [projects, isAdmin, user?.uid]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(visibleProjects.length / itemsPerPage);
    return Math.max(1, pages);
  }, [visibleProjects.length]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(Math.max(1, prev), totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (!sidebarOpen) setCurrentPage(1);
  }, [sidebarOpen]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProjects = useMemo(() => {
    return visibleProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [visibleProjects, startIndex]);

  const handleLogout = () => setAuthenticated(false);
  const goPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const NavButton = ({ active, icon: Icon, label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-center gap-4 p-3 rounded-xl transition-all border group',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2',
        active
          ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm'
          : 'border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900'
      ].join(' ')}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span
        className={[
          'text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300',
          sidebarOpen ? 'opacity-100 max-w-[220px] delay-150' : 'opacity-0 max-w-0'
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  );

  return (
    <aside
      className={[
        'relative z-30 h-full flex flex-col border-r border-slate-200',
        'bg-white/80 backdrop-blur-md shadow-xl transition-[width] duration-500 ease-in-out',
        'overflow-visible', // <-- permite o botão “sair” sem ser cortado
        sidebarOpen ? 'w-72' : 'w-20'
      ].join(' ')}
    >
      {/* Conteúdo interno com clip (evita vazamento de texto durante animação) */}
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-white/50">
          <div className={`flex items-center gap-3 w-full ${sidebarOpen ? '' : 'justify-center'}`}>
            <SectiLogo size="medium" className={sidebarOpen ? '' : 'mx-auto'} />

            <div
              className={[
                'min-w-0 transition-all duration-300 overflow-hidden',
                sidebarOpen ? 'opacity-100 max-w-[220px] delay-150' : 'opacity-0 max-w-0'
              ].join(' ')}
            >
              <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none title whitespace-nowrap">
                INFO<span>.SECTI</span>
              </h1>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest whitespace-nowrap">
                Estrutura de Projetos
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 py-4 overflow-y-auto no-scrollbar flex flex-col">
          <nav className="px-3 space-y-1">
            <NavButton
              active={view === 'dashboard'}
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setView('dashboard')}
            />

            <div className="px-1 py-2">
              <div
                className={[
                  'px-2 pt-2',
                  sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'
                ].join(' ')}
              >
                <div className="flex justify-between items-center mb-4 mt-6">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {isAdmin ? 'Global' : 'Meus Documentos'}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={goPrevPage}
                        aria-label="Página anterior"
                        className="p-0.5 rounded border border-slate-200 disabled:opacity-30 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                      >
                        <ChevronLeft size={10} />
                      </button>
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={goNextPage}
                        aria-label="Próxima página"
                        className="p-0.5 rounded border border-slate-200 disabled:opacity-30 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                      >
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {paginatedProjects.map((p, index) => {
                  const status = p?.status || 'Rascunho';
                  const natureza = p?.natureza || 'projeto';
                  const titulo = p?.titulo || 'Missão sem Título';

                  const dot =
                    status === 'Aprovado'
                      ? 'bg-emerald-400'
                      : status === 'Em Análise'
                        ? 'bg-blue-400'
                        : status === 'Revisão Necessária'
                          ? 'bg-rose-400'
                          : 'bg-slate-300';

                  const badge =
                    natureza === 'projeto'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600';

                  return (
                    <button
                      type="button"
                      key={p?.id || `sidebar-p-${index}`}
                      onClick={() => {
                        setCurrentProject(p);
                        setView('editor');
                        setCurrentDeck(0);
                      }}
                      title={!sidebarOpen ? titulo : ''}
                      className={[
                        'w-full text-left group relative rounded-xl border transition-all',
                        'hover:border-slate-200 hover:bg-white hover:shadow-md',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2',
                        sidebarOpen ? 'p-3' : 'p-3 flex justify-center',
                        'border-transparent'
                      ].join(' ')}
                    >
                      <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'gap-0'}`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />

                        <div
                          className={[
                            'min-w-0 flex-1 transition-all duration-300 overflow-hidden',
                            sidebarOpen ? 'opacity-100 max-w-[220px] delay-150' : 'opacity-0 max-w-0'
                          ].join(' ')}
                        >
                          <div className="text-xs font-bold text-slate-700 group-hover:text-blue-600 truncate transition-colors">
                            {titulo}
                          </div>
                          <div className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                            <span className={`px-1 rounded ${badge}`}>{natureza}</span>
                            <span>•</span>
                            <span className="truncate">{status}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {visibleProjects.length === 0 && sidebarOpen && (
                  <div className="flex flex-col items-center py-8 px-2 text-center opacity-50">
                    <FolderOpen className="w-8 h-8 mb-2 text-slate-300" />
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter italic">
                      Nenhum sinal no radar
                    </p>
                  </div>
                )}
              </div>

              {sidebarOpen && totalPages > 1 && (
                <div className="mt-3 text-[9px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                  Página {currentPage} de {totalPages}
                </div>
              )}
            </div>
          </nav>

          
        </div>

        {/* Footer / User */}
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
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>

              <div
                className={[
                  'min-w-0 transition-all duration-300 overflow-hidden',
                  sidebarOpen ? 'opacity-100 max-w-[180px] delay-150' : 'opacity-0 max-w-0'
                ].join(' ')}
              >
                <div className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">
                  {user?.name || 'Navegador'}
                </div>
                <div
                  className={[
                    'text-[8px] inline-block px-1 rounded font-black uppercase mt-0.5',
                    isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  ].join(' ')}
                >
                  {user?.role || 'user'}
                </div>
              </div>
            </div>

            {sidebarOpen && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                title="Encerrar Sessão"
                aria-label="Encerrar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {!sidebarOpen && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full flex justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              title="Encerrar Sessão"
              aria-label="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Toggle (fora do “clip”) */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
        className="absolute -right-3 top-24 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-blue-50 transition-colors z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;

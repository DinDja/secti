import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Save, Database, Shield } from 'lucide-react';
import { db, auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';

import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import DigitalBackground from './components/DigitalBackground';
import DownloadButton from './components/DownloadButton';
import ChipLoader from './components/ChipLoader';

import { EMPTY_PROJECT } from './utils/constants';
import { STYLES } from './styles/global';
import { generateProjectPDF } from './utils/pdfGenerator';

const App = () => {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({ ...EMPTY_PROJECT });
  const [currentDeck, setCurrentDeck] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: userSnap.exists() ? userSnap.data().role : 'user'
        };

        setUser(userData);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
      setIsLoggingIn(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authenticated && user) {
      let q;
      if (user.role === 'admin') {
        q = collection(db, 'projects');
      } else {
        q = query(collection(db, 'projects'), where('userId', '==', user.uid));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projectsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }));
        setProjects(projectsList);
      }, (error) => {
        console.error("Erro na sincronização:", error.message);
      });

      return () => unsubscribe();
    }
  }, [authenticated, user]);

  const updateField = (field, value) => {
    setCurrentProject(prev => ({ ...prev, [field]: value }));
  };

const saveProject = async () => {
  const base = {
    ...currentProject,
    email: user.email,
    updatedAt: new Date(),
  };

  const { id, ...dataToSave } = base;

  if (id) {
    // NÃO MEXE EM userId NO UPDATE
    const { userId, ...safeUpdate } = dataToSave;
    await updateDoc(doc(db, 'projects', id), safeUpdate);
    return { ...base, userId: currentProject.userId };
  } else {
    // SÓ DEFINE userId NA CRIAÇÃO
    const createData = { ...dataToSave, userId: user.uid };
    const docRef = await addDoc(collection(db, 'projects'), createData);
    const saved = { ...base, userId: user.uid, id: docRef.id };
    setCurrentProject(saved);
    return saved;
  }
};



  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const savedData = await saveProject('download');

      await new Promise(resolve => setTimeout(resolve, 2000));

      await generateProjectPDF(savedData);
    } catch (error) {
      console.error("Falha na exportação:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const navigateTo = (newView) => {
    setView(newView);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  if (isLoggingIn) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <style>{STYLES}</style>
        <DigitalBackground />
        <ChipLoader />
      </div>
    );
  }

  if (!authenticated) {
    return <Login setAuthenticated={setAuthenticated} isLoggingIn={isLoggingIn} setIsLoggingIn={setIsLoggingIn} />;
  }

  return (
    <div className="flex h-[100dvh] bg-slate-50 text-slate-700 font-sans overflow-hidden">
      <style>{STYLES}</style>

      {/* Background com z-index mínimo */}
      <div className="fixed inset-0 z-0">
        <DigitalBackground />
      </div>

      {/* Overlay Mobile: removido backdrop-blur para evitar o problema visual */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-[40] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar com z-index superior ao overlay */}
      <div className={`fixed inset-y-0 left-0 z-[50] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          view={view}
          setView={navigateTo}
          projects={projects}
          setCurrentProject={setCurrentProject}
          setCurrentDeck={setCurrentDeck}
          setAuthenticated={setAuthenticated}
          user={user}
        />
      </div>

      <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white/95 flex items-center justify-between px-4 md:px-6 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600 hidden md:block" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-800">
                {view === 'dashboard' ? 'Painel Central' : 'Editor de Proposta'}
              </span>
            </div>
          </div>

          {view === 'editor' && (
            <div className="flex items-center gap-2">
              <DownloadButton isDownloading={isDownloading} onToggle={handleDownload} />
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          {view === 'dashboard' ? (
            <Dashboard
              setView={setView}
              setCurrentProject={setCurrentProject}
              setCurrentDeck={setCurrentDeck}
              projects={projects}
              user={user}
            />
          ) : (
            <Editor
              currentProject={currentProject}
              updateField={updateField}
              setCurrentDeck={setCurrentDeck}
              currentDeck={currentDeck}
              isDownloading={isDownloading}
              setView={setView}
              saveProject={saveProject}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
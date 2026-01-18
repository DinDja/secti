import React, { useState } from 'react';
import { GoogleIcon, SmartphoneIcon } from './Icons';
import ChipLoader from './ChipLoader';
import SectiLogo from './SectiLogo';
import DigitalBackground from './DigitalBackground';
import { STYLES } from '../styles/global';

import { auth, db } from '../firebase/config'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const Login = ({ setAuthenticated, isLoggingIn, setIsLoggingIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const syncUserToFirestore = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || formData.name || 'Usuário Novo',
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        role: 'user'
      });
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await syncUserToFirestore(res.user);
      } else {
        const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        await syncUserToFirestore(res.user);
      }

      await delay(2000);
      setAuthenticated(true);
    } catch (error) {
      const errorMessages = {
        'auth/user-not-found': "Conta não encontrada. Por favor, realize o cadastro.",
        'auth/wrong-password': "Senha incorreta para este oficial.",
        'auth/email-already-in-use': "Este email já está registrado na frota."
      };
      alert(errorMessages[error.code] || "Erro na autenticação: " + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      await syncUserToFirestore(res.user);

      await delay(2000);
      setAuthenticated(true);
    } catch (error) {
      console.error("Erro Google:", error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 overflow-hidden relative">
      <style>{STYLES}</style>
      <style>{`
        .login-split-container {
          display: block !important;
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .login-banner-side {
          display: flex !important;
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 55vh !important;
          background-color: #0f172a;
          clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%);
          z-index: 1;
        }

        .login-logo-overlay {
          display: none !important;
        }

        .login-form-side {
          display: flex !important;
          position: relative;
          z-index: 10;
          height: 100vh !important;
          width: 100% !important;
          align-items: center;
          justify-content: center;
          background: transparent !important;
        }

        .banner-content-wrapper {
          position: absolute;
          top: 50px;
          left: 24px;
          right: 24px;
          z-index: 5;
        }

        @media (min-width: 768px) {
          .login-split-container {
            display: flex !important;
          }
          .login-banner-side {
            position: relative !important;
            height: 100vh !important;
            width: 50% !important;
            clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
          }
          .login-logo-overlay {
            display: flex !important;
          }
          .login-form-side {
            width: 50% !important;
            z-index: auto;
          }
          .banner-content-wrapper {
            top: auto;
            bottom: 40px;
            left: 40px;
          }
        }
      `}</style>
      
      <DigitalBackground />
      {isLoggingIn && <ChipLoader />}

      <div className="login-split-container animate-in fade-in zoom-in-95 duration-700">
        <div className="login-banner-side bg-slate-900">
          <div className="login-logo-overlay">
            <SectiLogo size="large" className="login-logo" />
          </div>
          
          <div className="banner-content-wrapper text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 uppercase tracking-tighter">SECTI.OS</h1>
            <p className="text-base md:text-lg opacity-90 font-medium">Sistema de Estruturação de Projetos</p>
            <p className="text-xs md:text-sm opacity-70 mt-2 md:mt-4 font-bold uppercase tracking-widest text-blue-300">Governo do Estado da Bahia</p>
          </div>
        </div>

        <div className="login-form-side">
          <div className="login-wrapper scale-90 md:scale-100">
            <div className="radio-input">
              <label className={`label ${!isSignUp ? 'checked' : ''}`} onClick={() => setIsSignUp(false)}>
                <span className="text" style={{fontSize: "12px"}}>Entrar</span>
              </label>
              <label className={`label ${isSignUp ? 'checked' : ''}`} onClick={() => setIsSignUp(true)}>
                <span className="text" style={{fontSize: "12px"}}>Cadastrar</span>
              </label>
            </div>

            <div className={`flip-card__inner ${isSignUp ? 'is-flipped' : ''}`}>
              <div className="flip-card__front">
                <div className="title">SECTI<span>.OS</span></div>
                <form className="flip-card__form" onSubmit={handleEmailAuth}>
                  <input 
                    className="flip-card__input" 
                    placeholder="Email Institucional" 
                    type="email" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                  <input 
                    className="flip-card__input" 
                    placeholder="Senha" 
                    type="password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                  <button className="flip-card__btn">INICIAR SESSÃO</button>
                </form>
                <div className="social-section">
                  <div className="social-divider">via</div>
                  <div className="social-row">
                    <button onClick={handleGoogleLogin} type="button" className="social-btn group">
                      <GoogleIcon /> <span className="group-hover:text-blue-600 transition-colors">Google</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flip-card__back">
                <div className="title">NOVA <span>CREDENCIAL</span></div>
                <form className="flip-card__form" onSubmit={handleEmailAuth}>
                  <input 
                    className="flip-card__input" 
                    placeholder="Nome e Sobrenome" 
                    type="text" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                  <input 
                    className="flip-card__input" 
                    placeholder="Email Institucional" 
                    type="email" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                  <input 
                    className="flip-card__input" 
                    placeholder="Definir Senha" 
                    type="password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                  <button className="flip-card__btn">SOLICITAR REGISTRO</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
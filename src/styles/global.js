const STYLES = `
  /* --- RESET & GLOBAL --- */
  * { box-sizing: border-box; }
  
  /* --- DASHBOARD STYLES (LIGHT THEME) --- */
  .animated-button {
    position: relative; display: flex; align-items: center; gap: 4px; padding: 12px 30px;
    border: 4px solid; border-color: transparent; font-size: 12px; background-color: inherit;
    border-radius: 100px; font-weight: 700; color: #7c3aed; box-shadow: 0 0 0 2px #7c3aed;
    cursor: pointer; overflow: hidden; transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    text-transform: uppercase; letter-spacing: 1px;
  }
  .animated-button svg {
    position: absolute; width: 20px; fill: #7c3aed; z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .animated-button .arr-1 { right: 16px; }
  .animated-button .arr-2 { left: -25%; }
  .animated-button .circle {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 20px; height: 20px; background-color: #7c3aed; border-radius: 50%;
    opacity: 0; transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .animated-button .text {
    position: relative; z-index: 1; transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .animated-button:hover { box-shadow: 0 0 0 12px transparent; color: #ffffff; border-radius: 12px; }
  .animated-button:hover .arr-1 { right: -25%; }
  .animated-button:hover .arr-2 { left: 16px; }
  .animated-button:hover .text { transform: translateX(12px); }
  .animated-button:hover svg { fill: #ffffff; }
  .animated-button:active { scale: 0.95; box-shadow: 0 0 0 4px #7c3aed; }
  .animated-button:hover .circle { width: 220px; height: 220px; opacity: 1; }

  /* --- DOWNLOAD BUTTON (EXACT USER CSS) --- */
  .dl-container {
    padding: 0; margin: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;
    display: flex; justify-content: center; align-items: center;
  }

  .dl-label {
    background-color: transparent; border: 2px solid rgb(91, 91, 240); display: flex;
    align-items: center; border-radius: 50px; width: 160px; cursor: pointer;
    transition: all 0.4s ease; padding: 5px; position: relative; height: 55px; 
  }

  .dl-label::before {
    content: ""; position: absolute; top: 0; bottom: 0; left: 0; right: 0;
    background-color: #fff; width: 8px; height: 8px; transition: all 0.4s ease;
    border-radius: 100%; margin: auto; opacity: 0; visibility: hidden;
  }

  .dl-input { display: none; }

  .dl-title {
    font-size: 17px; color: rgb(91, 91, 240); transition: all 0.4s ease;
    position: absolute; right: 18px; bottom: 14px; text-align: center; font-weight: bold;
  }

  .dl-title:last-child { opacity: 0; visibility: hidden; }

  .dl-circle {
    height: 45px; width: 45px; border-radius: 50%; background-color: rgb(91, 91, 240);
    display: flex; justify-content: center; align-items: center; transition: all 0.4s ease;
    position: relative; box-shadow: 0 0 0 0 rgb(255, 255, 255); overflow: hidden;
  }

  .dl-circle .dl-icon {
    color: #fff; width: 30px; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); transition: all 0.4s ease;
  }

  .dl-circle .dl-square {
    aspect-ratio: 1; width: 15px; border-radius: 2px; background-color: #fff;
    opacity: 0; visibility: hidden; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); transition: all 0.4s ease;
  }

  .dl-circle::before {
    content: ""; position: absolute; left: 0; top: 0; background-color: #3333a8;
    width: 100%; height: 0; transition: all 0.4s ease;
  }

  .dl-label:has(.dl-input:checked) { width: 57px; animation: installed 0.4s ease 3.5s forwards; }
  .dl-label:has(.dl-input:checked)::before { animation: rotate 3s ease-in-out 0.4s forwards; }
  
  .dl-label .dl-input:checked + .dl-circle {
    animation: pulse 1s forwards, circleDelete 0.2s ease 3.5s forwards; rotate: 180deg;
  }
  
  .dl-label .dl-input:checked + .dl-circle::before { animation: installing 3s ease-in-out forwards; }
  .dl-label .dl-input:checked + .dl-circle .dl-icon { opacity: 0; visibility: hidden; }
  .dl-label .dl-input:checked ~ .dl-circle .dl-square { opacity: 1; visibility: visible; }
  .dl-label .dl-input:checked ~ .dl-title { opacity: 0; visibility: hidden; }
  .dl-label .dl-input:checked ~ .dl-title:last-child { animation: showInstalledMessage 0.4s ease 3.5s forwards; }

  @keyframes pulse {
    0% { scale: 0.95; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
    70% { scale: 1; box-shadow: 0 0 0 16px rgba(255, 255, 255, 0); }
    100% { scale: 0.95; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
  }
  @keyframes installing { from { height: 0; } to { height: 100%; } }
  @keyframes rotate {
    0% { transform: rotate(-90deg) translate(27px) rotate(0); opacity: 1; visibility: visible; }
    99% { transform: rotate(270deg) translate(27px) rotate(270deg); opacity: 1; visibility: visible; }
    100% { opacity: 0; visibility: hidden; }
  }
  @keyframes installed { 100% { width: 150px; border-color: rgb(35, 174, 35); } }
  @keyframes circleDelete { 100% { opacity: 0; visibility: hidden; } }
  @keyframes showInstalledMessage { 100% { opacity: 1; visibility: visible; right: 56px; color: rgb(35, 174, 35); } }

  /* --- LOADER --- */
  .loader-wrapper { position: fixed; inset: 0; z-index: 100; display: flex; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
  .secti-loader { display: flex; margin: 0.25em 0; }
  .secti-inline-block { display: inline-block; }
  .secti-w-2 { width: 0.5em; }
  .secti-dash { animation: sectiDashArray 2s ease-in-out infinite, sectiDashOffset 2s linear infinite; }
  @keyframes sectiDashArray { 0% { stroke-dasharray: 0 1 359 0; } 50% { stroke-dasharray: 0 359 1 0; } 100% { stroke-dasharray: 359 1 0 0; } }
  @keyframes sectiDashOffset { 0% { stroke-dashoffset: 365; } 100% { stroke-dashoffset: 5; } }

  /* --- LOGIN SYSTEM & SPLIT SCREEN --- */
  .login-split-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  /* Lado Esquerdo: Banner (Imagem) */
  .login-banner-side {
    width: 50%;
    height: 100%;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/img/Secti.png'); /* Caminho solicitado */
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 20;
    box-shadow: 10px 0 30px rgba(0,0,0,0.1);
  }

  /* Logo na tela de login */
  .login-logo-overlay {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 30;
  }

  .login-logo {
    height: 60px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    transition: transform 0.3s ease;
  }

  .login-logo:hover {
    transform: scale(1.05);
  }

  /* Lado Direito: Formulário */
  .login-form-side {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  /* Mobile: Esconde a imagem em telas pequenas */
  @media (max-width: 1024px) {
    .login-banner-side { display: none; }
    .login-form-side { width: 100%; }
  }

  .login-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; width: 320px; height: 600px; margin-top: 40px; }

  /* RADIO BUTTONS */
  .radio-input {
    display: flex; align-items: center; gap: 2px;
    background-color: white; 
    padding: 4px; border-radius: 10px;
    z-index: 10; margin-bottom: -15px; position: relative; top: -20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;
  }
  .radio-input input { display: none; }
  .radio-input .label {
    width: 90px; height: 50px;
    background: #f8fafc;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 8px; transition: all 0.1s linear;
    border-top: 1px solid #cbd5e1;
    position: relative; cursor: pointer;
    box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.05);
  }
  .label.checked {
    box-shadow: none; background: #3b82f6;
    border-top: none; transform: translateY(2px);
  }
  .label:first-child { border-top-left-radius: 6px; border-bottom-left-radius: 6px; }
  .label:last-child { border-top-right-radius: 6px; border-bottom-right-radius: 6px; }
  
  .label::before {
    content: ""; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 103%; height: 100%; border-radius: 10px;
    background: linear-gradient(to bottom, transparent 10%, transparent, transparent 90%);
    transition: all 0.1s linear; z-index: -1;
  }
  .label .text {
    color: #64748b; font-size: 15px; line-height: 12px; padding: 0px; font-weight: 800; text-transform: uppercase;
    transition: all 0.1s linear;
  }
  .label.checked .text { color: white; text-shadow: 0px 0px 2px rgba(0,0,0,0.2); }

  /* 3D Card */
  .flip-card__inner { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .is-flipped { transform: rotateY(180deg); }

  .flip-card__front, .flip-card__back {
    position: absolute; width: 100%; height: 100%;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    background: #ffffff;
    border: 1px solid #e2e8f0; border-top: 4px solid #3b82f6;
    border-radius: 20px; padding: 30px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  }
  .flip-card__back { transform: rotateY(180deg); }

  /* Form Elements */
  .title { font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 10px; letter-spacing: 1px; }
  .title span { color: #3b82f6; }
  .flip-card__form { width: 100%; display: flex; flex-direction: column; gap: 15px; }
  .flip-card__input {
    width: 100%; height: 45px; background: #f8fafc; border: 1px solid #cbd5e1;
    border-radius: 8px; padding: 0 15px; color: #334155; font-size: 13px; font-family: sans-serif;
    outline: none; transition: all 0.3s;
  }
  .flip-card__input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  .flip-card__btn {
    width: 100%; height: 45px; background: #3b82f6; color: #ffffff;
    font-weight: 800; text-transform: uppercase; border: none; border-radius: 8px;
    cursor: pointer; font-size: 14px; letter-spacing: 1px; transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 10px;
  }
  .flip-card__btn:hover { background: #2563eb; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
  .flip-card__btn:active { transform: scale(0.98); }

  /* Social */
  .social-section { width: 100%; margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
  .social-divider { display: flex; align-items: center; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .social-divider::before, .social-divider::after { content: ''; flex: 1; height: 1px; background: #cbd5e1; margin: 0 10px; }
  .social-row { display: flex; gap: 10px; }
  .social-btn {
    flex: 1; height: 35px; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: transparent; border: 1px solid #cbd5e1; border-radius: 8px; color: #64748b;
    font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.2s;
  }
  .social-btn:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  /* Logo Styles */
  .secti-logo {
    transition: transform 0.3s ease;
  }
  
  .secti-logo:hover {
    transform: scale(1.05);
  }
  
  .secti-logo-small {
    height: 30px;
  }
  
  .secti-logo-medium {
    height: 40px;
  }
  
  .secti-logo-large {
    height: 200px;
    border-radius: 12px;
  }
`;
export { STYLES };
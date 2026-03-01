import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Globe, User, CheckCircle2, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lang, setLang] = useState('English');

  // --- 🌍 OPTIMIZED MULTILINGUAL DICTIONARY ---
  const content = {
    English: {
      title: "KRISHI CHAKRA",
      subtitle: "NEURAL AGRI-NETWORK // V2.0",
      labelLang: "SELECT SYSTEM DIALECT",
      labelName: "FARMER NAME",
      placeholder: "Input Full Name...",
      btn: "INITIALIZE INTERFACE",
      footer: "SECURE AGRI-TECH TERMINAL // ENCRYPTED"
    },
    Hindi: {
      title: "कृषि चक्र",
      subtitle: "न्यूरल एग्री-नेटवर्क // V2.0",
      labelLang: "प्रणाली भाषा चुनें",
      labelName: "किसान का नाम",
      placeholder: "पूरा नाम दर्ज करें...",
      btn: "इंटरफेस शुरू करें",
      footer: "सुरक्षित कृषि-तकनीक टर्मिनल // एन्क्रिप्टेड"
    },
    Telugu: {
      title: "కృషి చక్రం",
      subtitle: "న్యూరల్ అగ్రి-నెట్‌వర్క్ // V2.0",
      labelLang: "సిస్టమ్ భాషను ఎంచుకోండి",
      labelName: "రైతు పేరు",
      placeholder: "పూర్తి పేరు నమోదు చేయండి...",
      btn: "ఇంటర్‌ఫేస్‌ను ప్రారంభించండి",
      footer: "సురక్షిత అగ్రి-టెక్ టెర్మినల్ // ఎన్‌క్రిప్టెడ్"
    }
  };

  const t = content[lang];

  const handleLogin = () => {
    if (!name.trim()) return alert("CRITICAL ERROR: Operator identification required for system access.");
    localStorage.setItem('krishiUser', JSON.stringify({ name, lang }));
    navigate('/home');
  };

  return (
    <div style={{
      height: '100vh', 
      background: 'radial-gradient(circle at top, #064e3b 0%, #020617 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#f8fafc',
      padding: '20px',
      fontFamily: '"Inter", sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* 1. FUTURISTIC BRANDING SECTION */}
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '45px' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)', 
          width: '110px', 
          height: '110px', 
          borderRadius: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 25px auto',
          border: '2px solid #10b981',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.25)',
          position: 'relative'
        }} className="pulse-icon">
          <Sprout size={55} color="#10b981" style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.6))' }} />
        </div>
        <h1 style={{ margin: '0', fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-1.5px', color: '#f8fafc', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
          {t.title} <span style={{ color: '#10b981' }}>//</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '4px', marginTop: '8px' }}>
          {t.subtitle}
        </p>
      </div>

      {/* 2. SECURE ACCESS TERMINAL */}
      <div className="fade-in" style={{
        background: 'rgba(15, 23, 42, 0.7)', 
        backdropFilter: 'blur(20px)',
        width: '100%', 
        maxWidth: '400px', 
        borderRadius: '32px', 
        padding: '35px', 
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        
        {/* Language Selection Grid */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontWeight: '900', fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1.5px' }}>
          <Globe size={14} color="#10b981"/> {t.labelLang}
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '35px' }}>
          {['English', 'Hindi', 'Telugu'].map((l) => (
            <button 
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: '18px 5px', 
                borderRadius: '18px', 
                border: lang === l ? '2px solid #10b981' : '1px solid #1e293b',
                background: lang === l ? 'rgba(16, 185, 129, 0.12)' : '#020617', 
                color: lang === l ? '#10b981' : '#64748b', 
                fontWeight: '900',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {l === 'English' ? 'ENG' : l === 'Hindi' ? 'HIN' : 'TEL'}
              {lang === l ? <CheckCircle2 size={14} /> : <div style={{height: '14px'}} />}
            </button>
          ))}
        </div>

        {/* Operator Identification */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: '900', fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1.5px' }}>
          <User size={14} color="#10b981"/> {t.labelName}
        </label>
        <div style={{ position: 'relative', marginBottom: '35px' }}>
          <input 
            type="text" 
            placeholder={t.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%', 
              padding: '20px 24px', 
              borderRadius: '18px', 
              border: '1px solid #1e293b', 
              background: '#020617', 
              color: '#f8fafc', 
              fontSize: '1.15rem', 
              fontWeight: '700',
              outline: 'none', 
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#10b981';
              e.target.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#1e293b';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Command Initiation Button */}
        <button 
          onClick={handleLogin}
          style={{
            width: '100%', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white', 
            border: 'none', 
            padding: '22px', 
            borderRadius: '20px', 
            fontSize: '1.25rem', 
            fontWeight: '900',
            letterSpacing: '1.5px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 12px 30px rgba(16, 185, 129, 0.35)'
          }}
          className="btn-active"
        >
          {t.btn} <ArrowRight size={24} strokeWidth={3} />
        </button>

      </div>
      
      {/* 3. TERMINAL STATUS FOOTER */}
      <div style={{ marginTop: '50px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldCheck size={14} color="#10b981" style={{ opacity: 0.6 }} />
        <p style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.4, letterSpacing: '4px', margin: 0 }}>
          {t.footer}
        </p>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes pulseIcon { 0% { transform: scale(1); } 50% { transform: scale(1.03); box-shadow: 0 0 50px rgba(16, 185, 129, 0.4); } 100% { transform: scale(1); } }
        .pulse-icon { animation: pulseIcon 4s infinite ease-in-out; }

        .btn-active:active { transform: scale(0.97); opacity: 0.9; }
        input::placeholder { color: #334155; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default Login;
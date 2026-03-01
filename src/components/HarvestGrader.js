import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, ShieldCheck, IndianRupee, Star, 
  AlertTriangle, CheckCircle, Volume2, VolumeX,
  Zap, Cpu, Scan, FileSearch, Info, History
} from 'lucide-react';
import { gradeHarvest } from './gemini';

const HarvestGrader = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropName, setCropName] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL UI ---
  const ui = {
    English: {
      title: "Vision Grader", sub: "Neural Quality Inspection",
      cropInput: "TARGET CROP PROFILE (e.g., Cotton)",
      uploadBox: "INITIALIZE OPTICAL CAPTURE", fileSelected: "DATA ACQUIRED",
      btnScan: "EXECUTE QUALITY ANALYSIS",
      scanning: [ "Mapping biological color spectrum...", "Simulating moisture saturation...", "Cross-referencing market value indices..." ],
      gradeTitle: "NEURAL GRADE ASSIGNMENT", 
      score: "Quality Index", price: "Projected Value",
      analysis: "Optical Diagnostics", advice: "Negotiation Protocol",
      listen: "Listen to Protocol", stop: "Deactivate Audio",
      reset: "SCAN NEW PROFILE"
    },
    Hindi: {
      title: "विज़न ग्रेडर", sub: "न्यूरल गुणवत्ता जांच",
      cropInput: "फसल का नाम दर्ज करें (जैसे: कपास)",
      uploadBox: "फोटो कैप्चर शुरू करें", fileSelected: "डाटा प्राप्त हुआ",
      btnScan: "गुणवत्ता विश्लेषण चलाएं",
      scanning: [ "रंग स्पेक्ट्रम का मानचित्रण...", "नमी के स्तर का अनुकरण...", "बाजार मूल्य का मिलान..." ],
      gradeTitle: "आधिकारिक गुणवत्ता ग्रेड", 
      score: "गुणवत्ता स्कोर", price: "अनुमानित मूल्य",
      analysis: "ऑप्टिकल रिपोर्ट", advice: "मोलभाव प्रोटोकॉल",
      listen: "सलाह सुनें", stop: "ऑडियो बंद करें",
      reset: "नई फसल स्कैन करें"
    },
    Telugu: {
      title: "విజన్ గ్రేడర్", sub: "న్యూరల్ క్వాలిటీ ఇన్స్పెక్షన్",
      cropInput: "పంట పేరు (ఉదా: పత్తి, వరి)",
      uploadBox: "ఆప్టికల్ క్యాప్చర్ ప్రారంభించండి", fileSelected: "డేటా సేకరించబడింది",
      btnScan: "నాణ్యత విశ్లేషణను రన్ చేయండి",
      scanning: [ "రంగు స్పెక్ట్రంను మ్యాపింగ్ చేస్తోంది...", "తేమ శాతాన్ని అంచనా వేస్తోంది...", "మార్కెట్ ధరతో సరిపోలుస్తోంది..." ],
      gradeTitle: "అధికారిక క్వాలిటీ గ్రేడ్", 
      score: "నాణ్యత స్కోరు", price: "అంచనా వేసిన ధర",
      analysis: "ఆప్టికల్ రిపోర్ట్", advice: "బేరసారాల ప్రోటోకాల్",
      listen: "సలహా వినండి", stop: "ఆడియో ఆపండి",
      reset: "కొత్త పంటను స్కాన్ చేయండి"
    }
  };

  const t = ui[user.lang] || ui['English'];

  const handlePhotoUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!cropName) return alert("Error: Target crop profile required.");
    if (!file) return alert("Error: Biological data (photo) missing.");

    setIsAnalyzing(true);
    setResult(null);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev >= 2 ? prev : prev + 1));
    }, 2000);

    const aiData = await gradeHarvest(file, cropName, user.lang);
    
    clearInterval(stepInterval);
    setIsAnalyzing(false);

    if (aiData) setResult(aiData);
    else alert("Neural analysis failed. Image resolution insufficient.");
  };

  const handleSpeak = (text) => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLangCode = user.lang === 'Telugu' ? 'te-IN' : user.lang === 'Hindi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLangCode;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const getGradeStyle = (grade) => {
    if (grade === 'A') return { color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', icon: <Star size={44} fill="#10b981"/> };
    if (grade === 'B') return { color: '#eab308', glow: 'rgba(234, 179, 8, 0.4)', icon: <CheckCircle size={44} fill="#eab308" color="#020617"/> };
    return { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', icon: <AlertTriangle size={44} fill="#ef4444" color="#020617"/> };
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '90px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* 1. HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(16, 185, 129, 0.1)', border:'1px solid rgba(16, 185, 129, 0.3)', color:'#10b981', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Scan size={24} color="#10b981"/> {t.title}</h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      <div style={{padding: '25px 20px'}}>
        
        {/* 2. UPLOAD TERMINAL */}
        {!result && !isAnalyzing && (
          <div className="fade-in" style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', letterSpacing:'1px' }}>{t.cropInput}</label>
            <input type="text" placeholder="e.g. Cotton" value={cropName} onChange={e=>setCropName(e.target.value)} 
              style={{width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', background:'#020617', color:'#f8fafc', fontSize: '1.1rem', boxSizing:'border-box', marginBottom:'20px', fontWeight:'800', outline:'none'}}/>

            <input type="file" accept="image/*" capture="environment" id="cropUpload" style={{display:'none'}} onChange={handlePhotoUpload} />
            <label htmlFor="cropUpload" style={{
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              background: preview ? '#000' : 'rgba(16, 185, 129, 0.05)', border: preview ? '1px solid #1e293b' : '2px dashed #10b981', 
              padding: preview ? '5px' : '60px 20px', borderRadius:'20px', cursor:'pointer', color:'#10b981', 
              textAlign:'center', overflow:'hidden', position:'relative', height: preview ? '280px' : 'auto', transition: '0.3s'
            }}>
              {preview ? (
                <>
                  <img src={preview} alt="Harvest" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'15px', opacity:0.7}} />
                  <div className="scan-line" style={{position:'absolute', width:'100%', height:'2px', background:'#10b981', boxShadow:'0 0 15px #10b981', top:0}}></div>
                  <div style={{position:'absolute', bottom:'15px', background:'rgba(2, 6, 23, 0.8)', color:'#10b981', padding:'8px 16px', borderRadius:'12px', border:'1px solid #10b981', display:'flex', gap:'8px', alignItems:'center', fontWeight:'900', fontSize:'0.8rem', letterSpacing:'1px'}}>
                    <CheckCircle size={16}/> {t.fileSelected}
                  </div>
                </>
              ) : (
                <>
                  <Camera size={56} style={{marginBottom:'15px', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.5))'}}/>
                  <span style={{fontSize:'1rem', fontWeight:'900', letterSpacing:'1px'}}>{t.uploadBox}</span>
                </>
              )}
            </label>

            <button onClick={handleAnalyze} style={{
                width:'100%', padding:'20px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color:'white', border:'none', 
                borderRadius:'16px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', marginTop:'25px', 
                display:'flex', justifyContent:'center', alignItems:'center', gap:'12px',
                cursor: 'pointer', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
              }}>
              <Zap size={24} fill="white"/> {t.btnScan}
            </button>
          </div>
        )}

        {/* 3. NEURAL SCANNING ANIMATION */}
        {isAnalyzing && (
          <div className="fade-in" style={{textAlign:'center', marginTop:'40px', background:'#0f172a', padding:'50px 20px', borderRadius:'24px', border:'1px solid #1e293b', boxShadow:'0 10px 40px rgba(0,0,0,0.5)'}}>
            <div style={{position:'relative', width:'80px', height:'80px', margin:'0 auto 30px auto'}}>
               <Cpu size={80} color="#10b981" style={{filter:'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))'}} className="pulse-icon"/>
               <div style={{position:'absolute', top:'-10px', left:'-10px', right:'-10px', bottom:'-10px', border:'2px dashed #10b981', borderRadius:'50%'}} className="spin-slow"></div>
            </div>
            <h3 style={{color:'#a7f3d0', fontSize:'1.1rem', letterSpacing:'1px', textTransform:'uppercase', height:'3rem'}}>{t.scanning[scanStep]}</h3>
            <div style={{width:'100%', height:'6px', background:'#020617', borderRadius:'10px', marginTop:'20px', overflow:'hidden', border:'1px solid #1e293b'}}>
               <div style={{width: `${(scanStep + 1) * 33}%`, height:'100%', background:'#10b981', transition:'width 0.5s ease-in-out', boxShadow:'0 0 10px #10b981'}}></div>
            </div>
          </div>
        )}

        {/* 4. FINAL QUALITY REPORT */}
        {result && (
          <div className="fade-in">
            
            {/* Holographic Grade Badge */}
            <div style={{ background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)', border: `2px solid ${getGradeStyle(result.grade).color}`, borderRadius:'24px', padding:'40px 20px', textAlign:'center', marginBottom:'25px', boxShadow:`0 10px 40px ${getGradeStyle(result.grade).glow}`, position:'relative', overflow:'hidden' }}>
              <div style={{position:'absolute', top:0, left:0, padding:'10px', background:`${getGradeStyle(result.grade).color}20`, borderRadius:'0 0 12px 0'}}>
                <ShieldCheck size={20} color={getGradeStyle(result.grade).color}/>
              </div>
              <div style={{display:'flex', justifyContent:'center', marginBottom:'15px'}}>
                {getGradeStyle(result.grade).icon}
              </div>
              <p style={{margin:'0 0 5px 0', fontWeight:'900', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'2px'}}>{t.gradeTitle}</p>
              <h1 style={{fontSize:'6rem', margin:0, fontWeight:'900', color:getGradeStyle(result.grade).color, lineHeight:'1', textShadow:`0 0 20px ${getGradeStyle(result.grade).glow}`}}>{result.grade}</h1>
            </div>

            {/* Metrics Dashboard */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'25px'}}>
              <div style={{background:'#0f172a', padding:'25px 15px', borderRadius:'20px', border:'1px solid #1e293b', textAlign:'center', boxShadow:'0 4px 15px rgba(0,0,0,0.2)'}}>
                <Star size={24} color="#eab308" style={{margin:'0 auto 12px auto', filter:'drop-shadow(0 0 5px rgba(234,179,8,0.4))'}}/>
                <p style={{margin:0, fontSize:'0.75rem', color:'#94a3b8', fontWeight:'800', letterSpacing:'1px'}}>{t.score}</p>
                <h3 style={{margin:'8px 0 0 0', fontSize:'1.6rem', color:'#f8fafc', fontWeight:'900'}}>{result.qualityScore}<span style={{fontSize:'0.9rem', color:'#64748b'}}>/10</span></h3>
              </div>
              <div style={{background:'#0f172a', padding:'25px 15px', borderRadius:'20px', border:'1px solid #1e293b', textAlign:'center', boxShadow:'0 4px 15px rgba(0,0,0,0.2)'}}>
                <IndianRupee size={24} color="#10b981" style={{margin:'0 auto 12px auto', filter:'drop-shadow(0 0 5px rgba(16,185,129,0.4))'}}/>
                <p style={{margin:0, fontSize:'0.75rem', color:'#94a3b8', fontWeight:'800', letterSpacing:'1px'}}>{t.price}</p>
                <h3 style={{margin:'8px 0 0 0', fontSize:'1.3rem', color:'#10b981', fontWeight:'900'}}>{result.estimatedPrice}</h3>
              </div>
            </div>

            {/* AI Diagnostics Card */}
            <div style={{ background: '#0f172a', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '25px', overflow:'hidden', boxShadow:'0 8px 25px rgba(0,0,0,0.3)' }}>
              <div style={{background:'rgba(16, 185, 129, 0.1)', padding:'15px 20px', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', gap:'10px'}}>
                <FileSearch size={20} color="#10b981"/>
                <h3 style={{margin:0, color:'#f8fafc', fontSize:'0.9rem', fontWeight:'900', letterSpacing:'1px'}}>{t.analysis}</h3>
              </div>
              <div style={{padding:'20px'}}>
                 <p style={{color:'#cbd5e1', lineHeight:'1.8', margin:0, fontSize:'1rem'}}>{result.analysis}</p>
              </div>
            </div>

            {/* Negotiation Voice Hub */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #020617 100%)', padding: '25px', borderRadius: '24px', border: '1px solid #312e81', marginBottom:'30px', boxShadow:'0 8px 30px rgba(30, 27, 75, 0.5)' }}>
               <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'15px'}}>
                  <div style={{background:'rgba(56, 189, 248, 0.1)', padding:'10px', borderRadius:'12px'}}>
                    <Info size={24} color="#38bdf8"/>
                  </div>
                  <h3 style={{margin:0, color:'#f8fafc', fontSize:'1rem', fontWeight:'900', letterSpacing:'1px'}}>{t.advice}</h3>
               </div>
               
               <p style={{color:'#93c5fd', lineHeight:'1.7', margin:'0 0 20px 0', fontWeight:'700', fontSize:'1.05rem', borderLeft:'3px solid #38bdf8', paddingLeft:'15px'}}>{result.negotiationAdvice}</p>
               
               <button onClick={() => handleSpeak(result.negotiationAdvice)} className={speaking ? "pulse-voice" : ""}
                style={{ 
                  width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
                  background: speaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: 'white', fontSize: '1.05rem', fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.3s ease'
                }}>
                 {speaking ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                 {speaking ? t.stop : t.listen}
               </button>
            </div>

            <button onClick={() => {setResult(null); setFile(null); setPreview(null); setCropName('');}} 
              style={{width: '100%', padding: '20px', background: 'rgba(148, 163, 184, 0.1)', border: '1px solid #1e293b', color: '#94a3b8', fontWeight: '900', letterSpacing:'2px', fontSize: '0.9rem', cursor:'pointer', borderRadius:'16px'}}>
              {t.reset}
            </button>
          </div>
        )}

      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .scan-line { animation: scanMove 3s infinite linear; }
        @keyframes scanMove { 0% { top: 0; } 100% { top: 100%; } }

        @keyframes pulseIcon { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }

        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 8s linear infinite; }

        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.5); } 70% { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); } 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default HarvestGrader;
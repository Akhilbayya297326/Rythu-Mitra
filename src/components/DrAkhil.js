import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader, Leaf, PlayCircle, Tractor, ArrowLeft, Cpu, ShieldAlert, Volume2, VolumeX, Info, ScanLine } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeCropImage } from './gemini';

const DrAkhil = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState("");
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Get the User's Language from Memory
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const ui = {
    English: {
      title: "Dr. Akhil", sub: "Bio-Tech Disease Scanner",
      tapToSnap: "INITIALIZE OPTICAL SCAN",
      btnDiagnose: "RUN PATHOGEN ANALYSIS", 
      scanning: [ "Initializing Optical Scan...", "Analyzing Biological Signatures...", "Cross-referencing Pathogen Database...", "Generating Treatment Protocol..." ],
      report: "DIAGNOSIS REPORT", actions: "RECOMMENDED ACTIONS",
      btnVideo: "Watch Treatment Protocol", btnRent: "Deploy Sprayer Machinery",
      videoQuery: "Organic treatment for crop disease",
      voiceBanner: "The diagnosis and treatment protocol will be read out loud for clarity.",
      playVoice: "Listen to Diagnosis", stopVoice: "Stop Audio"
    },
    Hindi: {
      title: "डॉ. अखिल", sub: "बायो-टेक रोग स्कैनर",
      tapToSnap: "ऑप्टिकल स्कैन शुरू करें",
      btnDiagnose: "रोगजनक विश्लेषण चलाएं", 
      scanning: [ "ऑप्टिकल स्कैन शुरू किया जा रहा है...", "जैविक हस्ताक्षरों का विश्लेषण...", "रोगजनक डेटाबेस की जाँच...", "उपचार प्रोटोकॉल तैयार किया जा रहा है..." ],
      report: "निदान रिपोर्ट", actions: "सुझाई गई कार्रवाई",
      btnVideo: "उपचार प्रोटोकॉल देखें", btnRent: "स्प्रेयर मशीनरी तैनात करें",
      videoQuery: "फसल रोग का जैविक उपचार",
      voiceBanner: "स्पष्टता के लिए निदान और उपचार प्रोटोकॉल पढ़कर सुनाया जाएगा।",
      playVoice: "निदान सुनें", stopVoice: "ऑडियो रोकें"
    },
    Telugu: {
      title: "డా. అఖిల్", sub: "బయో-టెక్ డిసీజ్ స్కానర్",
      tapToSnap: "ఆప్టికల్ స్కాన్ ప్రారంభించండి",
      btnDiagnose: "వ్యాధి కారక విశ్లేషణను రన్ చేయండి", 
      scanning: [ "ఆప్టికల్ స్కాన్ ప్రారంభించబడుతోంది...", "జీవసంబంధిత లక్షణాలను విశ్లేషిస్తోంది...", "వ్యాధి కారకాల డేటాబేస్ తనిఖీ చేస్తోంది...", "చికిత్స విధానాన్ని సిద్ధం చేస్తోంది..." ],
      report: "రోగ నిర్ధారణ నివేదిక", actions: "సూచించిన చర్యలు",
      btnVideo: "చికిత్స విధానాన్ని చూడండి", btnRent: "స్ప్రేయర్ యంత్రాన్ని అద్దెకు తీసుకోండి",
      videoQuery: "పంట వ్యాధులకు సేంద్రీయ చికిత్స",
      voiceBanner: "రోగ నిర్ధారణ మరియు చికిత్స విధానం మీకు స్పష్టంగా అర్థం కావడానికి చదివి వినిపించబడుతుంది.",
      playVoice: "నివేదికను వినండి", stopVoice: "ఆడియో ఆపండి"
    }
  };

  const t = ui[user.lang] || ui['English'];

  // --- PRE-LOAD VOICES ---
  useEffect(() => {
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setImage(file);
    setDiagnosis(""); 
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => prev >= t.scanning.length - 1 ? prev : prev + 1);
    }, 2000);

    try {
      const result = await analyzeCropImage(image, user.lang);
      clearInterval(stepInterval);
      setDiagnosis(result);
    } catch (err) {
      clearInterval(stepInterval);
      alert("System Error: Optical scan failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- 🔴 BUG-FREE VOICE ASSISTANT WITH CHUNKING 🔴 ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported on this device.");

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // 1. Build Raw Text
    let rawText = `${t.voiceBanner}. ${diagnosis}`;

    // 2. Text Sanitizer: Strip Emojis, Markdown, and Image Tags
    const cleanText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                             .replace(/\[.*?\]/g, '') 
                             .replace(/\*/g, '').replace(/#/g, '');

    // 3. Language Mapping
    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(voice => voice.lang === targetLangCode || voice.lang.startsWith(targetLangCode.substring(0, 2)));

    // 4. Chunking Engine (Fixes Chrome 15-Second Timeout Bug)
    const sentences = cleanText.match(/[^.!?\n]+[.!?\n]+/g) || [cleanText];
    let currentSentenceIndex = 0;

    const speakNextSentence = () => {
      if (currentSentenceIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex].trim());
        utterance.lang = targetLangCode;
        if (specificVoice) utterance.voice = specificVoice;
        utterance.rate = 0.85; // Slower for clarity

        utterance.onend = () => {
          currentSentenceIndex++;
          speakNextSentence();
        };

        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    };

    setIsSpeaking(true);
    speakNextSentence();
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '90px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* 1. HUD HEADER */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)',
        padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(16, 185, 129, 0.1)', border:'1px solid rgba(16, 185, 129, 0.3)', color:'#10b981', padding:'10px', borderRadius:'12px', cursor:'pointer'}}>
             <ArrowLeft size={24}/>
          </button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}>
              <ShieldAlert size={24} color="#10b981" /> {t.title}
            </h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      <div style={{padding: '25px 20px'}}>
        
        {/* 2. BIO-SCANNER CAMERA BOX */}
        {!diagnosis && !loading && (
          <div className="fade-in" style={{background: '#0f172a', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            <input 
              type="file" accept="image/*" capture="environment" 
              id="cameraInput" style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            
            <label htmlFor="cameraInput" style={{
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              background:'rgba(16, 185, 129, 0.05)', border:'2px dashed #10b981', padding: preview ? '10px' : '50px 20px', borderRadius:'16px',
              cursor:'pointer', color:'#10b981', transition:'all 0.3s ease', textAlign:'center', position:'relative', overflow:'hidden'
            }}>
              {preview ? (
                <>
                  <img src={preview} alt="Crop" style={{width:'100%', height:'300px', objectFit:'cover', borderRadius:'12px'}} />
                  <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.2) 50%, transparent 100%)'}} className="scan-line"></div>
                </>
              ) : (
                <>
                  <ScanLine size={64} color="#10b981" style={{marginBottom:'15px', filter:'drop-shadow(0 0 15px rgba(16,185,129,0.6))'}} className="pulse-icon"/>
                  <span style={{fontSize:'1.05rem', fontWeight:'900', letterSpacing:'1px'}}>{t.tapToSnap}</span>
                </>
              )}
            </label>

            <button 
              onClick={handleDiagnose} 
              disabled={!image || loading}
              style={{
                width:'100%', padding:'20px', background: !image ? '#1e293b' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
                color: !image ? '#64748b' : 'white', border:'none', 
                borderRadius:'16px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', marginTop:'25px', 
                display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                cursor: !image ? 'not-allowed' : 'pointer', transition:'all 0.3s ease',
                boxShadow: !image ? 'none' : '0 8px 25px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Cpu size={24}/> {t.btnDiagnose}
            </button>
          </div>
        )}

        {/* 3. SCI-FI LOADING ANIMATION */}
        {loading && (
          <div style={{textAlign:'center', marginTop:'20px', background:'#0f172a', padding:'50px 20px', borderRadius:'24px', border:'1px solid #1e293b', boxShadow:'0 10px 40px rgba(0,0,0,0.5)'}}>
            <div style={{position:'relative', width:'80px', height:'80px', margin:'0 auto 20px auto'}}>
               <ShieldAlert size={80} color="#10b981" style={{filter:'drop-shadow(0 0 15px rgba(16,185,129,0.6))'}} className="pulse-icon"/>
               <div style={{position:'absolute', top:'-10px', left:'-10px', right:'-10px', bottom:'-10px', border:'2px dashed #10b981', borderRadius:'50%'}} className="spin-slow"></div>
            </div>
            <h3 style={{color:'#a7f3d0', fontSize:'1.1rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.scanning[scanStep]}</h3>
            <div style={{width:'100%', height:'6px', background:'#020617', borderRadius:'10px', marginTop:'30px', overflow:'hidden', border:'1px solid #1e293b'}}>
               <div style={{width: `${(scanStep + 1) * 25}%`, height:'100%', background:'#10b981', transition:'width 0.5s ease-in-out', boxShadow:'0 0 10px #10b981'}}></div>
            </div>
          </div>
        )}

        {/* 4. DIAGNOSIS RESULTS & ACTIONS */}
        {diagnosis && (
          <div className="fade-in">
            
            {/* 🔴 MASSIVE THUMB-FRIENDLY VOICE BANNER */}
            <div style={{ background:'rgba(16, 185, 129, 0.05)', border:'1px solid rgba(16, 185, 129, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
              <Info size={28} color="#10b981" style={{marginBottom:'10px'}} />
              <p style={{margin:'0 0 20px 0', color:'#e2e8f0', fontSize:'0.95rem', lineHeight:'1.6', fontWeight:'500'}}>{t.voiceBanner}</p>
              <button 
                onClick={handleSpeak} 
                className={isSpeaking ? "pulse-voice" : ""}
                style={{
                  width: '100%', 
                  background: isSpeaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  border: 'none', color: 'white',
                  padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: '900', fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.5)' : '0 8px 25px rgba(16, 185, 129, 0.4)'
                }}
              >
                 {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
                 {isSpeaking ? t.stopVoice : t.playVoice}
              </button>
            </div>

            {/* AI DIAGNOSIS REPORT */}
            <div style={{ background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #1e293b', borderTop: '4px solid #10b981', marginBottom:'25px' }}>
              <h3 style={{margin:'0 0 20px 0', color:'#10b981', display:'flex', alignItems:'center', gap:'10px', fontSize:'1.2rem', letterSpacing:'1px', textTransform:'uppercase'}}>
                <Leaf size={20}/> {t.report}
              </h3>
              
              <div className="custom-markdown" style={{color:'#cbd5e1', lineHeight:'1.8', fontSize:'1.05rem'}}>
                <ReactMarkdown>{diagnosis}</ReactMarkdown>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b'}}>
              <h4 style={{margin: '0 0 20px 0', color: '#94a3b8', fontSize:'0.9rem', letterSpacing:'2px', textTransform:'uppercase'}}>{t.actions}</h4>
              
              <button onClick={() => navigate('/vidya', { state: { search: t.videoQuery } })} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '18px', borderRadius: '16px', width: '100%', marginBottom: '15px', fontSize: '1.05rem', fontWeight: '800', cursor:'pointer', transition:'all 0.3s ease' }}>
                <PlayCircle size={24} /> {t.btnVideo}
              </button>

              <button onClick={() => navigate('/rentals')} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#7dd3fc', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '18px', borderRadius: '16px', width: '100%', fontSize: '1.05rem', fontWeight: '800', cursor:'pointer', transition:'all 0.3s ease' }}>
                <Tractor size={24} /> {t.btnRent}
              </button>
            </div>
            
            <button onClick={() => {setDiagnosis(""); setImage(null); setPreview(null);}} style={{width: '100%', padding: '15px', background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', fontWeight: 'bold', fontSize: '1rem', cursor:'pointer', borderRadius:'14px', marginTop:'20px'}}>
              &larr; SCAN ANOTHER CROP
            </button>

          </div>
        )}

      </div>

      {/* Animations & Markdown Styling */}
      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes pulseIcon { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
        
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 8s linear infinite; }

        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }

        @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .scan-line { animation: scanLine 3s linear infinite; }

        /* Dark Mode Markdown Styling */
        .custom-markdown h1, .custom-markdown h2, .custom-markdown h3 { color: #f8fafc; margin-top: 20px; margin-bottom: 10px; }
        .custom-markdown p { margin-bottom: 15px; }
        .custom-markdown ul, .custom-markdown ol { padding-left: 20px; margin-bottom: 15px; }
        .custom-markdown li { margin-bottom: 8px; }
        .custom-markdown strong { color: #10b981; }
      `}</style>
    </div>
  );
};

export default DrAkhil;
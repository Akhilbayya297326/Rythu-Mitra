import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Landmark, IndianRupee, Tractor, Shield, Sun, 
  FileText, CheckCircle, ChevronRight, Milk, Sparkles, BookOpen, 
  Loader, Info, Volume2, VolumeX, ShieldCheck
} from 'lucide-react';
import { getSchemeRecommendations } from './gemini';

const YojanaSetu = () => {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [mode, setMode] = useState('browse'); // 'ai' or 'browse'
  
  // AI Form States
  const [loading, setLoading] = useState(false);
  const [aiSchemes, setAiSchemes] = useState([]);
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ state: 'Telangana', land: '', crop: '', category: 'General' });

  // Browse States
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Voice States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL UI TRANSLATIONS ---
  const ui = {
    English: {
      title: "Yojana Setu", sub: "Govt Schemes & Subsidies",
      tabAi: "AI Match", tabBrowse: "Browse All",
      formTitle: "CHECK ELIGIBILITY", state: "State", land: "Land Size (Acres)", crop: "Primary Crop", cat: "Category",
      findBtn: "FIND MATCHING SCHEMES", aiBusy: "Neural Network busy. Please try again.",
      filterTitle: "SELECT CATEGORY", applyBtn: "Apply Official", 
      appliedMsg: "Application Initiated!", appliedDesc: "A local coordinator will contact you shortly to collect your documents.",
      cats: ['All', 'General', 'OBC', 'SC', 'ST'],
      voiceBanner: "Your eligible government schemes will be read out loud.",
      playVoice: "Listen to Schemes", stopVoice: "Stop Audio",
      resultsTitle: "AI VERIFIED SCHEMES"
    },
    Hindi: {
      title: "योजना सेतु", sub: "सरकारी योजनाएं और सब्सिडी",
      tabAi: "AI खोज", tabBrowse: "सभी देखें",
      formTitle: "पात्रता जांचें", state: "राज्य", land: "जमीन (एकड़)", crop: "मुख्य फसल", cat: "समुदाय",
      findBtn: "योजनाएं खोजें", aiBusy: "सिस्टम व्यस्त है। पुनः प्रयास करें।",
      filterTitle: "अपना समुदाय चुनें", applyBtn: "आधिकारिक आवेदन", 
      appliedMsg: "आवेदन शुरू हो गया!", appliedDesc: "दस्तावेजों के लिए एक स्थानीय समन्वयक जल्द ही आपसे संपर्क करेगा।",
      cats: ['सभी', 'सामान्य', 'OBC', 'SC', 'ST'],
      voiceBanner: "आपकी योग्य सरकारी योजनाएं पढ़कर सुनाई जाएंगी।",
      playVoice: "योजनाएं सुनें", stopVoice: "ऑडियो रोकें",
      resultsTitle: "AI सत्यापित योजनाएं"
    },
    Telugu: {
      title: "యోజన సేతు", sub: "ప్రభుత్వ పథకాలు & సబ్సిడీలు",
      tabAi: "AI అన్వేషణ", tabBrowse: "అన్ని పథకాలు",
      formTitle: "అర్హతను తనిఖీ చేయండి", state: "రాష్ట్రం", land: "భూమి (ఎకరాలు)", crop: "పంట", cat: "కులం",
      findBtn: "పథకాలను కనుగొనండి", aiBusy: "సిస్టమ్ బిజీగా ఉంది. మళ్ళీ ప్రయత్నించండి.",
      filterTitle: "మీ కులాన్ని ఎంచుకోండి", applyBtn: "అధికారిక దరఖాస్తు", 
      appliedMsg: "దరఖాస్తు ప్రారంభించబడింది!", appliedDesc: "పత్రాలను సేకరించడానికి స్థానిక కోఆర్డినేటర్ త్వరలో మిమ్మల్ని సంప్రదిస్తారు.",
      cats: ['అన్ని', 'జనరల్', 'OBC', 'SC', 'ST'],
      voiceBanner: "మీ అర్హత కలిగిన ప్రభుత్వ పథకాలు చదివి వినిపించబడతాయి.",
      playVoice: "పథకాలను వినండి", stopVoice: "ఆడియో ఆపండి",
      resultsTitle: "AI ధృవీకరించిన పథకాలు"
    }
  };

  const tUI = ui[user.lang] || ui['English'];
  const categoryMap = { [tUI.cats[0]]: 'All', [tUI.cats[1]]: 'General', [tUI.cats[2]]: 'OBC', [tUI.cats[3]]: 'SC', [tUI.cats[4]]: 'ST' };

  // --- PRE-LOAD VOICES ---
  useEffect(() => {
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  // --- 📋 REAL GOVERNMENT SCHEMES DATA (Dark Mode Colors) ---
  const browseSchemesData = [
    {
      id: 1, target: ['All', 'General', 'OBC', 'SC', 'ST'], icon: <IndianRupee size={28} />, color: '#10b981',
      en: { name: "PM-KISAN Samman Nidhi", desc: "Direct income support of ₹6,000 per year.", benefit: "₹6,000/year" },
      hi: { name: "पीएम-किसान सम्मान निधि", desc: "प्रति वर्ष ₹6,000 की सीधी आय सहायता।", benefit: "₹6,000/वर्ष" },
      te: { name: "పిఎం-కిసాన్ సమ్మాన్ నిధి", desc: "సంవత్సరానికి ₹6,000 నేరుగా బ్యాంకులో జమ.", benefit: "₹6,000/సం." }
    },
    {
      id: 2, target: ['SC', 'ST'], icon: <Tractor size={28} />, color: '#ea580c',
      en: { name: "SMAM Machinery Subsidy", desc: "50% subsidy for SC/ST farmers to buy tractors.", benefit: "50% Subsidy" },
      hi: { name: "SMAM मशीनरी सब्सिडी", desc: "SC/ST किसानों के लिए ट्रैक्टर पर 50% सब्सिडी।", benefit: "50% छूट" },
      te: { name: "SMAM యంత్రాల సబ్సిడీ", desc: "ట్రాక్టర్లు కొనుగోలుకు SC/ST రైతులకు 50% సబ్సిడీ.", benefit: "50% సబ్సిడీ" }
    },
    {
      id: 3, target: ['All', 'General', 'OBC', 'SC', 'ST'], icon: <Shield size={28} />, color: '#38bdf8',
      en: { name: "PM Fasal Bima Yojana", desc: "Crop insurance against natural calamities.", benefit: "Full Coverage" },
      hi: { name: "पीएम फसल बीमा योजना", desc: "प्राकृतिक आपदाओं के खिलाफ फसल बीमा।", benefit: "पूर्ण सुरक्षा" },
      te: { name: "పిఎం ఫసల్ బీమా యోజన", desc: "ప్రకృతి విపత్తుల నుండి పంటలకు బీమా.", benefit: "పూర్తి రక్షణ" }
    },
    {
      id: 4, target: ['OBC', 'SC', 'ST'], icon: <Milk size={28} />, color: '#a855f7',
      en: { name: "Dairy Entrepreneurship", desc: "33% capital subsidy for SC/ST/OBC for dairy farms.", benefit: "33% Subsidy" },
      hi: { name: "डेयरी उद्यमिता", desc: "डेयरी फार्म के लिए SC/ST/OBC को 33% सब्सिडी।", benefit: "33% सब्सिडी" },
      te: { name: "డైరీ ఎంటర్‌ప్రెన్యూర్‌షిప్", desc: "పాడి పరిశ్రమ స్థాపనకు SC/ST/OBC లకు 33% సబ్సిడీ.", benefit: "33% సబ్సిడీ" }
    },
    {
      id: 5, target: ['All', 'General', 'OBC', 'SC', 'ST'], icon: <Sun size={28} />, color: '#eab308',
      en: { name: "PM-KUSUM Scheme", desc: "60% subsidy to install solar water pumps.", benefit: "60% Subsidy" },
      hi: { name: "पीएम-कुसुम योजना", desc: "सोलर पंप लगाने पर 60% की भारी सब्सिडी।", benefit: "60% सब्सिडी" },
      te: { name: "పిఎం-కుసుమ్ పథకం", desc: "సోలార్ పంపుల ఏర్పాటుకు 60% సబ్సిడీ.", benefit: "60% సబ్సిడీ" }
    },
    {
      id: 6, target: ['All', 'General', 'OBC', 'SC', 'ST'], icon: <FileText size={28} />, color: '#6366f1',
      en: { name: "Kisan Credit Card (KCC)", desc: "Short-term loans at subsidized 4% interest.", benefit: "4% Interest Loan" },
      hi: { name: "किसान क्रेडिट कार्ड (KCC)", desc: "4% की ब्याज दर पर फसलों के लिए लोन।", benefit: "4% ब्याज लोन" },
      te: { name: "కిసాన్ క్రెడిట్ కార్డ్ (KCC)", desc: "4% వడ్డీ రేటుతో పంటలకు స్వల్పకాలిక రుణాలు.", benefit: "4% వడ్డీ రుణం" }
    }
  ];

  const filteredSchemes = browseSchemesData.filter(scheme => 
    categoryMap[activeCategory] === 'All' || scheme.target.includes(categoryMap[activeCategory])
  );

  // --- ACTIONS ---
  const handleAI_Search = async () => {
    if (!formData.land || !formData.crop) return alert("System Alert: Please fill all parameters.");
    setLoading(true);
    try {
      const results = await getSchemeRecommendations(formData, user.lang);
      setAiSchemes(results);
      setStep(2);
    } catch (e) {
      alert(tUI.aiBusy);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (schemeName) => {
    setSelectedScheme({ name: schemeName });
    setShowModal(true);
  };

  // --- VOICE ASSISTANT ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported.");
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (aiSchemes.length === 0) return;

    let rawText = `${tUI.resultsTitle}. `;
    aiSchemes.forEach((item, idx) => {
      rawText += `Number ${idx + 1}. ${item.name}. Benefit: ${item.benefit}. Eligibility: ${item.eligibility}. `;
    });

    const cleanText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/\*/g, '').replace(/#/g, '');
    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(v => v.lang === targetLangCode || v.lang.startsWith(targetLangCode.substring(0, 2)));

    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    let currentSentenceIndex = 0;

    const speakNextSentence = () => {
      if (currentSentenceIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex].trim());
        utterance.lang = targetLangCode;
        if (specificVoice) utterance.voice = specificVoice;
        utterance.rate = 0.85;

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
        padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => step === 2 && mode === 'ai' ? setStep(1) : navigate('/home')} style={{background:'rgba(99, 102, 241, 0.1)', border:'1px solid rgba(99, 102, 241, 0.3)', color:'#818cf8', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Landmark size={24} color="#818cf8"/> {tUI.title}</h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{tUI.sub}</p>
          </div>
        </div>
      </div>

      <div style={{padding: '20px'}}>

        {/* 2. MODE TOGGLE (Thumb-Friendly Dark Mode) */}
        {step === 1 && (
          <div style={{display:'flex', background:'#0f172a', padding:'6px', borderRadius:'16px', border:'1px solid #1e293b', marginBottom:'25px'}}>
            <button onClick={() => {setMode('browse'); setStep(1);}} style={toggleBtnStyle(mode === 'browse', '#818cf8')}><BookOpen size={18}/> {tUI.tabBrowse}</button>
            <button onClick={() => {setMode('ai'); setStep(1);}} style={toggleBtnStyle(mode === 'ai', '#818cf8')}><Sparkles size={18}/> {tUI.tabAi}</button>
          </div>
        )}

        {/* ======================================= */}
        {/* MODE 1: AI ELIGIBILITY FINDER */}
        {/* ======================================= */}
        {mode === 'ai' && (
          <div className="fade-in">
            {step === 1 && (
              <div style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
                <h3 style={{color:'#818cf8', fontSize:'0.9rem', letterSpacing:'2px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}><ShieldCheck size={18}/> {tUI.formTitle}</h3>
                
                <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <div>
                    <label style={labelStyle}>{tUI.state}</label>
                    <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} style={inputStyle}>
                      <option>Telangana</option><option>Andhra Pradesh</option><option>Maharashtra</option><option>Karnataka</option><option>Uttar Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{tUI.land}</label>
                    <input type="number" placeholder="Ex: 2.5" value={formData.land} onChange={(e) => setFormData({...formData, land: e.target.value})} style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>{tUI.crop}</label>
                    <input type="text" placeholder="Ex: Cotton, Paddy" value={formData.crop} onChange={(e) => setFormData({...formData, crop: e.target.value})} style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>{tUI.cat}</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle}>
                      <option>General</option><option>OBC</option><option>SC</option><option>ST</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleAI_Search} disabled={loading} style={{
                    width:'100%', padding:'18px', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color:'white', border:'none', 
                    borderRadius:'14px', fontSize:'1.05rem', fontWeight:'900', letterSpacing:'1px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                    cursor: 'pointer', boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)', marginTop:'25px'
                  }}>
                  {loading ? <Loader className="spin" size={24}/> : <>{tUI.findBtn} <Sparkles size={20}/></>}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in">
                {/* AI VOICE BANNER */}
                <div style={{ background:'rgba(99, 102, 241, 0.05)', border:'1px solid rgba(99, 102, 241, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
                  <Info size={28} color="#818cf8" style={{marginBottom:'10px'}} />
                  <p style={{margin:'0 0 20px 0', color:'#e2e8f0', fontSize:'0.95rem', lineHeight:'1.6', fontWeight:'500'}}>{tUI.voiceBanner}</p>
                  <button 
                    onClick={handleSpeak} 
                    className={isSpeaking ? "pulse-voice" : ""}
                    style={{
                      width: '100%', background: isSpeaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                      border: 'none', color: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                      fontWeight: '900', fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
                      boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.5)' : '0 8px 25px rgba(99, 102, 241, 0.4)'
                    }}
                  >
                     {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
                     {isSpeaking ? tUI.stopVoice : tUI.playVoice}
                  </button>
                </div>

                <h3 style={{color:'#94a3b8', fontSize:'0.85rem', letterSpacing:'2px', marginBottom:'15px', textTransform:'uppercase'}}>{tUI.resultsTitle} ({aiSchemes.length})</h3>
                
                {aiSchemes.map((item, index) => (
                  <div key={index} style={{background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', borderLeft: '4px solid #818cf8', padding: '25px 20px', marginBottom: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)'}}>
                    <h3 style={{margin:'0 0 10px 0', color:'#f8fafc', fontSize:'1.3rem', fontWeight:'900'}}>{item.name}</h3>
                    <div style={{background:'rgba(99, 102, 241, 0.1)', border:'1px solid rgba(99, 102, 241, 0.3)', color:'#818cf8', padding:'8px 15px', borderRadius:'10px', display:'inline-block', fontWeight:'900', marginBottom:'15px', fontSize:'0.9rem'}}>
                      {item.benefit}
                    </div>
                    <p style={{fontSize:'0.95rem', color:'#94a3b8', lineHeight:'1.5', margin:0, display:'flex', alignItems:'flex-start', gap:'8px'}}>
                      <CheckCircle size={16} style={{color:'#10b981', flexShrink:0, marginTop:'3px'}}/> {item.eligibility}
                    </p>
                    
                    <button onClick={() => handleApply(item.name)} style={{
                        width: '100%', marginTop: '20px', background: 'transparent', border: '1px solid #818cf8', color: '#818cf8', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer'
                      }}>
                      {tUI.applyBtn} <ChevronRight size={20}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* MODE 2: BROWSE ALL SCHEMES */}
        {/* ======================================= */}
        {mode === 'browse' && (
          <div className="fade-in">
            {/* COMMUNITY FILTER */}
            <h4 style={{margin:'0 0 10px 0', color:'#94a3b8', fontSize:'0.85rem', letterSpacing:'1px', textTransform:'uppercase'}}>{tUI.filterTitle}</h4>
            <div style={{display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'10px', marginBottom:'15px'}} className="hide-scrollbar">
              {tUI.cats.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    whiteSpace:'nowrap', padding:'12px 20px', borderRadius:'20px', fontWeight:'800', fontSize:'0.9rem', cursor:'pointer', transition:'all 0.2s',
                    background: activeCategory === cat ? 'rgba(99, 102, 241, 0.15)' : '#0f172a',
                    color: activeCategory === cat ? '#818cf8' : '#64748b',
                    border: activeCategory === cat ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid #1e293b'
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* SCHEMES LIST */}
            <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              {filteredSchemes.map((scheme) => {
                const tScheme = scheme[user.lang === 'English' ? 'en' : user.lang === 'Hindi' ? 'hi' : 'te'];
                return (
                  <div key={scheme.id} style={{
                    background: '#0f172a', borderRadius: '20px', padding: '25px 20px',
                    border: '1px solid #1e293b', borderBottom: `4px solid ${scheme.color}`,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)', position: 'relative'
                  }}>
                    <div style={{ position:'absolute', top:'20px', right:'20px', background: `${scheme.color}15`, color: scheme.color, border: `1px solid ${scheme.color}40`, padding:'6px 12px', borderRadius:'10px', fontWeight:'800', fontSize:'0.75rem' }}>
                      {tScheme.benefit}
                    </div>
                    
                    <div style={{display:'flex', gap:'15px', alignItems:'flex-start', marginBottom:'15px'}}>
                      <div style={{background: `${scheme.color}15`, color: scheme.color, padding:'15px', borderRadius:'16px', border: `1px solid ${scheme.color}30`}}>
                        {scheme.icon}
                      </div>
                      <div style={{flex:1, paddingRight:'80px'}}>
                        <h3 style={{margin:'0 0 8px 0', color:'#f8fafc', fontSize:'1.2rem', fontWeight:'900'}}>{tScheme.name}</h3>
                        <p style={{margin:0, color:'#94a3b8', fontSize:'0.95rem', lineHeight:'1.5'}}>{tScheme.desc}</p>
                      </div>
                    </div>
                    
                    <button onClick={() => handleApply(tScheme.name)} style={{
                        width: '100%', background: 'transparent', border: `1px solid ${scheme.color}`,
                        color: scheme.color, padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.05rem',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer'
                      }}>
                      {tUI.applyBtn} <ChevronRight size={20}/>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. SUCCESS MODAL */}
      {showModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 1000, padding:'20px'}}>
          <div className="fade-in" style={{background:'#0f172a', border:'1px solid #1e293b', padding:'30px', borderRadius:'25px', textAlign:'center', width:'100%', maxWidth:'400px', boxShadow:'0 20px 40px rgba(0, 0, 0, 0.6)'}}>
            <CheckCircle size={70} color="#10b981" style={{margin:'0 auto 15px auto'}} className="pulse-icon"/>
            <h2 style={{color:'#f8fafc', margin:'0 0 10px 0', fontSize:'1.4rem'}}>{tUI.appliedMsg}</h2>
            <p style={{color:'#10b981', fontSize:'1.1rem', marginBottom:'20px', fontWeight:'900'}}>{selectedScheme?.name}</p>
            <p style={{color:'#94a3b8', fontSize:'0.95rem', marginBottom:'25px', lineHeight:'1.6'}}>{tUI.appliedDesc}</p>
            <button onClick={() => setShowModal(false)} style={{width:'100%', padding:'18px', background:'linear-gradient(135deg, #10b981 0%, #047857 100%)', color:'white', border:'none', borderRadius:'14px', fontSize:'1.1rem', fontWeight:'900', cursor:'pointer', boxShadow:'0 8px 25px rgba(16, 185, 129, 0.4)'}}>
              DONE
            </button>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulseIcon { 0% { opacity: 0.4; } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.4; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
      `}</style>
    </div>
  );
};

// Form Styles
const toggleBtnStyle = (active, color) => ({
  flex:1, padding:'12px', borderRadius:'12px', 
  fontWeight:'800', fontSize:'0.95rem', cursor:'pointer',
  background: active ? `rgba(99, 102, 241, 0.15)` : 'transparent', color: active ? color : '#64748b', transition:'0.3s',
  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', 
  border: active ? `1px solid rgba(99, 102, 241, 0.3)` : '1px solid transparent'
});
const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', letterSpacing:'1px', textTransform:'uppercase' };
const inputStyle = { width: '100%', padding: '16px 15px', borderRadius: '14px', border: '1px solid #1e293b', fontSize: '1rem', boxSizing: 'border-box', background:'#020617', color:'#f8fafc', outline:'none', fontWeight:'600' };

export default YojanaSetu;
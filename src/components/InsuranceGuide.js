import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Landmark, Building2, 
  PhoneCall, ExternalLink, FileText, CheckCircle2, 
  MapPin, Sprout, CalendarClock, ChevronRight, Volume2, VolumeX, AlertTriangle, FileBadge, Info
} from 'lucide-react';

const InsuranceGuide = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { name: 'Farmer', lang: 'English' };

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); 
  const [insType, setInsType] = useState(null); 
  const [formData, setFormData] = useState({ state: '', crop: '', season: 'Kharif', land: '' });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const ui = {
    English: {
      title: "Bima Margdarshak", sub: "Disaster & Crop Protection",
      step1: "SELECT INSURANCE SECTOR", step2: "FARM PARAMETERS", step3: "POLICY MATCHES",
      govBtn: "Government Schemes", govDesc: "High subsidy, extreme disaster cover (PMFBY)",
      pvtBtn: "Private Providers", pvtDesc: "Faster claims, custom weather add-ons",
      lblState: "State", lblCrop: "Crop Name (e.g., Cotton)", lblSeason: "Season", lblLand: "Land Size (Acres)",
      btnNext: "PROCEED TO SCAN", btnBack: "GO BACK",
      helpline: "National Crop Insurance Helpline", callNow: "TAP TO CALL NOW",
      guideTitle: "APPLICATION PROTOCOL",
      playVoice: "Listen to Instructions", stopVoice: "Stop Audio",
      docTitle: "MANDATORY DOCUMENTS",
      docs: ["Aadhar Card", "Land Records (7/12 or Pattadar Passbook)", "Bank Passbook (Linked to Aadhar)", "Sowing Certificate (from Patwari/Sarpanch)"],
      stepsTitle: "HOW TO APPLY ONLINE",
      steps: [
        "Gather the 4 mandatory documents listed above.",
        "Click the 'Apply Official' button on your chosen policy below.",
        "Register on the portal as a 'Farmer' and upload clear photos of your documents.",
        "Pay the minimal premium online. Keep the receipt and application number safe for claims."
      ],
      estPremium: "Premium:", applyBtn: "Apply Official", coverage: "Covers:"
    },
    Hindi: {
      title: "बीमा मार्गदर्शक", sub: "आपदा और फसल सुरक्षा",
      step1: "बीमा क्षेत्र चुनें", step2: "खेत के पैरामीटर", step3: "पॉलिसी मैच",
      govBtn: "सरकारी योजनाएं", govDesc: "उच्च सब्सिडी, चरम आपदा कवर (PMFBY)",
      pvtBtn: "निजी प्रदाता", pvtDesc: "तेज़ दावे, कस्टम मौसम ऐड-ऑन",
      lblState: "राज्य", lblCrop: "फसल का नाम (जैसे, कपास)", lblSeason: "मौसम", lblLand: "भूमि का आकार (एकड़)",
      btnNext: "आगे बढ़ें", btnBack: "वापस जाएं",
      helpline: "राष्ट्रीय फसल बीमा हेल्पलाइन", callNow: "कॉल करने के लिए टैप करें",
      guideTitle: "आवेदन प्रक्रिया",
      playVoice: "निर्देश सुनें", stopVoice: "ऑडियो रोकें",
      docTitle: "अनिवार्य दस्तावेज़",
      docs: ["आधार कार्ड", "भूमि रिकॉर्ड (7/12 या पट्टादार पासबुक)", "बैंक पासबुक (आधार से लिंक)", "बुवाई प्रमाण पत्र (पटवारी/सरपंच से)"],
      stepsTitle: "ऑनलाइन आवेदन कैसे करें",
      steps: [
        "ऊपर सूचीबद्ध 4 अनिवार्य दस्तावेज़ एकत्र करें।",
        "नीचे अपनी चुनी गई पॉलिसी पर 'आधिकारिक आवेदन करें' बटन पर क्लिक करें।",
        "पोर्टल पर 'किसान' के रूप में पंजीकरण करें और अपने दस्तावेजों की स्पष्ट तस्वीरें अपलोड करें।",
        "न्यूनतम प्रीमियम का ऑनलाइन भुगतान करें। दावों के लिए रसीद और आवेदन संख्या सुरक्षित रखें।"
      ],
      estPremium: "प्रीमियम:", applyBtn: "आधिकारिक आवेदन", coverage: "कवर:"
    },
    Telugu: {
      title: "బీమా మార్గదర్శక్", sub: "విపత్తు & పంట రక్షణ",
      step1: "బీమా రంగాన్ని ఎంచుకోండి", step2: "పొలం వివరాలు", step3: "పాలసీ ఎంపికలు",
      govBtn: "ప్రభుత్వ పథకాలు", govDesc: "అధిక సబ్సిడీ, తీవ్ర విపత్తు కవర్ (PMFBY)",
      pvtBtn: "ప్రైవేట్ ప్రొవైడర్లు", pvtDesc: "వేగవంతమైన క్లెయిమ్‌లు, కస్టమ్ యాడ్-ఆన్‌లు",
      lblState: "రాష్ట్రం", lblCrop: "పంట పేరు (ఉదా. పత్తి)", lblSeason: "సీజన్", lblLand: "భూమి పరిమాణం (ఎకరాలు)",
      btnNext: "ముందుకు సాగండి", btnBack: "వెనక్కి వెళ్ళండి",
      helpline: "జాతీయ పంట బీమా హెల్ప్‌లైన్", callNow: "కాల్ చేయడానికి నొక్కండి",
      guideTitle: "దరఖాస్తు విధానం",
      playVoice: "సూచనలు వినండి", stopVoice: "ఆడియో ఆపండి",
      docTitle: "తప్పనిసరి పత్రాలు",
      docs: ["ఆధార్ కార్డ్", "భూ రికార్డులు (పట్టాదార్ పాస్‌బుక్)", "బ్యాంక్ పాస్‌బుక్ (ఆధార్‌కు లింక్ చేయబడింది)", "విత్తన ధృవీకరణ పత్రం (సర్పంచ్ నుండి)"],
      stepsTitle: "ఆన్‌లైన్‌లో ఎలా దరఖాస్తు చేయాలి",
      steps: [
        "పైన పేర్కొన్న 4 తప్పనిసరి పత్రాలను సేకరించండి.",
        "దిగువన మీరు ఎంచుకున్న పాలసీపై 'అధికారిక దరఖాస్తు' బటన్‌ను క్లిక్ చేయండి.",
        "పోర్టల్‌లో 'రైతు'గా నమోదు చేసుకోండి మరియు పత్రాల ఫోటోలను అప్‌లోడ్ చేయండి.",
        "ఆన్‌లైన్‌లో కనీస ప్రీమియం చెల్లించండి. క్లెయిమ్‌ల కోసం రసీదు నంబర్‌ను సురక్షితంగా ఉంచండి."
      ],
      estPremium: "ప్రీమియం:", applyBtn: "అధికారిక దరఖాస్తు", coverage: "కవరేజ్:"
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

  // --- EXTENSIVE INSURANCE DATABASE ---
  const getPolicies = () => {
    if (insType === 'gov') {
      return [
        {
          name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          tag: "⭐ Highly Recommended",
          premium: formData.season === 'Kharif' ? "2% of sum insured" : "1.5% of sum insured",
          cover: "Drought, Flood, Cyclones, Pests, Unseasonal Rain",
          link: "https://pmfby.gov.in/",
          color: "#38bdf8"
        },
        {
          name: "Weather Based Crop Insurance (WBCIS)",
          tag: "Weather Protection",
          premium: "2% to 5% based on crop",
          cover: "Rainfall deficit, Extreme Heat/Frost, High Wind",
          link: "https://pmfby.gov.in/",
          color: "#a855f7"
        },
        {
          name: "Unified Package Insurance Scheme (UPIS)",
          tag: "All-in-One",
          premium: "Varies by State",
          cover: "Crop loss, Tractor damage, Farmer Life/Accident",
          link: "https://pmfby.gov.in/",
          color: "#10b981"
        },
        {
          name: "Coconut Palm Insurance Scheme (CPIS)",
          tag: "Plantation Specific",
          premium: "₹9 to ₹14 per tree",
          cover: "Storms, Pests, Natural Death of Tree",
          link: "https://www.coconutboard.in/",
          color: "#f59e0b"
        },
        {
          name: "Pashu Dhan Bima Yojana (Livestock)",
          tag: "Animal Protection",
          premium: "Highly Subsidized (Up to 70%)",
          cover: "Accidents, Natural Calamities, Disease outbreaks",
          link: "https://dahd.nic.in/",
          color: "#ef4444"
        }
      ];
    } else {
      return [
        {
          name: "HDFC ERGO Agriculture Insurance",
          tag: "Fast Claim Settlement",
          premium: "Approx ₹500 - ₹800/Acre",
          link: "https://www.hdfcergo.com/agriculture-insurance",
          cover: "Yield Shortfall, Prevented Sowing, Floods",
          color: "#ef4444"
        },
        {
          name: "SBI General Rural Crop Insurance",
          tag: "Most Trusted Private",
          premium: "Location & Crop Based",
          link: "https://www.sbigeneral.in/rural-insurance",
          cover: "Natural Disasters, Fire, Hailstorms",
          color: "#38bdf8"
        },
        {
          name: "ICICI Lombard Crop Protection",
          tag: "Tech Driven",
          premium: "Customizable Plans",
          link: "https://www.icicilombard.com/",
          cover: "Post-harvest losses, Localized Calamities",
          color: "#f59e0b"
        },
        {
          name: "Tata AIG Farm Insurance",
          tag: "Comprehensive Coverage",
          premium: "Crop Specific",
          link: "https://www.tataaig.com/",
          cover: "Inundation, Cyclones, Landslides",
          color: "#10b981"
        },
        {
          name: "Reliance General Crop Cover",
          tag: "Flexible Add-ons",
          premium: "Dynamic Pricing",
          link: "https://www.reliancegeneral.co.in/",
          cover: "Drought, Unseasonal Rain, Pests",
          color: "#a855f7"
        }
      ];
    }
  };

  const handleNext = () => {
    if (step === 2 && (!formData.state || !formData.crop || !formData.land)) {
      return alert("System Alert: Please fill all parameters.");
    }
    setStep(step + 1);
    window.scrollTo(0, 0); // Scroll to top on step change
  };

  // --- BUG-FREE VOICE ASSISTANT WITH CHUNKING ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported on this device.");

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Build the Raw Text
    let rawText = `${t.docTitle}. `;
    t.docs.forEach((doc, idx) => { rawText += `${idx + 1}: ${doc}. `; });
    rawText += `${t.stepsTitle}. `;
    t.steps.forEach((step, idx) => { rawText += `Step ${idx + 1}: ${step} `; });

    // Text Sanitizer: Strip Emojis & Markdown
    const cleanText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                             .replace(/\*/g, '').replace(/#/g, '');

    // Language Mapping
    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(voice => voice.lang === targetLangCode || voice.lang.startsWith(targetLangCode.substring(0, 2)));

    // Chunking (Fixes Chrome 15-Second Timeout Bug)
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
        padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/home')} style={{background:'rgba(16, 185, 129, 0.1)', border:'1px solid rgba(16, 185, 129, 0.3)', color:'#10b981', padding:'10px', borderRadius:'12px', cursor:'pointer'}}>
            <ArrowLeft size={24}/>
          </button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}>
              <ShieldCheck size={24} color="#10b981" /> {t.title}
            </h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
          {[1, 2, 3].map((num) => (
            <div key={num} style={{flex: 1, height: '4px', borderRadius: '4px', background: step >= num ? '#10b981' : '#1e293b', boxShadow: step >= num ? '0 0 10px #10b981' : 'none', transition: 'all 0.3s ease'}}></div>
          ))}
        </div>
      </div>

      <div style={{padding: '25px 20px'}}>
        
        {/* ==================================== */}
        {/* STEP 1: CHOOSE SECTOR */}
        {/* ==================================== */}
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{color:'#94a3b8', fontSize:'0.85rem', letterSpacing:'2px', marginBottom:'20px'}}>{t.step1}</h3>
            
            <div onClick={() => {setInsType('gov'); setStep(2);}} style={sectorCardStyle(insType === 'gov', '#38bdf8')}>
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <div style={iconBoxStyle('#38bdf8')}><Landmark size={30}/></div>
                <div>
                  <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:'800', color:'#f8fafc'}}>{t.govBtn}</h3>
                  <p style={{margin:'5px 0 0 0', fontSize:'0.85rem', color:'#94a3b8', lineHeight:'1.5'}}>{t.govDesc}</p>
                </div>
              </div>
            </div>

            <div onClick={() => {setInsType('pvt'); setStep(2);}} style={sectorCardStyle(insType === 'pvt', '#f59e0b')}>
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <div style={iconBoxStyle('#f59e0b')}><Building2 size={30}/></div>
                <div>
                  <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:'800', color:'#f8fafc'}}>{t.pvtBtn}</h3>
                  <p style={{margin:'5px 0 0 0', fontSize:'0.85rem', color:'#94a3b8', lineHeight:'1.5'}}>{t.pvtDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* STEP 2: FARM PARAMETERS FORM */}
        {/* ==================================== */}
        {step === 2 && (
          <div className="fade-in" style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            <h3 style={{color:'#10b981', fontSize:'0.9rem', letterSpacing:'2px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}><FileText size={18}/> {t.step2}</h3>
            
            <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              <div>
                <label style={labelStyle}><MapPin size={14}/> {t.lblState}</label>
                <input type="text" placeholder="Ex: Telangana, Maharashtra" value={formData.state} onChange={e=>setFormData({...formData, state:e.target.value})} style={inputStyle}/>
              </div>
              
              <div>
                <label style={labelStyle}><Sprout size={14}/> {t.lblCrop}</label>
                <input type="text" placeholder="Ex: Cotton, Paddy" value={formData.crop} onChange={e=>setFormData({...formData, crop:e.target.value})} style={inputStyle}/>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <div>
                  <label style={labelStyle}><CalendarClock size={14}/> {t.lblSeason}</label>
                  <select value={formData.season} onChange={e=>setFormData({...formData, season:e.target.value})} style={selectStyle}>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>M² / {t.lblLand}</label>
                  <input type="number" placeholder="Acres" value={formData.land} onChange={e=>setFormData({...formData, land:e.target.value})} style={inputStyle}/>
                </div>
              </div>
            </div>

            <button onClick={handleNext} style={{
                width:'100%', padding:'18px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color:'white', border:'none', 
                borderRadius:'14px', fontSize:'1.05rem', fontWeight:'900', letterSpacing:'1px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                cursor: 'pointer', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)', marginTop:'25px'
              }}>
              {t.btnNext} <ChevronRight size={22}/>
            </button>
          </div>
        )}

        {/* ==================================== */}
        {/* STEP 3: RESULTS & GUIDANCE */}
        {/* ==================================== */}
        {step === 3 && (
          <div className="fade-in">

            {/* 🔴 MASSIVE THUMB-FRIENDLY VOICE BANNER */}
            <div style={{ background:'rgba(16, 185, 129, 0.05)', border:'1px solid rgba(16, 185, 129, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
              <Info size={28} color="#10b981" style={{marginBottom:'10px'}} />
              <h3 style={{margin:'0 0 20px 0', color:'#e2e8f0', fontSize:'1rem', lineHeight:'1.5'}}>{t.guideTitle}</h3>
              <button 
                onClick={handleSpeak} 
                className={isSpeaking ? "pulse-voice" : ""}
                style={{
                  width: '100%', 
                  background: isSpeaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  border: 'none', color: 'white',
                  padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.5)' : '0 8px 25px rgba(16, 185, 129, 0.4)'
                }}
              >
                 {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
                 {isSpeaking ? t.stopVoice : t.playVoice}
              </button>
            </div>

            {/* REQUIRED DOCUMENTS SECTION */}
            <div style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '25px'}}>
              <h3 style={{color:'#f59e0b', fontSize:'0.9rem', letterSpacing:'2px', margin:'0 0 20px 0', display:'flex', alignItems:'center', gap:'10px'}}><FileBadge size={18}/> {t.docTitle}</h3>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {t.docs.map((doc, idx) => (
                  <div key={idx} style={{display:'flex', alignItems:'center', gap:'10px', background:'#020617', padding:'12px', borderRadius:'12px', border:'1px solid #1e293b'}}>
                    <CheckCircle2 size={16} color="#10b981" style={{flexShrink:0}}/>
                    <span style={{color:'#cbd5e1', fontSize:'0.9rem', fontWeight:'600'}}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APPLICATION STEPS SECTION */}
            <div style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '25px'}}>
              <h3 style={{color:'#38bdf8', fontSize:'0.9rem', letterSpacing:'2px', margin:'0 0 20px 0'}}>{t.stepsTitle}</h3>
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                {t.steps.map((stepText, index) => (
                  <div key={index} style={{display:'flex', gap:'15px', alignItems:'flex-start'}}>
                    <div style={{background:'#020617', border:'1px solid #38bdf8', color:'#38bdf8', width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', fontWeight:'900', flexShrink:0}}>
                      {index + 1}
                    </div>
                    <p style={{margin:0, color:'#94a3b8', fontSize:'0.95rem', lineHeight:'1.5'}}>{stepText}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MATCHING SCHEMES SECTION */}
            <h3 style={{color:'#94a3b8', fontSize:'0.85rem', letterSpacing:'2px', marginBottom:'15px', marginTop:'30px'}}>{t.step3} ({getPolicies().length})</h3>
            
            {getPolicies().map((policy, idx) => (
              <div key={idx} style={{background: '#0f172a', borderRadius: '20px', border: `1px solid #1e293b`, borderLeft: `5px solid ${policy.color}`, padding: '25px 20px', marginBottom: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)'}}>
                <span style={{background:`${policy.color}15`, color:policy.color, border:`1px solid ${policy.color}40`, padding:'6px 12px', borderRadius:'8px', fontSize:'0.75rem', fontWeight:'800', letterSpacing:'1px'}}>{policy.tag}</span>
                <h3 style={{color:'#f8fafc', fontSize:'1.3rem', margin:'15px 0', lineHeight:'1.4', fontWeight:'900'}}>{policy.name}</h3>
                
                <div style={{display:'flex', alignItems:'flex-start', gap:'10px', color:'#94a3b8', fontSize:'0.9rem', marginBottom:'12px', lineHeight:'1.5'}}>
                  <AlertTriangle size={18} color={policy.color} style={{flexShrink:0, marginTop:'2px'}}/> 
                  <span><strong style={{color:'#cbd5e1'}}>{t.coverage}</strong> {policy.cover}</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#94a3b8', fontSize:'0.9rem', marginBottom:'25px'}}>
                  <Landmark size={18} color={policy.color}/> 
                  <span><strong style={{color:'#cbd5e1'}}>{t.estPremium}</strong> {policy.premium}</span>
                </div>

                <a href={policy.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                  <button style={{width:'100%', padding:'16px', background:'transparent', border:`1px solid ${policy.color}`, color:policy.color, borderRadius:'12px', fontSize:'1.05rem', fontWeight:'900', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'pointer', transition:'all 0.3s ease'}}>
                    {t.applyBtn} <ExternalLink size={20}/>
                  </button>
                </a>
              </div>
            ))}

            {/* 14447 HELPLINE BANNER */}
            <a href="tel:14447" style={{textDecoration:'none'}}>
              <div style={{background:'linear-gradient(90deg, #450a0a 0%, #020617 100%)', border:'1px solid #7f1d1d', borderRadius:'20px', padding:'25px', marginTop:'35px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 0 25px rgba(239, 68, 68, 0.2)'}} className="pulse-alert">
                <div>
                  <h4 style={{color:'#fca5a5', margin:0, fontSize:'0.85rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.helpline}</h4>
                  <p style={{color:'#f87171', margin:'8px 0 0 0', fontSize:'2rem', fontWeight:'900', letterSpacing:'3px'}}>14447</p>
                </div>
                <div style={{background:'#ef4444', padding:'15px', borderRadius:'50%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 15px rgba(239,68,68,0.5)'}}>
                  <PhoneCall size={28}/>
                </div>
              </div>
            </a>

          </div>
        )}

      </div>

      {/* Animations */}
      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes pulseAlert {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .pulse-alert { animation: pulseAlert 2s infinite; }

        @keyframes pulseVoice {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const sectorCardStyle = (isActive, color) => ({
  background: isActive ? `${color}10` : '#0f172a',
  border: isActive ? `2px solid ${color}` : '1px solid #1e293b',
  borderRadius: '24px', padding: '30px 20px', marginBottom: '20px', cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: isActive ? `0 10px 30px ${color}30` : '0 4px 15px rgba(0,0,0,0.2)'
});

const iconBoxStyle = (color) => ({
  background: `${color}15`, color: color, border: `1px solid ${color}40`, padding: '15px', borderRadius: '16px'
});

const labelStyle = { display: 'flex', alignItems:'center', gap:'6px', fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', marginBottom: '10px', letterSpacing:'1px', textTransform:'uppercase' };
const inputStyle = { width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', fontSize: '1.05rem', boxSizing:'border-box', background:'#020617', color:'#f8fafc', outline:'none', transition:'all 0.3s ease' };
const selectStyle = { ...inputStyle, appearance:'none', cursor:'pointer' };

export default InsuranceGuide;
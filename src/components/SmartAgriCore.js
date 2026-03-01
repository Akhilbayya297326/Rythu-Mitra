import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Cpu, AlertTriangle, Sprout, Droplets, 
  TrendingUp, PlayCircle, Beaker, IndianRupee,
  Camera, Keyboard, UploadCloud, FileText, CloudSun, 
  Tractor, Wallet, Target, Activity, CheckCircle, Navigation, MapPin, Layers, Volume2, VolumeX, Info
} from 'lucide-react';

import { getAgriCoreAnalysis } from './gemini';

const SmartAgriCore = () => {
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('upload');
  const [formData, setFormData] = useState({ 
    n: '', p: '', k: '', ph: '', 
    pastCrop: '', targetCrop: '', 
    season: 'Kharif (Monsoon)', water: 'Medium (Canal/Borewell)', 
    budget: 'Medium', equipment: 'Tractor Available'
  });
  
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  const [geoData, setGeoData] = useState({ city: '', state: '', soilType: '', groundWater: '', isDetected: false });
  const [isDetecting, setIsDetecting] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const ui = {
    English: {
      title: "AgriCore Matrix", sub: "Unified AI Soil & Yield Intelligence",
      tabManual: "Manual Entry", tabUpload: "Scan Report",
      geoTitle: "GEOSPATIAL TELEMETRY", btnGeo: "SYNC SATELLITE LOCATION",
      locDetecting: "Acquiring Sat-Link...", locDetected: "Telemetry Locked:",
      soilType: "Regional Soil:", gwLevel: "Groundwater:",
      formTitle: "FARM PARAMETERS", soilCard: "SOIL METRICS (NPK & pH)",
      pastCrop: "Previous Crop", targetCrop: "Planned Crop (Optional)",
      seasonLabel: "Sowing Season", waterLabel: "Local Water Source", 
      budgetLabel: "Investment", equipLabel: "Machinery",
      uploadBox: "INITIATE OPTICAL SCAN (Upload Soil Card)", fileSelected: "DATA LOADED:",
      btnScan: "INITIALIZE DEEP AI SCAN",
      scanning: [ "Extracting Soil Matrix Data...", "Cross-referencing Spatial Geography...", "Analyzing Groundwater Levels...", "Generating Yield Pathways..." ],
      soilAdviceTitle: "SOIL TREATMENT DIRECTIVE",
      riskTitle: "RISK ASSESSMENT", solTitle: "OPTIMAL YIELD PATHWAYS",
      water: "Water Need:", profit: "Est. Profit:", learnBtn: "Access Tutorial",
      voiceBanner: "The generated information will be read out loud so you can understand it clearly.",
      playVoice: "Listen to AI Report", stopVoice: "Stop Audio",
      optStr: "Option", reasonStr: "Reason"
    },
    Hindi: {
      title: "एग्री-कोर मैट्रिक्स", sub: "एकीकृत AI मृदा और उपज बुद्धिमत्ता",
      tabManual: "मैनुअल प्रविष्टि", tabUpload: "रिपोर्ट स्कैन करें",
      geoTitle: "भौगोलिक टेलीमेट्री", btnGeo: "स्थान सिंक करें",
      locDetecting: "सैटेलाइट लिंक खोज रहा है...", locDetected: "स्थान लॉक किया गया:",
      soilType: "क्षेत्रीय मिट्टी:", gwLevel: "भूजल स्तर:",
      formTitle: "खेत के पैरामीटर", soilCard: "मृदा मेट्रिक्स (NPK और pH)",
      pastCrop: "पिछली फसल", targetCrop: "लक्षित फसल (वैकल्पिक)",
      seasonLabel: "बुवाई का मौसम", waterLabel: "स्थानीय जल स्रोत", 
      budgetLabel: "निवेश बजट", equipLabel: "मशीनरी",
      uploadBox: "ऑप्टिकल स्कैन शुरू करें", fileSelected: "डेटा लोड किया गया:",
      btnScan: "डीप AI स्कैन प्रारंभ करें",
      scanning: [ "मृदा डेटा निकाला जा रहा है...", "भौगोलिक स्थिति का विश्लेषण...", "भूजल स्तर की जाँच...", "उपज मार्ग उत्पन्न किए जा रहे हैं..." ],
      soilAdviceTitle: "मृदा उपचार निर्देश",
      riskTitle: "जोखिम मूल्यांकन", solTitle: "इष्टतम उपज मार्ग",
      water: "जल आवश्यकता:", profit: "अनुमानित लाभ:", learnBtn: "ट्यूटोरियल देखें",
      voiceBanner: "उत्पन्न की गई जानकारी अब पढ़कर सुनाई जाएगी ताकि आप इसे स्पष्ट रूप से समझ सकें।",
      playVoice: "AI रिपोर्ट सुनें", stopVoice: "ऑडियो रोकें",
      optStr: "विकल्प", reasonStr: "कारण"
    },
    Telugu: {
      title: "అగ్రి-కోర్ మ్యాట్రిక్స్", sub: "సమీకృత AI నేల & దిగుబడి ఇంటెలిజెన్స్",
      tabManual: "మాన్యువల్ ఎంట్రీ", tabUpload: "రిపోర్ట్ స్కాన్",
      geoTitle: "భౌగోళిక టెలిమెట్రీ", btnGeo: "లొకేషన్ సింక్ చేయండి",
      locDetecting: "శాటిలైట్ లింక్ పొందుతోంది...", locDetected: "లొకేషన్ లాక్ చేయబడింది:",
      soilType: "ప్రాంతీయ నేల:", gwLevel: "భూగర్భ జలాలు:",
      formTitle: "పొలం పారామితులు", soilCard: "నేల మెట్రిక్స్ (NPK & pH)",
      pastCrop: "గత పంట", targetCrop: "లక్ష్య పంట (ఐచ్ఛికం)",
      seasonLabel: "నాటే సీజన్", waterLabel: "స్థానిక నీటి వనరు", 
      budgetLabel: "పెట్టుబడి", equipLabel: "యంత్రాలు",
      uploadBox: "ఆప్టికల్ స్కాన్ ప్రారంభించండి", fileSelected: "డేటా లోడ్ చేయబడింది:",
      btnScan: "డీప్ AI స్కాన్ ప్రారంభించండి",
      scanning: [ "మట్టి డేటాను సంగ్రహిస్తోంది...", "భౌగోళికతను విశ్లేషిస్తోంది...", "భూగర్భ జలాలను తనిఖీ చేస్తోంది...", "దిగుబడి మార్గాలను రూపొందిస్తోంది..." ],
      soilAdviceTitle: "నేల చికిత్స విధానం",
      riskTitle: "ప్రమాద అంచనా", solTitle: "ఉత్తమ దిగుబడి మార్గాలు",
      water: "నీటి అవసరం:", profit: "అంచనా లాభం:", learnBtn: "ట్యుటోరియల్ చూడండి",
      voiceBanner: "ఉత్పత్తి చేయబడిన సమాచారం మీకు స్పష్టంగా అర్థం కావడానికి ఇప్పుడు చదివి వినిపించబడుతుంది.",
      playVoice: "AI రిపోర్ట్ వినండి", stopVoice: "ఆడియో ఆపండి",
      optStr: "ఎంపిక", reasonStr: "కారణం"
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

  const getRegionalHeuristics = (state) => {
    const s = state.toLowerCase();
    if (s.includes('telangana') || s.includes('andhra')) return { soil: 'Red & Black Cotton Soil', gw: 'Semi-Critical (Deep Borewell needed)' };
    if (s.includes('maharashtra')) return { soil: 'Black Basalt Soil', gw: 'Critical (Water Stress High)' };
    if (s.includes('punjab') || s.includes('haryana')) return { soil: 'Alluvial Loam', gw: 'Over-Exploited (Severely Deep)' };
    if (s.includes('gujarat') || s.includes('rajasthan')) return { soil: 'Sandy / Arid Soil', gw: 'Deep / Saline' };
    if (s.includes('west bengal') || s.includes('bihar')) return { soil: 'Rich Alluvial', gw: 'Safe (Shallow Table)' };
    if (s.includes('kerala') || s.includes('karnataka')) return { soil: 'Laterite / Coastal Alluvium', gw: 'Safe / Abundant' };
    return { soil: 'Mixed / Loamy Soil', gw: 'Moderate (Variable Table)' };
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("System Alert: GPS Hardware not found.");
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const city = res.data.city || res.data.locality || 'Unknown Sector';
          const state = res.data.principalSubdivision || '';
          
          const heuristics = getRegionalHeuristics(state);
          setGeoData({ city, state, soilType: heuristics.soil, groundWater: heuristics.gw, isDetected: true });
        } catch (err) {
          console.error(err);
          alert("Telemetry Failed. API block.");
        } finally { setIsDetecting(false); }
      },
      () => { setIsDetecting(false); alert("Access Denied to GPS System."); }
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null);
    }
  };

  const handlePredict = async () => {
    if (mode === 'manual' && (!formData.n || !formData.ph)) return alert("System Alert: Soil metrics missing.");
    if (mode === 'upload' && !file) return alert("System Alert: Visual data required.");
    if (!geoData.isDetected) return alert("System Alert: Geospatial Telemetry required. Please sync location first.");

    setIsAnalyzing(true);
    setResult(null);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => prev >= t.scanning.length - 1 ? prev : prev + 1);
    }, 2000);

    const enhancedPayload = {
      ...formData,
      locationCity: geoData.city,
      locationState: geoData.state,
      regionalSoilType: geoData.soilType,
      groundWaterLevel: geoData.groundWater
    };
    
    const finalPayload = mode === 'upload' ? { file, ...enhancedPayload } : enhancedPayload;
    
    try {
      const analysisResult = await getAgriCoreAnalysis(finalPayload, mode, user.lang);
      clearInterval(stepInterval);
      if (analysisResult) setResult(analysisResult);
      else alert("Neural Network Error: Analysis failed.");
    } catch (err) {
      clearInterval(stepInterval);
      alert("System Error.");
    } finally { setIsAnalyzing(false); }
  };

  // --- 🔴 BUG-FREE VOICE ASSISTANT WITH CHUNKING 🔴 ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported on this device.");

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // 1. Build the Raw Text
    let rawText = `${t.voiceBanner}. `;
    if (result.soilData) rawText += `${t.soilAdviceTitle}. ${result.soilData}. `;
    if (result.cropData?.riskAnalysis) rawText += `${t.riskTitle}. ${result.cropData.riskAnalysis}. `;
    if (result.cropData?.recommendations) {
      rawText += `${t.solTitle}. `;
      result.cropData.recommendations.forEach((rec, idx) => {
        rawText += `${t.optStr} ${idx + 1}. ${rec.cropName}. ${t.reasonStr}, ${rec.reason}. `;
      });
    }

    // 2. Text Sanitizer: Strip Emojis & Markdown (Prevents Engine Crash)
    const cleanText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                             .replace(/\*/g, '')
                             .replace(/#/g, '');

    // 3. Language Mapping
    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(voice => voice.lang === targetLangCode || voice.lang.startsWith(targetLangCode.substring(0, 2)));

    // 4. Chunking (Fixes Chrome 15-Second Timeout Bug)
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    let currentSentenceIndex = 0;

    const speakNextSentence = () => {
      if (currentSentenceIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex].trim());
        utterance.lang = targetLangCode;
        if (specificVoice) utterance.voice = specificVoice;
        utterance.rate = 0.85; // Slightly slower for clarity

        utterance.onend = () => {
          currentSentenceIndex++;
          speakNextSentence(); // Read next sentence
        };

        utterance.onerror = (e) => {
          console.error("TTS Chunk Error:", e);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false); // Done reading
      }
    };

    setIsSpeaking(true);
    speakNextSentence();
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '90px', fontFamily: '"Inter", sans-serif'}}>
      
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)',
        padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(56, 189, 248, 0.1)', border:'1px solid rgba(56, 189, 248, 0.3)', color:'#38bdf8', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Cpu size={24} color="#38bdf8" /> {t.title}</h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        
        {/* GEOSPATIAL TELEMETRY */}
        {!result && !isAnalyzing && (
          <div style={{background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.05), 0 10px 30px rgba(0,0,0,0.5)', marginBottom: '25px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'15px'}}>
               <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                 <MapPin size={18} color="#38bdf8"/>
                 <h3 style={{margin:0, color:'#7dd3fc', fontSize:'0.9rem', letterSpacing:'1.5px', textTransform:'uppercase'}}>{t.geoTitle}</h3>
               </div>
               {geoData.isDetected && <div style={{width:'8px', height:'8px', background:'#10b981', borderRadius:'50%'}} className="pulse-icon"></div>}
            </div>

            {!geoData.isDetected ? (
              <button onClick={detectLocation} style={{width:'100%', padding:'15px', background:'rgba(56, 189, 248, 0.1)', color:'#38bdf8', border:'1px solid rgba(56, 189, 248, 0.3)', borderRadius:'14px', fontSize:'0.95rem', fontWeight:'800', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', cursor:'pointer', transition:'all 0.3s ease'}}>
                {isDetecting ? <Activity className="spin-slow" size={20}/> : <Navigation size={20}/>}
                {isDetecting ? t.locDetecting : t.btnGeo}
              </button>
            ) : (
              <div className="fade-in">
                <p style={{margin:'0 0 10px 0', fontSize:'0.85rem', color:'#94a3b8'}}>{t.locDetected} <strong style={{color:'#f8fafc', letterSpacing:'1px'}}>{geoData.city}, {geoData.state}</strong></p>
                <div style={{display:'flex', flexDirection:'column', gap:'10px', background:'#020617', padding:'15px', borderRadius:'12px', border:'1px solid #1e293b'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <Layers size={16} color="#f59e0b"/> 
                    <span style={{fontSize:'0.85rem', color:'#94a3b8'}}>{t.soilType}</span>
                    <strong style={{color:'#fcd34d', fontSize:'0.9rem'}}>{geoData.soilType}</strong>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <Droplets size={16} color="#3b82f6"/> 
                    <span style={{fontSize:'0.85rem', color:'#94a3b8'}}>{t.gwLevel}</span>
                    <strong style={{color:'#93c5fd', fontSize:'0.9rem'}}>{geoData.groundWater}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE TOGGLE */}
        {!result && !isAnalyzing && (
          <div style={{display:'flex', background:'#0f172a', padding:'6px', borderRadius:'16px', border:'1px solid #1e293b', marginBottom:'25px'}}>
            <button onClick={() => setMode('upload')} style={toggleBtnStyle(mode === 'upload', '#8b5cf6')}><Camera size={18}/> {t.tabUpload}</button>
            <button onClick={() => setMode('manual')} style={toggleBtnStyle(mode === 'manual', '#8b5cf6')}><Keyboard size={18}/> {t.tabManual}</button>
          </div>
        )}

        {/* FARM PARAMETERS FORM */}
        {!result && !isAnalyzing && (
          <div style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            {mode === 'upload' && (
              <div style={{marginBottom:'30px'}}>
                <input type="file" accept="image/*,application/pdf" capture="environment" id="soilUpload" style={{display:'none'}} onChange={handleFileChange} />
                <label htmlFor="soilUpload" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(139, 92, 246, 0.05)', border:'2px dashed #8b5cf6', padding:'35px 20px', borderRadius:'16px', cursor:'pointer', color:'#a78bfa', textAlign:'center'}}>
                  <UploadCloud size={48} style={{marginBottom:'12px', filter:'drop-shadow(0 0 10px rgba(139,92,246,0.5))'}}/>
                  <span style={{fontSize:'0.95rem', fontWeight:'800', letterSpacing:'1px'}}>{t.uploadBox}</span>
                </label>
                {file && (
                  <div style={{marginTop:'15px', padding:'12px', background:'#020617', borderRadius:'12px', border:'1px solid #1e293b', display:'flex', alignItems:'center', gap:'12px'}}>
                    {filePreview ? <img src={filePreview} alt="Preview" style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'8px', border:'1px solid #8b5cf6'}} /> : <FileText size={32} color="#8b5cf6" />}
                    <div style={{overflow:'hidden'}}>
                      <span style={{fontSize:'0.75rem', color:'#64748b', fontWeight:'700'}}>{t.fileSelected}</span>
                      <p style={{margin:0, color:'#f8fafc', fontWeight:'600', fontSize:'0.9rem', whiteSpace:'nowrap', textOverflow:'ellipsis'}}>{file.name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {mode === 'manual' && (
              <div style={{marginBottom:'30px', background:'#020617', padding:'20px', borderRadius:'16px', border:'1px solid #1e293b'}}>
                <label style={{...labelStyle, color:'#a78bfa', display:'flex', alignItems:'center', gap:'6px'}}><Beaker size={16}/> {t.soilCard}</label>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                  <input type="number" placeholder="N (Nitrogen)" value={formData.n} onChange={e=>setFormData({...formData, n:e.target.value})} style={inputStyle}/>
                  <input type="number" placeholder="P (Phosphorus)" value={formData.p} onChange={e=>setFormData({...formData, p:e.target.value})} style={inputStyle}/>
                  <input type="number" placeholder="K (Potassium)" value={formData.k} onChange={e=>setFormData({...formData, k:e.target.value})} style={inputStyle}/>
                  <input type="number" placeholder="pH Level" value={formData.ph} onChange={e=>setFormData({...formData, ph:e.target.value})} style={inputStyle}/>
                </div>
              </div>
            )}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'25px'}}>
              <div style={{gridColumn: 'span 2'}}>
                <label style={labelStyle}>{t.pastCrop}</label>
                <input type="text" placeholder="Ex: Cotton, Paddy" value={formData.pastCrop} onChange={e=>setFormData({...formData, pastCrop:e.target.value})} style={inputStyle}/>
              </div>
              <div style={{gridColumn: 'span 2'}}>
                <label style={labelStyle}>{t.targetCrop}</label>
                <div style={{position:'relative'}}>
                   <Target size={18} color="#8b5cf6" style={{position:'absolute', left:'12px', top:'14px'}}/>
                   <input type="text" placeholder="Crop you want to grow (Optional)" value={formData.targetCrop} onChange={e=>setFormData({...formData, targetCrop:e.target.value})} style={{...inputStyle, paddingLeft:'40px', borderColor:'#8b5cf6'}}/>
                </div>
              </div>
              <div>
                <label style={{...labelStyle, display:'flex', alignItems:'center', gap:'5px'}}><CloudSun size={14} color="#38bdf8"/> {t.seasonLabel}</label>
                <select value={formData.season} onChange={e=>setFormData({...formData, season:e.target.value})} style={selectStyle}>
                  <option value="Kharif (Monsoon)">Kharif</option> <option value="Rabi (Winter)">Rabi</option> <option value="Zaid (Summer)">Zaid</option>
                </select>
              </div>
              <div>
                <label style={{...labelStyle, display:'flex', alignItems:'center', gap:'5px'}}><Droplets size={14} color="#38bdf8"/> {t.waterLabel}</label>
                <select value={formData.water} onChange={e=>setFormData({...formData, water:e.target.value})} style={selectStyle}>
                  <option value="Low (Rainfed)">Low</option> <option value="Medium (Canal/Borewell)">Medium</option> <option value="High (Abundant)">High</option>
                </select>
              </div>
              <div>
                <label style={{...labelStyle, display:'flex', alignItems:'center', gap:'5px'}}><Wallet size={14} color="#10b981"/> {t.budgetLabel}</label>
                <select value={formData.budget} onChange={e=>setFormData({...formData, budget:e.target.value})} style={selectStyle}>
                  <option value="Low (Subsidized)">Low</option> <option value="Medium">Medium</option> <option value="High (Commercial)">High</option>
                </select>
              </div>
              <div>
                <label style={{...labelStyle, display:'flex', alignItems:'center', gap:'5px'}}><Tractor size={14} color="#f59e0b"/> {t.equipLabel}</label>
                <select value={formData.equipment} onChange={e=>setFormData({...formData, equipment:e.target.value})} style={selectStyle}>
                  <option value="Manual / Bullocks">Manual</option> <option value="Tractor Available">Tractor</option> <option value="Advanced Machinery">Advanced</option>
                </select>
              </div>
            </div>

            <button onClick={handlePredict} style={{
                width:'100%', padding:'18px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color:'white', border:'none', 
                borderRadius:'14px', fontSize:'1.05rem', fontWeight:'900', letterSpacing:'1px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                cursor: 'pointer', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
              }}>
              <TrendingUp size={22}/> {t.btnScan}
            </button>
          </div>
        )}

        {/* FUTURISTIC LOADING */}
        {isAnalyzing && (
          <div style={{textAlign:'center', marginTop:'40px', background:'#0f172a', padding:'50px 20px', borderRadius:'24px', border:'1px solid #1e293b', boxShadow:'0 10px 40px rgba(0,0,0,0.5)'}}>
            <div style={{position:'relative', width:'80px', height:'80px', margin:'0 auto 20px auto'}}>
               <Cpu size={80} color="#8b5cf6" style={{filter:'drop-shadow(0 0 15px rgba(139,92,246,0.6))'}} className="pulse-icon"/>
               <div style={{position:'absolute', top:'-10px', left:'-10px', right:'-10px', bottom:'-10px', border:'2px dashed #8b5cf6', borderRadius:'50%'}} className="spin-slow"></div>
            </div>
            <h3 style={{color:'#a78bfa', fontSize:'1.1rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.scanning[scanStep]}</h3>
            <div style={{width:'100%', height:'6px', background:'#020617', borderRadius:'10px', marginTop:'30px', overflow:'hidden', border:'1px solid #1e293b'}}>
               <div style={{width: `${(scanStep + 1) * 25}%`, height:'100%', background:'#8b5cf6', transition:'width 0.5s ease-in-out', boxShadow:'0 0 10px #8b5cf6'}}></div>
            </div>
          </div>
        )}

        {/* AI RESULTS WITH VOICE INTEGRATION */}
        {result && (
          <div className="fade-in" style={{marginTop:'20px'}}>
            
            {/* 🔴 REDESIGNED MASSIVE THUMB-FRIENDLY VOICE BANNER 🔴 */}
            <div style={{ background:'rgba(139, 92, 246, 0.05)', border:'1px solid rgba(139, 92, 246, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
              <Info size={28} color="#a78bfa" style={{marginBottom:'10px'}} />
              <p style={{margin:'0 0 20px 0', color:'#e2e8f0', fontSize:'0.95rem', lineHeight:'1.6'}}>{t.voiceBanner}</p>
              <button 
                onClick={handleSpeak} 
                className={isSpeaking ? "pulse-voice" : ""}
                style={{
                  width: '100%', // Massive Full-Width Button
                  background: isSpeaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  border: 'none', color: 'white',
                  padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: '900', fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.5)' : '0 8px 25px rgba(139, 92, 246, 0.4)'
                }}
              >
                 {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
                 {isSpeaking ? t.stopVoice : t.playVoice}
              </button>
            </div>

            {result.soilData && (
              <div style={{ background:'linear-gradient(145deg, #0f172a 0%, #020617 100%)', border:'1px solid #1e293b', borderTop:'4px solid #38bdf8', borderRadius:'24px', padding:'25px', marginBottom:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.4)' }}>
                <h3 style={{color:'#38bdf8', margin:'0 0 15px 0', display:'flex', alignItems:'center', gap:'10px', fontSize:'1.1rem', letterSpacing:'1px'}}><CheckCircle size={20}/> {t.soilAdviceTitle}</h3>
                <div style={{color:'#cbd5e1', fontSize:'0.95rem', lineHeight:'1.7', whiteSpace:'pre-wrap'}}>{result.soilData}</div>
              </div>
            )}

            {result.cropData?.riskAnalysis && (
              <div style={{ background:'linear-gradient(145deg, #2e1012 0%, #020617 100%)', border:'1px solid #450a0a', borderTop:'4px solid #ef4444', borderRadius:'24px', padding:'25px', marginBottom:'20px' }}>
                <h3 style={{color:'#f87171', margin:'0 0 10px 0', display:'flex', alignItems:'center', gap:'10px', fontSize:'1.1rem', letterSpacing:'1px'}}><AlertTriangle size={20}/> {t.riskTitle}</h3>
                <p style={{color:'#fca5a5', fontSize:'0.95rem', lineHeight:'1.6', margin:0}}>{result.cropData.riskAnalysis}</p>
              </div>
            )}

            {result.cropData?.recommendations && (
              <>
                <h3 style={{color:'#94a3b8', margin:'30px 0 15px 0', fontSize:'0.9rem', letterSpacing:'2px', display:'flex', alignItems:'center', gap:'10px'}}><Sprout size={18} color="#10b981"/> {t.solTitle}</h3>
                {result.cropData.recommendations.map((rec, index) => (
                  <div key={index} style={{ background:'#0f172a', border:'1px solid #1e293b', borderLeft:'4px solid #10b981', borderRadius:'20px', padding:'20px', marginBottom:'15px', boxShadow:'0 8px 20px rgba(0,0,0,0.3)' }}>
                    <h3 style={{margin:'0 0 10px 0', color:'#f8fafc', fontSize:'1.3rem', fontWeight:'900', letterSpacing:'1px'}}>{rec.cropName}</h3>
                    <p style={{color:'#94a3b8', fontSize:'0.9rem', lineHeight:'1.5', margin:'0 0 20px 0'}}>{rec.reason}</p>
                    <div style={{display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap'}}>
                      <span style={{background:'rgba(56, 189, 248, 0.1)', border:'1px solid rgba(56, 189, 248, 0.2)', color:'#38bdf8', padding:'6px 12px', borderRadius:'8px', fontSize:'0.8rem', fontWeight:'700', display:'flex', alignItems:'center', gap:'6px'}}><Droplets size={14}/> {t.water} {rec.waterNeeds}</span>
                      <span style={{background:'rgba(16, 185, 129, 0.1)', border:'1px solid rgba(16, 185, 129, 0.2)', color:'#10b981', padding:'6px 12px', borderRadius:'8px', fontSize:'0.8rem', fontWeight:'700', display:'flex', alignItems:'center', gap:'6px'}}><IndianRupee size={14}/> {t.profit} {rec.expectedProfit}</span>
                    </div>
                    <button onClick={() => navigate('/vidya', { state: { search: `${rec.cropName} cultivation modern farming` } })} style={{ width:'100%', background:'transparent', border:'1px solid #10b981', color:'#10b981', padding:'12px', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', transition:'all 0.3s ease' }}>
                      <PlayCircle size={20}/> {t.learnBtn}
                    </button>
                  </div>
                ))}
              </>
            )}
            
            <button onClick={() => {setResult(null); setFile(null); setFilePreview(null);}} style={{width: '100%', padding: '15px', background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', fontWeight: 'bold', fontSize: '1rem', cursor:'pointer', borderRadius:'14px', marginTop:'20px'}}>
              &larr; RUN NEW MATRIX ANALYSIS
            </button>
          </div>
        )}

      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes pulseIcon { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
        
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 8s linear infinite; }

        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
      `}</style>
    </div>
  );
};

const toggleBtnStyle = (active, color) => ({
  flex:1, padding:'10px', borderRadius:'12px', 
  fontWeight:'800', fontSize:'0.9rem', cursor:'pointer',
  background: active ? `rgba(139, 92, 246, 0.15)` : 'transparent', color: active ? color : '#64748b', transition:'0.3s',
  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', 
  border: active ? `1px solid rgba(139, 92, 246, 0.3)` : '1px solid transparent'
});
const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', letterSpacing:'1px', textTransform:'uppercase' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '1rem', boxSizing:'border-box', background:'#020617', color:'#f8fafc', outline:'none' };
const selectStyle = { ...inputStyle, appearance:'none', cursor:'pointer' };

export default SmartAgriCore;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CloudRain, Sun, Droplets, Wind, MapPin, 
  Sprout, Tractor, Landmark, Mic, ShieldCheck, 
  Handshake, BookText, Droplet, Cpu, Camera, 
  CalendarClock, TrendingUp, Zap, ShieldAlert, Leaf, Stethoscope, LogOut, 
  ShieldQuestion, BookOpen, HeartPulse, Radar, ChevronRight
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { name: 'Farmer', lang: 'English' };

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const translations = {
    English: {
      morning: "OPERATIONAL // MORNING", afternoon: "OPERATIONAL // AFTERNOON", evening: "OPERATIONAL // EVENING",
      detecting: "Scanning Location...", disabled: "GPS Offline",
      phase1: "PHASE 1 // STRATEGY & PROTECTION", phase2: "PHASE 2 // RESOURCES & METHODS", 
      phase3: "PHASE 3 // ACTIVE FIELD CARE", phase4: "PHASE 4 // HARVEST & COMMERCE",
      agriCore: "AgriCore AI", agriCoreSub: "Soil & Yield Matrix",
      bima: "Bima Guide", bimaSub: "Insurance Matrix",
      doctor: "Crop Doctor", doctorSub: "AI Disease Scan",
      mandi: "Live Mandi", mandiSub: "Real-time rates",
      water: "Hydro Smart", waterSub: "Irrigation AI",
      khata: "Smart Ledger", khataSub: "Profit Matrix",
      sahayog: "Sahayog Grid", sahayogSub: "P2P Equipment",
      schemes: "Yojana Setu", schemesSub: "Subsidy Portal",
      grade: "Vision Grader", gradeSub: "Optical Quality",
      organic: "Organic Hub", organicSub: "Smart & Natural",
      vet: "Pashu Rakshak", vetSub: "Medical Locator",
      safety: "Safety Protocol", safetySub: "Protective Care",
      vidya: "Vidya Vani", vidyaSub: "Audio Academy",
      radar: "Pest Radar", radarSub: "Live Outbreak Map",
      askAi: "SYSTEM COMMAND"
    },
    Hindi: {
      morning: "सिस्टम चालू // शुभ प्रभात", afternoon: "सिस्टम चालू // शुभ दोपहर", evening: "सिस्टम चालू // शुभ संध्या",
      detecting: "स्थान खोज रहा है...", disabled: "GPS बंद",
      phase1: "चरण 1 // रणनीति और सुरक्षा", phase2: "चरण 2 // संसाधन और तरीके", 
      phase3: "चरण 3 // सक्रिय देखभाल", phase4: "चरण 4 // कटाई और व्यापार",
      agriCore: "एग्री-कोर AI", agriCoreSub: "मृदा विश्लेषण",
      bima: "बीमा गाइड", bimaSub: "फसल बीमा",
      doctor: "फसल डॉक्टर", doctorSub: "रोग स्कैन",
      mandi: "लाइव मंडी", mandiSub: "बाजार भाव",
      water: "जल स्मार्ट", waterSub: "सिंचाई AI",
      khata: "स्मार्ट खाता", khataSub: "लाभ मैट्रिक्स",
      sahayog: "सहयोग ग्रिड", sahayogSub: "उपकरण किराया",
      schemes: "योजना सेतु", schemesSub: "सरकारी योजना",
      grade: "विज़न ग्रेडर", gradeSub: "गुणवत्ता जांच",
      organic: "जैविक केंद्र", organicSub: "प्राकृतिक खेती",
      vet: "पशु रक्षक", vetSub: "पशु चिकित्सक",
      safety: "सुरक्षा", safetySub: "सावधानी",
      vidya: "विद्या वाणी", vidyaSub: "ऑडियो शिक्षा",
      radar: "कीट रडार", radarSub: "लाइव प्रकोप मैप",
      askAi: "AI कमांड"
    },
    Telugu: {
      morning: "సిస్టమ్ ఆన్ // శుభోదయం", afternoon: "సిస్టమ్ ఆన్ // శుభ మధ్యాహ్నం", evening: "సిస్టమ్ ఆన్ // శుభ సాయంత్రం",
      detecting: "స్థానం వెతుకుతోంది...", disabled: "GPS ఆఫ్‌లైన్",
      phase1: "దశ 1 // వ్యూహం & రక్షణ", phase2: "దశ 2 // వనరులు & పద్ధతులు", 
      phase3: "దశ 3 // క్రియాశీల సంరక్షణ", phase4: "దశ 4 // కోత & వాణిజ్యం",
      agriCore: "అగ్రి-కోర్ AI", agriCoreSub: "నేల విశ్లేషణ",
      bima: "బీమా గైడ్", bimaSub: "పంట బీమా",
      doctor: "పంట డాక్టర్", doctorSub: "AI వ్యాధి స్కాన్",
      mandi: "లైవ్ మండి", mandiSub: "మార్కెట్ ధరలు",
      water: "హైడ్రో స్మార్ట్", waterSub: "నీటిపారుదల AI",
      khata: "స్మార్ట్ లెడ్జర్", khataSub: "లాభాల లెక్కలు",
      sahayog: "సహాయోగ్ గ్రిడ్", sahayogSub: "యంత్రాల అద్దె",
      schemes: "యోజన సేతు", schemesSub: "ప్రభుత్వ పథకాలు",
      grade: "విజన్ గ్రేడర్", gradeSub: "నాణ్యత తనిఖీ",
      organic: "సేంద్రియ హబ్", organicSub: "ప్రకృతి వ్యవసాయం",
      vet: "పశు రక్షక్", vetSub: "వైద్య సేవలు",
      safety: "భద్రత", safetySub: "జాగ్రత్తలు",
      vidya: "విద్యా వాణి", vidyaSub: "ఆడియో శిక్షణ",
      radar: "పెస్ట్ రాడార్", radarSub: "లైవ్ మ్యాప్",
      askAi: "AI కమాండ్"
    }
  };
  
  const t = translations[user.lang] || translations['English'];

  const [weather, setWeather] = useState({ temp: '--', humidity: '--', wind: '--', description: t.detecting });
  const [locationName, setLocationName] = useState(t.detecting);
  const [timeGreeting, setTimeGreeting] = useState(t.morning);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting(t.morning);
    else if (hour < 17) setTimeGreeting(t.afternoon);
    else setTimeGreeting(t.evening);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          setLocationName(geoRes.data.city || geoRes.data.locality || "Primary Sector");

          const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
          const current = weatherRes.data.current;
          setWeather({ temp: Math.round(current.temperature_2m), humidity: current.relative_humidity_2m, wind: current.wind_speed_10m, description: "Atmospheric Link Clear" });
        } catch (err) { setLocationName("Manual Link"); }
      });
    }
  }, [t.morning, t.afternoon, t.evening, t.detecting]);

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '140px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* 1. HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
              <div className="pulse-dot" style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
              <p style={{margin:0, color:'#10b981', fontSize:'0.75rem', fontWeight:'800', letterSpacing: '2px'}}>{timeGreeting}</p>
            </div>
            <h1 style={{margin:0, fontSize:'1.7rem', fontWeight:'900', letterSpacing:'-0.5px'}}>{user.name} <span style={{color: '#38bdf8'}}>/ID</span></h1>
            <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'4px', color: '#94a3b8'}}>
              <MapPin size={12} color="#38bdf8" />
              <span style={{fontSize:'0.8rem', fontWeight:'700'}}>{locationName}</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', color:'#ef4444', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><LogOut size={20}/></button>
        </div>
      </div>

      {/* 2. ATMOSPHERE STATUS */}
      <div style={{padding: '20px'}}>
        <div style={{ background: '#0f172a', borderRadius: '24px', padding: '20px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{margin:'0 0 5px 0', color:'#38bdf8', fontSize:'0.7rem', fontWeight:'900', letterSpacing:'1.5px'}}>DATA TELEMETRY</p>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <span style={{fontSize:'3.2rem', fontWeight:'900'}}>{weather.temp}°</span>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                 <Sun size={24} color="#fbbf24"/>
                 <span style={{color:'#94a3b8', fontWeight:'700', fontSize:'0.8rem'}}>{weather.description}</span>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px solid #1e293b', paddingLeft: '20px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}><Droplets size={16} color="#38bdf8"/> <span style={{fontWeight:'800', fontSize:'0.9rem'}}>{weather.humidity}%</span></div>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}><Wind size={16} color="#94a3b8"/> <span style={{fontWeight:'800', fontSize:'0.9rem'}}>{weather.wind} <small>km/h</small></span></div>
          </div>
        </div>
      </div>

      <div style={{padding: '0 20px'}}>
        
        {/* PHASE 1: STRATEGY */}
        <div style={sectionHeaderStyle}><CalendarClock size={14} /> {t.phase1}</div>
        <div style={gridStyle}>
          <div onClick={() => navigate('/agricore')} className="fade-in" style={darkCardStyle('#a855f7')}><div style={glowIconStyle('#a855f7')}><Cpu size={24} /></div><span style={cardTextStyle}>{t.agriCore}</span><span style={cardSubTextStyle}>{t.agriCoreSub}</span></div>
          <div onClick={() => navigate('/insurance')} className="fade-in" style={darkCardStyle('#38bdf8')}><div style={glowIconStyle('#38bdf8')}><ShieldCheck size={24} /></div><span style={cardTextStyle}>{t.bima}</span><span style={cardSubTextStyle}>{t.bimaSub}</span></div>
          <div onClick={() => navigate('/safety')} className="fade-in" style={darkCardStyle('#ef4444')}><div style={glowIconStyle('#ef4444')}><ShieldQuestion size={24} /></div><span style={cardTextStyle}>{t.safety}</span><span style={cardSubTextStyle}>{t.safetySub}</span></div>
          <div onClick={() => navigate('/vidya')} className="fade-in" style={darkCardStyle('#eab308')}><div style={glowIconStyle('#eab308')}><BookOpen size={24} /></div><span style={cardTextStyle}>{t.vidya}</span><span style={cardSubTextStyle}>{t.vidyaSub}</span></div>
        </div>

        {/* PHASE 2: RESOURCES */}
        <div style={sectionHeaderStyle}><Tractor size={14} /> {t.phase2}</div>
        <div style={gridStyle}>
          <div onClick={() => navigate('/rentals')} className="fade-in" style={darkCardStyle('#2dd4bf')}><div style={glowIconStyle('#2dd4bf')}><Handshake size={24} /></div><span style={cardTextStyle}>{t.sahayog}</span><span style={cardSubTextStyle}>{t.sahayogSub}</span></div>
          <div onClick={() => navigate('/schemes')} className="fade-in" style={darkCardStyle('#818cf8')}><div style={glowIconStyle('#818cf8')}><Landmark size={24} /></div><span style={cardTextStyle}>{t.schemes}</span><span style={cardSubTextStyle}>{t.schemesSub}</span></div>
          <div onClick={() => navigate('/organic')} className="fade-in" style={darkCardStyle('#84cc16')}><div style={glowIconStyle('#84cc16')}><Leaf size={24} /></div><span style={cardTextStyle}>{t.organic}</span><span style={cardSubTextStyle}>{t.organicSub}</span></div>
          <div onClick={() => navigate('/vet')} className="fade-in" style={darkCardStyle('#06b6d4')}><div style={glowIconStyle('#06b6d4')}><Stethoscope size={24} /></div><span style={cardTextStyle}>{t.vet}</span><span style={cardSubTextStyle}>{t.vetSub}</span></div>
        </div>

        {/* PHASE 3: FIELD CARE (With PEST RADAR) */}
        <div style={sectionHeaderStyle}><HeartPulse size={14} /> {t.phase3}</div>
        <div style={gridStyle}>
          {/* Pest Radar - High Visibility Full-Width Card */}
          <div onClick={() => navigate('/radar')} className="fade-in" style={{...darkCardStyle('#ef4444'), gridColumn: 'span 2', background: 'linear-gradient(90deg, #450a0a 0%, #020617 100%)', border: '1px solid #7f1d1d'}}>
            <div style={{display: 'flex', alignItems: 'center', width: '100%', gap: '15px'}}>
              <div style={{...glowIconStyle('#ef4444'), background: 'rgba(239, 68, 68, 0.1)', flexShrink: 0}} className="radar-ping">
                <Radar size={32} color="#ef4444"/>
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{...cardTextStyle, color: '#f87171', textAlign: 'left'}}>{t.radar}</span>
                  <span style={{background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>LIVE</span>
                </div>
                <span style={{...cardSubTextStyle, textAlign: 'left', display: 'block'}}>{t.radarSub}</span>
              </div>
              <ChevronRight color="#7f1d1d" />
            </div>
          </div>

          <div onClick={() => navigate('/doctor')} className="fade-in" style={darkCardStyle('#4ade80')}><div style={glowIconStyle('#4ade80')}><Sprout size={24} /></div><span style={cardTextStyle}>{t.doctor}</span><span style={cardSubTextStyle}>{t.doctorSub}</span></div>
          <div onClick={() => navigate('/water')} className="fade-in" style={darkCardStyle('#38bdf8')}><div style={glowIconStyle('#38bdf8')}><Droplet size={24} /></div><span style={cardTextStyle}>{t.water}</span><span style={cardSubTextStyle}>{t.waterSub}</span></div>
        </div>

        {/* PHASE 4: COMMERCE */}
        <div style={sectionHeaderStyle}><TrendingUp size={14} /> {t.phase4}</div>
        <div style={gridStyle}>
          <div onClick={() => navigate('/grade')} className="fade-in" style={{...darkCardStyle('#10b981'), gridColumn: 'span 2', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2310b981\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E"), #0f172a'}}>
            <div style={{display: 'flex', alignItems: 'center', width: '100%', gap: '15px'}}>
              <div style={{...glowIconStyle('#10b981'), flexShrink: 0}}><Camera size={32} /></div>
              <div style={{flex: 1}}>
                <span style={{...cardTextStyle, textAlign: 'left', display: 'block'}}>{t.grade}</span>
                <span style={{...cardSubTextStyle, textAlign: 'left', display: 'block'}}>{t.gradeSub}</span>
              </div>
              <Zap color="#10b981" />
            </div>
          </div>
          <div onClick={() => navigate('/mandi')} className="fade-in" style={darkCardStyle('#f97316')}><div style={glowIconStyle('#f97316')}><TrendingUp size={24} /></div><span style={cardTextStyle}>{t.mandi}</span><span style={cardSubTextStyle}>{t.mandiSub}</span></div>
          <div onClick={() => navigate('/khata')} className="fade-in" style={darkCardStyle('#a855f7')}><div style={glowIconStyle('#a855f7')}><BookText size={24} /></div><span style={cardTextStyle}>{t.khata}</span><span style={cardSubTextStyle}>{t.khataSub}</span></div>
        </div>
      </div>

      {/* FLOATING COMMAND CORE */}
      <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 100 }}>
        <button onClick={() => navigate('/vidya')} className="ai-core-pulse"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: '50%', width: '75px', height: '75px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: '4px solid #020617' }}>
          <Mic size={34} />
        </button>
        <span style={{marginTop: '10px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', color: '#10b981', background: '#020617', padding: '2px 8px', borderRadius: '10px'}}>{t.askAi}</span>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out backwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseDot { 0% { opacity: 0.4; } 50% { opacity: 1; box-shadow: 0 0 10px #10b981; } 100% { opacity: 0.4; } }
        .pulse-dot { animation: pulseDot 2s infinite ease-in-out; }
        @keyframes aiPulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .ai-core-pulse { animation: aiPulse 2.5s infinite; }
        @keyframes radarPing { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .radar-ping { animation: radarPing 2s infinite; }
      `}</style>
    </div>
  );
};

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' };
const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '15px' };
const darkCardStyle = (color) => ({ background: '#0f172a', border: '1px solid #1e293b', borderTop: `2px solid ${color}40`, borderRadius: '20px', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' });
const glowIconStyle = (color) => ({ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: `1px solid ${color}30` });
const cardTextStyle = { fontSize: '0.95rem', fontWeight: '900', color: '#f8fafc', textAlign: 'center' };
const cardSubTextStyle = { fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textAlign: 'center', marginTop: '4px' };

export default Home;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Droplet, Power, PowerOff, CloudRain, AlertCircle, 
  ArrowLeft, MapPin, Sprout, ThermometerSun, 
  Lightbulb, Info, CheckCircle2, Volume2, VolumeX, Loader 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JalRakshak = () => {
  const navigate = useNavigate();
  const [pumpStatus, setPumpStatus] = useState(false);
  const [weather, setWeather] = useState({ rainChance: '--', temp: '--' });
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState('paddy'); 

  // Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const ui = {
    English: {
      title: "Hydro Smart", sub: "AI Irrigation Matrix",
      locating: "Scanning Field Coordinates...",
      selectCrop: "SELECT CROP PROFILE:",
      crops: { 
        paddy: "🌾 Paddy (High Water)", 
        sugarcane: "🎋 Sugarcane (High Water)",
        cotton: "☁️ Cotton (Low Water)", 
        wheat: "🌾 Wheat (Medium Water)",
        maize: "🌽 Maize (Medium Water)",
        groundnut: "🥜 Groundnut (Low Water)",
        veg: "🍅 Vegetables (Medium)" 
      },
      stats: "ATMOSPHERIC CONDITIONS", rain: "Rain Probability", temp: "Surface Temp",
      advStop: "🛑 IRRIGATION HALTED", advStart: "✅ IRRIGATION REQUIRED", advModerate: "⚠️ LIGHT IRRIGATION",
      descRain: "Heavy precipitation detected in your sector. Save electricity and let natural weather patterns water your crop.",
      descPaddy: "Paddy requires standing water. The atmospheric conditions are dry, initiate pump sequence.",
      descCotton: "Cotton requires less water. Surface temp is high, initiate light watering cycle.",
      descVeg: "Vegetables need consistent moisture. Initiate short-duration pump sequence.",
      descGeneral: "Soil moisture dropping due to surface heat. A moderate irrigation session is recommended.",
      btnStart: "INITIATE PUMP", btnStop: "TERMINATE PUMP",
      pumpOn: "STATUS: PUMP RUNNING", pumpOff: "STATUS: PUMP OFFLINE",
      techniqueTitle: "OPTIMAL IRRIGATION PROTOCOL",
      voiceBanner: "The AI irrigation protocol will be read out loud for clarity.",
      playVoice: "Listen to Protocol", stopVoice: "Stop Audio",
      techniques: {
        paddy: {
          name: "Alternate Wetting & Drying (AWD)",
          desc: "Do not keep the field flooded constantly. Let the water recede until hairline cracks appear in the soil, then re-flood to 5cm.  This saves 30% water and strengthens plant roots, leading to higher yield."
        },
        cotton: {
          name: "Furrow / Drip Irrigation",
          desc: "Apply water every 15-20 days only. Avoid waterlogging at all costs as it causes root rot in cotton.  If using drip, water daily for 1-2 hours depending on heat."
        },
        veg: {
          name: "Drip Irrigation with Mulching",
          desc: "Apply water directly to the plant roots using a drip line.  Cover the soil with plastic or organic mulch to trap moisture. This prevents weed growth and saves 50% water."
        },
        sugarcane: {
          name: "Deep Furrow Irrigation",
          desc: "Plant in deep trenches. Irrigate frequently during the summer growth phase.  Crucial tip: Stop all watering 15 to 20 days before harvest to increase sugar content."
        },
        wheat: {
          name: "Border or Sprinkler Irrigation",
          desc: "Wheat is highly sensitive to water stress at the Crown Root Initiation (CRI) stage, which occurs exactly 21 days after sowing.  Ensure a light but thorough irrigation at this specific time for maximum grain size."
        },
        groundnut: {
          name: "Sprinkler Irrigation",
          desc: "Requires light and frequent watering. Never overwater during the pod-formation stage, as wet soil prevents the pegs from penetrating the earth. "
        },
        maize: {
          name: "Ridge and Furrow Irrigation",
          desc: "Maize cannot tolerate standing water. Plant on ridges and flow water through the furrows.  Ensure the soil is perfectly moist during the tasseling and silking (flowering) stages."
        }
      }
    },
    Hindi: {
      title: "जल स्मार्ट", sub: "एआई सिंचाई मैट्रिक्स",
      locating: "खेत निर्देशांक स्कैन कर रहा है...",
      selectCrop: "फसल प्रोफ़ाइल चुनें:",
      crops: { 
        paddy: "🌾 धान (अधिक पानी)", 
        sugarcane: "🎋 गन्ना (अधिक पानी)",
        cotton: "☁️ कपास (कम पानी)", 
        wheat: "🌾 गेहूं (मध्यम पानी)",
        maize: "🌽 मक्का (मध्यम पानी)",
        groundnut: "🥜 मूंगफली (कम पानी)",
        veg: "🍅 सब्जियां (मध्यम पानी)" 
      },
      stats: "वायुमंडलीय स्थितियां", rain: "बारिश की संभावना", temp: "सतह का तापमान",
      advStop: "🛑 सिंचाई रोकी गई", advStart: "✅ सिंचाई की आवश्यकता", advModerate: "⚠️ हल्की सिंचाई",
      descRain: "आपके सेक्टर में भारी बारिश का अनुमान है। बिजली बचाएं और प्रकृति को सिंचाई करने दें।",
      descPaddy: "धान को खड़े पानी की आवश्यकता होती है। वायुमंडलीय स्थितियां शुष्क हैं, पंप शुरू करें।",
      descCotton: "कपास को कम पानी चाहिए। सतह का तापमान अधिक है, हल्की सिंचाई शुरू करें।",
      descVeg: "सब्जियों को लगातार नमी चाहिए। छोटी अवधि के लिए पंप शुरू करें।",
      descGeneral: "गर्मी के कारण मिट्टी की नमी कम हो रही है। मध्यम सिंचाई की सलाह दी जाती है।",
      btnStart: "पंप शुरू करें", btnStop: "पंप बंद करें",
      pumpOn: "स्थिति: पंप चल रहा है", pumpOff: "स्थिति: पंप ऑफ़लाइन",
      techniqueTitle: "इष्टतम सिंचाई प्रोटोकॉल",
      voiceBanner: "स्पष्टता के लिए एआई सिंचाई प्रोटोकॉल पढ़कर सुनाया जाएगा।",
      playVoice: "प्रोटोकॉल सुनें", stopVoice: "ऑडियो रोकें",
      techniques: {
        paddy: {
          name: "वैकल्पिक गीला और सूखा (AWD)",
          desc: "खेत को हमेशा पानी से न भरें। पानी को तब तक सूखने दें जब तक मिट्टी में हल्की दरारें न आ जाएं, फिर 5 सेमी तक दोबारा भरें।  इससे 30% पानी बचता है और जड़ें मजबूत होती हैं।"
        },
        cotton: {
          name: "नाली (फरो) या ड्रिप सिंचाई",
          desc: "केवल हर 15-20 दिन में पानी दें। जलभराव से बचें क्योंकि इससे कपास में जड़ सड़न होती है।  यदि ड्रिप का उपयोग कर रहे हैं, तो गर्मी के अनुसार रोजाना 1-2 घंटे चलाएं।"
        },
        veg: {
          name: "मल्चिंग के साथ ड्रिप सिंचाई",
          desc: "ड्रिप लाइन का उपयोग करके सीधे पौधों की जड़ों में पानी दें।  नमी को रोकने के लिए मिट्टी को प्लास्टिक या जैविक मल्च से ढक दें। यह 50% पानी बचाता है।"
        },
        sugarcane: {
          name: "गहरी नाली सिंचाई",
          desc: "गहरी खाइयों में रोपण करें। गर्मियों के दौरान बार-बार सिंचाई करें।  महत्वपूर्ण सुझाव: चीनी की मात्रा बढ़ाने के लिए कटाई से 15 से 20 दिन पहले पानी देना पूरी तरह बंद कर दें।"
        },
        wheat: {
          name: "बॉर्डर या स्प्रिंकलर सिंचाई",
          desc: "गेहूं क्राउन रूट इनिशिएशन (CRI) चरण में पानी की कमी के प्रति अत्यधिक संवेदनशील है, जो बुवाई के ठीक 21 दिन बाद होता है।  अधिकतम उपज के लिए इस समय हल्की लेकिन अच्छी सिंचाई सुनिश्चित करें।"
        },
        groundnut: {
          name: "स्प्रिंकलर सिंचाई",
          desc: "हल्की सिंचाई की आवश्यकता होती है। फली बनने के चरण के दौरान कभी भी अधिक पानी न दें। "
        },
        maize: {
          name: "रिज और फरो सिंचाई",
          desc: "मक्का खड़े पानी को बर्दाश्त नहीं कर सकता। मेड़ों (रिज) पर रोपण करें और नालियों (फरो) से पानी बहाएं।  फूल आने के चरण (टैसलिंग) के दौरान मिट्टी में नमी सुनिश्चित करें।"
        }
      }
    },
    Telugu: {
      title: "హైడ్రో స్మార్ట్", sub: "AI నీటిపారుదల మ్యాట్రిక్స్",
      locating: "ఫీల్డ్ కోఆర్డినేట్‌లను స్కాన్ చేస్తోంది...",
      selectCrop: "పంట ప్రొఫైల్‌ను ఎంచుకోండి:",
      crops: { 
        paddy: "🌾 వరి (ఎక్కువ నీరు)", 
        sugarcane: "🎋 చెరకు (ఎక్కువ నీరు)",
        cotton: "☁️ పత్తి (తక్కువ నీరు)", 
        wheat: "🌾 గోధుమ (మధ్యస్థం)",
        maize: "🌽 మొక్కజొన్న (మధ్యస్థం)",
        groundnut: "🥜 వేరుశనగ (తక్కువ నీరు)",
        veg: "🍅 కూరగాయలు (మధ్యస్థం)" 
      },
      stats: "వాతావరణ పరిస్థితులు", rain: "వర్షం అవకాశం", temp: "ఉపరితల ఉష్ణోగ్రత",
      advStop: "🛑 నీటిపారుదల ఆపబడింది", advStart: "✅ నీటిపారుదల అవసరం", advModerate: "⚠️ స్వల్ప నీటిపారుదల",
      descRain: "మీ సెక్టార్‌లో భారీ వర్షం కురిసే అవకాశం ఉంది. కరెంటు ఆదా చేయండి.",
      descPaddy: "వరికి ఎక్కువ నీరు అవసరం. వాతావరణం పొడిగా ఉంది, మోటార్ ఆన్ చేయండి.",
      descCotton: "పత్తికి తక్కువ నీరు అవసరం. ఉపరితల ఉష్ణోగ్రత ఎక్కువగా ఉంది, కొద్దిగా నీరు పెట్టండి.",
      descVeg: "కూరగాయలకు తగినంత తేమ అవసరం. కొద్దిసేపు మోటార్ ఆన్ చేయండి.",
      descGeneral: "ఎండల వల్ల నేలలో తేమ తగ్గుతోంది. కొద్దిగా నీరు పెట్టడం మంచిది.",
      btnStart: "మోటార్ ఆన్ చేయండి", btnStop: "మోటార్ ఆఫ్ చేయండి",
      pumpOn: "స్థితి: మోటార్ రన్నింగ్", pumpOff: "స్థితి: మోటార్ ఆఫ్‌లైన్",
      techniqueTitle: "సరైన నీటిపారుదల ప్రోటోకాల్",
      voiceBanner: "మీకు స్పష్టంగా అర్థం కావడానికి AI నీటిపారుదల ప్రోటోకాల్ చదివి వినిపించబడుతుంది.",
      playVoice: "ప్రోటోకాల్ వినండి", stopVoice: "ఆడియో ఆపండి",
      techniques: {
        paddy: {
          name: "ప్రత్యామ్నాయ తడి మరియు పొడి (AWD)",
          desc: "పొలంలో ఎప్పుడూ నీరు నిల్వ ఉంచవద్దు. నేల మీద సన్నని పగుళ్లు వచ్చే వరకు ఆరనిచ్చి, ఆపై 5 సెం.మీ వరకు నీరు పెట్టండి.  దీనివల్ల 30% నీరు ఆదా అవుతుంది మరియు వేర్లు బలపడతాయి."
        },
        cotton: {
          name: "బోదెలు / బిందు సేద్యం",
          desc: "ప్రతి 15-20 రోజులకు మాత్రమే నీరు పెట్టండి. నీరు నిల్వ ఉండకుండా చూసుకోండి, ఇది వేరు కుళ్లుకు దారి తీస్తుంది.  డ్రిప్ వాడుతుంటే రోజుకు 1-2 గంటలు నీరు అందించండి."
        },
        veg: {
          name: "మల్చింగ్‌తో బిందు సేద్యం",
          desc: "డ్రిప్ ద్వారా నేరుగా మొక్కల వేర్లకు నీరు అందించండి.  తేమను నిలపడానికి ప్లాస్టిక్ లేదా సేంద్రియ మల్చింగ్ వాడండి. ఇది కలుపును నివారించి 50% నీటిని ఆదా చేస్తుంది."
        },
        sugarcane: {
          name: "లోతైన బోదెల పద్ధతి",
          desc: "లోతైన కందకాలలో నాటండి. వేసవిలో క్రమం తప్పకుండా నీరు పెట్టండి.  ముఖ్య సూచన: చెరకులో చక్కెర శాతం పెరగడానికి కోతకు 15-20 రోజుల ముందు నీరు పెట్టడం ఆపేయాలి."
        },
        wheat: {
          name: "బోర్డర్ లేదా స్ప్రింక్లర్ పద్ధతి",
          desc: "విత్తిన సరిగ్గా 21 రోజుల తర్వాత వచ్చే క్రౌన్ రూట్ ఇనిషియేషన్ (CRI) దశలో గోధుమకు నీరు అత్యంత కీలకం.  అధిక దిగుబడి కోసం ఈ సమయంలో తప్పనిసరిగా నీరు పెట్టాలి."
        },
        groundnut: {
          name: "స్ప్రింక్లర్ సేద్యం",
          desc: "తక్కువ మరియు తరచుగా నీరు పెట్టాలి. కాయలు ఏర్పడే దశలో ఎట్టిపరిస్థితుల్లోనూ ఎక్కువ నీరు పెట్టకండి. "
        },
        maize: {
          name: "బోదెలు మరియు కాలువల పద్ధతి",
          desc: "మొక్కజొన్న పొలంలో నీరు నిల్వ ఉండకూడదు. బోదెల మీద నాటి, కాలువల ద్వారా నీరు పారించండి.  పూత మరియు గింజలు ఏర్పడే దశలో నేలలో సరైన తేమ ఉండేలా చూసుకోండి."
        }
      }
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

  // 🚀 DUAL-ENGINE GEOLOCATION (Bypasses HTTP Mobile Blocks)
  useEffect(() => {
    setLocationName(t.locating);
    
    const fetchWeather = async (lat, lon, cityName) => {
      try {
        let finalCity = cityName;
        if (!finalCity) {
          const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          finalCity = geoRes.data.city || geoRes.data.locality || "Unknown Sector";
        }
        setLocationName(finalCity);

        const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=precipitation_probability_max&timezone=auto`);
        
        setWeather({
          temp: Math.round(weatherRes.data.current.temperature_2m),
          rainChance: weatherRes.data.daily.precipitation_probability_max[0]
        });
      } catch (err) {
        console.error("Data fetch error", err);
        setLocationName("Telemetry Offline");
      } finally {
        setLoading(false);
      }
    };

    const fetchFromIP = async () => {
      try {
        const ipRes = await axios.get('https://ipapi.co/json/');
        fetchWeather(ipRes.data.latitude, ipRes.data.longitude, ipRes.data.city);
      } catch (e) {
        // Fallback to Vizag if everything fails
        fetchWeather(17.6868, 83.2185, "Visakhapatnam (Default)");
      }
    };

    if (!navigator.geolocation) {
      fetchFromIP();
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, null),
        (err) => fetchFromIP(), 
        { timeout: 5000 }
      );
    }
  }, [t.locating]);

  // --- SMART DECISION ENGINE ---
  const getAdvice = () => {
    if (weather.rainChance > 50) {
      return { title: t.advStop, desc: t.descRain, color: '#ef4444', bg: '#450a0a', border: '#7f1d1d' };
    }
    if (crop === 'paddy' || crop === 'sugarcane') {
      return { title: t.advStart, desc: t.descPaddy, color: '#10b981', bg: '#064e3b', border: '#047857' };
    }
    if (crop === 'cotton' || crop === 'groundnut') {
      return { title: t.advModerate, desc: t.descCotton, color: '#f59e0b', bg: '#451a03', border: '#78350f' };
    }
    return { title: t.advModerate, desc: t.descGeneral, color: '#38bdf8', bg: '#082f49', border: '#0c4a6e' };
  };

  const advice = getAdvice();
  const activeTechnique = t.techniques[crop];

  // --- VOICE ASSISTANT ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported on this device.");
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let rawText = `${t.voiceBanner}. `;
    rawText += `${advice.title}. ${advice.desc}. `;
    rawText += `${t.techniqueTitle}: ${activeTechnique.name}. ${activeTechnique.desc}. `;

    const cleanText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                             .replace(/\[.*?\]/g, '') 
                             .replace(/\*/g, '').replace(/#/g, '');

    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(voice => voice.lang === targetLangCode || voice.lang.startsWith(targetLangCode.substring(0, 2)));

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
    <div style={{paddingBottom:'90px', background:'#020617', color:'#f8fafc', minHeight:'100vh', fontFamily:'"Inter", sans-serif'}}>
      
      {/* 1. HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(56, 189, 248, 0.3)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(56, 189, 248, 0.1)', border:'1px solid rgba(56, 189, 248, 0.3)', color:'#38bdf8', padding:'10px', borderRadius:'12px', cursor:'pointer'}}>
             <ArrowLeft size={24}/>
          </button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px', color:'#f8fafc'}}>
              <Droplet size={24} color="#38bdf8"/> {t.title}
            </h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        
        {/* 2. LOCATION & CROP SELECTION */}
        <div className="fade-in" style={{background: '#0f172a', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom:'20px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#38bdf8', fontWeight:'800', marginBottom:'20px', background:'#020617', padding:'12px 15px', borderRadius:'16px', border:'1px solid #1e293b'}}>
             {loading ? <Loader className="spin" size={18}/> : <MapPin size={18}/>} 
             <span style={{fontSize:'0.95rem', letterSpacing:'0.5px'}}>{locationName}</span>
          </div>

          <label style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'0.8rem', fontWeight:'800', color:'#94a3b8', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'1px'}}>
            <Sprout size={16} color="#38bdf8"/> {t.selectCrop}
          </label>
          <select 
            value={crop} onChange={(e) => setCrop(e.target.value)}
            style={{width:'100%', padding:'16px 15px', borderRadius:'14px', border:'1px solid #1e293b', background:'#020617', color:'#f8fafc', fontSize:'1.05rem', fontWeight:'800', outline:'none', cursor:'pointer', appearance:'none'}}
          >
            {Object.entries(t.crops).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* 🔴 MASSIVE VOICE BANNER */}
        <div className="fade-in" style={{ background:'rgba(56, 189, 248, 0.05)', border:'1px solid rgba(56, 189, 248, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
          <Info size={28} color="#38bdf8" style={{marginBottom:'10px'}} />
          <p style={{margin:'0 0 20px 0', color:'#cbd5e1', fontSize:'0.95rem', lineHeight:'1.5', fontWeight:'500'}}>{t.voiceBanner}</p>
          <button 
            onClick={handleSpeak} className={isSpeaking ? "pulse-voice" : ""}
            style={{
              width: '100%', 
              background: isSpeaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              border: 'none', color: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              fontWeight: '900', fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.4)' : '0 8px 25px rgba(56, 189, 248, 0.3)'
            }}
          >
             {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
             {isSpeaking ? t.stopVoice : t.playVoice}
          </button>
        </div>
        
        {/* 3. WEATHER STATS */}
        <h3 style={{margin:'0 0 15px 0', color:'#94a3b8', fontSize:'0.85rem', fontWeight:'800', textTransform:'uppercase', letterSpacing:'2px'}}>{t.stats}</h3>
        
        <div className="fade-in" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'25px'}}>
          <div style={{background:'#0f172a', padding:'25px 10px', borderRadius:'20px', display:'flex', flexDirection:'column', alignItems:'center', border:'1px solid #1e293b', boxShadow:'0 8px 20px rgba(0,0,0,0.3)'}}>
             <CloudRain size={36} color={weather.rainChance > 50 ? "#38bdf8" : "#64748b"} style={{marginBottom:'12px'}}/>
             <span style={{fontSize:'2.2rem', fontWeight:'900', color:'#f8fafc', lineHeight:'1'}}>{weather.rainChance}%</span>
             <span style={{fontSize:'0.8rem', color:'#94a3b8', fontWeight:'800', marginTop:'8px', textTransform:'uppercase'}}>{t.rain}</span>
          </div>
          <div style={{background:'#0f172a', padding:'25px 10px', borderRadius:'20px', display:'flex', flexDirection:'column', alignItems:'center', border:'1px solid #1e293b', boxShadow:'0 8px 20px rgba(0,0,0,0.3)'}}>
             <ThermometerSun size={36} color="#f59e0b" style={{marginBottom:'12px'}}/>
             <span style={{fontSize:'2.2rem', fontWeight:'900', color:'#f8fafc', lineHeight:'1'}}>{weather.temp}°C</span>
             <span style={{fontSize:'0.8rem', color:'#94a3b8', fontWeight:'800', marginTop:'8px', textTransform:'uppercase'}}>{t.temp}</span>
          </div>
        </div>

        {/* 4. SMART ADVICE CARD */}
        {!loading && (
          <div className="fade-in" style={{
            background: advice.bg, padding:'25px 20px', borderRadius:'24px', 
            border:`1px solid ${advice.border}`, borderLeft:`5px solid ${advice.color}`, marginBottom:'25px',
            boxShadow:`0 10px 30px rgba(0,0,0,0.4)`
          }}>
            <h3 style={{margin:'0 0 12px 0', color:advice.color, fontSize:'1.1rem', display:'flex', alignItems:'center', gap:'10px', fontWeight:'900', letterSpacing:'1px'}}>
              <AlertCircle size={22}/> {advice.title}
            </h3>
            <p style={{margin:0, color:'#cbd5e1', fontSize:'0.95rem', lineHeight:'1.6', fontWeight:'500'}}>
              {advice.desc}
            </p>
          </div>
        )}

        {/* 5. INTERACTIVE PUMP BUTTON */}
        <div className="fade-in" style={{textAlign:'center', marginBottom:'35px'}}>
          <p style={{color:'#94a3b8', fontWeight:'800', marginBottom:'12px', fontSize:'0.85rem', letterSpacing:'2px', textTransform:'uppercase'}}>
            {pumpStatus ? t.pumpOn : t.pumpOff}
          </p>
          <button 
            onClick={() => setPumpStatus(!pumpStatus)}
            style={{
              width:'100%', padding:'25px', borderRadius:'24px', border:'none', 
              background: pumpStatus ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
              color:'white', fontSize:'1.3rem', fontWeight:'900', letterSpacing:'2px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'15px',
              cursor:'pointer', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: pumpStatus ? '0 10px 30px rgba(239, 68, 68, 0.4)' : '0 10px 30px rgba(16, 185, 129, 0.4)'
            }}
          >
            {pumpStatus ? <><PowerOff size={32}/> {t.btnStop}</> : <><Power size={32}/> {t.btnStart}</>}
          </button>
        </div>

        {/* 6. BEST IRRIGATION TECHNIQUE CARD */}
        {activeTechnique && (
          <div className="fade-in" style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
              <div style={{background:'rgba(56, 189, 248, 0.1)', padding:'10px', borderRadius:'12px', border:'1px solid rgba(56, 189, 248, 0.3)'}}>
                <Lightbulb size={24} color="#38bdf8"/>
              </div>
              <h3 style={{margin:0, color:'#f8fafc', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px'}}>{t.techniqueTitle}</h3>
            </div>
            
            <div style={{borderLeft:'4px solid #38bdf8', paddingLeft:'15px', marginLeft:'5px'}}>
              <h4 style={{margin:'0 0 10px 0', color:'#38bdf8', fontSize:'1.1rem', fontWeight:'800'}}>{activeTechnique.name}</h4>
              <p style={{margin:0, color:'#cbd5e1', fontSize:'0.95rem', lineHeight:'1.7', fontWeight:'500'}}>
                {activeTechnique.desc}
              </p>
            </div>
            
            <div style={{marginTop:'25px', background:'#020617', padding:'15px', borderRadius:'16px', display:'flex', gap:'12px', alignItems:'flex-start', border:'1px dashed #334155'}}>
              <CheckCircle2 size={20} color="#10b981" style={{flexShrink:0, marginTop:'2px'}}/>
              <p style={{margin:0, fontSize:'0.85rem', color:'#94a3b8', lineHeight:'1.5'}}>
                {user.lang === 'Hindi' ? "इन विधियों का उपयोग करने से 50% तक पानी की बचत होती है और फसल की उपज बढ़ती है।" : 
                 user.lang === 'Telugu' ? "ఈ పద్ధతులను ఉపయోగించడం ద్వారా 50% వరకు నీరు ఆదా అవుతుంది మరియు దిగుబడి పెరుగుతుంది." : 
                 "Using these verified methods can save up to 50% of groundwater and significantly increase crop yield."}
              </p>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default JalRakshak;
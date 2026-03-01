import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Phone, AlertTriangle, ThermometerSun, Syringe, ArrowLeft } from 'lucide-react';

const Safety = () => {
  const navigate = useNavigate();
  
  // Get User Language
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 TRANSLATIONS ---
  const translations = {
    English: {
      title: "🛡️ Raksha (Safety)", subtitle: "Stay Safe in the Field",
      sosTitle: "Emergency?", sosDesc: "Call Ambulance / Help immediately", callBtn: "CALL 108",
      guidelines: "Safety Guidelines",
      snakeTitle: "Snake Bite Protocol",
      snakePoints: [
        "Stay Calm: Panic speeds up heart rate and venom spread.",
        "Immobilize: Do not move the bitten limb. Keep it below heart level.",
        "NO Cutting: Do not cut the wound or try to suck venom.",
        "Transport: Go to the hospital immediately."
      ],
      pestTitle: "Pesticide Safety",
      pestPoints: [
        "Wear Gear: Always wear a mask, gloves, and full-sleeved shirts.",
        "Wind Direction: Never spray against the wind.",
        "Wash: Bathe immediately after spraying."
      ],
      heatTitle: "Sun & Heat Safety",
      heatPoints: [
        "Hydrate: Drink water every 30 minutes.",
        "Timing: Avoid heavy work between 12 PM - 3 PM.",
        "Cover Head: Wear a turban or hat."
      ]
    },
    Hindi: {
      title: "🛡️ सुरक्षा (Safety)", subtitle: "खेत में सुरक्षित रहें",
      sosTitle: "आपातकालीन स्थिति?", sosDesc: "तुरंत एम्बुलेंस बुलाएं", callBtn: "कॉल 108",
      guidelines: "सुरक्षा दिशानिर्देश",
      snakeTitle: "सांप के काटने पर",
      snakePoints: [
        "शांत रहें: घबराने से जहर तेजी से फैलता है।",
        "हिलाएं नहीं: काटे हुए अंग को स्थिर रखें।",
        "चीरा न लगाएं: घाव को काटें या चूसें नहीं।",
        "अस्पताल जाएं: तुरंत नजदीकी अस्पताल जाएं।"
      ],
      pestTitle: "कीटनाशक सुरक्षा",
      pestPoints: [
        "सुरक्षा गियर: मास्क और दस्ताने हमेशा पहनें।",
        "हवा की दिशा: हवा के विपरीत छिड़काव न करें।",
        "स्नान करें: छिड़काव के तुरंत बाद नहाएं।"
      ],
      heatTitle: "धूप और गर्मी से सुरक्षा",
      heatPoints: [
        "पानी पिएं: हर 30 मिनट में पानी पिएं।",
        "समय: दोपहर 12 से 3 बजे के बीच भारी काम से बचें।",
        "सिर ढंकें: धूप से बचने के लिए पगड़ी या टोपी पहनें।"
      ]
    },
    Telugu: {
      title: "🛡️ రక్ష (Safety)", subtitle: "పొలంలో జాగ్రత్తలు",
      sosTitle: "అత్యవసరమా?", sosDesc: "వెంటనే అంబులెన్స్‌కు కాల్ చేయండి", callBtn: "కాల్ 108",
      guidelines: "భద్రతా సూచనలు",
      snakeTitle: "పాము కాటు జాగ్రత్తలు",
      snakePoints: [
        "ప్రశాంతంగా ఉండండి: భయపడితే విషం త్వరగా వ్యాపిస్తుంది.",
        "కదల్చకండి: కాటు వేసిన భాగాన్ని కదల్చకుండా ఉంచండి.",
        "కోయవద్దు: గాయాన్ని కోయడం లేదా విషం పీల్చడం చేయవద్దు.",
        "ఆసుపత్రికి వెళ్ళండి: వెంటనే దగ్గరి ఆసుపత్రికి వెళ్ళండి."
      ],
      pestTitle: "పురుగు మందుల జాగ్రత్తలు",
      pestPoints: [
        "రక్షణ కవచం: మాస్క్ మరియు గ్లౌజులు తప్పక ధరించండి.",
        "గాలి దిశ: గాలికి ఎదురుగా మందు కొట్టవద్దు.",
        "స్నానం: మందు కొట్టిన వెంటనే స్నానం చేయండి."
      ],
      heatTitle: "ఎండ దెబ్బ నుండి రక్షణ",
      heatPoints: [
        "నీరు త్రాగండి: ప్రతి 30 నిమిషాలకు నీరు త్రాగండి.",
        "సమయం: మధ్యాహ్నం 12 నుండి 3 గంటల మధ్య పని తగ్గించండి.",
        "తలపాగా: ఎండ తగలకుండా టోపీ లేదా తలపాగా ధరించండి."
      ]
    }
  };

  const t = translations[user.lang] || translations['English'];

  const handleSOS = () => {
    window.open('tel:108'); 
  };

  return (
    <div className="module-container" style={{paddingBottom:'80px'}}>
      
      {/* Header */}
      <div className="header" style={{background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <button onClick={() => navigate('/home')} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>
             <ArrowLeft size={24}/>
          </button>
          <div>
            <h2 style={{fontSize:'1.5rem'}}>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* SOS BUTTON */}
      <div className="card" style={{marginTop:'-30px', textAlign:'center', border:'2px solid #ef4444', background:'#fef2f2'}}>
        <h3 style={{margin:0, color:'#dc2626'}}>{t.sosTitle}</h3>
        <p style={{fontSize:'0.9rem', color:'#666'}}>{t.sosDesc}</p>
        <button onClick={handleSOS} style={{
          background:'#dc2626', color:'white', border:'none', padding:'15px 30px', 
          borderRadius:'50px', fontSize:'1.2rem', fontWeight:'bold', marginTop:'10px',
          display:'flex', alignItems:'center', gap:'10px', margin:'10px auto', cursor:'pointer',
          boxShadow:'0 4px 15px rgba(220, 38, 38, 0.4)'
        }}>
          <Phone className="pulse" /> {t.callBtn}
        </button>
      </div>

      <h3 style={{margin:'20px 0 10px 0', color:'#444', paddingLeft:'10px'}}>{t.guidelines}</h3>

      {/* 1. Snake Bite */}
      <div className="card" style={{borderLeft:'5px solid #dc2626'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
           <div style={{background:'#fee2e2', padding:'8px', borderRadius:'50%'}}>
             <Syringe color="#dc2626" size={24}/>
           </div>
           <h3 style={{margin:0}}>{t.snakeTitle}</h3>
        </div>
        
        <ul style={{paddingLeft:'20px', color:'#555', lineHeight:'1.6'}}>
          {t.snakePoints.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      </div>

      {/* 2. Pesticides */}
      <div className="card" style={{borderLeft:'5px solid #eab308'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
           <div style={{background:'#fef9c3', padding:'8px', borderRadius:'50%'}}>
             <ShieldAlert color="#ca8a04" size={24}/>
           </div>
           <h3 style={{margin:0}}>{t.pestTitle}</h3>
        </div>
        
        <ul style={{paddingLeft:'20px', color:'#555', lineHeight:'1.6'}}>
          {t.pestPoints.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      </div>

      {/* 3. Heat Stroke */}
      <div className="card" style={{borderLeft:'5px solid #ea580c'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
           <div style={{background:'#ffedd5', padding:'8px', borderRadius:'50%'}}>
             <ThermometerSun color="#ea580c" size={24}/>
           </div>
           <h3 style={{margin:0}}>{t.heatTitle}</h3>
        </div>
        <ul style={{paddingLeft:'20px', color:'#555', lineHeight:'1.6'}}>
          {t.heatPoints.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      </div>

    </div>
  );
};

export default Safety;
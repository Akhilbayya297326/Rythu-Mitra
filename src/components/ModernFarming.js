import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Leaf, Volume2, VolumeX, PlayCircle, 
  Sprout, Bug, ShieldCheck, Sun, Droplets, Earth
} from 'lucide-react';

const ModernFarming = () => {
  const navigate = useNavigate();
  const [speakingId, setSpeakingId] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL UI TRANSLATIONS ---
  const ui = {
    English: {
      title: "Smart Organic", sub: "Protect Earth, Increase Profit",
      whyTitle: "Why Organic Farming?",
      whyDesc: "Chemicals destroy soil and cause cancer. Organic farming uses nature to protect the earth, saves water, costs zero rupees in chemical fertilizers, and gives you a much higher market price for your healthy crops!",
      listen: "Listen", stop: "Stop", watch: "Watch Tutorial",
      steps: [
        {
          id: 1, icon: <Sun size={24}/>, color: '#f59e0b',
          title: "1. Basics of Natural Farming",
          desc: "Understand the foundation of growing crops without chemicals. Let nature do the heavy lifting to keep your farm healthy.",
          videos: ['NSuodo1Magc', 'sG0gy0SY5Rw']
        },
        {
          id: 2, icon: <Sprout size={24}/>, color: '#10b981',
          title: "2. Vermicompost Preparation",
          desc: "Turn your farm waste and cow dung into 'Black Gold'. Earthworms break down waste into the most powerful natural fertilizer.",
          videos: ['8JL1bHSv6o4']
        },
        {
          id: 3, icon: <Leaf size={24}/>, color: '#84cc16',
          title: "3. Green Manure",
          desc: "Grow specific leguminous crops and plow them back into the soil before they flower. This naturally boosts Nitrogen levels in your soil.",
          videos: ['_HvG0vnI9o4', 'yGoqydYbPFw']
        },
        {
          id: 4, icon: <Droplets size={24}/>, color: '#0ea5e9',
          title: "4. Cover Cropping & Mulching",
          desc: "Cover the bare soil with dry leaves or crop residue. This traps moisture, saves water, and stops weeds from growing.",
          videos: ['ssZ3G__PkSc', 'aiWqbtv4wYs']
        },
        {
          id: 5, icon: <ShieldCheck size={24}/>, color: '#d97706',
          title: "5. Mechanical Weed Management",
          desc: "Never use toxic weed-killer sprays. Use manual weeding or mechanical tools to clear weeds safely without poisoning the earth.",
          videos: ['NcLoM1T3YxQ', 'ahVrIvQwPkQ']
        },
        {
          id: 6, icon: <Bug size={24}/>, color: '#ef4444',
          title: "6. Biological Pest Control",
          desc: "Instead of chemical pesticides, use natural enemies like friendly insects (ladybugs) or Neem oil sprays to kill harmful crop pests.",
          videos: ['nZ59KPS2VKY', 'BCf7Z78ndTc']
        }
      ]
    },
    Hindi: {
      title: "स्मार्ट जैविक", sub: "धरती बचाएं, मुनाफा बढ़ाएं",
      whyTitle: "जैविक खेती क्यों?",
      whyDesc: "रसायन मिट्टी को नष्ट करते हैं। जैविक खेती धरती को बचाती है, पानी बचाती है, रासायनिक खादों का खर्च शून्य करती है, और आपको अपनी स्वस्थ फसल के लिए बाजार में बहुत अधिक कीमत दिलाती है!",
      listen: "सुनें", stop: "रोकें", watch: "वीडियो देखें",
      steps: [
        {
          id: 1, icon: <Sun size={24}/>, color: '#f59e0b',
          title: "1. प्राकृतिक खेती के मूल बातें",
          desc: "बिना रसायनों के फसल उगाने की नींव समझें। अपने खेत को स्वस्थ रखने के लिए प्रकृति की मदद लें।",
          videos: ['NSuodo1Magc', 'sG0gy0SY5Rw']
        },
        {
          id: 2, icon: <Sprout size={24}/>, color: '#10b981',
          title: "2. केंचुआ खाद (Vermicompost)",
          desc: "खेत के कचरे और गोबर को 'काले सोने' में बदलें। केंचुए कचरे को सबसे शक्तिशाली प्राकृतिक उर्वरक में बदल देते हैं।",
          videos: ['8JL1bHSv6o4']
        },
        {
          id: 3, icon: <Leaf size={24}/>, color: '#84cc16',
          title: "3. हरी खाद (प्राकृतिक नाइट्रोजन)",
          desc: "विशिष्ट फसलें उगाएं और फूल आने से पहले उन्हें वापस मिट्टी में जोत दें। यह मिट्टी में प्राकृतिक रूप से नाइट्रोजन बढ़ाता है।",
          videos: ['_HvG0vnI9o4', 'yGoqydYbPFw']
        },
        {
          id: 4, icon: <Droplets size={24}/>, color: '#0ea5e9',
          title: "4. मल्चिंग (Mulching)",
          desc: "सूखी पत्तियों या फसल के अवशेषों से नंगी मिट्टी को ढक दें। यह नमी को रोकता है, पानी बचाता है और खरपतवार को उगने से रोकता है।",
          videos: ['ssZ3G__PkSc', 'aiWqbtv4wYs']
        },
        {
          id: 5, icon: <ShieldCheck size={24}/>, color: '#d97706',
          title: "5. यांत्रिक खरपतवार प्रबंधन",
          desc: "कभी भी जहरीले स्प्रे का उपयोग न करें। धरती को जहर दिए बिना खरपतवार साफ करने के लिए यांत्रिक उपकरणों का उपयोग करें।",
          videos: ['NcLoM1T3YxQ', 'ahVrIvQwPkQ']
        },
        {
          id: 6, icon: <Bug size={24}/>, color: '#ef4444',
          title: "6. जैविक कीट नियंत्रण",
          desc: "रासायनिक कीटनाशकों के बजाय, हानिकारक कीटों को मारने के लिए मित्र कीट (लेडीबग) या नीम के तेल जैसे प्राकृतिक दुश्मनों का उपयोग करें।",
          videos: ['nZ59KPS2VKY', 'BCf7Z78ndTc']
        }
      ]
    },
    Telugu: {
      title: "స్మార్ట్ సేంద్రియ", sub: "భూమిని రక్షించండి, లాభం పెంచండి",
      whyTitle: "సేంద్రియ వ్యవసాయం ఎందుకు?",
      whyDesc: "రసాయనాలు నేలను నాశనం చేస్తాయి. సేంద్రియ వ్యవసాయం భూమిని రక్షిస్తుంది, నీటిని ఆదా చేస్తుంది, ఎరువుల ఖర్చును సున్నా చేస్తుంది మరియు మీ ఆరోగ్యకరమైన పంటలకు మార్కెట్లో అత్యధిక ధరను ఇస్తుంది!",
      listen: "వినండి", stop: "ఆపండి", watch: "వీడియో చూడండి",
      steps: [
        {
          id: 1, icon: <Sun size={24}/>, color: '#f59e0b',
          title: "1. ప్రకృతి వ్యవసాయం ప్రాథమికాలు",
          desc: "రసాయనాలు లేకుండా పంటలు పండించడం ఎలాగో నేర్చుకోండి. మీ పొలాన్ని ఆరోగ్యంగా ఉంచడానికి ప్రకృతిని వాడుకోండి.",
          videos: ['NSuodo1Magc', 'sG0gy0SY5Rw']
        },
        {
          id: 2, icon: <Sprout size={24}/>, color: '#10b981',
          title: "2. వర్మీ కంపోస్ట్ తయారీ",
          desc: "మీ పొలం వ్యర్థాలు మరియు ఆవు పేడను 'బ్లాక్ గోల్డ్' గా మార్చండి. వానపాములు వ్యర్థాలను అత్యుత్తమ సహజ ఎరువుగా మారుస్తాయి.",
          videos: ['8JL1bHSv6o4']
        },
        {
          id: 3, icon: <Leaf size={24}/>, color: '#84cc16',
          title: "3. పచ్చిరొట్ట ఎరువు",
          desc: "పప్పుదినుసుల పంటలను పెంచి, పూతకు రాకముందే వాటిని నేలలో కలియదున్నాలి. ఇది నేలలో నత్రజనిని సహజంగా పెంచుతుంది.",
          videos: ['_HvG0vnI9o4', 'yGoqydYbPFw']
        },
        {
          id: 4, icon: <Droplets size={24}/>, color: '#0ea5e9',
          title: "4. మల్చింగ్ (నేల కప్పడం)",
          desc: "నేలను ఎండు ఆకులు లేదా పంట వ్యర్థాలతో కప్పండి. ఇది తేమను ఆపుతుంది, నీటిని ఆదా చేస్తుంది మరియు కలుపు మొక్కలను పెరగనివ్వదు.",
          videos: ['ssZ3G__PkSc', 'aiWqbtv4wYs']
        },
        {
          id: 5, icon: <ShieldCheck size={24}/>, color: '#d97706',
          title: "5. సహజ కలుపు నివారణ",
          desc: "విషపూరిత కలుపు మందులను ఎప్పుడూ వాడకండి. భూమిని విషపూరితం చేయకుండా కలుపును తీయడానికి మానవ శ్రమ లేదా యంత్రాలను వాడండి.",
          videos: ['NcLoM1T3YxQ', 'ahVrIvQwPkQ']
        },
        {
          id: 6, icon: <Bug size={24}/>, color: '#ef4444',
          title: "6. జీవసంబంధ తెగుళ్ల నివారణ",
          desc: "రసాయన పురుగుమందులకు బదులుగా, తెగుళ్లను చంపడానికి మిత్ర పురుగులు లేదా వేప నూనె వంటి సహజ పద్ధతులను వాడండి.",
          videos: ['nZ59KPS2VKY', 'BCf7Z78ndTc']
        }
      ]
    }
  };

  const t = ui[user.lang] || ui['English'];

  useEffect(() => {
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleSpeak = (text, id) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel(); 
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(v => v.lang === targetLangCode || v.lang.startsWith(targetLangCode.substring(0, 2)));

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLangCode;
    if (specificVoice) utterance.voice = specificVoice;
    utterance.rate = 0.85;

    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  return (
    <div style={{paddingBottom:'90px', background:'#020617', color:'#f8fafc', minHeight:'100vh', fontFamily: '"Inter", sans-serif'}}>
      
      {/* 1. HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(16, 185, 129, 0.1)', border:'1px solid rgba(16, 185, 129, 0.3)', color:'#10b981', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Leaf size={24} color="#10b981"/> {t.title}</h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        
        {/* 2. WHY ORGANIC? (Dark Mode Hero) */}
        <div className="fade-in" style={{background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border:'1px solid #1e293b', borderBottom:'4px solid #10b981', marginBottom:'30px'}}>
          <h3 style={{margin:'0 0 15px 0', color:'#10b981', fontSize:'1.3rem', display:'flex', alignItems:'center', gap:'8px', fontWeight:'900'}}>
            <Earth color="#10b981"/> {t.whyTitle}
          </h3>
          <p style={{color:'#cbd5e1', fontSize:'1.05rem', lineHeight:'1.7', margin:'0 0 20px 0', fontWeight:'500'}}>
            {t.whyDesc}
          </p>
          <button 
            onClick={() => handleSpeak(t.whyDesc, 'intro')} className={speakingId === 'intro' ? "pulse-voice" : ""}
            style={{ width:'100%', padding:'18px', background: speakingId === 'intro' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: speakingId === 'intro' ? '#ef4444' : '#10b981', border: speakingId === 'intro' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)', borderRadius:'14px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', cursor:'pointer', transition:'all 0.3s' }}
          >
            {speakingId === 'intro' ? <VolumeX size={24}/> : <Volume2 size={24}/>} 
            {speakingId === 'intro' ? t.stop : t.listen}
          </button>
        </div>

        {/* 3. STEP-BY-STEP FLOWCHART */}
        <div style={{position: 'relative', paddingLeft: '20px'}}>
          <div style={{ position: 'absolute', left: '38px', top: '20px', bottom: '0', width: '2px', background: '#1e293b', zIndex: 0 }}></div>

          {t.steps.map((step, index) => (
            <div key={step.id} className="fade-in" style={{position:'relative', zIndex:1, marginBottom:'40px', display:'flex', flexDirection:'column'}}>
              
              <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px'}}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:`${step.color}20`, color:step.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 0 15px ${step.color}40`, border:`2px solid ${step.color}` }}>
                  {step.icon}
                </div>
                <h3 style={{margin:0, color:'#f8fafc', fontSize:'1.2rem', fontWeight:'900'}}>{step.title}</h3>
              </div>

              <div style={{ marginLeft:'20px', background:'#0f172a', padding:'25px 20px', borderRadius:'0 24px 24px 24px', boxShadow:'0 8px 25px rgba(0,0,0,0.4)', border:`1px solid ${step.color}30`, borderLeft:`4px solid ${step.color}` }}>
                
                <p style={{color:'#94a3b8', fontSize:'1rem', lineHeight:'1.6', margin:'0 0 20px 0', fontWeight:'500'}}>
                  {step.desc}
                </p>

                <button 
                  onClick={() => handleSpeak(step.desc, step.id)}
                  style={{ width:'100%', padding:'15px', background: speakingId === step.id ? 'rgba(239, 68, 68, 0.1)' : '#020617', color: speakingId === step.id ? '#ef4444' : '#64748b', border: speakingId === step.id ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #1e293b', borderRadius:'12px', fontSize:'1rem', fontWeight:'800', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'pointer', marginBottom:'25px', transition:'0.3s' }}
                >
                  {speakingId === step.id ? <VolumeX size={20}/> : <Volume2 size={20}/>} 
                  {speakingId === step.id ? t.stop : t.listen}
                </button>

                <div style={{display:'flex', gap:'15px', overflowX:'auto', paddingBottom:'10px'}} className="hide-scrollbar">
                  {step.videos.map((vidId, vIndex) => (
                    <div key={vIndex} style={{minWidth:'85%', position:'relative', borderRadius:'16px', overflow:'hidden', boxShadow:'0 8px 20px rgba(0,0,0,0.5)', border:'1px solid #1e293b'}}>
                      <div style={{ position:'relative', width:'100%', height:'160px', backgroundImage:`url(https://img.youtube.com/vi/${vidId}/hqdefault.jpg)`, backgroundSize:'cover', backgroundPosition:'center', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(2, 6, 23, 0.5)'}}></div>
                        <PlayCircle color="#10b981" size={60} style={{ position:'relative', zIndex:1, filter:'drop-shadow(0 4px 10px rgba(16,185,129,0.8))' }} className="pulse-icon"/>
                      </div>
                      <button 
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${vidId}`, '_blank')}
                        style={{ width:'100%', background:'#020617', color:'#10b981', borderTop:'1px solid #1e293b', border:'none', padding:'15px', fontSize:'1rem', fontWeight:'900', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer' }}
                      >
                        <PlayCircle size={20} /> {t.watch}
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
        @keyframes pulseIcon { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default ModernFarming;
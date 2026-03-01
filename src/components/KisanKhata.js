import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Tractor, Droplets, Users, Sprout, 
  Plus, Wallet, TrendingUp, TrendingDown, 
  Info, Volume2, VolumeX, Landmark, CheckCircle2, XCircle
} from 'lucide-react';

const KisanKhata = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { name: 'Farmer', lang: 'English' };

  // --- STATES ---
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Seeds');
  
  const [hasSold, setHasSold] = useState(null); // null, true, false
  const [income, setIncome] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Voice States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const ui = {
    English: {
      title: "Smart Ledger", sub: "Financial & Profit Matrix",
      catSeeds: "Seeds", catFuel: "Fuel", catWater: "Water", catLabor: "Labor",
      spentTitle: "TOTAL INVESTMENT", addExp: "ADD EXPENSE", 
      history: "LEDGER HISTORY", placeholder: "Enter Amount (₹)",
      btnSave: "SAVE RECORD",
      soldQ: "Has the harvest been sold in the market?",
      btnYes: "YES, SOLD", btnNo: "NOT YET",
      incomeLbl: "MARKET REVENUE (₹)",
      btnCalc: "GENERATE FINANCIAL REPORT",
      analysisTitle: "PROFIT / LOSS ANALYSIS",
      netProfit: "NET PROFIT", netLoss: "NET LOSS",
      advice: "Financial Advice",
      voiceBanner: "Your financial report will be read out loud for clarity.",
      playVoice: "Listen to Report", stopVoice: "Stop Audio",
      profitMsg: "Congratulations! You made a profit. Tip: Save 20% of this profit for next season's seeds to become self-reliant.",
      lossMsg: "You faced a loss this season. Your highest expense was on"
    },
    Hindi: {
      title: "स्मार्ट खाता", sub: "वित्तीय और लाभ मैट्रिक्स",
      catSeeds: "बीज", catFuel: "ईंधन", catWater: "पानी", catLabor: "मजदूर",
      spentTitle: "कुल निवेश", addExp: "खर्च जोड़ें", 
      history: "खाता इतिहास", placeholder: "राशि दर्ज करें (₹)",
      btnSave: "रिकॉर्ड सहेजें",
      soldQ: "क्या फसल बाज़ार में बिक चुकी है?",
      btnYes: "हाँ, बिक गई", btnNo: "अभी नहीं",
      incomeLbl: "बाज़ार से आय (₹)",
      btnCalc: "वित्तीय रिपोर्ट तैयार करें",
      analysisTitle: "लाभ / हानि विश्लेषण",
      netProfit: "शुद्ध लाभ", netLoss: "शुद्ध हानि",
      advice: "वित्तीय सलाह",
      voiceBanner: "स्पष्टता के लिए आपकी वित्तीय रिपोर्ट पढ़कर सुनाई जाएगी।",
      playVoice: "रिपोर्ट सुनें", stopVoice: "ऑडियो रोकें",
      profitMsg: "बधाई हो! आपने मुनाफा कमाया है। सुझाव: आत्मनिर्भर बनने के लिए इस मुनाफे का 20% अगले मौसम के बीजों के लिए बचाएं।",
      lossMsg: "इस बार आपको नुकसान हुआ है। आपका सबसे बड़ा खर्च इस पर था:"
    },
    Telugu: {
      title: "స్మార్ట్ లెడ్జర్", sub: "ఆర్థిక & లాభాల మ్యాట్రిక్స్",
      catSeeds: "విత్తనాలు", catFuel: "ఇంధనం", catWater: "నీరు", catLabor: "కూలీలు",
      spentTitle: "మొత్తం పెట్టుబడి", addExp: "ఖర్చును జోడించండి", 
      history: "ఖాతా చరిత్ర", placeholder: "మొత్తం నమోదు చేయండి (₹)",
      btnSave: "రికార్డ్ సేవ్ చేయండి",
      soldQ: "పంట మార్కెట్‌లో అమ్ముడైందా?",
      btnYes: "అవును, అమ్మాను", btnNo: "ఇంకా లేదు",
      incomeLbl: "మార్కెట్ ఆదాయం (₹)",
      btnCalc: "ఆర్థిక నివేదికను రూపొందించండి",
      analysisTitle: "లాభం / నష్టం విశ్లేషణ",
      netProfit: "నికర లాభం", netLoss: "నికర నష్టం",
      advice: "ఆర్థిక సలహా",
      voiceBanner: "మీ ఆర్థిక నివేదిక స్పష్టత కోసం చదివి వినిపించబడుతుంది.",
      playVoice: "రిపోర్ట్ వినండి", stopVoice: "ఆడియో ఆపండి",
      profitMsg: "అభినందనలు! మీరు లాభం పొందారు. చిట్కా: స్వయం సమృద్ధి సాధించడానికి ఈ లాభంలో 20% తదుపరి సీజన్ విత్తనాల కోసం ఆదా చేయండి.",
      lossMsg: "ఈ సీజన్‌లో మీకు నష్టం వచ్చింది. మీ అత్యధిక ఖర్చు దీనిపై జరిగింది:"
    }
  };
  const t = ui[user.lang] || ui['English'];

  const categories = [
    { id: 'Seeds', name: t.catSeeds, icon: <Sprout size={28}/>, color: '#10b981' },
    { id: 'Fuel', name: t.catFuel, icon: <Tractor size={28}/>, color: '#f59e0b' },
    { id: 'Water', name: t.catWater, icon: <Droplets size={28}/>, color: '#38bdf8' },
    { id: 'Labor', name: t.catLabor, icon: <Users size={28}/>, color: '#a855f7' }
  ];

  // --- LOGIC ---
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const revenue = parseFloat(income) || 0;
  const isProfit = revenue >= totalSpent;
  const netAmount = Math.abs(revenue - totalSpent);

  // Find highest expense category
  const highestExpense = expenses.length > 0 ? expenses.reduce((max, obj) => obj.amount > max.amount ? obj : max, expenses[0]) : null;

  const addExpense = () => {
    if(!amount || isNaN(amount)) return;
    const catName = categories.find(c => c.id === category).name;
    setExpenses([{ id: Date.now(), category: catName, amount: parseFloat(amount) }, ...expenses]);
    setAmount('');
  };

  // --- PRE-LOAD VOICES ---
  useEffect(() => {
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  // --- VOICE ASSISTANT ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported on this device.");
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let rawText = `${t.voiceBanner}. `;
    rawText += `${t.spentTitle} ₹${totalSpent}. `;
    rawText += `${t.incomeLbl} ₹${revenue}. `;
    
    if (isProfit) {
      rawText += `${t.netProfit}: ₹${netAmount}. ${t.profitMsg}`;
    } else {
      rawText += `${t.netLoss}: ₹${netAmount}. ${t.lossMsg} ${highestExpense?.category || "Unknown"}.`;
    }

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
      
      {/* HUD HEADER */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)',
        padding: '35px 20px 45px 20px', borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(168, 85, 247, 0.1)', border:'1px solid rgba(168, 85, 247, 0.3)', color:'#a855f7', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Wallet size={24} color="#a855f7" /> {t.title}</h2>
            <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>

        {/* TOTAL SPENT BANNER */}
        <div style={{background:'linear-gradient(90deg, rgba(168, 85, 247, 0.15) 0%, transparent 100%)', borderLeft:'4px solid #a855f7', padding:'15px', borderRadius:'12px'}}>
          <p style={{margin:0, color:'#cbd5e1', fontSize:'0.85rem', letterSpacing:'1px'}}>{t.spentTitle}</p>
          <h1 style={{margin:'5px 0 0 0', color:'#f8fafc', fontSize:'2.5rem', fontWeight:'900'}}>₹{totalSpent.toLocaleString('en-IN')}</h1>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        
        {/* ADD EXPENSE CARD */}
        <div className="fade-in" style={{background: '#0f172a', padding: '25px 20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom:'25px'}}>
          <h3 style={{color:'#a855f7', fontSize:'0.9rem', letterSpacing:'2px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}><Plus size={18}/> {t.addExp}</h3>
          
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'10px', marginBottom:'20px'}}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
                padding:'15px 5px', borderRadius:'16px', border: category === cat.id ? `2px solid ${cat.color}` : '1px solid #1e293b',
                background: category === cat.id ? `${cat.color}15` : '#020617', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', cursor:'pointer', transition:'all 0.2s ease'
              }}>
                {React.cloneElement(cat.icon, { color: category === cat.id ? cat.color : '#64748b' })}
                <span style={{fontSize:'0.75rem', fontWeight:'700', color: category === cat.id ? '#f8fafc' : '#64748b'}}>{cat.name}</span>
              </button>
            ))}
          </div>

          <input type="number" placeholder={t.placeholder} value={amount} onChange={e=>setAmount(e.target.value)} 
            style={{width:'100%', padding:'18px', borderRadius:'14px', border:'1px solid #1e293b', background:'#020617', color:'#f8fafc', fontSize:'1.2rem', fontWeight:'bold', outline:'none', marginBottom:'15px', boxSizing:'border-box'}}/>
          
          <button onClick={addExpense} style={{
            width:'100%', background:'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color:'white', border:'none', padding:'18px', borderRadius:'14px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', cursor:'pointer', boxShadow:'0 8px 25px rgba(168, 85, 247, 0.3)'
          }}>
            {t.btnSave}
          </button>
        </div>

        {/* EXPENSE HISTORY */}
        {expenses.length > 0 && (
          <div className="fade-in" style={{background: '#0f172a', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b', marginBottom:'25px'}}>
            <h3 style={{color:'#94a3b8', fontSize:'0.85rem', letterSpacing:'2px', marginBottom:'15px'}}>{t.history}</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', maxHeight:'200px', overflowY:'auto'}}>
              {expenses.map(exp => (
                <div key={exp.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', background:'#020617', borderRadius:'12px', border:'1px solid #1e293b'}}>
                  <span style={{color:'#cbd5e1', fontWeight:'600'}}>{exp.category}</span>
                  <span style={{fontWeight:'900', color:'#ef4444'}}>- ₹{exp.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MARKET QUESTION (FAT FINGER BUTTONS) */}
        {/* ========================================================= */}
        {expenses.length > 0 && (
          <div className="fade-in" style={{background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)', padding: '25px 20px', borderRadius: '24px', border: '1px solid #38bdf8', boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.05)'}}>
            <h3 style={{color:'#38bdf8', fontSize:'1.1rem', textAlign:'center', marginBottom:'20px', fontWeight:'800', lineHeight:'1.5'}}>{t.soldQ}</h3>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
              <button onClick={() => {setHasSold(true); setShowAnalysis(false);}} style={{
                padding:'25px', borderRadius:'20px', border: hasSold === true ? '2px solid #10b981' : '1px solid #1e293b', background: hasSold === true ? 'rgba(16, 185, 129, 0.1)' : '#020617', color: hasSold === true ? '#10b981' : '#94a3b8', fontSize:'1.1rem', fontWeight:'900', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', cursor:'pointer'
              }}>
                <CheckCircle2 size={36}/> {t.btnYes}
              </button>
              
              <button onClick={() => {setHasSold(false); setShowAnalysis(false);}} style={{
                padding:'25px', borderRadius:'20px', border: hasSold === false ? '2px solid #ef4444' : '1px solid #1e293b', background: hasSold === false ? 'rgba(239, 68, 68, 0.1)' : '#020617', color: hasSold === false ? '#ef4444' : '#94a3b8', fontSize:'1.1rem', fontWeight:'900', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', cursor:'pointer'
              }}>
                <XCircle size={36}/> {t.btnNo}
              </button>
            </div>

            {hasSold && (
              <div className="fade-in" style={{marginTop:'25px'}}>
                <label style={{display:'block', color:'#38bdf8', fontSize:'0.85rem', fontWeight:'800', letterSpacing:'1px', marginBottom:'10px'}}>{t.incomeLbl}</label>
                <input type="number" placeholder="₹0" value={income} onChange={e=>setIncome(e.target.value)} 
                  style={{width:'100%', padding:'20px', borderRadius:'16px', border:'2px solid #38bdf8', background:'#020617', color:'#f8fafc', fontSize:'1.5rem', fontWeight:'900', outline:'none', marginBottom:'20px', boxSizing:'border-box'}}/>
                
                <button onClick={() => setShowAnalysis(true)} disabled={!income} style={{
                  width:'100%', background:'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color:'white', border:'none', padding:'20px', borderRadius:'16px', fontSize:'1.15rem', fontWeight:'900', letterSpacing:'1px', cursor: !income ? 'not-allowed' : 'pointer', opacity: !income ? 0.5 : 1, boxShadow:'0 8px 25px rgba(56, 189, 248, 0.4)'
                }}>
                  <Landmark size={20} style={{marginRight:'10px', verticalAlign:'middle'}}/> {t.btnCalc}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PROFIT / LOSS REPORT & VOICE AI */}
        {/* ========================================================= */}
        {showAnalysis && hasSold && (
          <div className="fade-in" style={{marginTop:'25px'}}>
            
            {/* MASSIVE VOICE BANNER */}
            <div style={{ background:'rgba(56, 189, 248, 0.1)', border:'1px solid rgba(56, 189, 248, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
              <Info size={28} color="#38bdf8" style={{marginBottom:'10px'}} />
              <p style={{margin:'0 0 20px 0', color:'#e2e8f0', fontSize:'0.95rem', lineHeight:'1.6'}}>{t.voiceBanner}</p>
              <button 
                onClick={handleSpeak} 
                className={isSpeaking ? "pulse-voice" : ""}
                style={{
                  width: '100%', background: isSpeaking ? '#ef4444' : '#38bdf8', border: 'none', color: 'white',
                  padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: '900', fontSize: '1.15rem', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.5)' : '0 8px 25px rgba(56, 189, 248, 0.4)'
                }}
              >
                 {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
                 {isSpeaking ? t.stopVoice : t.playVoice}
              </button>
            </div>

            {/* FINANCIAL DASHBOARD */}
            <div style={{ background: isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: isProfit ? '2px solid #10b981' : '2px solid #ef4444', borderRadius: '24px', padding: '30px 20px', textAlign:'center', boxShadow: isProfit ? '0 10px 40px rgba(16, 185, 129, 0.2)' : '0 10px 40px rgba(239, 68, 68, 0.2)' }}>
              {isProfit ? <TrendingUp size={48} color="#10b981" style={{marginBottom:'15px'}}/> : <TrendingDown size={48} color="#ef4444" style={{marginBottom:'15px'}}/>}
              <h4 style={{margin:0, color: isProfit ? '#34d399' : '#fca5a5', fontSize:'1rem', letterSpacing:'2px'}}>{isProfit ? t.netProfit : t.netLoss}</h4>
              <h1 style={{margin:'10px 0', fontSize:'3.5rem', fontWeight:'900', color: isProfit ? '#10b981' : '#ef4444'}}>₹{netAmount.toLocaleString('en-IN')}</h1>
              
              <div style={{background:'#020617', padding:'20px', borderRadius:'16px', marginTop:'25px', textAlign:'left'}}>
                <h4 style={{color:'#f8fafc', display:'flex', alignItems:'center', gap:'8px', margin:'0 0 10px 0'}}><Info size={18} color={isProfit?"#10b981":"#ef4444"}/> {t.advice}</h4>
                <p style={{color:'#cbd5e1', lineHeight:'1.6', margin:0, fontSize:'0.95rem'}}>
                  {isProfit ? t.profitMsg : `${t.lossMsg} ${highestExpense?.category} (₹${highestExpense?.amount}).`}
                  <br/><br/>
                  
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default KisanKhata;
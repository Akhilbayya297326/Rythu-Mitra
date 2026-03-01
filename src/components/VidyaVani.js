import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayCircle, Mic, Search, BookOpen, Loader, Sparkles, Youtube, MicOff, TrendingUp, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getVidyaInfo } from './gemini';

const VidyaVani = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tech'); // Default to Tech on load
  const [aiInfo, setAiInfo] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English', name: 'Farmer' };

  // --- 🌍 MULTILINGUAL UI TRANSLATIONS ---
  const ui = {
    English: {
      title: "Vidya Vani", sub: "AI-Powered Learning", placeholder: "Search crop (e.g., Cotton, Paddy)...",
      listening: "Listening...", loading: "Gathering Information...", featured: "Featured Lessons",
      watchBtn: "Watch Video Now", trendingTitle: "Trending in Farming",
      aiInsights: "AI Crop Insights", goBack: "← Go Back to Trending"
    },
    Hindi: {
      title: "विद्या वाणी", sub: "आपके लिए एआई पाठ", placeholder: "फसल खोजें (जैसे: कपास, धान)...",
      listening: "सुन रहा हूँ...", loading: "जानकारी एकत्रित कर रहा है...", featured: "मुख्य पाठ",
      watchBtn: "वीडियो देखें", trendingTitle: "खेती में नई तकनीकें",
      aiInsights: "AI फसल जानकारी", goBack: "← वापस जाएं"
    },
    Telugu: {
      title: "విద్యా వాణి", sub: "మీ కోసం AI పాఠాలు", placeholder: "పంటను వెతకండి (ఉదా: పత్తి, వరి)...",
      listening: "వింటున్నాను...", loading: "సమాచారం సేకరిస్తోంది...", featured: "సిఫార్సు చేయబడిన పాఠాలు",
      watchBtn: "వీడియో చూడండి", trendingTitle: "వ్యవసాయంలో కొత్త టెక్నాలజీ",
      aiInsights: "AI పంట సమాచారం", goBack: "← వెనుకకు వెళ్ళండి"
    }
  };

  const t = ui[user.lang] || ui['English'];

  // --- 📺 STATIC VIDEO DATABASE ---
  const videoDB = {
    cotton: [
      { id: 'gtPHQvYyX48', title: { en: "Cotton Disease Management", hi: "कपास रोग प्रबंधन", te: "పత్తి వ్యాధుల నిర్వహణ" } },
      { id: 'FFCUvpoQAVQ', title: { en: "Cotton Fertilizer Management", hi: "कपास उर्वरक प्रबंधन", te: "పత్తి ఎరువుల నిర్వహణ" } }
    ],
    paddy: [
      { id: '-o2qVRbXdlk', title: { en: "Paddy Plant Diseases", hi: "धान के रोग", te: "వరి పంట వ్యాధులు" } },
      { id: 'QHZ1Z8T3oUM', title: { en: "Paddy Disease Prevention", hi: "धान रोग रोकथाम", te: "వరి వ్యాధుల నివారణ" } },
      { id: '6h-pfEhVcdY', title: { en: "Paddy Fertilizer Management", hi: "धान उर्वरक प्रबंधन", te: "వరి ఎరువుల నిర్వహణ" } }
    ],
    vegetables: [
      { id: '0dNegPO8o_g', title: { en: "Vegetable Growing Techniques 1", hi: "सब्जी उगाने की तकनीक 1", te: "కూరగాయలు పండించే విధానం 1" } },
      { id: 'vBPCtUOxCkE', title: { en: "Vegetable Growing Techniques 2", hi: "सब्जी उगाने की तकनीक 2", te: "కూరగాయలు పండించే విధానం 2" } },
      { id: 'Yxzj_sK-W5k', title: { en: "Vegetable Disease Management", hi: "सब्जी रोग प्रबंधन", te: "కూరగాయల వ్యాధుల నిర్వహణ" } },
      { id: 'NSuodo1Magc', title: { en: "Advanced Vegetable Farming", hi: "उन्नत सब्जी खेती", te: "అధునాతన కూరగాయల సాగు" } },
      { id: 'pGzmf_OQ8ro', title: { en: "Vegetable Fertilizers", hi: "सब्जियों के लिए उर्वरक", te: "కూరగాయల ఎరువులు" } },
      { id: 'nccV__8Pb9U', title: { en: "High Yield Vegetables", hi: "उच्च उपज वाली सब्जियां", te: "అధిక దిగుబడినిచ్చే కూరగాయలు" } }
    ],
    sugarcane: [
      { id: 'ZfTIyrGQ8Fc', title: { en: "Sugarcane Growing Techniques", hi: "गन्ना उगाने की तकनीक", te: "చెరకు సాగు పద్ధతులు" } },
      { id: 'XVTRCaYaHDk', title: { en: "Sugarcane Yield Improvement", hi: "गन्ने की पैदावार में सुधार", te: "చెరకు దిగుబడి పెంపు" } },
      { id: 'eCBZHKRe-Co', title: { en: "Sugarcane Diseases", hi: "गन्ने के रोग", te: "చెరకు వ్యాధులు" } },
      { id: '4LZVCMm8_k0', title: { en: "Sugarcane Disease Management", hi: "गन्ना रोग प्रबंधन", te: "చెరకు వ్యాధుల నిర్వహణ" } }
    ],
    chilies: [
      { id: 'owQdTavWm_Q', title: { en: "Chili Disease Management", hi: "मिर्च रोग प्रबंधन", te: "మిరప వ్యాధుల నిర్వహణ" } },
      { id: 'bDKs4YvVPc4', title: { en: "Chili Crop Management 1", hi: "मिर्च फसल प्रबंधन 1", te: "మిరప పంట నిర్వహణ 1" } },
      { id: 'IrMBIgoy7Ro', title: { en: "Chili Crop Management 2", hi: "मिर्च फसल प्रबंधन 2", te: "మిరప పంట నిర్వహణ 2" } }
    ],
    oilseeds: [
      { id: 'SDHieM6jnYU', title: { en: "Groundnut/Oilseed Management 1", hi: "मूंगफली प्रबंधन 1", te: "వేరుశనగ సాగు విధానం 1" } },
      { id: 'gQTcvUvtbxg', title: { en: "Groundnut/Oilseed Management 2", hi: "मूंगफली प्रबंधन 2", te: "వేరుశనగ సాగు విధానం 2" } }
    ],
    tech: [
      { id: 'FLhMcM88EvM', title: { en: "New Agriculture Tech in India", hi: "भारत में नई कृषि तकनीक", te: "భారతదేశంలో కొత్త వ్యవసాయ టెక్నాలజీ" } },
      { id: 'jh9lO3RUEHo', title: { en: "Agricultural Drones", hi: "कृषि ड्रोन", te: "వ్యవసాయ డ్రోన్లు" } },
      { id: 'VvC9YH7JCrs', title: { en: "Combine Harvester Machine", hi: "कंबाइन हार्वेस्टर मशीन", te: "కంబైన్ హార్వెస్టర్ యంత్రం" } }
    ]
  };

  // 🔍 CATEGORY MATCHER
  const getCategory = (query) => {
    const q = query.toLowerCase();
    if (q.includes('cotton') || q.includes('कपास') || q.includes('పత్తి')) return 'cotton';
    if (q.includes('paddy') || q.includes('rice') || q.includes('धान') || q.includes('వరి')) return 'paddy';
    if (q.includes('veg') || q.includes('tomato') || q.includes('सब्जी') || q.includes('కూరగాయలు')) return 'vegetables';
    if (q.includes('sugar') || q.includes('cane') || q.includes('गन्ना') || q.includes('చెరకు')) return 'sugarcane';
    if (q.includes('chili') || q.includes('mirchi') || q.includes('मिर्च') || q.includes('మిరప')) return 'chilies';
    if (q.includes('oil') || q.includes('groundnut') || q.includes('मूंगफली') || q.includes('వేరుశనగ')) return 'oilseeds';
    return 'tech'; // Default fallback
  };

  // 🚀 SEARCH HANDLER
  const handleSearch = async (query) => {
    if (!query || query.trim() === "") return;
    setLoading(true);
    setAiInfo('');
    
    const category = getCategory(query);
    setActiveCategory(category);

    try {
      // If it's a specific crop, ask Gemini for management details
      if (category !== 'tech') {
        const aiResponse = await getVidyaInfo(query, user.lang);
        setAiInfo(aiResponse);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🎙️ VOICE SEARCH
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search is not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = user.lang === 'Telugu' ? 'te-IN' : user.lang === 'Hindi' ? 'hi-IN' : 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      handleSearch(transcript); 
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ✅ AUTO-LINK CATCHER (From Dr. Akhil)
  useEffect(() => {
    if (location.state && location.state.search) {
      const query = location.state.search;
      setSearchTerm(query);
      handleSearch(query);
    }
  }, [location]);

  return (
    <div className="module-container" style={{ paddingBottom: '100px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div className="header" style={{ 
        background: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
        padding: '30px 20px 60px 20px', borderRadius: '0 0 30px 30px', color: 'white'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{background:'rgba(255,255,255,0.2)', padding:'10px', borderRadius:'50%'}}>
            <BookOpen size={28} />
          </div>
          <div>
            <h2 style={{margin: 0, fontSize: '1.6rem', fontWeight: '800'}}>{t.title}</h2>
            <p style={{margin: '4px 0 0 0', opacity: 0.9, fontSize:'1rem'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginTop: '-30px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '10px', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '12px 15px', borderRadius: '15px', flex: 1 }}>
            <Search size={22} color="#64748b"/>
            <input 
              type="text" 
              value={searchTerm}
              placeholder={t.placeholder} 
              style={{ border: 'none', background: 'transparent', marginLeft: '10px', outline: 'none', width: '100%', fontSize: '1.05rem', color: '#1e293b' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            />
          </div>
          <button onClick={startVoiceSearch} style={{ background: isListening ? '#ef4444' : '#fef3c7', color: isListening ? 'white' : '#ca8a04', border: 'none', width: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
            {isListening ? <MicOff size={26} className="pulse" /> : <Mic size={26} />}
          </button>
          <button onClick={() => handleSearch(searchTerm)} disabled={loading} style={{ background: '#ca8a04', color: 'white', border: 'none', width: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? <Loader className="spin" size={24}/> : <Sparkles size={24} />}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* LOADING STATE */}
        {loading && (
          <h3 style={{ margin: '10px 0 20px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
            <Loader className="spin" size={20} color="#ca8a04"/> {t.loading}
          </h3>
        )}

        {/* AI INSIGHTS CARD (Only shows if there is AI text) */}
        {aiInfo && !loading && (
          <div className="fade-in" style={{
            background: 'white', borderRadius: '24px', padding: '25px', marginBottom: '25px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)', borderLeft: '6px solid #ca8a04'
          }}>
            <h3 style={{margin:'0 0 15px 0', color:'#a16207', display:'flex', alignItems:'center', gap:'8px', fontSize:'1.2rem'}}>
              <Info size={24}/> {t.aiInsights}
            </h3>
            <div style={{color:'#334155', lineHeight:'1.7', fontSize:'1.05rem', whiteSpace:'pre-wrap'}}>
              <ReactMarkdown>{aiInfo}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* VIDEOS LIST */}
        {!loading && (
          <div className="fade-in">
            <h3 style={{ margin: '10px 0 20px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              {activeCategory === 'tech' ? <TrendingUp size={22} color="#ca8a04"/> : <Sparkles size={22} color="#ca8a04"/>} 
              {activeCategory === 'tech' ? t.trendingTitle : t.featured}
            </h3>

            {videoDB[activeCategory].map((video, index) => {
              // Extract the correct language title
              const localizedTitle = video.title[user.lang === 'Telugu' ? 'te' : user.lang === 'Hindi' ? 'hi' : 'en'];
              
              return (
                <div key={index} style={{ 
                  background: 'white', borderRadius: '24px', overflow: 'hidden', marginBottom: '25px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)', border: '1px solid #fef3c7', borderBottom: '6px solid #ca8a04'
                }}>
                  {/* BEAUTIFUL YOUTUBE THUMBNAIL EXTRACTOR */}
                  <div style={{ 
                    position: 'relative', width: '100%', height: '220px', 
                    backgroundImage: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)`,
                    backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.3)'}}></div>
                    <PlayCircle color="white" size={70} style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}/>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.25rem', color: '#1e293b', textAlign: 'center', lineHeight: '1.4' }}>
                      {localizedTitle}
                    </h3>
                    <button 
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                      style={{ width: '100%', background: '#ca8a04', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(202, 138, 4, 0.3)' }}
                    >
                      <Youtube size={24} /> {t.watchBtn}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clear Button to go back to Trending */}
            {activeCategory !== 'tech' && (
              <button onClick={() => {setActiveCategory('tech'); setSearchTerm(''); setAiInfo('');}} style={{width: '100%', padding: '15px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 'bold', fontSize: '1rem'}}>
                {t.goBack}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default VidyaVani;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Tractor, Phone, User, CheckCircle, 
  PlusCircle, X, MapPin, ArrowLeft, Database, Handshake, Loader 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🚀 YOUR BACKEND IP (Same as Mandi Connect)
import { API_BASE_URL } from './apiConfig';

// --- STYLES (Moved to top to prevent React Reference Errors) ---
const modalOverlayStyle = {
  position:'fixed', top:0, left:0, right:0, bottom:0,
  background:'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)',
  display:'flex', alignItems:'center', justifyContent:'center', zIndex: 1000, padding:'20px'
};
const modalContentStyle = {
  background:'#0f172a', border:'1px solid #1e293b', padding:'30px', borderRadius:'24px',
  boxShadow:'0 20px 40px rgba(0, 0, 0, 0.6)',
  width:'100%', maxWidth:'400px', textAlign:'center', animation: 'fadeIn 0.3s ease-out'
};
const inputStyle = {
  width: '100%', padding: '16px 15px', marginBottom: '15px', 
  borderRadius: '12px', border: '1px solid #1e293b', fontSize: '1rem', boxSizing:'border-box', background:'#020617', color:'#f8fafc', outline:'none'
};

// 🛡️ BULLETPROOF OFFLINE FALLBACK DATA 🛡️
const fallbackRentals = [
  { _id: '1', name: 'Mahindra 575 DI Tractor', owner: 'Ramesh Reddy', price: '800', phone: '+919876543210', location: 'Visakhapatnam' },
  { _id: '2', name: 'Automatic Seed Drill', owner: 'Suresh Kumar', price: '300', phone: '+919876543211', location: 'Vizianagaram' },
  { _id: '3', name: 'Heavy Duty Rotavator', owner: 'Raju Bhai', price: '500', phone: '+919876543212', location: 'Srikakulam' },
  { _id: '4', name: 'Pesticide Power Sprayer', owner: 'Venkat Rao', price: '200', phone: '+919876543213', location: 'Anakapalle' }
];

// --- 🌍 MULTILINGUAL DICTIONARY ---
const UI_DICT = {
  English: {
    title: "Sahayog", subtitle: "Rent Tools & Share Labor",
    connecting: "Connecting...", openingWa: "Opening WhatsApp with",
    listEqTitle: "List Equipment",
    phMachine: "Machine Name (e.g. Rotavator)", phPrice: "Price (e.g. ₹500/hr)", phOwner: "Your Name", phPhone: "Phone Number (10 digits)",
    btnPost: "Post Listing", btnCancel: "Cancel",
    bannerTitle: "Have idle equipment?", bannerSub: "Earn money by renting it to neighbors.", btnList: "List Your Equipment",
    availNearby: "Available Nearby", finding: "Finding nearby machines...", noRent: "Database is empty. No rentals found.",
    nearbyTxt: "Nearby", btnContact: "Contact Owner",
    errFill: "Please fill all details", errSave: "Failed to connect to backend.", successSave: "✅ Equipment Listed Successfully!",
    waMsg: "Namaste {owner}, I found your {machine} on KrishiChakra. Is it available for rent?"
  },
  Hindi: {
    title: "सहयोग", subtitle: "उपकरण किराए पर लें और दें",
    connecting: "कनेक्ट हो रहा है...", openingWa: "WhatsApp खोल रहे हैं:",
    listEqTitle: "उपकरण किराए पर दें",
    phMachine: "मशीन का नाम (जैसे: रोटावेटर)", phPrice: "किराया (जैसे: ₹500/घंटा)", phOwner: "आपका नाम", phPhone: "फोन नंबर (10 अंक)",
    btnPost: "लिस्टिंग डालें", btnCancel: "रद्द करें",
    bannerTitle: "क्या उपकरण खाली पड़ा है?", bannerSub: "पड़ोसियों को किराए पर देकर पैसे कमाएं।", btnList: "अपना उपकरण लिस्ट करें",
    availNearby: "आसपास उपलब्ध", finding: "मशीनें खोजी जा रही हैं...", noRent: "कोई मशीन नहीं मिली। सबसे पहले अपनी मशीन डालें!",
    nearbyTxt: "आसपास", btnContact: "मालिक से संपर्क करें",
    errFill: "कृपया सभी विवरण भरें", errSave: "सहेजने में विफल।", successSave: "✅ उपकरण सफलतापूर्वक लिस्ट हो गया!",
    waMsg: "नमस्ते {owner}, मैंने कृषिचक्र पर आपकी {machine} देखी। क्या यह किराए पर उपलब्ध है?"
  },
  Telugu: {
    title: "సహాయోగ్", subtitle: "యంత్రాలను అద్దెకు తీసుకోండి/ఇవ్వండి",
    connecting: "కనెక్ట్ అవుతోంది...", openingWa: "వాట్సాప్ ఓపెన్ అవుతోంది:",
    listEqTitle: "యంత్రాన్ని అద్దెకు ఇవ్వండి",
    phMachine: "యంత్రం పేరు (ఉదా: రోటవేటర్)", phPrice: "అద్దె (ఉదా: ₹500/గంట)", phOwner: "మీ పేరు", phPhone: "ఫోన్ నంబర్ (10 అంకెలు)",
    btnPost: "పోస్ట్ చేయండి", btnCancel: "రద్దు చేయండి",
    bannerTitle: "యంత్రం ఖాళీగా ఉందా?", bannerSub: "ఇతరులకు అద్దెకు ఇచ్చి డబ్బు సంపాదించండి.", btnList: "మీ యంత్రాన్ని అద్దెకు ఇవ్వండి",
    availNearby: "దగ్గరలో అందుబాటులో ఉన్నాయి", finding: "యంత్రాల కోసం వెతుకుతోంది...", noRent: "ఏ యంత్రాలు లేవు. మీ యంత్రాన్ని ముందుగా పోస్ట్ చేయండి!",
    nearbyTxt: "దగ్గరలో", btnContact: "యజమానిని సంప్రదించండి",
    errFill: "దయచేసి అన్ని వివరాలు పూరించండి", errSave: "సేవ్ చేయడంలో విఫలమైంది.", successSave: "✅ యంత్రం విజయవంతంగా పోస్ట్ చేయబడింది!",
    waMsg: "నమస్తే {owner}, నేను కృషిచక్రలో మీ {machine}ని చూశాను. ఇది అద్దెకు అందుబాటులో ఉందా?"
  }
};

const Sahayog = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  
  // Modal States
  const [showRentModal, setShowRentModal] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form Data for New Listing
  const [newItem, setNewItem] = useState({ name: '', price: '', owner: '', phone: '' });

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };
  const t = UI_DICT[user.lang] || UI_DICT['English'];

  // 1. FETCH REAL DATA FROM BACKEND
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);
    try {
      // 3 SECOND TIMEOUT ensures app doesn't freeze on mobile
      const res = await axios.get(`${API_BASE_URL}/api/rentals`, { timeout: 3000 });
      setItems(res.data);
    } catch (err) {
      console.warn("Backend Blocked! Loading Safe-Mode Offline Data.");
      setConnectionError(true);
      setItems(fallbackRentals); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 🚀 DB SEEDER: Instantly populates your empty MongoDB for the Hackathon!
  const seedDatabase = async () => {
    setLoading(true);
    try {
      for (const item of fallbackRentals) {
        const { _id, ...cleanItem } = item; 
        await axios.post(`${API_BASE_URL}/api/rentals`, cleanItem);
      }
      alert("✅ Successfully injected rental data into your MongoDB!");
      fetchItems(); 
    } catch (err) {
      console.error("Seeding Failed:", err);
      alert("Failed to inject data. Check your Node.js console.");
    } finally {
      setLoading(false);
    }
  };

  // 2. HANDLE RENTING (WhatsApp Integration Re-Wired)
  const handleRent = (item) => {
    setSelectedItem(item);
    setShowRentModal(true);
    let message = t.waMsg.replace('{owner}', item.owner).replace('{machine}', item.name);
    const whatsappUrl = `https://wa.me/${item.phone || '919492462673'}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      setShowRentModal(false);
      window.open(whatsappUrl, '_blank');
    }, 2000);
  };

  // 3. HANDLE LISTING (Saving to Database FIRST)
  const handleListSubmit = async () => {
    if (!newItem.name || !newItem.price || !newItem.phone || !newItem.owner) {
      return alert(t.errFill);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/rentals`, newItem);
      setItems([response.data, ...items]); 
      setShowListForm(false);
      setNewItem({ name: '', price: '', owner: '', phone: '' });
      alert(t.successSave);
      setConnectionError(false);
    } catch (err) {
      console.error("Database Save Error:", err.message);
      alert(t.errSave + " Check if your Node backend is running.");
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '90px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(45, 212, 191, 0.3)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <button onClick={() => navigate('/home')} style={{background:'rgba(45, 212, 191, 0.1)', border:'1px solid rgba(45, 212, 191, 0.3)', color:'#2dd4bf', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
            <div>
              <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Handshake size={24} color="#2dd4bf" /> {t.title}</h2>
              <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.subtitle}</p>
            </div>
          </div>
          <button onClick={() => setShowListForm(true)} style={{background:'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', color:'white', border:'none', padding:'10px', borderRadius:'12px', display:'flex', alignItems:'center', gap:'5px', fontWeight:'900', cursor:'pointer', boxShadow:'0 4px 15px rgba(45, 212, 191, 0.4)'}}>
            <PlusCircle size={22}/>
          </button>
        </div>
      </div>

      {/* --- MODAL 1: SUCCESS POPUP --- */}
      {showRentModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <CheckCircle size={65} color="#10b981" style={{margin:'0 auto 15px auto', display:'block'}} className="pulse-icon"/>
            <h3 style={{color:'#f8fafc', margin:'0 0 10px 0', fontSize:'1.3rem'}}>{t.connecting}</h3>
            <p style={{color:'#94a3b8', fontSize:'0.95rem', margin:0}}>{t.openingWa} <strong style={{color:'#2dd4bf'}}>{selectedItem?.owner}</strong></p>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD LISTING FORM --- */}
      {showListForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, textAlign:'left', padding:'25px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
               <h3 style={{margin:0, color:'#2dd4bf', fontSize:'1.2rem', display:'flex', alignItems:'center', gap:'8px'}}><Tractor size={20}/> {t.listEqTitle}</h3>
               <button onClick={() => setShowListForm(false)} style={{background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', padding:'8px', borderRadius:'50%', cursor:'pointer', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center'}}><X size={20}/></button>
            </div>
            
            <input placeholder={t.phMachine} value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} style={inputStyle}/>
            <input placeholder={t.phPrice} value={newItem.price} onChange={e=>setNewItem({...newItem, price:e.target.value})} style={inputStyle}/>
            <input placeholder={t.phOwner} value={newItem.owner} onChange={e=>setNewItem({...newItem, owner:e.target.value})} style={inputStyle}/>
            <input type="number" placeholder={t.phPhone} value={newItem.phone} onChange={e=>setNewItem({...newItem, phone:e.target.value})} style={inputStyle}/>
            
            <button onClick={handleListSubmit} style={{width:'100%', padding:'18px', marginTop:'20px', background:'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', color:'white', border:'none', borderRadius:'14px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', cursor:'pointer', boxShadow:'0 8px 25px rgba(45, 212, 191, 0.4)'}}>
              {t.btnPost}
            </button>
          </div>
        </div>
      )}

      <div style={{padding: '20px'}}>

        {/* INFO BANNER */}
        <div className="fade-in" style={{ background:'rgba(45, 212, 191, 0.05)', border:'1px solid rgba(45, 212, 191, 0.3)', borderRadius:'20px', padding:'20px', marginBottom:'25px', display:'flex', gap:'15px', alignItems:'center' }}>
          <div style={{background:'rgba(45, 212, 191, 0.1)', padding:'10px', borderRadius:'14px'}}>
            <Tractor size={28} color="#2dd4bf" />
          </div>
          <div>
            <h4 style={{margin:'0 0 5px 0', color:'#f8fafc', fontSize:'1rem'}}>{t.bannerTitle}</h4>
            <p style={{margin:0, color:'#94a3b8', fontSize:'0.85rem', lineHeight:'1.5'}}>{t.bannerSub}</p>
          </div>
        </div>
        
        {/* RENTALS LIST / ERROR HANDLING */}
        {loading ? (
          <div style={{textAlign:'center', padding:'50px'}}><Loader className="spin" size={40} color="#2dd4bf"/></div>
        ) : items.length === 0 ? (
          
          <div style={{textAlign:'center', marginTop:'30px', color:'#64748b', padding: '30px 20px', background: '#0f172a', borderRadius: '20px', border:'1px solid #1e293b'}}>
            <Tractor size={50} style={{margin: '0 auto 15px auto', opacity:0.3}} />
            <p style={{margin: '0 0 20px 0', fontWeight:'bold', fontSize:'1.1rem'}}>{t.noRent}</p>
            
            {/* 🔴 THE HACKATHON DATABASE SEEDER BUTTON 🔴 */}
            {!connectionError && (
              <button onClick={seedDatabase} style={{
                background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '15px 25px', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', boxShadow: '0 8px 20px rgba(45, 212, 191, 0.4)'
              }}>
                <Database size={20} /> Initialize Database Data
              </button>
            )}
          </div>

        ) : (
          <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            {items.map((item, idx) => (
              <div key={item._id || idx} style={{background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', borderTop: '4px solid #2dd4bf', padding: '20px', boxShadow:'0 8px 20px rgba(0,0,0,0.3)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'15px'}}>
                  <div>
                    <h3 style={{margin:'0 0 8px 0', fontSize:'1.2rem', color:'#f8fafc', fontWeight:'900'}}>{item.name}</h3>
                    <p style={{margin:0, color:'#94a3b8', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'5px', fontWeight:'600'}}><MapPin size={14} color="#ea580c"/> {item.location || item.owner}</p>
                  </div>
                  <div style={{background:'rgba(45, 212, 191, 0.1)', border:'1px solid rgba(45, 212, 191, 0.3)', color:'#2dd4bf', padding:'8px 12px', borderRadius:'10px', fontWeight:'900', fontSize:'1.1rem'}}>
                    ₹{item.price}<span style={{fontSize:'0.7rem'}}>/hr</span>
                  </div>
                </div>
                
                <div style={{display:'flex', gap:'10px', marginTop: '15px'}}>
                  <div style={{flex:1, padding:'12px', background:'#020617', borderRadius:'12px', border:'1px solid #1e293b', display: 'flex', alignItems:'center', gap:'8px', color: '#cbd5e1', fontSize: '0.9rem', fontWeight:'600'}}>
                    <User size={16} color="#2dd4bf"/> {item.owner}
                  </div>
                  
                  {/* WIRED UP THE handleRent WHATSAPP MODAL FUNCTION HERE */}
                  <button 
                    onClick={() => handleRent(item)}
                    style={{flex:1, padding:'12px', background:'transparent', border:'1px solid #2dd4bf', color:'#2dd4bf', borderRadius:'12px', fontSize:'1rem', fontWeight:'800', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'pointer', transition:'all 0.3s ease'}}
                  >
                    <Phone size={18}/> {t.call}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Styles */}
      <style>{`
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } } 
        .fade-in { animation: fadeIn 0.4s ease-in-out; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseIcon { 0% { opacity: 0.4; } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.4; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Sahayog;
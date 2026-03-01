import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save, Trash2, PlusCircle, ArrowLeft, MapPin, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for adding a brand new crop
  const [newCrop, setNewCrop] = useState({ 
    crop: '', 
    price: '', 
    market: '', 
    city: '', 
    trend: 'up' 
  });

  // 1. READ: Fetch all items from the Cloud DB
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/mandi');
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error", err);
      alert("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. CREATE: Insert a new crop
  const handleInsert = async () => {
    if (!newCrop.crop || !newCrop.price || !newCrop.city) {
      return alert("Please fill at least Crop, Price, and City!");
    }
    try {
      const res = await axios.post('http://localhost:5000/api/mandi', newCrop);
      setItems([...items, res.data]); // Update the list on screen
      setNewCrop({ crop: '', price: '', market: '', city: '', trend: 'up' }); // Clear form
      alert("✅ Added successfully to Cloud!");
    } catch (err) {
      alert("❌ Insert failed");
    }
  };

  // 3. UPDATE: Save changes made to an existing crop
  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/mandi/${id}`, updatedData);
      alert("✅ Update saved to Database!");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  // 4. DELETE: Remove a crop entirely
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/mandi/${id}`);
      setItems(items.filter(item => item._id !== id)); // Remove from screen
      alert("🗑️ Item Deleted");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  // Helper to handle typing in the list inputs
  const handleListChange = (id, field, value) => {
    setItems(items.map(item => 
      item._id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="module-container" style={{paddingBottom:'80px'}}>
      <div className="header" style={{background: '#111827'}}>
        <h2>🛠️ Inventory Controller</h2>
        <p>Full CRUD Access to {items.length} Items</p>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', margin:'15px 0'}}>
        <button onClick={() => navigate('/market')} style={navBtnStyle}>
          <ArrowLeft size={16}/> Back to Market
        </button>
        <button onClick={fetchData} style={navBtnStyle}>
          <RefreshCw size={16}/> Refresh
        </button>
      </div>

      {/* --- INSERT SECTION --- */}
      <div className="card" style={{border:'2px solid #16a34a', background:'#f0fdf4'}}>
        <h3 style={{margin:'0 0 15px 0', color:'#16a34a', display:'flex', alignItems:'center', gap:'8px'}}>
          <PlusCircle size={20}/> Add New Market Entry
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
          <input type="text" placeholder="Crop (e.g. Paddy)" value={newCrop.crop} onChange={(e)=>setNewCrop({...newCrop, crop:e.target.value})} style={inputStyle}/>
          <input type="text" placeholder="Price (e.g. ₹2100)" value={newCrop.price} onChange={(e)=>setNewCrop({...newCrop, price:e.target.value})} style={inputStyle}/>
          <input type="text" placeholder="City (Matches GPS)" value={newCrop.city} onChange={(e)=>setNewCrop({...newCrop, city:e.target.value})} style={inputStyle}/>
          <input type="text" placeholder="Mandi Name (Optional)" value={newCrop.market} onChange={(e)=>setNewCrop({...newCrop, market:e.target.value})} style={inputStyle}/>
          <select value={newCrop.trend} onChange={(e)=>setNewCrop({...newCrop, trend:e.target.value})} style={inputStyle}>
            <option value="up">Trend: Up 📈</option>
            <option value="down">Trend: Down 📉</option>
          </select>
        </div>
        <button onClick={handleInsert} className="btn-primary" style={{marginTop:'15px', background:'#16a34a'}}>
          Save New Entry to Cloud
        </button>
      </div>

      <hr style={{margin:'25px 0', opacity:0.2}}/>

      {/* --- READ / UPDATE / DELETE SECTION --- */}
      <h3>Live Database Items</h3>
      {loading ? <p>Connecting to Atlas...</p> : items.map((item) => (
        <div key={item._id} className="card" style={{borderLeft:'5px solid #111827'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <input 
                  type="text" 
                  value={item.crop} 
                  onChange={(e) => handleListChange(item._id, 'crop', e.target.value)}
                  style={{...inputStyle, width:'120px', fontWeight:'bold', border:'none', padding:0}}
                />
                <span style={{fontSize:'0.8rem', color:'#16a34a'}}><MapPin size={12}/> {item.city}</span>
             </div>
             <button onClick={() => handleDelete(item._id)} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}>
                <Trash2 size={20}/>
             </button>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'10px', alignItems:'center'}}>
            <input 
              type="text" 
              value={item.price} 
              onChange={(e) => handleListChange(item._id, 'price', e.target.value)}
              style={inputStyle}
            />
            <select 
              value={item.trend}
              onChange={(e) => handleListChange(item._id, 'trend', e.target.value)}
              style={inputStyle}
            >
              <option value="up">Up 📈</option>
              <option value="down">Down 📉</option>
            </select>
            
            {/* UPDATE BUTTON */}
            <button 
              onClick={() => handleUpdate(item._id, { crop: item.crop, price: item.price, trend: item.trend })}
              style={{background:'#2563eb', color:'white', border:'none', padding:'10px', borderRadius:'8px', cursor:'pointer'}}
            >
              <Save size={20}/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};

const navBtnStyle = {
  background: 'none',
  border: '1px solid #ddd',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '0.9rem'
};

export default AdminPanel;
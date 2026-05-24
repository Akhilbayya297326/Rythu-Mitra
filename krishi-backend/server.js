// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ==========================================
// 1. NETWORK & SECURITY CONFIGURATION
// ==========================================
// DEPLOYMENT FIX: Use process.env.PORT for cloud providers
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Essential: Forces server to accept external connections

app.use(cors({
  origin: '*', // Allows any device/frontend to send data
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// 2. FAIL-SAFE CLOUD DATABASE CONNECTION
// ==========================================
// DEPLOYMENT FIX: Hide credentials in environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ [FATAL] MONGO_URI is missing from .env file!");
  process.exit(1); // Stop the server if no database is provided
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ [DATABASE] Cloud MongoDB Atlas Link Established!");
  } catch (err) {
    console.error("❌ [DATABASE] Connection Failed:", err.message);
    console.log("🔄 [RETRY] Attempting to reconnect in 5 seconds...");
    setTimeout(connectDB, 5000); 
  }
};
connectDB();

// ==========================================
// 3. OPTIMIZED SCHEMAS (NEURAL MATRIX)
// ==========================================
const MandiItem = mongoose.model('MandiItem', new mongoose.Schema({
  crop: String, price: String, market: String, city: String, trend: String   
}));

const RentalItem = mongoose.model('RentalItem', new mongoose.Schema({
  name: String, owner: String, price: String, phone: String
}));

const Outbreak = mongoose.model('Outbreak', new mongoose.Schema({
  crop: String, disease: String, lat: Number, lon: Number, date: { type: Date, default: Date.now }
}));

const LedgerTransaction = mongoose.model('LedgerTransaction', new mongoose.Schema({
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: String, amount: Number, date: { type: Date, default: Date.now }
}));

const AgriCoreScan = mongoose.model('AgriCoreScan', new mongoose.Schema({
  locationState: String, soilType: String, recommendedCrops: [String], riskAnalysis: String, date: { type: Date, default: Date.now }
}));

// ==========================================
// 4. ROBUST API ROUTES (Full CRUD)
// ==========================================

// 🛡️ MOBILE HEALTH CHECK 
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "Online", 
    system: "Rythu Mitra API", 
    database: mongoose.connection.readyState === 1 ? "Connected to Atlas Cloud" : "Reconnecting..."
  });
});

// --- MANDI ROUTES ---
app.get('/api/mandi', async (req, res) => {
  try {
    const { market } = req.query; 
    let query = {};
    if (market && market !== 'All India') {
      query = { $or: [{ city: new RegExp(market, 'i') }, { market: new RegExp(market, 'i') }] };
    }
    res.json(await MandiItem.find(query).limit(50));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/mandi', async (req, res) => { try { res.status(201).json(await new MandiItem(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/mandi/:id', async (req, res) => { try { res.json(await MandiItem.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/mandi/:id', async (req, res) => { try { await MandiItem.findByIdAndDelete(req.params.id); res.json({ message: "Item purged" }); } catch (err) { res.status(500).json({ error: err.message }); } });

// --- SAHAYOG (RENTALS) ROUTES ---
app.get('/api/rentals', async (req, res) => { try { res.json(await RentalItem.find()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/rentals', async (req, res) => { try { res.status(201).json(await new RentalItem(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); } });

// --- PEST RADAR ROUTES ---
app.get('/api/outbreaks', async (req, res) => { try { res.json(await Outbreak.find().sort({ date: -1 })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/outbreaks', async (req, res) => { try { res.status(201).json(await new Outbreak(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); } });

// --- KISAN KHATA (LEDGER) ROUTES ---
app.get('/api/ledger', async (req, res) => { try { res.json(await LedgerTransaction.find().sort({ date: -1 })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/ledger', async (req, res) => { try { res.status(201).json(await new LedgerTransaction(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/ledger/:id', async (req, res) => { try { await LedgerTransaction.findByIdAndDelete(req.params.id); res.json({ message: "Transaction deleted" }); } catch (err) { res.status(500).json({ error: err.message }); } });

// --- AGRICORE AI LOGS ---
app.get('/api/agricore', async (req, res) => { try { res.json(await AgriCoreScan.find().sort({ date: -1 })); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/agricore', async (req, res) => { try { res.status(201).json(await new AgriCoreScan(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); } });

// ==========================================
// 5. BOOT ENGINE (Binding to All Interfaces)
// ==========================================
app.listen(PORT, HOST, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 RYTHU MITRA V2.0 ENGINE ONLINE`);
  console.log(`💻 PORT: ${PORT}`);
  console.log(`📡 DB STATUS: Connecting to Cloud Atlas...`);
  console.log(`=========================================\n`);
});

// GLOBAL ERROR HANDLER (Prevents Crash)
process.on('uncaughtException', (err) => { console.error('⚠️ Critical System Error:', err); });
process.on('unhandledRejection', (reason, promise) => { console.error('⚠️ Unhandled Promise Rejection:', reason); });
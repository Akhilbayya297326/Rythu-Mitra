// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ==========================================
// 1. MIDDLEWARE 
// ==========================================
app.use(cors({
  origin: '*', // Allows mobile phones and other network devices to connect
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// 2. DATABASE CONNECTION (Local MongoDB)
// ==========================================
const MONGO_URI = "mongodb://127.0.0.1:27017/krishiDB"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Local MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ Local DB Error:", err));


// ==========================================
// 3. DEFINE SCHEMAS (PROJECT 2.0)
// ==========================================

// 🌾 Mandi (Market) Schema
const MandiSchema = new mongoose.Schema({
  crop: String, price: String, market: String, city: String, trend: String   
});
const MandiItem = mongoose.model('MandiItem', MandiSchema);

// 🚜 Rentals (Sahayog) Schema
const RentalSchema = new mongoose.Schema({
  name: String, owner: String, price: String, phone: String
});
const RentalItem = mongoose.model('RentalItem', RentalSchema);

// 🐛 Pest Radar (Outbreaks) Schema
const outbreakSchema = new mongoose.Schema({
  crop: String, disease: String, lat: Number, lon: Number, date: { type: Date, default: Date.now }
});
const Outbreak = mongoose.model('Outbreak', outbreakSchema);

// 📒 NEW: Kisan Khata (Smart Ledger) Schema
const LedgerSchema = new mongoose.Schema({
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});
const LedgerTransaction = mongoose.model('LedgerTransaction', LedgerSchema);

// 🤖 NEW: AgriCore AI Scan History Schema
const AgriCoreSchema = new mongoose.Schema({
  locationState: String,
  soilType: String,
  recommendedCrops: [String],
  riskAnalysis: String,
  date: { type: Date, default: Date.now }
});
const AgriCoreScan = mongoose.model('AgriCoreScan', AgriCoreSchema);


// ==========================================
// 4. API ROUTES
// ==========================================

// --- MANDI ROUTES ---
app.get('/api/mandi', async (req, res) => {
  try {
    const { market } = req.query; 
    let query = {};
    if (market && market !== 'All India') {
      query = { $or: [{ city: new RegExp(market, 'i') }, { market: new RegExp(market, 'i') }] };
    }
    const items = await MandiItem.find(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mandi', async (req, res) => {
  try {
    const savedItem = await new MandiItem(req.body).save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/mandi/:id', async (req, res) => {
  try {
    const updatedItem = await MandiItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/mandi/:id', async (req, res) => {
  try {
    await MandiItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SAHAYOG (RENTALS) ROUTES ---
app.get('/api/rentals', async (req, res) => {
  try {
    res.json(await RentalItem.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rentals', async (req, res) => {
  try {
    res.status(201).json(await new RentalItem(req.body).save());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PEST RADAR ROUTES ---
app.get('/api/outbreaks', async (req, res) => {
  try {
    res.json(await Outbreak.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/outbreaks', async (req, res) => {
  try {
    res.status(201).json(await new Outbreak(req.body).save());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: KISAN KHATA (LEDGER) ROUTES ---
app.get('/api/ledger', async (req, res) => {
  try {
    // Returns all financial transactions, sorted by newest first
    const transactions = await LedgerTransaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ledger', async (req, res) => {
  try {
    const newTransaction = new LedgerTransaction(req.body);
    res.status(201).json(await newTransaction.save());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ledger/:id', async (req, res) => {
  try {
    await LedgerTransaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW: AGRICORE AI LOGS ---
app.get('/api/agricore', async (req, res) => {
  try {
    res.json(await AgriCoreScan.find().sort({ date: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agricore', async (req, res) => {
  try {
    res.status(201).json(await new AgriCoreScan(req.body).save());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. START SERVER (Updated for Mobile Access)
// ==========================================
const PORT = process.env.PORT || 5000;
// Binding to 0.0.0.0 forces the server to accept connections from your phone via Wi-Fi
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Project 2.0 Backend Running!`);
  console.log(`📡 Local Access: http://localhost:${PORT}`);
  console.log(`📱 Network Access (for Mobile): Find your IPv4 address and append :${PORT} (e.g. http://10.16.43.22:5000)`);
});
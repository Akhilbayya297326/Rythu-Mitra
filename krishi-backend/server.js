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
  origin: '*', // Allows mobile phones, Render, and Vercel to connect
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// 2. DATABASE CONNECTION (Cloud MongoDB Atlas)
// ==========================================
// Your specific Atlas Connection String with credentials integrated
const CLOUD_MONGO_URI = "mongodb+srv://vramasarma806_db_user:Akhil2025@akcluster.7dzjzpg.mongodb.net/krishiDB?retryWrites=true&w=majority&appName=Akcluster";

// Use Environment Variable if available (on Render), otherwise use the Cloud URI string
const MONGO_URI = process.env.MONGODB_URI || CLOUD_MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Cloud MongoDB Atlas Connected Successfully!"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
  });

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

// 📒 Kisan Khata (Smart Ledger) Schema
const LedgerSchema = new mongoose.Schema({
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});
const LedgerTransaction = mongoose.model('LedgerTransaction', LedgerSchema);

// 🤖 AgriCore AI Scan History Schema
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

// --- KISAN KHATA (LEDGER) ROUTES ---
app.get('/api/ledger', async (req, res) => {
  try {
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

// --- AGRICORE AI LOGS ---
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
// 5. START SERVER (Production Optimized)
// ==========================================
const PORT = process.env.PORT || 5000;

// On Render, we don't always need '0.0.0.0', but it's safe to keep
app.listen(PORT, () => {
  console.log(`🚀 Rythu Mitra V2.0 Backend Online!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
});
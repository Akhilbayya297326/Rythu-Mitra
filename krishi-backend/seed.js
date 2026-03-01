const mongoose = require('mongoose');

const MONGO_URI = "mongodb://localhost:27017/krishiDB";

mongoose.connect(MONGO_URI).then(() => console.log("Connected for Seeding..."));

const MandiSchema = new mongoose.Schema({ crop: String, price: String, market: String, trend: String });
const MandiItem = mongoose.model('MandiItem', MandiSchema);

const seedData = async () => {
  await MandiItem.deleteMany({}); // Clear old data
  
  await MandiItem.insertMany([
    // WARANGAL Data
    { crop: 'Cotton (Raw)', price: '₹6,800/Qt', market: 'Warangal', trend: 'up' },
    { crop: 'Chilly (Red)', price: '₹18,500/Qt', market: 'Warangal', trend: 'up' },
    
    // NALGONDA Data
    { crop: 'Tomato (Hybrid)', price: '₹2,400/Qt', market: 'Nalgonda', trend: 'down' },
    { crop: 'Paddy (Common)', price: '₹2,100/Qt', market: 'Nalgonda', trend: 'up' },

    // NAGPUR Data
    { crop: 'Orange', price: '₹4,500/Qt', market: 'Nagpur', trend: 'up' },
    { crop: 'Soybean', price: '₹3,900/Qt', market: 'Nagpur', trend: 'down' }
  ]);
  
  console.log("✅ Database Seeded with Multi-City Data!");
  mongoose.connection.close();
};

seedData();
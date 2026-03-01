import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Sprout, BookOpen, Tractor, TrendingUp } from 'lucide-react';
import './App.css';

// --- CORE SYSTEM COMPONENTS ---
import Login from './components/Login';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';

// --- PHASE 1: STRATEGY & PROTECTION ---
import SmartAgriCore from './components/SmartAgriCore'; 
import InsuranceGuide from './components/InsuranceGuide'; 
import Safety from './components/Safety';
import VidyaVani from './components/VidyaVani';

// --- PHASE 2: RESOURCES & METHODS ---
import Sahayog from './components/Sahayog';
import YojanaSetu from './components/YojanaSetu';
import ModernFarming from './components/ModernFarming';
import PashuChikitsa from './components/PashuChikitsa';

// --- PHASE 3: ACTIVE FIELD CARE ---
import DrAkhil from './components/DrAkhil';
import JalRakshak from './components/JalRakshak';
import PestRadar from './components/PestRadar'; // 🚀 Added Pest Radar

// --- PHASE 4: HARVEST & COMMERCE ---
import HarvestGrader from './components/HarvestGrader';
import MandiConnect from './components/MandiConnect';
import KisanKhata from './components/KisanKhata';

// --- NAVIGATION SYSTEM ---
const BottomNav = () => {
  const location = useLocation();
  
  // Hide navigation on Login page for clean Terminal experience
  if (location.pathname === '/') return null;

  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <HomeIcon size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/doctor" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <Sprout size={20} />
        <span>Doctor</span>
      </NavLink>
      
      <NavLink to="/vidya" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <BookOpen size={20} />
        <span>Vidya</span>
      </NavLink>
      
      <NavLink to="/rentals" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <Tractor size={20} />
        <span>Rent</span>
      </NavLink>
      
      <NavLink to="/mandi" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <TrendingUp size={20} />
        <span>Mandi</span>
      </NavLink>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-area">
          <Routes>
            {/* 1. AUTHENTICATION & SYSTEM HUB */}
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* 2. PHASE 1: STRATEGY NODES */}
            <Route path="/agricore" element={<SmartAgriCore />} /> 
            <Route path="/insurance" element={<InsuranceGuide />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/vidya" element={<VidyaVani />} />
            
            {/* 3. PHASE 2: RESOURCE NODES */}
            <Route path="/rentals" element={<Sahayog />} />
            <Route path="/schemes" element={<YojanaSetu />} />
            <Route path="/organic" element={<ModernFarming />} />
            <Route path="/vet" element={<PashuChikitsa />} />

            {/* 4. PHASE 3: ACTIVE CARE NODES */}
            <Route path="/radar" element={<PestRadar />} /> {/* 🚀 Critical Link */}
            <Route path="/doctor" element={<DrAkhil />} />
            <Route path="/jal" element={<JalRakshak />} />

            {/* 5. PHASE 4: COMMERCE NODES */}
            <Route path="/grade" element={<HarvestGrader />} />
            <Route path="/mandi" element={<MandiConnect />} />
            <Route path="/khata" element={<KisanKhata />} />
          </Routes>
        </div>
        
        {/* Navigation Bar remains fixed at bottom for easy thumb access */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
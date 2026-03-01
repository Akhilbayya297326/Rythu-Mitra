// This script automatically detects if you are running locally
// or on a network, so you don't have to change IPs manually.

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If you are using 'npm start' and opening on your phone via Wi-Fi,
  // this will automatically use your laptop's IP address.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // If accessed from another device (like a Judge's phone), 
  // it uses the current IP of the laptop.
  return `http://${hostname}:5000`;
};

export const API_BASE_URL = "https://rythu-mitra-api.onrender.com";
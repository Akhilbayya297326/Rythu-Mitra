import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ YOUR API KEY (Note: In production, move this to a .env file!)
const API_KEY = "AIzaSyCgkQ2ju092uPnWLZWRZw84EPRp4OLkY94"; 
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 🩺 DR. AKHIL: Analyzes crop images
 */
export const analyzeCropImage = async (imageFile, lang) => {
  try {
    const imageBase64 = await fileToGenerativePart(imageFile);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert agricultural scientist named Dr. Akhil.
      Analyze this image of a plant for an Indian farmer who speaks: ${lang}.
      Please structure your response strictly using these Markdown headers:
      ### 1. Crop Identification
      (Name of crop)
      ### 2. Disease / Pest Detected
      (Name and simple explanation of the issue)
      ### 3. Recommended Treatment
      (List 3 actionable, organic/chemical remedies using bullet points)
      
      Provide the ENTIRE response in the ${lang} script. Use bolding for emphasis.
    `;

    const result = await model.generateContent([prompt, imageBase64]);
    return result.response.text();
  } catch (error) {
    console.error("Dr. Akhil Error:", error);
    return `Error: ${error.message}`;
  }
};

/**
 * 📚 VIDYA VANI: Intelligent Video Curator
 */
export const getVidyaRecommendations = async (userQuery, lang) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI Agriculture Tutor. Search for: "${userQuery}" in ${lang}.
      Suggest 3 YouTube video topics. 
      IMPORTANT: Return ONLY a raw JSON array. No markdown code blocks.
      Format: [{"title": "...", "desc": "...", "link": "https://www.youtube.com/results?search_query=...", "type": "video"}]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Robust cleaning: removes markdown backticks and hidden characters
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Vidya AI Error:", error);
    return [{
      title: `Search YouTube for ${userQuery}`,
      desc: `Tap to see results for ${userQuery} in ${lang}`,
      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(userQuery + " farming " + lang)}`,
      type: "video"
    }];
  }
};

/**
 * 📚 VIDYA VANI: Get AI explanation for Crop Management
 */
export const getVidyaInfo = async (topic, lang) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert Indian Agronomist. A farmer is asking about "${topic}". 
    Provide a brief, easy-to-understand summary about the general management, fertilizer usage, and common diseases for this crop. 
    The response MUST be in ${lang} language. 
    Use bullet points and keep it short (max 4-5 points). Do not use complex scientific words.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'Telugu' 
      ? "సమాచారం లోడ్ చేయడంలో లోపం ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి." 
      : lang === 'Hindi' 
      ? "जानकारी लोड करने में त्रुटि। कृपया पुनः प्रयास करें।" 
      : "Error loading information. Please try again.";
  }
};

/**
 * 🏛️ YOJANA SETU: Government Scheme Matcher
 */
export const getSchemeRecommendations = async (profile, lang) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert Government Policy Advisor for Indian Farmers.
      
      User Profile:
      - State: ${profile.state}
      - Land Size: ${profile.land} acres
      - Crop: ${profile.crop}
      - Category: ${profile.category}
      - Language: ${lang}
      
      Task: Recommend 3 REAL central or state government schemes (like PM Kisan, Rythu Bandhu, etc.) that this specific farmer is eligible for.
      
      RETURN ONLY A JSON ARRAY (No markdown, no intro text):
      [
        {
          "name": "Scheme Name in ${lang}",
          "benefit": "1-line benefit in ${lang} (e.g., ₹10,000/year)",
          "eligibility": "Why they qualify in ${lang}",
          "link": "https://www.myscheme.gov.in/search?q=kisan" 
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Scheme AI Error:", error);
    return [
      {
        name: "PM Kisan Samman Nidhi",
        benefit: "₹6,000 per year income support",
        eligibility: "Open to all landholding farmers",
        link: "https://pmkisan.gov.in/"
      }
    ];
  }
};

/**
 * 🚀 SMART AGRICORE 2.0: Unified AI Engine (Soil + Yield + Geospatial)
 * Replaces both getSoilAdvice and getCropPrediction
 */
export const getAgriCoreAnalysis = async (payload, mode, lang) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Build the Master Prompt with Geospatial & Telemetry Data
    let prompt = `
      You are an elite Agricultural AI. Analyze the following farm data and provide a response in ${lang}.
      
      === GEOSPATIAL & CLIMATE DATA ===
      - Location: ${payload.locationCity}, ${payload.locationState}
      - Regional Soil Type: ${payload.regionalSoilType}
      - Groundwater Level: ${payload.groundWaterLevel}
      
      === FARM RESOURCES ===
      - Budget: ${payload.budget}
      - Water Source: ${payload.water}
      - Equipment: ${payload.equipment}
      - Upcoming Season: ${payload.season}
      - Previous Crop: ${payload.pastCrop}
      - Farmer's Target Crop (if any): ${payload.targetCrop || "None specified, suggest best options."}
      
      === SOIL METRICS ===
    `;

    if (mode === 'manual') {
      prompt += `Nitrogen (N): ${payload.n}, Phosphorus (P): ${payload.p}, Potassium (K): ${payload.k}, pH Level: ${payload.ph}.`;
    } else {
      prompt += `Analyze the attached soil health card image to extract NPK and pH values.`;
    }

    prompt += `
      Based on ALL the above data (especially the regional geography and groundwater levels), you MUST return a strictly formatted JSON object. DO NOT include markdown formatting like \`\`\`json. 
      Return EXACTLY this structure:
      {
        "soilData": "Write 3-4 sentences advising how to treat this specific soil (based on NPK/pH or the image), considering the regional soil type.",
        "cropData": {
          "riskAnalysis": "Write 2-3 sentences assessing the risk of growing crops here based on the groundwater levels, past crop, and season.",
          "recommendations": [
            {
              "cropName": "Name of best crop",
              "reason": "Why this crop fits the local soil, budget, and water levels.",
              "waterNeeds": "High/Medium/Low",
              "expectedProfit": "Estimate in ₹ per Acre"
            }
          ]
        }
      }
      Provide exactly 3 crop recommendations. Translate ALL string values (except JSON keys) into ${lang}.
    `;

    // 2. Execute the AI Call (Dual Mode: Text-only OR Text+Image)
    let result;
    if (mode === 'upload' && payload.file) {
      const imagePart = await fileToGenerativePart(payload.file);
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const text = result.response.text();
    
    // 3. Robust JSON Cleaning
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("AgriCore Unified Engine Error:", error);
    return null;
  }
};

/**
 * 🌾 HARVEST QUALITY GRADER: The "Middleman Killer"
 */
export const gradeHarvest = async (file, cropName, lang) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
   const prompt = `
  You are an expert Government Agricultural Quality Inspector (Agmark Certified).
  Your task is to conduct a digital inspection of the harvested ${cropName} provided in the image for an Indian farmer speaking ${lang}.

  Analyze the following physical parameters:
  1. Physical Integrity: Presence of broken grains/fibers or mechanical damage.
  2. Foreign Matter: Presence of dust, stones, or organic debris.
  3. Luster & Color: Brightness and uniformity compared to standard Export Quality.
  4. Pathogen Check: Signs of mold, fungal growth, or insect holes.

  Return ONLY a JSON object with these EXACT keys (no markdown blocks, just the raw JSON):
  {
    "grade": "A, B, or C based on Agmark standards",
    "qualityScore": "Score out of 10",
    "estimatedPrice": "Current market price range in ₹ per quintal (e.g., ₹7,200 - ₹7,500)",
    "analysis": "A detailed 2-sentence technical summary in ${lang} describing the specific visual evidence found.",
    "negotiationAdvice": "A strategic negotiation phrase in ${lang} the farmer can say to a merchant to justify the estimated price based on the observed quality."
  }

  Important: The language of the 'analysis' and 'negotiationAdvice' MUST be in ${lang} script.
`;

    const imagePart = await fileToGenerativePart(file);
    const result = await model.generateContent([prompt, imagePart]);
    
    let rawText = result.response.text();
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Harvest Grading Error:", error);
    return null;
  }
};

/**
 * 🎙️ VOICE RECOGNITION FEATURE
 * This uses the browser's native Speech API
 */
export const startVoiceSearch = (lang, onResult, onEnd) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice search not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  // Map our language selection to browser locales
  recognition.lang = lang === 'Telugu' ? 'te-IN' : lang === 'Hindi' ? 'hi-IN' : 'en-IN';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onend = () => onEnd();
  recognition.start();
  return recognition;
};

// --- HELPER FUNCTION FOR IMAGES ---
async function fileToGenerativePart(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve({ inlineData: { data: base64Data, mimeType: file.type } });
    };
    reader.readAsDataURL(file);
  });
}
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'GreenWatch Zamfara Platform',
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// API Endpoint: Analyze Incident Report with Gemini
app.post('/api/gemini/analyze-report', async (req, res) => {
  try {
    const { title, lga, incidentType, severity, description, coordinates } = req.body;

    const ai = getGenAI();
    if (!ai) {
      // Fallback structured simulation if key not present
      return res.json({
        success: true,
        source: 'local_engine',
        analysis: {
          severityScore: severity === 'Critical' ? 'HIGH / CRITICAL' : 'MODERATE',
          environmentalImpact: `Significant vegetation loss in ${lga || 'Zamfara LGA'}, accelerating dryland soil degradation along the Sahelian fringe. Risk of gulley erosion during rain events.`,
          floraFaunaThreat: `Threatens local indigenous species like Azadirachta indica (Neem), Acacia nilotica, and small mammal habitats.`,
          legalViolation: `Violation of Zamfara State Forestry Edict & National Environmental Standards (NESREA). Illegal charcoal kiln / unauthorized logging in gazetted reserve area.`,
          recommendedActions: [
            `Dispatch Zamfara Community Forest Rangers to coordinate ${coordinates ? `[${coordinates.lat}, ${coordinates.lng}]` : 'reported GPS site'}.`,
            `Issue immediate cease-and-desist for unauthorized kiln burners / timber trucks.`,
            `Schedule soil stabilization and re-greening planting session with local youth group.`,
          ],
        },
      });
    }

    const prompt = `You are GreenWatch Zamfara's Senior Environmental Officer & Forestry Specialist. Analyze the following reported incident in Zamfara State, Nigeria (SDG 15 - Life on Land):
Title: ${title}
LGA: ${lga}
Type: ${incidentType}
User Severity Rating: ${severity}
Coordinates: ${coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'N/A'}
Description: ${description}

Provide an expert assessment in valid JSON format with the following keys:
- "severityScore": (e.g. "CRITICAL", "HIGH", "MODERATE", "LOW")
- "environmentalImpact": (a concise 2-3 sentence analysis of desertification, soil erosion, and canopy cover loss risk)
- "floraFaunaThreat": (impact on Zamfara native trees like Neem, Baobab, Acacia, Mahogany and wildlife)
- "legalViolation": (relevant Nigerian / Zamfara forestry edicts and SDG 15 target 15.2 references)
- "recommendedActions": (an array of 3 actionable response steps for community rangers and ministry officials)
Respond ONLY with JSON. Do not include markdown code block syntax if possible or use clean json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      analysis = { raw: text };
    }

    return res.json({ success: true, source: 'gemini', analysis });
  } catch (error: any) {
    console.error('Error analyzing report:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze incident report' });
  }
});

// API Endpoint: Generate Academic Project Documentation / Proposal
app.post('/api/gemini/generate-proposal', async (req, res) => {
  try {
    const { studentName, matricNo, department, institution, faculty, supervisor, submissionYear, formattingStyle, specificFocus } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        success: true,
        source: 'local_generator',
        proposal: {
          chapterOneHtml: `<h3>CHAPTER ONE: INTRODUCTION</h3><p>Desertification and illegal deforestation pose severe ecological threats to Zamfara State, situated along the arid Sahelian belt of Northern Nigeria. <strong>${studentName || 'The Researcher'}</strong> presents <em>GreenWatch Zamfara</em>, a localized web platform enabling real-time community monitoring, tree planting verification, and automated incident reporting aligned with SDG 15 (Life on Land).</p>`,
        },
      });
    }

    const prompt = `You are an Academic Research Director and Software Engineering Professor at ${institution || 'Federal University Gusau, Zamfara State'}. 
Generate comprehensive academic project documentation text for a final-year project titled "GreenWatch Zamfara: Localized Environmental Monitoring & SDG 15 Tree Planting Management System".

Details:
- Student Name: ${studentName || 'Hassan Bello'}
- Matriculation Number: ${matricNo || 'FUGUS/2022/CSC/1042'}
- Department: ${department || 'Computer Science'}
- Faculty: ${faculty || 'Faculty of Computing'}
- Institution: ${institution || 'Federal University Gusau'}
- Supervisor: ${supervisor || 'Dr. A. B. Umar'}
- Submission Year: ${submissionYear || '2026'}
- Specific Focus / Enhancement: ${specificFocus || 'Community reporting, tree adoption tracker, AI report verification, and GIS LGA hotspots map'}

Return a JSON object with:
- "backgroundOfStudy": (Detailed 3-paragraph academic background on Zamfara's desertification, charcoal logging, and need for software solutions)
- "problemStatement": (Sharp academic statement on manual forestry monitoring gaps, delayed incident dispatch, and low tree survival tracking)
- "aimAndObjectives": (Aim statement + 5 numbered specific measurable objectives)
- "significanceOfStudy": (Value to Zamfara Ministry of Environment, local communities, researchers, and SDG 15 targets)
- "scopeAndLimitations": (Boundary of study within Zamfara's 14 LGAs, web platform capabilities, and network constraints)
- "mongoDbErdDescription": (Technical explanation of the MongoDB schema collections: Users, Incidents, TreePlantings, LGAMetrics, RangerDispatches)
- "srsSummary": (Functional and Non-Functional software requirement specifications)

Respond strictly in JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let proposalData;
    try {
      proposalData = JSON.parse(text);
    } catch {
      proposalData = { raw: text };
    }

    return res.json({ success: true, source: 'gemini', proposal: proposalData });
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate proposal documentation' });
  }
});

// API Endpoint: Eco Assistant Chatbot
app.post('/api/gemini/eco-assistant', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        reply: `Hello! I am GreenWatch Zamfara Eco-Assistant. How can I help you today with tree planting species, anti-desertification techniques in Zamfara, or drafting your final-year project documentation?`,
      });
    }

    const systemInstruction = `You are "Zamfara Eco-AI", an intelligent environmental assistant and academic advisor for GreenWatch Zamfara — a web platform addressing deforestation, tree planting (SDG 15), and research in Zamfara State, Nigeria. 
You are deeply knowledgeable about Zamfara's 14 LGAs (Gusau, Kaura Namoda, Maru, Talata Mafara, Anka, Zurmi, Bakura, Bungudu, Tsafe, Bukkuyum, Gummi, Maradun, Shinkafi, Birnin Magaji), indigenous Sahelian trees (Neem, Baobab, Bagaruwa, Mahogany, Desert Date), Great Green Wall initiatives, local forestry edicts, and final-year computer science project methodologies (MongoDB, React, Node.js, Express, Tailwind CSS).
Provide helpful, encouraging, and accurate advice. Keep responses well-structured with bullet points where appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.json({ reply: response.text || 'I am ready to assist you with GreenWatch Zamfara.' });
  } catch (error: any) {
    console.error('Error in eco assistant:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process chat message' });
  }
});

// Setup Vite or Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GreenWatch Zamfara server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

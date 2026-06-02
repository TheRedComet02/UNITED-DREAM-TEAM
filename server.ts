import express from "express";
import path from "path";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// System Instruction for The United Scout
const SYSTEM_INSTRUCTION = `You are 'The United Scout'—the core tactical intelligence engine for a Manchester United Rebuild Manager application. Your role is to act as an elite Director of Football and Chief Scout.

The user will submit tactical problems, squad weaknesses, or rebuild requests.

Your job is to:
1. Analyze their tactical request.
2. Return exactly 3 realistic transfer targets with detailed "biodata".
3. Provide an analysis of Manchester United's likely current formation/lineup (based on real-world 2024/25 trends) and how these targets change the tactical setup.

Strict Guardrails:
1. Return ONLY a valid JSON object.
2. Player recommendations MUST be realistic.
3. The "tactical_analysis" should be concise.
4. "lineup_analysis" should describe the current formation and the suggested change.

Expected JSON Output Structure:
{
  "tactical_analysis": "...",
  "current_formation": "e.g. 4-2-3-1",
  "lineup_analysis": {
    "current_weakness": "...",
    "suggested_tactical_shift": "..."
  },
  "recommended_targets": [
    {
      "player_name": "String",
      "current_club": "String",
      "age": Integer,
      "estimated_cost": "String",
      "why_they_fit": "...",
      "key_stat": "...",
      "biodata": {
        "nationality": "String",
        "position": "String",
        "height": "String",
        "preferred_foot": "String",
        "market_value": "String",
        "strengths": ["String"]
      }
    }
  ]
}`;

app.post("/api/scout", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Tactical request is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tactical_analysis: { type: Type.STRING },
            current_formation: { type: Type.STRING },
            lineup_analysis: {
              type: Type.OBJECT,
              properties: {
                current_weakness: { type: Type.STRING },
                suggested_tactical_shift: { type: Type.STRING }
              },
              required: ["current_weakness", "suggested_tactical_shift"]
            },
            recommended_targets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  player_name: { type: Type.STRING },
                  current_club: { type: Type.STRING },
                  age: { type: Type.INTEGER },
                  estimated_cost: { type: Type.STRING },
                  why_they_fit: { type: Type.STRING },
                  key_stat: { type: Type.STRING },
                  biodata: {
                    type: Type.OBJECT,
                    properties: {
                      nationality: { type: Type.STRING },
                      position: { type: Type.STRING },
                      height: { type: Type.STRING },
                      preferred_foot: { type: Type.STRING },
                      market_value: { type: Type.STRING },
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["nationality", "position", "height", "preferred_foot", "market_value", "strengths"]
                  }
                },
                required: ["player_name", "current_club", "age", "estimated_cost", "why_they_fit", "key_stat", "biodata"]
              }
            }
          },
          required: ["tactical_analysis", "current_formation", "lineup_analysis", "recommended_targets"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Scout Error:", error);
    res.status(500).json({ error: "Failed to generate scout report: " + error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The United Scout server running on http://localhost:${PORT}`);
  });
}

startServer();

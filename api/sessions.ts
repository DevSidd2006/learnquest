import type { VercelRequest, VercelResponse } from '@vercel/node';
import "dotenv/config";
import { storage } from "../server/services/storage";
import { generateTopicOutline } from "../server/services/gemini";
import { z } from "zod";

// Validation schema
const createSessionSchema = z.object({
  topic: z.string().min(1).max(200),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  learningStyle: z.enum(["visual", "practical", "conceptual"]),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // Create Learning Session
      const validationResult = createSessionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid request data", details: validationResult.error });
      }

      const { topic, difficulty, learningStyle } = validationResult.data;

      console.log(`Creating session for topic: ${topic}`);

      // Generate outline using Gemini AI
      const outline = await generateTopicOutline(topic, difficulty, learningStyle);

      // Create session
      const session = await storage.createSession({
        topic,
        difficulty,
        learningStyle,
        outline: JSON.stringify(outline),
        currentStep: 0,
        completed: false,
      });

      console.log(`Session created with ID: ${session.id}`);
      return res.json(session);

    } else if (req.method === 'GET') {
      // Get All Sessions
      const sessions = await storage.getAllSessions();
      return res.json(sessions);

    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Sessions API error:", error);
    res.status(500).json({ error: "Failed to process request", details: error.message });
  }
}
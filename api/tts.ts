import type { VercelRequest, VercelResponse } from '@vercel/node';
import "dotenv/config";
import { z } from "zod";

// Validation schema
const ttsSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z.enum(["en-US-Neural2-J", "en-US-Neural2-D", "en-US-Neural2-F", "en-US-Neural2-A"]).optional(),
  speed: z.number().min(0.25).max(4.0).optional(),
  enhanced: z.boolean().optional(),
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
      const validationResult = ttsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid request data", details: validationResult.error });
      }

      const { text, voice = "en-US-Neural2-J", speed = 0.95, enhanced = false } = validationResult.data;

      console.log(`Generating TTS for text length: ${text.length}, enhanced: ${enhanced}`);

      // Use Google Cloud Text-to-Speech API
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: "en-US",
              name: voice,
              ssmlGender: "NEUTRAL",
            },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: speed,
              pitch: 0,
              volumeGainDb: 0,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google TTS API error:", errorData);
        return res.status(response.status).json({ 
          error: "TTS generation failed", 
          details: errorData 
        });
      }

      const data = await response.json();
      
      if (!data.audioContent) {
        return res.status(500).json({ error: "No audio content received" });
      }

      // Return the audio as base64
      return res.json({ 
        audioContent: data.audioContent,
        format: "mp3"
      });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("TTS API error:", error);
    res.status(500).json({ error: "Failed to generate speech", details: error.message });
  }
}

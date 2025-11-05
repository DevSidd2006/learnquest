import type { VercelRequest, VercelResponse } from '@vercel/node';
import "dotenv/config";
import { storage } from "../../server/services/storage";

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
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const session = await storage.getSession(id);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      return res.json(session);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Session API error:", error);
    res.status(500).json({ error: "Failed to fetch session", details: error.message });
  }
}
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Serve the built React app for non-API routes
    const indexPath = path.join(process.cwd(), 'client/dist/index.html');
    
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      res.status(404).json({ error: 'App not found' });
    }
  } catch (error) {
    console.error('Static serve error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
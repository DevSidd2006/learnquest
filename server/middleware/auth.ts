import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user-service";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to get current user (optional - doesn't require auth)
export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = req.headers.authorization?.replace("Bearer ", "");
    
    if (sessionToken) {
      const user = await userService.validateSession(sessionToken);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
}

// Middleware to require authentication
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionToken = req.headers.authorization?.replace("Bearer ", "");
    
    if (!sessionToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await userService.validateSession(sessionToken);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
}
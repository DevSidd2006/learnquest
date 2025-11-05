import type { Express } from "express";
import { userService } from "../services/user-service";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

export function registerAuthRoutes(app: Express) {
  // User Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }

      const result = await userService.registerUser(validationResult.data);
      
      res.json({
        user: result.user,
        session: result.session,
        preferences: result.preferences,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ 
        error: error.message || "Registration failed" 
      });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }

      const { email, password } = validationResult.data;
      const result = await userService.loginUser(email, password);
      
      res.json({
        user: result.user,
        session: result.session,
        preferences: result.preferences,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({ 
        error: error.message || "Login failed" 
      });
    }
  });

  // User Logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      
      if (sessionToken) {
        await userService.logoutUser(sessionToken);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ 
        error: error.message || "Logout failed" 
      });
    }
  });

  // Get Current User
  app.get("/api/auth/me", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      
      if (!sessionToken) {
        return res.status(401).json({ error: "No session token provided" });
      }

      const user = await userService.validateSession(sessionToken);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }

      const profile = await userService.getUserProfile(user.id);
      
      res.json(profile);
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to get user" 
      });
    }
  });

  // Update User Profile
  app.put("/api/auth/profile", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      
      if (!sessionToken) {
        return res.status(401).json({ error: "No session token provided" });
      }

      const user = await userService.validateSession(sessionToken);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }

      const updatedUser = await userService.updateUserProfile(user.id, req.body);
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to update profile" 
      });
    }
  });

  // Update User Preferences
  app.put("/api/auth/preferences", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      
      if (!sessionToken) {
        return res.status(401).json({ error: "No session token provided" });
      }

      const user = await userService.validateSession(sessionToken);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }

      const updatedPreferences = await userService.updateUserPreferences(user.id, req.body);
      
      res.json(updatedPreferences);
    } catch (error: any) {
      console.error("Update preferences error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to update preferences" 
      });
    }
  });
}
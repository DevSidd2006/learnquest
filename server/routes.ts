import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateTopicOutline, 
  generateQuizQuestions, 
  generateFlashcards,
  generateExplanation 
} from "./gemini";
import { z } from "zod";

// Validation schemas
const createSessionSchema = z.object({
  topic: z.string().min(1).max(200),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  learningStyle: z.enum(["visual", "practical", "conceptual"]),
});

const submitQuizSchema = z.object({
  sessionId: z.string().uuid(),
  subtopicId: z.string().min(1),
  score: z.number().int().min(0),
});

const completeFlashcardsSchema = z.object({
  sessionId: z.string().uuid(),
  subtopicId: z.string().min(1),
});

const explanationSchema = z.object({
  concept: z.string().min(1),
  context: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create Learning Session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validationResult = createSessionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid request data", details: validationResult.error });
      }

      const { topic, difficulty, learningStyle } = validationResult.data;

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

      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create learning session" });
    }
  });

  // Get Single Session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getSession(id);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Get All Sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Get Quiz Questions
  app.get("/api/quiz/:sessionId/:subtopicId", async (req, res) => {
    try {
      const { sessionId, subtopicId } = req.params;

      // Get session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const outline = JSON.parse(session.outline);
      const subtopic = outline.subtopics.find((s: any) => s.id === subtopicId);
      
      if (!subtopic) {
        return res.status(404).json({ error: "Subtopic not found" });
      }

      // Check if quiz already exists
      let existingQuiz = await storage.getQuiz(sessionId, subtopic.title);
      
      if (existingQuiz) {
        return res.json(JSON.parse(existingQuiz.questions));
      }

      // Generate new quiz questions
      const questions = await generateQuizQuestions(
        outline.topic,
        subtopic.title,
        session.difficulty
      );

      // Store quiz
      await storage.createQuiz({
        sessionId,
        subtopic: subtopic.title,
        questions: JSON.stringify(questions),
        score: null,
        totalQuestions: questions.length,
        completed: false,
      });

      res.json(questions);
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ error: "Failed to generate quiz" });
    }
  });

  // Submit Quiz
  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const validationResult = submitQuizSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid request data", details: validationResult.error });
      }

      const { sessionId, subtopicId, score } = validationResult.data;

      // Get session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const outline = JSON.parse(session.outline);
      const subtopic = outline.subtopics.find((s: any) => s.id === subtopicId);

      if (!subtopic) {
        return res.status(404).json({ error: "Subtopic not found" });
      }

      // Get and update quiz
      const quiz = await storage.getQuiz(sessionId, subtopic.title);
      if (quiz) {
        await storage.updateQuizScore(quiz.id, score);
      }

      // Calculate XP (10 XP per correct answer)
      const xpEarned = score * 10;
      await storage.addXp(xpEarned);

      // Update session progress
      const currentStepIndex = outline.subtopics.findIndex((s: any) => s.id === subtopicId);
      if (currentStepIndex >= session.currentStep) {
        await storage.updateSessionProgress(sessionId, currentStepIndex + 1);
      }

      // Check if session is complete
      if (currentStepIndex + 1 >= outline.subtopics.length) {
        await storage.completeSession(sessionId);
      }

      res.json({ success: true, xpEarned });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  // Get Flashcards
  app.get("/api/flashcards/:sessionId/:subtopicId", async (req, res) => {
    try {
      const { sessionId, subtopicId } = req.params;

      // Get session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const outline = JSON.parse(session.outline);
      const subtopic = outline.subtopics.find((s: any) => s.id === subtopicId);
      
      if (!subtopic) {
        return res.status(404).json({ error: "Subtopic not found" });
      }

      // Check if flashcards already exist
      let existingSet = await storage.getFlashcardSet(sessionId, subtopic.title);
      
      if (existingSet) {
        return res.json(JSON.parse(existingSet.cards));
      }

      // Generate new flashcards
      const flashcards = await generateFlashcards(
        outline.topic,
        subtopic.title,
        session.difficulty
      );

      // Store flashcard set
      await storage.createFlashcardSet({
        sessionId,
        subtopic: subtopic.title,
        cards: JSON.stringify(flashcards),
        reviewedCount: 0,
        totalCards: flashcards.length,
      });

      res.json(flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ error: "Failed to generate flashcards" });
    }
  });

  // Complete Flashcards
  app.post("/api/flashcards/complete", async (req, res) => {
    try {
      const validationResult = completeFlashcardsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid request data", details: validationResult.error });
      }

      const { sessionId, subtopicId } = validationResult.data;

      // Get session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const outline = JSON.parse(session.outline);
      const subtopic = outline.subtopics.find((s: any) => s.id === subtopicId);

      if (!subtopic) {
        return res.status(404).json({ error: "Subtopic not found" });
      }

      // Get and update flashcard set
      const set = await storage.getFlashcardSet(sessionId, subtopic.title);
      if (set) {
        await storage.updateFlashcardProgress(set.id, set.totalCards);
      }

      // Add XP (5 XP per flashcard reviewed)
      const xpEarned = set ? set.totalCards * 5 : 0;
      await storage.addXp(xpEarned);

      // Update session progress
      const currentStepIndex = outline.subtopics.findIndex((s: any) => s.id === subtopicId);
      if (currentStepIndex >= session.currentStep) {
        await storage.updateSessionProgress(sessionId, currentStepIndex + 1);
      }

      // Check if session is complete
      if (currentStepIndex + 1 >= outline.subtopics.length) {
        await storage.completeSession(sessionId);
      }

      res.json({ success: true, xpEarned });
    } catch (error) {
      console.error("Error completing flashcards:", error);
      res.status(500).json({ error: "Failed to complete flashcards" });
    }
  });

  // Get Explanation
  app.post("/api/explanation", async (req, res) => {
    try {
      const validationResult = explanationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid request data", details: validationResult.error });
      }

      const { concept, context, difficulty } = validationResult.data;

      const explanation = await generateExplanation(concept, context, difficulty);
      res.json(explanation);
    } catch (error) {
      console.error("Error generating explanation:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  // Get User Progress
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getProgress();
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

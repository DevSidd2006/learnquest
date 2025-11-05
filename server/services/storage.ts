import { 
  type LearningSession, 
  type InsertLearningSession,
  type Quiz,
  type InsertQuiz,
  type FlashcardSet,
  type InsertFlashcardSet,
  type UserProgress,
  type InsertUserProgress
} from "../../database/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Learning Sessions
  createSession(session: InsertLearningSession, userId?: string): Promise<LearningSession>;
  getSession(id: string): Promise<LearningSession | undefined>;
  getAllSessions(userId?: string): Promise<LearningSession[]>;
  updateSessionProgress(id: string, currentStep: number): Promise<void>;
  completeSession(id: string): Promise<void>;

  // Quizzes
  createQuiz(quiz: InsertQuiz, userId?: string): Promise<Quiz>;
  getQuiz(sessionId: string, subtopic: string): Promise<Quiz | undefined>;
  updateQuizScore(id: string, score: number): Promise<void>;

  // Flashcard Sets
  createFlashcardSet(set: InsertFlashcardSet, userId?: string): Promise<FlashcardSet>;
  getFlashcardSet(sessionId: string, subtopic: string): Promise<FlashcardSet | undefined>;
  updateFlashcardProgress(id: string, reviewedCount: number): Promise<void>;

  // User Progress
  getProgress(userId?: string): Promise<UserProgress>;
  updateProgress(updates: Partial<UserProgress>, userId?: string): Promise<void>;
  addXp(xp: number, userId?: string): Promise<void>;
  incrementStreak(userId?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, LearningSession>;
  private quizzes: Map<string, Quiz>;
  private flashcardSets: Map<string, FlashcardSet>;
  private progress: UserProgress;

  constructor() {
    this.sessions = new Map();
    this.quizzes = new Map();
    this.flashcardSets = new Map();
    
    // Initialize default progress
    this.progress = {
      id: randomUUID(),
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      completedTopics: 0,
      quizzesCompleted: 0,
      flashcardsReviewed: 0,
    };
  }

  // Learning Sessions
  async createSession(insertSession: InsertLearningSession): Promise<LearningSession> {
    const id = randomUUID();
    const session: LearningSession = { 
      ...insertSession, 
      id,
      currentStep: 0,
      completed: false
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<LearningSession | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<LearningSession[]> {
    return Array.from(this.sessions.values());
  }

  async updateSessionProgress(id: string, currentStep: number): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.currentStep = currentStep;
      this.sessions.set(id, session);
    }
  }

  async completeSession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.completed = true;
      this.sessions.set(id, session);
      
      // Update progress
      this.progress.completedTopics += 1;
    }
  }

  // Quizzes
  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = { 
      ...insertQuiz, 
      id,
      score: null,
      completed: false
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async getQuiz(sessionId: string, subtopic: string): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      q => q.sessionId === sessionId && q.subtopic === subtopic
    );
  }

  async updateQuizScore(id: string, score: number): Promise<void> {
    const quiz = this.quizzes.get(id);
    if (quiz) {
      quiz.score = score;
      quiz.completed = true;
      this.quizzes.set(id, quiz);
      
      // Update progress
      this.progress.quizzesCompleted += 1;
    }
  }

  // Flashcard Sets
  async createFlashcardSet(insertSet: InsertFlashcardSet): Promise<FlashcardSet> {
    const id = randomUUID();
    const set: FlashcardSet = { 
      ...insertSet, 
      id,
      reviewedCount: 0
    };
    this.flashcardSets.set(id, set);
    return set;
  }

  async getFlashcardSet(sessionId: string, subtopic: string): Promise<FlashcardSet | undefined> {
    return Array.from(this.flashcardSets.values()).find(
      s => s.sessionId === sessionId && s.subtopic === subtopic
    );
  }

  async updateFlashcardProgress(id: string, reviewedCount: number): Promise<void> {
    const set = this.flashcardSets.get(id);
    if (set) {
      set.reviewedCount = reviewedCount;
      this.flashcardSets.set(id, set);
      
      // Update progress
      this.progress.flashcardsReviewed += reviewedCount;
    }
  }

  // User Progress
  async getProgress(): Promise<UserProgress> {
    return this.progress;
  }

  async updateProgress(updates: Partial<UserProgress>): Promise<void> {
    this.progress = { ...this.progress, ...updates };
  }

  async addXp(xp: number): Promise<void> {
    this.progress.totalXp += xp;
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    if (this.progress.lastActivityDate !== today) {
      this.progress.currentStreak += 1;
      if (this.progress.currentStreak > this.progress.longestStreak) {
        this.progress.longestStreak = this.progress.currentStreak;
      }
      this.progress.lastActivityDate = today;
    }
  }

  async incrementStreak(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    if (this.progress.lastActivityDate !== today) {
      this.progress.currentStreak += 1;
      if (this.progress.currentStreak > this.progress.longestStreak) {
        this.progress.longestStreak = this.progress.currentStreak;
      }
      this.progress.lastActivityDate = today;
    }
  }
}

// Import Supabase storage
import { SupabaseStorage } from "./supabase-storage";

// Use Supabase if configured, otherwise fall back to in-memory storage
export const storage: IStorage = (() => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey && supabaseUrl.trim() && supabaseKey.trim()) {
    console.log("Using Supabase storage");
    try {
      return new SupabaseStorage();
    } catch (error) {
      console.error("Failed to initialize Supabase storage:", error);
      console.log("Falling back to in-memory storage");
      return new MemStorage();
    }
  } else {
    console.log("Using in-memory storage (Supabase not configured)");
    return new MemStorage();
  }
})();

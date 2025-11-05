import { createClient } from '@supabase/supabase-js';
import { 
  type LearningSession, 
  type InsertLearningSession,
  type Quiz,
  type InsertQuiz,
  type FlashcardSet,
  type InsertFlashcardSet,
  type UserProgress
} from "../../database/schema";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Only create client if credentials are provided
let supabase: any = null;

if (supabaseUrl && supabaseKey && supabaseUrl.trim() && supabaseKey.trim()) {
  console.log(`Connecting to Supabase at ${supabaseUrl}`);
  supabase = createClient(supabaseUrl, supabaseKey);
}

export class SupabaseStorage implements IStorage {
  private progressId: string | null = null;

  constructor() {
    if (!supabase) {
      throw new Error("Supabase client not initialized. Please provide SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
    }
  }

  // Learning Sessions
  async createSession(insertSession: InsertLearningSession): Promise<LearningSession> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    // Map to database column names (snake_case)
    const dbSession = {
      id,
      topic: insertSession.topic,
      difficulty: insertSession.difficulty,
      learning_style: insertSession.learningStyle,
      outline: insertSession.outline,
      current_step: 0,
      completed: false,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('learning_sessions')
      .insert(dbSession)
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }

    // Map back to TypeScript interface (camelCase)
    return {
      id: data.id,
      topic: data.topic,
      difficulty: data.difficulty,
      learningStyle: data.learning_style,
      outline: data.outline,
      currentStep: data.current_step,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getSession(id: string): Promise<LearningSession | undefined> {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      console.error('Error fetching session:', error);
      throw new Error(`Failed to fetch session: ${error.message}`);
    }

    // Map from database columns to TypeScript interface
    return {
      id: data.id,
      topic: data.topic,
      difficulty: data.difficulty,
      learningStyle: data.learning_style,
      outline: data.outline,
      currentStep: data.current_step,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getAllSessions(): Promise<LearningSession[]> {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      throw new Error(`Failed to fetch sessions: ${error.message}`);
    }

    // Map each session from database columns to TypeScript interface
    return (data || []).map(session => ({
      id: session.id,
      topic: session.topic,
      difficulty: session.difficulty,
      learningStyle: session.learning_style,
      outline: session.outline,
      currentStep: session.current_step,
      completed: session.completed,
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
    }));
  }

  async updateSessionProgress(id: string, currentStep: number): Promise<void> {
    const { error } = await supabase
      .from('learning_sessions')
      .update({ 
        current_step: currentStep,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating session progress:', error);
      throw new Error(`Failed to update session progress: ${error.message}`);
    }
  }

  async completeSession(id: string): Promise<void> {
    const { error } = await supabase
      .from('learning_sessions')
      .update({ 
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error completing session:', error);
      throw new Error(`Failed to complete session: ${error.message}`);
    }

    // Update progress
    await this.incrementCompletedTopics();
  }

  // Quizzes
  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        id,
        session_id: insertQuiz.sessionId,
        subtopic: insertQuiz.subtopic,
        questions: insertQuiz.questions,
        score: null,
        total_questions: insertQuiz.totalQuestions,
        completed: false,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      throw new Error(`Failed to create quiz: ${error.message}`);
    }

    return {
      ...data,
      sessionId: data.session_id,
      totalQuestions: data.total_questions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getQuiz(sessionId: string, subtopic: string): Promise<Quiz | undefined> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('session_id', sessionId)
      .eq('subtopic', subtopic)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      console.error('Error fetching quiz:', error);
      throw new Error(`Failed to fetch quiz: ${error.message}`);
    }

    return {
      ...data,
      sessionId: data.session_id,
      totalQuestions: data.total_questions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateQuizScore(id: string, score: number): Promise<void> {
    const { error } = await supabase
      .from('quizzes')
      .update({ 
        score,
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating quiz score:', error);
      throw new Error(`Failed to update quiz score: ${error.message}`);
    }

    // Update progress
    await this.incrementQuizzesCompleted();
  }

  // Flashcard Sets
  async createFlashcardSet(insertSet: InsertFlashcardSet): Promise<FlashcardSet> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('flashcard_sets')
      .insert({
        id,
        session_id: insertSet.sessionId,
        subtopic: insertSet.subtopic,
        cards: insertSet.cards,
        reviewed_count: 0,
        total_cards: insertSet.totalCards,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating flashcard set:', error);
      throw new Error(`Failed to create flashcard set: ${error.message}`);
    }

    return {
      ...data,
      sessionId: data.session_id,
      reviewedCount: data.reviewed_count,
      totalCards: data.total_cards,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getFlashcardSet(sessionId: string, subtopic: string): Promise<FlashcardSet | undefined> {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .select('*')
      .eq('session_id', sessionId)
      .eq('subtopic', subtopic)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      console.error('Error fetching flashcard set:', error);
      throw new Error(`Failed to fetch flashcard set: ${error.message}`);
    }

    return {
      ...data,
      sessionId: data.session_id,
      reviewedCount: data.reviewed_count,
      totalCards: data.total_cards,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateFlashcardProgress(id: string, reviewedCount: number): Promise<void> {
    const { error } = await supabase
      .from('flashcard_sets')
      .update({ 
        reviewed_count: reviewedCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating flashcard progress:', error);
      throw new Error(`Failed to update flashcard progress: ${error.message}`);
    }

    // Update progress
    await this.addFlashcardsReviewed(reviewedCount);
  }

  // User Progress
  async getProgress(): Promise<UserProgress> {
    // Try to get existing progress
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching progress:', error);
      throw new Error(`Failed to fetch progress: ${error.message}`);
    }

    if (data) {
      this.progressId = data.id;
      return {
        id: data.id,
        totalXp: data.total_xp,
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastActivityDate: data.last_activity_date,
        completedTopics: data.completed_topics,
        quizzesCompleted: data.quizzes_completed,
        flashcardsReviewed: data.flashcards_reviewed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    }

    // Create initial progress if none exists
    const initialProgress: UserProgress = {
      id: randomUUID(),
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      completedTopics: 0,
      quizzesCompleted: 0,
      flashcardsReviewed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { data: newData, error: createError } = await supabase
      .from('user_progress')
      .insert({
        id: initialProgress.id,
        total_xp: initialProgress.totalXp,
        current_streak: initialProgress.currentStreak,
        longest_streak: initialProgress.longestStreak,
        last_activity_date: initialProgress.lastActivityDate,
        completed_topics: initialProgress.completedTopics,
        quizzes_completed: initialProgress.quizzesCompleted,
        flashcards_reviewed: initialProgress.flashcardsReviewed,
        created_at: initialProgress.createdAt.toISOString(),
        updated_at: initialProgress.updatedAt.toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating initial progress:', createError);
      throw new Error(`Failed to create initial progress: ${createError.message}`);
    }

    this.progressId = newData.id;
    return initialProgress;
  }

  async updateProgress(updates: Partial<UserProgress>): Promise<void> {
    if (!this.progressId) {
      await this.getProgress(); // Initialize if needed
    }

    const supabaseUpdates: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.totalXp !== undefined) supabaseUpdates.total_xp = updates.totalXp;
    if (updates.currentStreak !== undefined) supabaseUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) supabaseUpdates.longest_streak = updates.longestStreak;
    if (updates.lastActivityDate !== undefined) supabaseUpdates.last_activity_date = updates.lastActivityDate;
    if (updates.completedTopics !== undefined) supabaseUpdates.completed_topics = updates.completedTopics;
    if (updates.quizzesCompleted !== undefined) supabaseUpdates.quizzes_completed = updates.quizzesCompleted;
    if (updates.flashcardsReviewed !== undefined) supabaseUpdates.flashcards_reviewed = updates.flashcardsReviewed;

    const { error } = await supabase
      .from('user_progress')
      .update(supabaseUpdates)
      .eq('id', this.progressId);

    if (error) {
      console.error('Error updating progress:', error);
      throw new Error(`Failed to update progress: ${error.message}`);
    }
  }

  async addXp(xp: number): Promise<void> {
    const progress = await this.getProgress();
    const newTotalXp = progress.totalXp + xp;
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    let newCurrentStreak = progress.currentStreak;
    let newLongestStreak = progress.longestStreak;
    
    if (progress.lastActivityDate !== today) {
      newCurrentStreak += 1;
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    }

    await this.updateProgress({
      totalXp: newTotalXp,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: today,
    });
  }

  async incrementStreak(): Promise<void> {
    const progress = await this.getProgress();
    const today = new Date().toISOString().split('T')[0];
    
    if (progress.lastActivityDate !== today) {
      const newCurrentStreak = progress.currentStreak + 1;
      const newLongestStreak = Math.max(newCurrentStreak, progress.longestStreak);
      
      await this.updateProgress({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      });
    }
  }

  // Helper methods
  private async incrementCompletedTopics(): Promise<void> {
    const progress = await this.getProgress();
    await this.updateProgress({
      completedTopics: progress.completedTopics + 1,
    });
  }

  private async incrementQuizzesCompleted(): Promise<void> {
    const progress = await this.getProgress();
    await this.updateProgress({
      quizzesCompleted: progress.quizzesCompleted + 1,
    });
  }

  private async addFlashcardsReviewed(count: number): Promise<void> {
    const progress = await this.getProgress();
    await this.updateProgress({
      flashcardsReviewed: progress.flashcardsReviewed + count,
    });
  }
}
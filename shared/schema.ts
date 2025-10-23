import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Learning Session Schema
export const learningSessions = pgTable("learning_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  learningStyle: text("learning_style").notNull(), // visual, practical, conceptual
  outline: text("outline").notNull(), // JSON string of topic outline
  currentStep: integer("current_step").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
});

export const insertLearningSessionSchema = createInsertSchema(learningSessions).omit({
  id: true,
});

export type InsertLearningSession = z.infer<typeof insertLearningSessionSchema>;
export type LearningSession = typeof learningSessions.$inferSelect;

// Quiz Schema
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  subtopic: text("subtopic").notNull(),
  questions: text("questions").notNull(), // JSON string of questions
  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

// Flashcard Set Schema
export const flashcardSets = pgTable("flashcard_sets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  subtopic: text("subtopic").notNull(),
  cards: text("cards").notNull(), // JSON string of flashcards
  reviewedCount: integer("reviewed_count").notNull().default(0),
  totalCards: integer("total_cards").notNull(),
});

export const insertFlashcardSetSchema = createInsertSchema(flashcardSets).omit({
  id: true,
});

export type InsertFlashcardSet = z.infer<typeof insertFlashcardSetSchema>;
export type FlashcardSet = typeof flashcardSets.$inferSelect;

// Progress Tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalXp: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: text("last_activity_date"),
  completedTopics: integer("completed_topics").notNull().default(0),
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  flashcardsReviewed: integer("flashcards_reviewed").notNull().default(0),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// TypeScript interfaces for frontend use
export interface TopicOutline {
  topic: string;
  subtopics: SubtopicItem[];
  estimatedTime: string;
  difficulty: string;
}

export interface SubtopicItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  realLifeExample: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  example?: string;
}

export interface Explanation {
  concept: string;
  simpleExplanation: string;
  analogy: string;
  realLifeExamples: string[];
  keyTakeaways: string[];
  commonMistakes?: string[];
}

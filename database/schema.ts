import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  avatar: text("avatar"), // URL to profile picture
  emailVerified: boolean("email_verified").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Authentication Schema
export const userAuth = pgTable("user_auth", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 50 }).notNull(), // 'email', 'google', 'github', etc.
  providerId: varchar("provider_id", { length: 255 }), // External provider ID
  passwordHash: text("password_hash"), // For email/password auth
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueProviderUser: unique().on(table.provider, table.providerId),
}));

// User Sessions Schema (for session management)
export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Preferences Schema
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  theme: varchar("theme", { length: 20 }).notNull().default("light"), // 'light', 'dark', 'system'
  language: varchar("language", { length: 10 }).notNull().default("en"), // 'en', 'es', 'fr', etc.
  defaultDifficulty: varchar("default_difficulty", { length: 20 }).notNull().default("beginner"),
  defaultLearningStyle: varchar("default_learning_style", { length: 20 }).notNull().default("visual"),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  dailyGoalXp: integer("daily_goal_xp").notNull().default(100),
  weeklyGoalSessions: integer("weekly_goal_sessions").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Achievements Schema
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementType: varchar("achievement_type", { length: 50 }).notNull(), // 'first_quiz', 'streak_7', 'level_10', etc.
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // Icon name or emoji
  xpReward: integer("xp_reward").notNull().default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
}, (table) => ({
  uniqueUserAchievement: unique().on(table.userId, table.achievementType),
}));

// Learning Session Schema
export const learningSessions = pgTable("learning_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Optional for guest users
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  learningStyle: text("learning_style").notNull(), // visual, practical, conceptual
  outline: text("outline").notNull(), // JSON string of topic outline
  currentStep: integer("current_step").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false), // Allow sharing sessions
  tags: text("tags"), // JSON array of tags for categorization
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLearningSessionSchema = createInsertSchema(learningSessions).omit({
  id: true,
});

export type InsertLearningSession = z.infer<typeof insertLearningSessionSchema>;
export type LearningSession = typeof learningSessions.$inferSelect;

// Quiz Schema
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid("session_id").notNull().references(() => learningSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Optional for guest users
  subtopic: text("subtopic").notNull(),
  questions: text("questions").notNull(), // JSON string of questions
  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),
  completed: boolean("completed").notNull().default(false),
  timeSpent: integer("time_spent"), // Time spent in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

// Flashcard Set Schema
export const flashcardSets = pgTable("flashcard_sets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid("session_id").notNull().references(() => learningSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Optional for guest users
  subtopic: text("subtopic").notNull(),
  cards: text("cards").notNull(), // JSON string of flashcards
  reviewedCount: integer("reviewed_count").notNull().default(0),
  totalCards: integer("total_cards").notNull(),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFlashcardSetSchema = createInsertSchema(flashcardSets).omit({
  id: true,
});

export type InsertFlashcardSet = z.infer<typeof insertFlashcardSetSchema>;
export type FlashcardSet = typeof flashcardSets.$inferSelect;

// Progress Tracking
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).unique(), // One progress per user
  totalXp: integer("total_xp").notNull().default(0),
  currentLevel: integer("current_level").notNull().default(1),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: text("last_activity_date"),
  completedTopics: integer("completed_topics").notNull().default(0),
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  flashcardsReviewed: integer("flashcards_reviewed").notNull().default(0),
  totalStudyTime: integer("total_study_time").notNull().default(0), // In minutes
  averageQuizScore: integer("average_quiz_score").notNull().default(0), // Percentage
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// User Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertUserAuthSchema = createInsertSchema(userAuth).omit({
  id: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserAuth = typeof userAuth.$inferSelect;
export type InsertUserAuth = z.infer<typeof insertUserAuthSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

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
  type: 'multiple-choice' | 'true-false';
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

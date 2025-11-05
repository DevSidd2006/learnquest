import { createClient } from '@supabase/supabase-js';
import { 
  type User, 
  type InsertUser,
  type UserAuth,
  type InsertUserAuth,
  type UserSession,
  type InsertUserSession,
  type UserPreferences,
  type InsertUserPreferences,
  type UserAchievement,
  type InsertUserAchievement
} from "../../database/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Anon Key are required for user service");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthResult {
  user: User;
  session: UserSession;
  preferences: UserPreferences;
}

export class UserService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // User Registration
  async registerUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  }): Promise<AuthResult> {
    const { email, password, firstName, lastName, username } = userData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = randomUUID();
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        email_verified: false,
        is_active: true,
      })
      .select()
      .single();

    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`);
    }

    // Create auth record
    const { error: authError } = await supabase
      .from('user_auth')
      .insert({
        user_id: userId,
        provider: 'email',
        password_hash: passwordHash,
      });

    if (authError) {
      throw new Error(`Failed to create auth record: ${authError.message}`);
    }

    // Create default preferences
    const { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
      })
      .select()
      .single();

    if (prefError) {
      throw new Error(`Failed to create user preferences: ${prefError.message}`);
    }

    // Create initial progress record
    await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
      });

    // Create session
    const session = await this.createSession(userId);

    // Award first registration achievement
    await this.awardAchievement(userId, 'first_registration');

    return {
      user: this.mapUser(user),
      session,
      preferences: this.mapPreferences(preferences),
    };
  }

  // User Login
  async loginUser(email: string, password: string): Promise<AuthResult> {
    // Get user and auth info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_auth!inner(password_hash)
      `)
      .eq('email', email)
      .eq('user_auth.provider', 'email')
      .eq('is_active', true)
      .single();

    if (userError || !userData) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.user_auth[0].password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userData.id);

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    // Create session
    const session = await this.createSession(userData.id);

    return {
      user: this.mapUser(userData),
      session,
      preferences: preferences ? this.mapPreferences(preferences) : await this.createDefaultPreferences(userData.id),
    };
  }

  // Create Session
  async createSession(userId: string): Promise<UserSession> {
    const sessionToken = jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    const { data: session, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }

    return this.mapSession(session);
  }

  // Validate Session
  async validateSession(sessionToken: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(sessionToken, this.JWT_SECRET) as { userId: string };
      
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          users(*)
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session) {
        return null;
      }

      return this.mapUser(session.users);
    } catch (error) {
      return null;
    }
  }

  // Logout User
  async logoutUser(sessionToken: string): Promise<void> {
    await supabase
      .from('user_sessions')
      .delete()
      .eq('session_token', sessionToken);
  }

  // Get User Profile
  async getUserProfile(userId: string): Promise<{
    user: User;
    preferences: UserPreferences;
    achievements: UserAchievement[];
  }> {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(`Failed to get user: ${userError.message}`);
    }

    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    return {
      user: this.mapUser(user),
      preferences: preferences ? this.mapPreferences(preferences) : await this.createDefaultPreferences(userId),
      achievements: (achievements || []).map(this.mapAchievement),
    };
  }

  // Update User Profile
  async updateUserProfile(userId: string, updates: Partial<InsertUser>): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return this.mapUser(user);
  }

  // Update User Preferences
  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update preferences: ${error.message}`);
    }

    return this.mapPreferences(preferences);
  }

  // Award Achievement
  async awardAchievement(userId: string, achievementType: string): Promise<UserAchievement | null> {
    // Check if user already has this achievement
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)
      .single();

    if (existing) {
      return null; // Already has this achievement
    }

    // Get achievement template
    const achievementTemplates: Record<string, { title: string; description: string; icon: string; xpReward: number }> = {
      first_registration: { title: 'Welcome!', description: 'Joined LearnQuest', icon: '🎉', xpReward: 50 },
      first_session: { title: 'Getting Started', description: 'Created your first learning session', icon: '🎯', xpReward: 50 },
      first_quiz: { title: 'Quiz Master', description: 'Completed your first quiz', icon: '🧠', xpReward: 25 },
      first_flashcard: { title: 'Memory Builder', description: 'Reviewed your first flashcard set', icon: '📚', xpReward: 25 },
      streak_3: { title: '3-Day Streak', description: 'Maintained a 3-day learning streak', icon: '🔥', xpReward: 100 },
      streak_7: { title: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: '⚡', xpReward: 250 },
      perfect_quiz: { title: 'Perfect Score', description: 'Got 100% on a quiz', icon: '💯', xpReward: 150 },
    };

    const template = achievementTemplates[achievementType];
    if (!template) {
      return null;
    }

    const { data: achievement, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_type: achievementType,
        title: template.title,
        description: template.description,
        icon: template.icon,
        xp_reward: template.xpReward,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to award achievement:', error);
      return null;
    }

    // Add XP to user progress
    await this.addXpToUser(userId, template.xpReward);

    return this.mapAchievement(achievement);
  }

  // Add XP to user
  async addXpToUser(userId: string, xp: number): Promise<void> {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('total_xp, current_level')
      .eq('user_id', userId)
      .single();

    if (progress) {
      const newTotalXp = progress.total_xp + xp;
      const newLevel = Math.floor(newTotalXp / 1000) + 1; // 1000 XP per level

      await supabase
        .from('user_progress')
        .update({
          total_xp: newTotalXp,
          current_level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      // Award level achievements
      if (newLevel > progress.current_level) {
        if (newLevel === 5) await this.awardAchievement(userId, 'level_5');
        if (newLevel === 10) await this.awardAchievement(userId, 'level_10');
      }
    }
  }

  // Helper methods for mapping database objects to TypeScript types
  private mapUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      avatar: dbUser.avatar,
      emailVerified: dbUser.email_verified,
      isActive: dbUser.is_active,
      lastLoginAt: dbUser.last_login_at ? new Date(dbUser.last_login_at) : null,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at),
    };
  }

  private mapSession(dbSession: any): UserSession {
    return {
      id: dbSession.id,
      userId: dbSession.user_id,
      sessionToken: dbSession.session_token,
      expiresAt: new Date(dbSession.expires_at),
      createdAt: new Date(dbSession.created_at),
    };
  }

  private mapPreferences(dbPrefs: any): UserPreferences {
    return {
      id: dbPrefs.id,
      userId: dbPrefs.user_id,
      theme: dbPrefs.theme,
      language: dbPrefs.language,
      defaultDifficulty: dbPrefs.default_difficulty,
      defaultLearningStyle: dbPrefs.default_learning_style,
      emailNotifications: dbPrefs.email_notifications,
      dailyGoalXp: dbPrefs.daily_goal_xp,
      weeklyGoalSessions: dbPrefs.weekly_goal_sessions,
      createdAt: new Date(dbPrefs.created_at),
      updatedAt: new Date(dbPrefs.updated_at),
    };
  }

  private mapAchievement(dbAchievement: any): UserAchievement {
    return {
      id: dbAchievement.id,
      userId: dbAchievement.user_id,
      achievementType: dbAchievement.achievement_type,
      title: dbAchievement.title,
      description: dbAchievement.description,
      icon: dbAchievement.icon,
      xpReward: dbAchievement.xp_reward,
      unlockedAt: new Date(dbAchievement.unlocked_at),
    };
  }

  private async createDefaultPreferences(userId: string): Promise<UserPreferences> {
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create default preferences: ${error.message}`);
    }

    return this.mapPreferences(preferences);
  }
}

export const userService = new UserService();
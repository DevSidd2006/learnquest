-- Complete LearnQuest Database Setup
-- This script creates all tables and user management in the correct order

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Create Base Tables (from 001_initial_schema.sql)
-- ============================================================================

-- Learning Sessions Table (using UUID from the start)
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    learning_style TEXT NOT NULL CHECK (learning_style IN ('visual', 'practical', 'conceptual')),
    outline TEXT NOT NULL,
    current_step INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Quizzes Table (using UUID from the start)
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    subtopic TEXT NOT NULL,
    questions TEXT NOT NULL,
    score INTEGER,
    total_questions INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (session_id) REFERENCES learning_sessions(id) ON DELETE CASCADE
);

-- Flashcard Sets Table (using UUID from the start)
CREATE TABLE flashcard_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    subtopic TEXT NOT NULL,
    cards TEXT NOT NULL,
    reviewed_count INTEGER NOT NULL DEFAULT 0,
    total_cards INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (session_id) REFERENCES learning_sessions(id) ON DELETE CASCADE
);

-- User Progress Table (using UUID from the start)
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date TEXT,
    completed_topics INTEGER NOT NULL DEFAULT 0,
    quizzes_completed INTEGER NOT NULL DEFAULT 0,
    flashcards_reviewed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- STEP 2: Add User Management Tables
-- ============================================================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User Authentication Table
CREATE TABLE user_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255),
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(provider, provider_id)
);

-- User Sessions Table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    default_difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner',
    default_learning_style VARCHAR(20) NOT NULL DEFAULT 'visual',
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    daily_goal_xp INTEGER NOT NULL DEFAULT 100,
    weekly_goal_sessions INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User Achievements Table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    xp_reward INTEGER NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, achievement_type)
);

-- Achievement Templates Table (for achievement definitions)
CREATE TABLE achievement_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_type VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    xp_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- STEP 3: Add User Relationships to Base Tables
-- ============================================================================

-- Add user relationships to existing tables
ALTER TABLE learning_sessions 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN tags TEXT;

-- Add user_id to quizzes
ALTER TABLE quizzes 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN time_spent INTEGER;

-- Add user_id to flashcard_sets
ALTER TABLE flashcard_sets 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN last_reviewed_at TIMESTAMP WITH TIME ZONE;

-- Update user_progress
ALTER TABLE user_progress 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
ADD COLUMN current_level INTEGER NOT NULL DEFAULT 1,
ADD COLUMN total_study_time INTEGER NOT NULL DEFAULT 0,
ADD COLUMN average_quiz_score INTEGER NOT NULL DEFAULT 0;

-- ============================================================================
-- STEP 4: Create Indexes
-- ============================================================================

-- Base table indexes
CREATE INDEX idx_learning_sessions_created_at ON learning_sessions(created_at DESC);
CREATE INDEX idx_quizzes_session_id ON quizzes(session_id);
CREATE INDEX idx_quizzes_session_subtopic ON quizzes(session_id, subtopic);
CREATE INDEX idx_flashcard_sets_session_id ON flashcard_sets(session_id);
CREATE INDEX idx_flashcard_sets_session_subtopic ON flashcard_sets(session_id, subtopic);

-- User table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_auth_user_id ON user_auth(user_id);
CREATE INDEX idx_user_auth_provider ON user_auth(provider, provider_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);
CREATE INDEX idx_achievement_templates_type ON achievement_templates(achievement_type);

-- User relationship indexes
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_public ON learning_sessions(is_public) WHERE is_public = true;
CREATE INDEX idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX idx_flashcard_sets_user_id ON flashcard_sets(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- ============================================================================
-- STEP 5: Create Triggers
-- ============================================================================

-- Create triggers for all tables
CREATE TRIGGER update_learning_sessions_updated_at BEFORE UPDATE ON learning_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcard_sets_updated_at BEFORE UPDATE ON flashcard_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_auth_updated_at BEFORE UPDATE ON user_auth FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Enable Row Level Security
-- ============================================================================

-- Enable RLS for all tables
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: Create RLS Policies
-- ============================================================================

-- Temporary policies for development (allow all operations)
-- Note: In production, you should implement proper user-based policies

CREATE POLICY "Allow all operations on learning_sessions" ON learning_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on quizzes" ON quizzes FOR ALL USING (true);
CREATE POLICY "Allow all operations on flashcard_sets" ON flashcard_sets FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_progress" ON user_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_auth" ON user_auth FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_preferences" ON user_preferences FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_achievements" ON user_achievements FOR ALL USING (true);
CREATE POLICY "Allow read access to achievement_templates" ON achievement_templates FOR SELECT USING (true);

-- ============================================================================
-- STEP 8: Insert Achievement Templates Data
-- ============================================================================

-- Insert achievement templates
INSERT INTO achievement_templates (achievement_type, title, description, icon, xp_reward) VALUES
('first_session', 'Getting Started', 'Created your first learning session', '🎯', 50),
('first_quiz', 'Quiz Master', 'Completed your first quiz', '🧠', 25),
('first_flashcard', 'Memory Builder', 'Reviewed your first flashcard set', '📚', 25),
('streak_3', '3-Day Streak', 'Maintained a 3-day learning streak', '🔥', 100),
('streak_7', 'Week Warrior', 'Maintained a 7-day learning streak', '⚡', 250),
('streak_30', 'Monthly Master', 'Maintained a 30-day learning streak', '👑', 1000),
('level_5', 'Rising Star', 'Reached level 5', '⭐', 200),
('level_10', 'Knowledge Seeker', 'Reached level 10', '🌟', 500),
('perfect_quiz', 'Perfect Score', 'Got 100% on a quiz', '💯', 150),
('topic_master', 'Topic Master', 'Completed 10 learning sessions', '🎓', 300);

-- Success message
SELECT 'LearnQuest database setup completed successfully! 🎉' as status;

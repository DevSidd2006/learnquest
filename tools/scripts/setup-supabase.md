# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `learnquest` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to Settings → API
2. Copy the following values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

## 3. Update Your Environment Variables

Add these to your `.env` file:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Run Database Migrations

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click "Run" to execute the migration

## 5. Verify Setup

1. Check the "Table Editor" in your Supabase dashboard
2. You should see the following tables:
   - `learning_sessions`
   - `quizzes`
   - `flashcard_sets`
   - `user_progress`

## 6. Test the Integration

1. Restart your development server: `npm run dev`
2. You should see "Using Supabase storage" in the console
3. Create a new learning session to test the database connection

## Security Notes

The current setup uses public policies for simplicity. For production, consider:

1. Implementing user authentication
2. Adding Row Level Security (RLS) policies based on user ID
3. Using service role key for server-side operations
4. Implementing proper access controls

## Troubleshooting

- **Connection errors**: Check your SUPABASE_URL and SUPABASE_ANON_KEY
- **Permission errors**: Verify the RLS policies are correctly set
- **Migration errors**: Ensure the SQL runs without syntax errors in Supabase SQL Editor
# LearnQuest Setup Guide

This guide will help you set up LearnQuest with Supabase database integration.

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd learnquest
npm install
```

### 2. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Get API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

#### Supabase Setup (Optional - for persistent storage)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)
4. Go to Settings → API
5. Copy your Project URL and Anon Key

**Note:** If you skip this step, the application will use in-memory storage (data is lost when server restarts).

### 4. Configure Environment Variables

Edit your `.env` file:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for persistent storage)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional
PORT=5000
NODE_ENV=development
```

### 5. Setup Database (Optional)

**For Persistent Storage (Supabase):**
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy the contents of `database/migrations/001_initial_schema.sql`
5. Paste and click "Run"

**For Development (In-Memory):**
- Skip this step - the application will use in-memory storage automatically

### 6. Test Your Setup

Test Supabase connection:
```bash
npm run test:supabase
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5000` to use the application.

## Verification Checklist

- [ ] ✅ Gemini API key is working (no 403 errors when creating topics)
- [ ] ✅ Supabase connection successful (see "Using Supabase storage" in logs)
- [ ] ✅ Database tables created (check Supabase Table Editor)
- [ ] ✅ Can create learning sessions
- [ ] ✅ Data persists after server restart

## Troubleshooting

### "Using in-memory storage" message
- Check your SUPABASE_URL and SUPABASE_ANON_KEY in `.env`
- Ensure there are no extra spaces in the environment variables

### "Failed to create learning session" errors
- Verify your Gemini API key is correct
- Check for API quota limits

### Database connection errors
- Ensure you ran the database migration
- Check RLS policies in Supabase dashboard
- Verify your project URL and anon key

### Permission denied errors
- Check that RLS policies allow public access
- Ensure the migration created the correct policies

## Development vs Production

### Development
- Uses Supabase if configured, falls back to in-memory storage
- Hot reloading enabled
- Detailed error logging

### Production
- Requires Supabase configuration
- Consider implementing user authentication
- Review and tighten RLS policies for security

## Next Steps

1. **Add Authentication**: Implement user accounts with Supabase Auth
2. **Secure Database**: Add proper RLS policies based on user ID
3. **Deploy**: Use platforms like Vercel, Netlify, or Railway
4. **Monitor**: Set up error tracking and analytics

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify your environment variables
4. Test the Supabase connection with `npm run test:supabase`
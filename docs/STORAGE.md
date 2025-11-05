# Storage Options

LearnQuest supports two storage modes:

## 🧠 In-Memory Storage (Default)

**When to use:**
- Development and testing
- Quick setup without database configuration
- Temporary learning sessions

**Characteristics:**
- ✅ No setup required
- ✅ Fast performance
- ❌ Data is lost when server restarts
- ❌ No persistence between sessions

**Configuration:**
Leave `SUPABASE_URL` and `SUPABASE_ANON_KEY` empty in your `.env` file.

## 🗄️ Supabase Storage (Optional)

**When to use:**
- Production deployments
- Persistent learning progress
- Multiple users or long-term usage

**Characteristics:**
- ✅ Data persists between server restarts
- ✅ Full PostgreSQL database features
- ✅ Scalable and reliable
- ❌ Requires Supabase account setup

**Configuration:**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Add your credentials to `.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the database migration from `migrations/001_initial_schema.sql`

## 🔄 Automatic Fallback

The application automatically detects which storage to use:

- **Supabase configured** → Uses PostgreSQL database
- **Supabase not configured** → Uses in-memory storage
- **Supabase connection fails** → Falls back to in-memory storage

## 📊 Storage Comparison

| Feature | In-Memory | Supabase |
|---------|-----------|----------|
| Setup Time | Instant | 5-10 minutes |
| Data Persistence | No | Yes |
| Performance | Fastest | Fast |
| Scalability | Limited | High |
| Cost | Free | Free tier available |
| Best For | Development | Production |

## 🚀 Getting Started

**Quick Start (In-Memory):**
```bash
npm install
cp .env.example .env
# Add only GEMINI_API_KEY
npm run dev
```

**Production Setup (Supabase):**
```bash
npm install
cp .env.example .env
# Add GEMINI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
# Run database migration
npm run dev
```

The application will automatically use the appropriate storage based on your configuration!
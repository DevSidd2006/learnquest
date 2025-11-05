# 🚀 Quick Deployment Checklist

## Before Deploying to Vercel

### ✅ Prerequisites
- [ ] GitHub repository is up to date
- [ ] Supabase database is set up and migrated
- [ ] Google Gemini API key is ready
- [ ] All environment variables are documented

### ✅ Code Preparation
- [ ] Run `npm run build:client` locally to test
- [ ] Run `npm run check` to verify TypeScript
- [ ] Test the app locally with `npm run dev`
- [ ] Commit and push all changes to GitHub

### ✅ Vercel Setup
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure build settings:
  - Build Command: `npm run vercel-build`
  - Output Directory: `client/dist`
  - Install Command: `npm install`

### ✅ Environment Variables (Add in Vercel Dashboard)
- [ ] `GEMINI_API_KEY` - Your Google Gemini API key
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- [ ] `JWT_SECRET` - A secure random string for JWT tokens
- [ ] `NODE_ENV` - Set to "production"

### ✅ Database Configuration
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify all tables exist
- [ ] Check RLS policies are enabled
- [ ] Test database connection

### ✅ Post-Deployment Testing
- [ ] Visit deployed URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Create a learning session
- [ ] Test AI content generation
- [ ] Test quiz functionality
- [ ] Test flashcard functionality
- [ ] Check mobile responsiveness

## 🎯 Quick Deploy Commands

```bash
# 1. Final local test
npm run build:client
npm run check

# 2. Commit and push
git add .
git commit -m "🚀 Ready for Vercel deployment"
git push origin main

# 3. Deploy via Vercel CLI (optional)
npx vercel --prod
```

## 🆘 If Something Goes Wrong

1. **Check Vercel build logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Test locally** with production build
4. **Check Supabase** connection and policies
5. **Review the full deployment guide** in `docs/DEPLOYMENT.md`

---

**Ready to deploy?** Follow the complete guide in `docs/DEPLOYMENT.md`!
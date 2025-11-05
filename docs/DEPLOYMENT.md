# 🚀 Vercel Deployment Guide for LearnQuest

This guide will help you deploy your LearnQuest application to Vercel with full functionality including database integration and user authentication.

## 📋 Prerequisites

- ✅ GitHub repository with your code
- ✅ Vercel account (free tier available)
- ✅ Supabase project set up
- ✅ Google Gemini API key

## 🔧 Step 1: Prepare Your Project

### Update Package.json Scripts

Make sure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18",
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "vercel-build": "npm run build:client"
  }
}
```

### Create Vercel Configuration

The `vercel.json` file has been created with the optimal configuration for your full-stack app.

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository:**
   - Select `DevSidd2006/learnquest`
   - Click "Import"
4. **Configure the project:**
   - Framework Preset: **Other**
   - Root Directory: **Leave empty** (uses root)
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`
   
   *Note: These settings are also configured in `vercel.json` for automatic detection.*

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: learnquest
# - Directory: ./
```

## 🔐 Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

### Required Variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
```

### How to Add Variables:
1. Go to your project dashboard on Vercel
2. Click **Settings** tab
3. Click **Environment Variables**
4. Add each variable:
   - **Name**: Variable name (e.g., `GEMINI_API_KEY`)
   - **Value**: Your actual key/value
   - **Environments**: Select **Production**, **Preview**, and **Development**
5. Click **Save**

## 🗄️ Step 4: Database Setup

### Supabase Configuration

1. **Ensure your Supabase database is set up:**
   - Run the migration from `database/migrations/000_complete_setup.sql`
   - Verify all tables are created
   - Check RLS policies are enabled

2. **Update CORS settings in Supabase:**
   - Go to Supabase Dashboard → Settings → API
   - Add your Vercel domain to allowed origins:
     ```
     https://your-app-name.vercel.app
     https://your-app-name-git-main-yourusername.vercel.app
     ```

## 🔧 Step 5: Build Configuration

### Update Build Scripts

Add this to your `package.json`:

```json
{
  "scripts": {
    "vercel-build": "vite build",
    "postinstall": "npm run build:types || true"
  }
}
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["client/src/**/*", "database/**/*", "server/**/*"]
}
```

## 🚀 Step 6: Deploy and Test

### Initial Deployment

1. **Trigger deployment:**
   - Push changes to your main branch
   - Vercel will automatically deploy
   - Or click "Deploy" in Vercel dashboard

2. **Monitor deployment:**
   - Check the **Deployments** tab
   - View build logs for any errors
   - Wait for "Ready" status

### Test Your Deployment

1. **Visit your deployed app:**
   ```
   https://your-app-name.vercel.app
   ```

2. **Test key features:**
   - ✅ Home page loads
   - ✅ Login/register works
   - ✅ Create learning session
   - ✅ AI content generation
   - ✅ Database operations
   - ✅ User authentication

## 🔍 Step 7: Troubleshooting

### Common Issues and Solutions

#### Build Errors
```bash
# If you get TypeScript errors
npm run check

# If you get dependency issues
npm install
npm audit fix
```

#### Environment Variable Issues
- Ensure all variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies allow operations
- Ensure migration was run successfully

#### API Route Issues
- Check `vercel.json` routing configuration
- Verify server endpoints are working locally
- Check function timeout settings

### Debug Commands

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run check

# Test production build locally
npm run start
```

## 📊 Step 8: Production Optimizations

### Performance Improvements

1. **Enable Vercel Analytics:**
   - Go to project dashboard
   - Click **Analytics** tab
   - Enable Web Analytics

2. **Configure Caching:**
   ```json
   // In vercel.json
   {
     "headers": [
       {
         "source": "/api/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "s-maxage=60, stale-while-revalidate"
           }
         ]
       }
     ]
   }
   ```

3. **Optimize Images:**
   - Use Vercel's Image Optimization
   - Compress assets before deployment

### Security Enhancements

1. **Add Security Headers:**
   ```json
   // In vercel.json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

2. **Environment Security:**
   - Use strong JWT secrets
   - Rotate API keys regularly
   - Monitor usage in Supabase dashboard

## 🎯 Step 9: Custom Domain (Optional)

### Add Custom Domain

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   - Add your custom domain to Supabase CORS settings
   - Update any hardcoded URLs in your app

## 📈 Step 10: Monitoring and Maintenance

### Set Up Monitoring

1. **Vercel Analytics:**
   - Monitor page views and performance
   - Track Core Web Vitals

2. **Supabase Monitoring:**
   - Monitor database usage
   - Check API request limits
   - Review authentication metrics

3. **Error Tracking:**
   - Set up error logging
   - Monitor function execution times
   - Track failed deployments

### Regular Maintenance

- **Update dependencies** regularly
- **Monitor API usage** and costs
- **Review security logs**
- **Backup database** regularly
- **Test deployments** in preview environments

## 🎉 Success Checklist

After deployment, verify:

- ✅ **App loads** at your Vercel URL
- ✅ **Authentication works** (login/register)
- ✅ **Database operations** function correctly
- ✅ **AI content generation** works
- ✅ **All pages** are accessible
- ✅ **Environment variables** are set
- ✅ **No console errors** in browser
- ✅ **Mobile responsive** design works

## 🆘 Support Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
- **GitHub Repository:** Your project repository for issues
- **Vercel Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

🎊 **Congratulations!** Your LearnQuest application is now live on Vercel with full functionality including user authentication, database integration, and AI-powered learning features!
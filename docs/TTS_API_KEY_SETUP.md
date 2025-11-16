# Setting Up Google Cloud Text-to-Speech API Key

## Quick Setup Guide

### Step 1: Enable the API in Your Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Select or create** the project where you want to enable TTS
3. Go to **APIs & Services** > **Library**
4. Search for "**Cloud Text-to-Speech API**"
5. Click **Enable**

### Step 2: Create an API Key

1. In the same project, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key
4. (Optional but recommended) Click **Restrict Key**:
   - Under **API restrictions**, select "Restrict key"
   - Check only: **Cloud Text-to-Speech API**
   - Click **Save**

### Step 3: Add the API Key to Your .env File

Open your `.env` file and add:

```bash
# Google Cloud Text-to-Speech API Key
GOOGLE_TTS_API_KEY=AIzaSy...your_actual_key_here
```

**Important**: Replace `AIzaSy...your_actual_key_here` with your actual API key from Step 2.

### Step 4: Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test the TTS Feature

1. Go to http://localhost:5000
2. Create a learning session
3. Click "Learn Concept" on any subtopic
4. Click the **"AI Voice"** button at the top
5. You should hear high-quality AI-generated speech!

## Troubleshooting

### Error: "API key not valid"

**Solution**: 
- Verify you copied the entire API key correctly
- Make sure there are no extra spaces in the .env file
- Ensure the API key is from the project where TTS is enabled

### Error: "PERMISSION_DENIED"

**Solution**:
- Go back to Google Cloud Console
- Verify that **Cloud Text-to-Speech API** is enabled
- Check that your API key restrictions allow the TTS API
- If using IP restrictions, make sure your IP is allowed

### Error: "Quota exceeded"

**Solution**:
- You've hit the free tier limit (1M characters/month for Standard voices)
- Enable billing in Google Cloud Console
- Or wait until next month for quota reset
- Or reduce TTS usage (use browser TTS for sections)

### TTS Still Not Working?

**Fallback Options**:

1. **Use Browser TTS** (Free, works offline):
   - The small play buttons on each section use browser TTS
   - No API key needed
   - Works immediately

2. **Check Server Logs**:
   ```bash
   # Look for TTS-related errors in the terminal
   # They will show detailed error messages
   ```

3. **Verify API Key in Code**:
   - The app tries `GOOGLE_TTS_API_KEY` first
   - Falls back to `GEMINI_API_KEY` if not set
   - Make sure at least one is configured

## Cost Information

### Free Tier
- **Standard voices**: 1M characters/month free
- **Neural2 voices**: 1M characters/month free (first year only)

### Paid Pricing
- **Standard voices**: $4 per 1M characters
- **Neural2 voices**: $16 per 1M characters

### Estimated Usage
- Average explanation: ~500 characters
- 1000 AI voice plays = ~$8/month (Neural2)
- Browser TTS is always free

## Security Best Practices

### 1. Restrict Your API Key

In Google Cloud Console:
- **Application restrictions**: Add your domain
- **API restrictions**: Only allow Text-to-Speech API
- **Regenerate** if key is exposed

### 2. Don't Commit API Keys

The `.env` file is in `.gitignore` - never commit it!

### 3. Use Different Keys for Dev/Prod

- Development: Use a restricted key for localhost
- Production: Use a different key restricted to your domain

## Alternative: Use Browser TTS Only

If you don't want to set up Google Cloud TTS:

1. Simply don't add `GOOGLE_TTS_API_KEY` to .env
2. The app will automatically use browser TTS
3. All features work, just with device-native voices
4. Completely free and works offline

The main "AI Voice" button will automatically fall back to browser TTS if Google TTS is unavailable.

## Need Help?

- [Google Cloud TTS Documentation](https://cloud.google.com/text-to-speech/docs)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

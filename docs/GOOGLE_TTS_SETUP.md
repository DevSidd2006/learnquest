# Google Cloud Text-to-Speech Integration

## Overview
LearnQuest now supports high-quality AI-powered text-to-speech using Google Cloud's Text-to-Speech API with Neural2 voices.

## Features

### 🎙️ Premium Voice Quality
- **Neural2 Voices**: State-of-the-art neural network-based voices
- **Natural Prosody**: Human-like intonation and rhythm
- **Clear Pronunciation**: Optimized for educational content
- **Consistent Quality**: Same voice across all devices

### 🆚 Comparison: Browser TTS vs Google Cloud TTS

| Feature | Browser TTS | Google Cloud TTS |
|---------|-------------|------------------|
| Voice Quality | Good | Excellent |
| Consistency | Varies by device | Always consistent |
| Offline Support | ✅ Yes | ❌ No |
| Cost | Free | Pay per character |
| Customization | Limited | Extensive |
| Speed Control | ✅ Yes | ✅ Yes |
| Voice Selection | Device-dependent | 200+ voices |

## Setup Instructions

### 1. Enable Google Cloud Text-to-Speech API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Text-to-Speech API**
4. Go to **APIs & Services** > **Credentials**
5. Create an **API Key**
6. Restrict the API key to only Text-to-Speech API (recommended)

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Your existing Gemini API key works for Google Cloud services
GEMINI_API_KEY=your_google_api_key_here
```

**Note**: The same API key used for Gemini can be used for Google Cloud TTS if it's from the same Google Cloud project.

### 3. API Key Restrictions (Recommended)

For security, restrict your API key:

1. **Application restrictions**: 
   - HTTP referrers (for web)
   - Add your domain: `https://yourdomain.com/*`

2. **API restrictions**:
   - Restrict key to: Cloud Text-to-Speech API
   - Also include: Generative Language API (for Gemini)

## Usage

### In Components

```tsx
import { TextToSpeech } from "@/components/text-to-speech";

// Use Google Cloud TTS (premium quality)
<TextToSpeech 
  text="Your text here"
  useGoogleTTS={true}
  showLabel={true}
  variant="default"
/>

// Use Browser TTS (free, offline)
<TextToSpeech 
  text="Your text here"
  useGoogleTTS={false}
  showLabel={true}
  variant="outline"
/>
```

### Available Voices

The API currently uses these Neural2 voices:
- `en-US-Neural2-J` (Default) - Neutral, clear
- `en-US-Neural2-D` - Male, professional
- `en-US-Neural2-F` - Female, warm
- `en-US-Neural2-A` - Male, authoritative

### API Endpoint

**POST** `/api/tts`

Request body:
```json
{
  "text": "Text to convert to speech",
  "voice": "en-US-Neural2-J",
  "speed": 0.95,
  "enhanced": false
}
```

Response:
```json
{
  "audioContent": "base64_encoded_mp3_data",
  "format": "mp3"
}
```

## Pricing

Google Cloud Text-to-Speech pricing (as of 2024):

- **Standard voices**: $4 per 1 million characters
- **Neural2 voices**: $16 per 1 million characters
- **Free tier**: 1 million characters per month (Standard)

### Cost Estimation

For LearnQuest usage:
- Average explanation: ~500 characters
- 1000 explanations = 500,000 characters
- Cost: ~$8/month for 1000 AI voice generations

**Recommendation**: Use Google TTS for main "Listen" buttons, browser TTS for section buttons to balance quality and cost.

## Implementation Details

### Current Setup

1. **Main Listen Button** (Concept page): Uses Google Cloud TTS
   - Full explanation audio
   - Premium quality for best learning experience
   - Gradient button with Sparkles icon

2. **Section Buttons**: Uses Browser TTS
   - Individual sections (analogy, examples, etc.)
   - Free and instant
   - Ghost button style

### Audio Format

- **Encoding**: MP3
- **Sample Rate**: 24kHz (Neural2 default)
- **Bit Rate**: 32 kbps
- **Channels**: Mono

### Caching Strategy

To reduce costs, consider implementing:

```typescript
// Cache audio files by text hash
const textHash = hashText(text);
const cachedAudio = await getCachedAudio(textHash);

if (cachedAudio) {
  return cachedAudio;
}

// Generate new audio
const audio = await generateTTS(text);
await cacheAudio(textHash, audio);
return audio;
```

## Troubleshooting

### API Key Issues

**Error**: "API key not valid"
- Verify the API key is correct in `.env`
- Check that Text-to-Speech API is enabled
- Ensure API key restrictions allow your domain

### CORS Errors

**Error**: "CORS policy blocked"
- API endpoint includes CORS headers
- Check that request is going to `/api/tts`
- Verify Vercel deployment includes the endpoint

### Audio Not Playing

**Error**: Audio element fails to play
- Check browser console for errors
- Verify base64 audio data is valid
- Try different browser (Chrome recommended)

### Rate Limiting

**Error**: "Quota exceeded"
- You've hit the free tier limit
- Enable billing in Google Cloud Console
- Or reduce TTS usage

## Future Enhancements

- [ ] Voice selection dropdown
- [ ] Speed control slider (0.5x - 2x)
- [ ] Audio caching to reduce API calls
- [ ] Batch TTS generation for entire sessions
- [ ] SSML support for better prosody
- [ ] Multiple language support
- [ ] Download audio files
- [ ] Offline mode with pre-generated audio

## Resources

- [Google Cloud TTS Documentation](https://cloud.google.com/text-to-speech/docs)
- [Neural2 Voices](https://cloud.google.com/text-to-speech/docs/voices)
- [Pricing Calculator](https://cloud.google.com/products/calculator)
- [API Reference](https://cloud.google.com/text-to-speech/docs/reference/rest)

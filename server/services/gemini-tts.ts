import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface TTSOptions {
  text: string;
  voice?: "Puck" | "Charon" | "Kore" | "Fenrir" | "Aoede";
  speed?: number; // 0.25 to 4.0
}

/**
 * Generate speech audio using Gemini 2.0 Flash with multimodal live API
 * Note: As of now, Gemini's native TTS is in preview. This uses the multimodal capabilities.
 */
export async function generateSpeechWithGemini(options: TTSOptions): Promise<Buffer> {
  const { text, voice = "Puck", speed = 1.0 } = options;

  try {
    // Use Gemini 2.0 Flash model with audio generation
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
    });

    // For now, we'll use a workaround since direct TTS API might not be available
    // We can use the multimodal generation with audio output
    const prompt = `Convert this text to natural speech: "${text}"`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    // Note: This is a placeholder implementation
    // Gemini's TTS API is still in development
    // For production, we should use Google Cloud Text-to-Speech API
    throw new Error("Gemini native TTS not yet available. Use Google Cloud TTS instead.");
    
  } catch (error) {
    console.error("Gemini TTS error:", error);
    throw error;
  }
}

/**
 * Generate speech using Google Cloud Text-to-Speech API
 * This is the recommended approach for production
 */
export async function generateSpeechWithGoogleTTS(options: TTSOptions): Promise<Buffer> {
  const { text, voice = "en-US-Neural2-J", speed = 1.0 } = options;

  try {
    // Use Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "en-US",
            name: voice,
            ssmlGender: "NEUTRAL",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: speed,
            pitch: 0,
            volumeGainDb: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google TTS API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.audioContent) {
      throw new Error("No audio content received from Google TTS");
    }

    // Convert base64 to buffer
    return Buffer.from(data.audioContent, "base64");
  } catch (error) {
    console.error("Google TTS error:", error);
    throw error;
  }
}

/**
 * Enhanced TTS using Gemini for natural language processing
 * and Google Cloud TTS for audio generation
 */
export async function generateEnhancedSpeech(text: string): Promise<Buffer> {
  try {
    // Step 1: Use Gemini to enhance/optimize the text for speech
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
    });

    const enhancementPrompt = `Optimize this text for natural speech synthesis. 
Make it flow better when spoken aloud, add appropriate pauses (use commas), 
and ensure it sounds conversational. Keep the meaning intact.

Text: ${text}

Return only the optimized text, nothing else.`;

    const result = await model.generateContent(enhancementPrompt);
    const enhancedText = result.response.text().trim();

    // Step 2: Generate speech using Google Cloud TTS
    return await generateSpeechWithGoogleTTS({
      text: enhancedText,
      voice: "en-US-Neural2-J",
      speed: 0.95,
    });
  } catch (error) {
    console.error("Enhanced speech generation error:", error);
    // Fallback to direct TTS without enhancement
    return await generateSpeechWithGoogleTTS({
      text,
      voice: "en-US-Neural2-J",
      speed: 0.95,
    });
  }
}

import { GoogleGenAI } from "@google/genai";
import type { TopicOutline, QuizQuestion, Flashcard, Explanation } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTopicOutline(
  topic: string,
  difficulty: string,
  learningStyle: string
): Promise<TopicOutline> {
  const systemPrompt = `You are an expert educational content creator. Create a comprehensive learning outline for the topic provided.
The outline should be tailored to ${difficulty} level learners with a ${learningStyle} learning preference.
Generate 5-7 subtopics that build upon each other logically.`;

  const prompt = `Create a detailed learning outline for: "${topic}"

Difficulty Level: ${difficulty}
Learning Style: ${learningStyle}

Provide a structured outline with subtopics, descriptions, estimated duration for each, and total estimated time.
Make it engaging and appropriate for the difficulty level.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          topic: { type: "string" },
          estimatedTime: { type: "string" },
          difficulty: { type: "string" },
          subtopics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                duration: { type: "string" },
                order: { type: "number" },
              },
              required: ["id", "title", "description", "duration", "order"],
            },
          },
        },
        required: ["topic", "estimatedTime", "difficulty", "subtopics"],
      },
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (!rawJson) {
    throw new Error("Empty response from Gemini");
  }

  const outline: TopicOutline = JSON.parse(rawJson);
  return outline;
}

export async function generateQuizQuestions(
  topic: string,
  subtopic: string,
  difficulty: string
): Promise<QuizQuestion[]> {
  const systemPrompt = `You are an expert quiz creator. Generate engaging, educational quiz questions that test understanding.
Create questions with real-life examples and clear explanations.
Mix question types: multiple-choice, true-false, and fill-in-the-blank.`;

  const prompt = `Create 5 quiz questions about "${subtopic}" within the broader topic of "${topic}".
Difficulty level: ${difficulty}

For each question, provide:
- The question text
- Question type (multiple-choice, true-false, or fill-blank)
- Options (for multiple choice, provide 4 options)
- The correct answer
- A clear explanation of why it's correct
- A real-life example that illustrates the concept`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                type: { type: "string", enum: ["multiple-choice", "true-false", "fill-blank"] },
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correctAnswer: { type: "string" },
                explanation: { type: "string" },
                realLifeExample: { type: "string" },
              },
              required: ["id", "type", "question", "correctAnswer", "explanation", "realLifeExample"],
            },
          },
        },
        required: ["questions"],
      },
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (!rawJson) {
    throw new Error("Empty response from Gemini");
  }

  const data = JSON.parse(rawJson);
  return data.questions;
}

export async function generateFlashcards(
  topic: string,
  subtopic: string,
  difficulty: string
): Promise<Flashcard[]> {
  const systemPrompt = `You are an expert at creating effective flashcards for learning.
Create concise, memorable flashcards that focus on key concepts.
Include hints and practical examples to aid retention.`;

  const prompt = `Create 8 flashcards about "${subtopic}" within the broader topic of "${topic}".
Difficulty level: ${difficulty}

For each flashcard:
- Front: A clear question or concept to recall
- Back: The answer or explanation (concise but complete)
- Hint: A helpful hint to guide thinking (optional)
- Example: A practical example of the concept in use`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                front: { type: "string" },
                back: { type: "string" },
                hint: { type: "string" },
                example: { type: "string" },
              },
              required: ["id", "front", "back"],
            },
          },
        },
        required: ["flashcards"],
      },
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (!rawJson) {
    throw new Error("Empty response from Gemini");
  }

  const data = JSON.parse(rawJson);
  return data.flashcards;
}

export async function generateExplanation(
  concept: string,
  context: string,
  difficulty: string
): Promise<Explanation> {
  const systemPrompt = `You are an expert teacher who excels at breaking down complex concepts into simple, understandable explanations.
Use analogies, real-life examples, and clear language appropriate for the difficulty level.`;

  const prompt = `Explain the concept: "${concept}" in the context of "${context}".
Difficulty level: ${difficulty}

Provide:
1. A simple, clear explanation
2. An analogy that makes it easy to understand
3. 2-3 real-life examples where this concept applies
4. 3-4 key takeaways to remember
5. Common mistakes people make with this concept`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          concept: { type: "string" },
          simpleExplanation: { type: "string" },
          analogy: { type: "string" },
          realLifeExamples: { type: "array", items: { type: "string" } },
          keyTakeaways: { type: "array", items: { type: "string" } },
          commonMistakes: { type: "array", items: { type: "string" } },
        },
        required: ["concept", "simpleExplanation", "analogy", "realLifeExamples", "keyTakeaways"],
      },
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (!rawJson) {
    throw new Error("Empty response from Gemini");
  }

  const explanation: Explanation = JSON.parse(rawJson);
  return explanation;
}


import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A concise, one-paragraph summary of the conversation's content." },
        sentimentFlow: {
            type: Type.ARRAY,
            description: "An array of objects, each representing a segment of the conversation with sentiment and justification.",
            items: {
                type: Type.OBJECT,
                properties: {
                    time_marker: { type: Type.STRING, description: 'A label for the conversation segment (e.g., "Start", "Middle", "End").' },
                    sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"], description: "The dominant sentiment of this segment." },
                    justification: { type: Type.STRING, description: "A brief explanation for the assigned sentiment." },
                },
                required: ["time_marker", "sentiment", "justification"],
            },
        },
        speakingPace: {
            type: Type.OBJECT,
            description: "An analysis of the speaker's pace.",
            properties: {
                wpm: { type: Type.NUMBER, description: "Calculated words per minute." },
                assessment: { type: Type.STRING, description: 'Qualitative assessment of the pace (e.g., "Slightly fast", "Conversational", "Slow").' },
            },
            required: ["wpm", "assessment"],
        },
        clarity: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER, description: "A score from 1-10 on clarity." },
                feedback: { type: Type.STRING, description: "Brief feedback on the speaker's clarity." },
            },
            required: ["score", "feedback"],
        },
        confidence: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER, description: "A score from 1-10 on confidence." },
                feedback: { type: Type.STRING, description: "Brief feedback on the speaker's confidence." },
            },
            required: ["score", "feedback"],
        },
        actionableInsights: {
            type: Type.ARRAY,
            description: "An array of 2-3 specific, actionable tips for the speaker.",
            items: { type: Type.STRING },
        },
    },
    required: ["summary", "sentimentFlow", "speakingPace", "clarity", "confidence", "actionableInsights"],
};


export const analyzeConversation = async (transcript: string, durationInSeconds: number): Promise<AnalysisResult> => {
  if (!transcript.trim()) {
    throw new Error("Transcript is empty.");
  }
  
  const wordCount = transcript.trim().split(/\s+/).length;
  const minutes = durationInSeconds / 60;
  const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

  const prompt = `
    You are an expert communication coach. Analyze the following conversation transcript from a single speaker.
    The total duration of the recording was approximately ${Math.round(durationInSeconds)} seconds, and the speaker said ${wordCount} words, resulting in a pace of about ${wpm} words per minute.

    Transcript:
    ---
    ${transcript}
    ---

    Provide a detailed analysis based on the transcript and the calculated speaking pace. Your analysis should include:
    1.  **summary**: A concise, one-paragraph summary of the conversation's content.
    2.  **sentimentFlow**: An array of objects for the "Start", "Middle", and "End" of the conversation. Each object must have a 'time_marker', a 'sentiment' ('positive', 'neutral', 'negative'), and a 'justification'.
    3.  **speakingPace**: An analysis of the speaker's pace. It must be an object with the calculated 'wpm' of ${wpm}, and an 'assessment' string.
    4.  **clarity**: A score from 1-10 on clarity, with brief 'feedback'.
    5.  **confidence**: A score from 1-10 on confidence, with brief 'feedback'.
    6.  **actionableInsights**: An array of 2-3 specific, actionable tips for the speaker to improve their communication, based directly on the transcript.

    The entire response must be a single JSON object that conforms to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("API returned an empty response.");
    }

    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from AI. The model may have returned an invalid response.");
  }
};

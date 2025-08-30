
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "A question or key term from the text.",
      },
      answer: {
        type: Type.STRING,
        description: "The corresponding answer or definition for the question/term.",
      },
    },
    required: ["question", "answer"],
  },
};

export async function generateFlashcardsFromText(text: string): Promise<Flashcard[]> {
  const prompt = `
    Analyze the following study material. Identify the most important concepts, definitions, and key information.
    Based on this analysis, generate a concise set of flashcards. Each flashcard should have a clear 'question' (a term or concept) and a corresponding 'answer' (its definition or explanation).
    Focus on creating high-quality, effective study aids.

    Study Material:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    if (!Array.isArray(parsedData)) {
      throw new Error("AI response was not in the expected array format.");
    }

    return parsedData.map((card: any, index: number) => ({
      id: `card-${Date.now()}-${index}`,
      question: card.question,
      answer: card.answer,
    }));

  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. The AI model may be temporarily unavailable or the input text could not be processed.");
  }
}

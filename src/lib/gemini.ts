import { GoogleGenerativeAI } from "@google/generative-ai";

// Export a function or instantiate lazily
let genAI: GoogleGenerativeAI | null = null;

export const getGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

export default getGemini;

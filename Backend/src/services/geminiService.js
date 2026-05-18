import { geminiModel } from '../config/gemini.js';
import { buildPrompt } from './promptService.js';

export const generateContent = async (type, userPrompt) => {

  // Build optimized + templated prompt
  const { finalPrompt, optimizedPrompt } = buildPrompt(type, userPrompt);

  // Call Gemini with optimized prompt
  const result = await geminiModel.generateContent(finalPrompt);
  const content = result.response.text();

  return { content, optimizedPrompt };
};
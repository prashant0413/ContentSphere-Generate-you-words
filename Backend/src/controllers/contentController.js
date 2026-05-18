import { generateContent } from '../services/geminiService.js';
import {
  getFromRedis, saveToRedis,
  getFromMySQL, saveToMySQL
} from '../services/cacheService.js';

export const generateContentHandler = async (req, res) => {
  try {
    const { type, prompt } = req.body;

    // Validate input
    if (!type || !prompt) {
      return res.status(400).json({
        success: false,
        message: 'Both "type" and "prompt" are required'
      });
    }

    if (!['email', 'blog'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "email" or "blog"'
      });
    }

    // Step 1: Check L1 Redis cache
    const redisContent = await getFromRedis(type, prompt);
    if (redisContent) {
      return res.status(200).json({
        success: true,
        source: 'redis_cache',
        type,
        prompt,
        content: redisContent
      });
    }

    // Step 2: Check L2 MySQL cache
    const mysqlContent = await getFromMySQL(type, prompt);
    if (mysqlContent) {
      await saveToRedis(type, prompt, mysqlContent);
      return res.status(200).json({
        success: true,
        source: 'mysql_cache',
        type,
        prompt,
        content: mysqlContent
      });
    }

    // Step 3: Call Gemini with optimized prompt
    console.log(`🤖 Calling Gemini for ${type}: "${prompt}"`);
    const { content, optimizedPrompt } = await generateContent(type, prompt);

    // Step 4: Save to both caches
    await saveToRedis(type, prompt, content);
    await saveToMySQL(type, prompt, content, optimizedPrompt);

    return res.status(200).json({
      success: true,
      source: 'gemini_api',
      type,
      prompt,
      optimizedPrompt,   // ← shows what was sent to Gemini
      content
    });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
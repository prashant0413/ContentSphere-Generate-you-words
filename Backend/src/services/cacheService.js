import CachedContent from '../models/CachedContent.js';
import { generateHash } from '../utils/hashUtils.js';
import redisClient from '../config/redis.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const REDIS_TTL = parseInt(process.env.REDIS_TTL_SECONDS) || 86400;

// ─── L1: Redis ───────────────────────────────────────────

export const getFromRedis = async (type, prompt) => {
  try {
    const key = `content:${generateHash(type, prompt)}`;
    const cached = await redisClient.get(key);
    if (cached) {
      console.log('✅ Redis cache hit!');
      return cached;
    }
    return null;
  } catch (error) {
    console.error('❌ Redis get error:', error.message);
    return null;
  }
};

export const saveToRedis = async (type, prompt, content) => {
  try {
    const key = `content:${generateHash(type, prompt)}`;
    await redisClient.setEx(key, REDIS_TTL, content);
    console.log('✅ Saved to Redis');
  } catch (error) {
    console.error('❌ Redis save error:', error.message);
  }
};

// ─── L2: MySQL ───────────────────────────────────────────

export const getFromMySQL = async (type, prompt) => {
  try {
    const promptHash = generateHash(type, prompt);
    const cached = await CachedContent.findOne({ where: { promptHash } });
    if (cached) {
      console.log('✅ MySQL cache hit!');
      return cached.content;
    }
    return null;
  } catch (error) {
    console.error('❌ MySQL get error:', error.message);
    return null;
  }
};

export const saveToMySQL = async (type, prompt, content, optimizedPrompt = null) => {
  try {
    const promptHash = generateHash(type, prompt);
    await CachedContent.create({
      type,
      prompt,
      optimizedPrompt,   // ✅ save optimized prompt
      content,
      promptHash
    });
    console.log('✅ Saved to MySQL');
  } catch (error) {
    console.error('❌ MySQL save error:', error.message);
  }
};
import crypto from 'crypto';

export const generateHash = (type, prompt) => {
  const normalized = `${type}:${prompt.toLowerCase().trim()}`;
  return crypto.createHash('sha256').update(normalized).digest('hex');
};
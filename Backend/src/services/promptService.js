// ─── PROMPT OPTIMIZER ────────────────────────────────────
// Cleans and shortens the user prompt before sending to Gemini

const optimizePrompt = (prompt) => {
  let optimized = prompt

    // Remove filler words
    .replace(/\b(please|kindly|could you|can you|i want|i need|i would like|just|very|really|actually|basically|honestly|literally)\b/gi, '')

    // Remove extra punctuation
    .replace(/[!]{2,}/g, '!')
    .replace(/[.]{2,}/g, '.')
    .replace(/[?]{2,}/g, '?')

    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  return optimized;
};


// ─── EMAIL TEMPLATE ──────────────────────────────────────

const emailTemplate = (optimizedPrompt) => {
  return `Write a professional email.
Topic: ${optimizedPrompt}
Requirements:
- Subject line
- Greeting
- Body (2-3 short paragraphs)
- Professional closing
Keep it concise.`;
};


// ─── BLOG TEMPLATE ───────────────────────────────────────

const blogTemplate = (optimizedPrompt) => {
  return `Write a blog post.
Topic: ${optimizedPrompt}
Requirements:
- Catchy title
- Introduction (2-3 sentences)
- 3 main sections with headings
- Conclusion (2-3 sentences)
Keep it informative and concise.`;
};


// ─── MAIN FUNCTION ───────────────────────────────────────

export const buildPrompt = (type, userPrompt) => {

  // Step 1: Optimize the prompt
  const optimized = optimizePrompt(userPrompt);

  // Step 2: Apply template based on type
  let finalPrompt = '';
  if (type === 'email') {
    finalPrompt = emailTemplate(optimized);
  } else if (type === 'blog') {
    finalPrompt = blogTemplate(optimized);
  }

  // Step 3: Log token savings
  console.log(`📝 Original prompt  : "${userPrompt}" (${userPrompt.length} chars)`);
  console.log(`✅ Optimized prompt : "${optimized}" (${optimized.length} chars)`);
  console.log(`📦 Final prompt     : ${finalPrompt.length} chars`);

  return {
    optimizedPrompt: optimized,   // save this to DB
    finalPrompt                    // send this to Gemini
  };
};
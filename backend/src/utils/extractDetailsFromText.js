import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

export async function extractDetailsFromText(text) {
  const prompt = `Extract key details from the following job posting text.
Respond ONLY with a JSON code block using this exact shape:
\`\`\`json
{ "title": "...", "company": "...", "location": "...", "skills": ["...", ...], "summary": "..." }
\`\`\`
- skills: 5–7 items max
- summary: 120 words max

Job posting:
${text}`;

  const response = await openai.responses.create({
    model: MODEL,
    input: prompt,
    max_output_tokens: 1000,
  });

  const cleaned = response.output_text
    .replace(/```json\s*/i, '')
    .replace(/```$/, '')
    .trim();
  return JSON.parse(cleaned);
}
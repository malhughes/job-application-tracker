import OpenAI from 'openai';
import dotenv from 'dotenv';
import Application from '../models/Application.js';
import { scrapeJobPosting } from '../utils/scrapeJobDescription.js';
import { extractDetailsFromText } from '../utils/extractDetailsFromText.js';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('❌ Missing OPENAI_API_KEY in environment variables.');
}

const MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractJobDetails(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Missing url field.' });
    }

    const jobText = await scrapeJobPosting(url);
    const data = await extractDetailsFromText(jobText);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in extractJobDetails controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

export async function generateFollowupEmail(req, res) {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) return res.status(404).json({ message: 'Application not found' });

    const { status, nextStep } = application;
    const { title, company } = application.jobDetails;

    const prompt = `Write a concise, professional follow-up email template (75-120 words) based on the following job application details.

    Job title: ${title}
    Company name: ${company}
    Current application status: ${status}
    Next step or goal: ${nextStep}

    The email should:
    - Sound polite and confident, not pushy
    - Be formatted for easy copy-paste into an email client
    - Include a short greeting, brief mention of the role, and a respectful close
    Do not include placeholders like [Your Name]; just write the body text.`;

    const response = await openai.responses.create({
      model: MODEL,
      input: prompt,
      max_output_tokens: 500,
    });

    res.status(200).json({
      email: response.output_text.trim(),
    });
  } catch (error) {
    console.error('Error in generateFollowupEmail controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

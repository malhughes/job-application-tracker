import OpenAI from 'openai';
import dotenv from 'dotenv';
import Application from '../models/Application.js';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('❌ Missing OPENAI_API_KEY in environment variables.');
}

const MODEL = process.env.AI_MODEL || 'gpt-5-nano';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractJobDetails(req, res) {
  try {
    const job_description = typeof req.body === 'string' ? req.body : req.body.text;

    if (!job_description) {
      return res.status(404).json({ message: 'Missing job description text.' });
    }

    const prompt = `Extract key details from the following job description.
    Return JSON with keys: title, company, location, skills (5-7 items max), and summary (<= 120 words).

    Job description:
    ${job_description}`;

    const response = await openai.responses.create({
      model: MODEL,
      input: prompt,
      max_output_tokens: 1000,
    });

    const output = response.output_text;
    let data = undefined;
    try {
      data = JSON.parse(output);
    } catch {
      data = { rawText: output };
    }
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

    const { title, company, status, nextStep } = application;

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

// integrate in later version
/* export async function generateResumeBullets(req, res) {
  try {
    const { job_description, skills } = req.body;

    if (!job_description || !skills) {
      return res.status(404).json({ message: 'Missing job description or skills.' });
    }

    const prompt = `Based on this job description and set of skills, generate 3-5 professional resume bullet points.
    Respond as JSON: {"bullet_points" : [...]}
    
    job_description:
    ${job_description}
    
    skills:
    ${skills}`;
  } catch (error) {
    console.error('Error in extractJobDetails controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
} */

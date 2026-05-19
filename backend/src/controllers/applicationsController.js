import Application from '../models/Application.js';
import { scrapeJobPosting } from '../utils/scrapeJobDescription.js';
import { extractDetailsFromText } from '../utils/extractDetailsFromText.js';

export async function getApplications(req, res) {
  const user_id = req.user._id;
  try {
    const applications = await Application.find({ user_id }).sort({ updatedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error in getApplications controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

export async function getApplicationById(req, res) {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json(application);
  } catch (error) {
    console.error('Error in getApplicationById controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

export async function createApplication(req, res) {
  try {
    const user_id = req.user._id;
    const { title, company, link, status, nextStep } = req.body;

    if (link) {
      const existing = await Application.findOne({ user_id, link });
      if (existing) {
        return res.status(409).json({ message: 'An application with that link already exists.' });
      }
    }

    const application = new Application({ title, company, link, status, nextStep, user_id });

    const savedApplication = await application.save();

    if (link) {
      try {
        const rawText = await scrapeJobPosting(link);
        const aiData = await extractDetailsFromText(rawText);
        savedApplication.location = aiData.location;
        savedApplication.skills = aiData.skills;
        savedApplication.aiSummary = aiData.summary;
        savedApplication.aiExtracted = true;
        await savedApplication.save();
      } catch (aiError) {
        console.error('AI extraction failed:', aiError.message);
        res.set('X-AI-Extraction', 'failed');
      }
    }

    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error in createApplication controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

export async function updateApplication(req, res) {
  try {
    const { title, company, status, nextStep } = req.body;
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { title, company, status, nextStep },
      { new: true }
    );

    if (!updatedApplication) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Error in updateApplication controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

export async function deleteApplication(req, res) {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);

    if (!deletedApplication) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json({ message: 'Application succuessfully deleted' });
  } catch (error) {
    console.error('Error in deleteApplication controller', error);
    res.status(500).json({ message: 'Internal error' });
  }
}

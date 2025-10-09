import Application from '../models/Application.js';

export async function getApplications(req, res) {
  try {
    const applications = await Application.find().sort({ updatedAt: -1 });
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
    const { title, company, status, nextStep } = req.body;
    const application = new Application({ title, company, status, nextStep });

    const savedApplication = await application.save();
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

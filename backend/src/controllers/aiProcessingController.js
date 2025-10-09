export const extractJobDetails = (req, res) => {
  res.status(200).send('You successfully extracted job details');
};

export const generateResumeBullets = (req, res) => {
  res.status(200).send('You successfully logged generated resume bullet points');
};

export const generateFollowupEmail = (req, res) => {
  res.status(200).send('You successfully logged generated follow-up email');
};

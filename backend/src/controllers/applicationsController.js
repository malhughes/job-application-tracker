export const getApplications = (req, res) => {
  res.status(200).send('You got the applicaitons');
};

export const getApplicationById = (req, res) => {
  res.status(200).send('You got the applicaiton');
};

export const createApplication = (req, res) => {
  res.status(200).send('You successfully created an application');
};

export const updateApplication = (req, res) => {
  res.status(200).send('You successfully updated the application');
};

export const deleteApplication = (req, res) => {
  res.status(200).send('You successfully deleted the application');
};

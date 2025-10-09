export const login = (req, res) => {
  res.status(200).send('You successfully logged in');
};

export const register = (req, res) => {
  res.status(200).send('You successfully registered');
};

export const logout = (req, res) => {
  res.status(200).send('You successfully logged out');
};

export const getMe = (req, res) => {
  res.status(200).send('Welcome back');
};

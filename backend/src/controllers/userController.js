import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

export async function signUp(req, res) {
  try {
    const { email, password, name } = req.body;

    const user = await User.signup(email, password, name);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error in signUp controller', error);
    res.status(500).json({ message: error.message });
  }
  res.status(200).send('You successfully registered');
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.signin(email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error in signIn controller', error);
    res.status(500).json({ message: error.message });
  }
  res.status(200).send('You successfully logged in');
}

export async function signOut(req, res) {
  res.status(200).send('You successfully logged out');
}

export async function getMe(req, res) {
  res.status(200).send('Welcome back');
}

export async function googleAuth(req, res) {
  try {
    const { googleId, email, name } = req.body;

    const user = await User.googleAuth(googleId, email, name);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error in googleAuth controller', error);
    res.status(400).json({ message: error.message });
  }
}

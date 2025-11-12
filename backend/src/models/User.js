import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Not required for Google OAuth users
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
  },
  name: {
    type: String,
    required: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
});

// static signup
userSchema.statics.signup = async function (email, password, name) {
  // validation
  if (!email || !password || !name) throw Error('Email, password, and name required');

  if (!validator.isEmail(email)) throw Error('Email is invalid');

  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

  const userExists = await this.findOne({ email });

  if (userExists) throw Error('Email already in use');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, name });

  return user;
};

// static signin
userSchema.statics.signin = async function (email, password) {
  if (!email || !password) throw Error('Email and password required');

  const user = await this.findOne({ email });

  if (!user) throw Error('Incorrect email');

  if (user.authProvider === 'google') throw Error('Please sign in with Google');

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw Error('Incorrect password');

  return user;
};

// static google auth
userSchema.statics.googleAuth = async function (googleId, email, name) {
  // Check if user exists with Google ID
  let user = await this.findOne({ googleId });

  if (user) return user;

  // Check if user exists with email (from local auth)
  user = await this.findOne({ email });

  if (user && user.authProvider === 'local') {
    throw Error('Email already registered with password. Please sign in with email and password.');
  }

  // Create new user
  user = await this.create({
    email,
    googleId,
    name,
    authProvider: 'google',
  });

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;

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
    required: true,
  },
});

// static signup
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) throw Error('Email and password required');

  if (!validator.isEmail(email)) throw Error('Email is invalid');

  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

  const userExists = await this.findOne({ email });

  if (userExists) throw Error('Email already in use');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// static signin
userSchema.statics.signin = async function (email, password) {
  if (!email || !password) throw Error('Email and password required');

  const user = await this.findOne({ email });

  if (!user) throw Error('Incorrect email');

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw Error('Incorrect password');

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;

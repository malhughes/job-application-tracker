import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    nextStep: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;

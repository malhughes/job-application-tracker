import mongoose from 'mongoose';

const jobDetailsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String },
    location: { type: String },
    compensation: {
      type: [{ label: String, range: String, _id: false }],
      default: null,
    },
    skills: { type: [String], default: [] },
    aiSummary: { type: String },
    aiExtracted: { type: Boolean, default: false },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    nextStep: { type: String, required: true },
    jobDetails: { type: jobDetailsSchema, required: true },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;

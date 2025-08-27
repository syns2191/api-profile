import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  projectTitle: String,
  projectShortDescription: String,
  projectImage: String,
  projectDemoLink: String,
  projectCodeLink: String,
  projectTeachStack: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TechStack'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
    timestamps: true
  });

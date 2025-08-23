import * as mongoose from 'mongoose';

export const TechStackSchema = new mongoose.Schema({
  stackName: {
    type: String,
    required: true,
    unique: true
  },
  stackIcon: String
});

export const TechStackCategorySchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCategories'},
  stack: { type: mongoose.Schema.Types.ObjectId, ref: 'TechStack'}
});

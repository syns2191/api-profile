import * as mongoose from 'mongoose';

export const SkillCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    unique: true,
    required: true
  },
});

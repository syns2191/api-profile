import { Document } from "mongoose";

export interface ISkillCategory extends Document {
  categoryName: string;
}

export interface ISkillCategoryFilter {
  categoryName?: string;
  page?: number;
  limit?: number;
}

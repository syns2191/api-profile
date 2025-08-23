import { Mongoose } from "mongoose";
import { SkillCategorySchema } from "./schemas/skill-category.schema";

export const skillCategoryProviders = [
  {
    provide: 'SKILL_CATEGORIES_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('SkillCategories', SkillCategorySchema),
    inject: ['DATABASE_CONNECTION'],
  }
]

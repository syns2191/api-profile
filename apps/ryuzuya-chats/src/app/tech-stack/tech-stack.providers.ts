import { Mongoose } from "mongoose";
import { TechStackCategorySchema, TechStackSchema } from "./schemas/tech-stack.schema";

export const techStackProviders = [
  {
    provide: 'TECH_STACK_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('TechStack', TechStackSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'TECH_STACK_CATEGORY_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('TechStackCategory', TechStackCategorySchema),
    inject: ['DATABASE_CONNECTION'],
  }
]

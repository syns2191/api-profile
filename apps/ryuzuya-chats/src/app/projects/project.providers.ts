import { Mongoose } from "mongoose";
import { ProjectSchema } from './schemas/project.schema';

export const projectProviders = [
  {
    provide: 'PROJECT_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Projects', ProjectSchema),
    inject: ['DATABASE_CONNECTION'],
  }
]

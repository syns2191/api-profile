import { Mongoose } from "mongoose";
import { IntegrationSchema } from "./schemas/integration.schema";

export const integrationProviders = [
  {
    provide: 'INTEGRATION_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Integration', IntegrationSchema),
    inject: ['DATABASE_CONNECTION'],
  }
]

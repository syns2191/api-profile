import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (config: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(config.get<string>('MONGO_CONNECTION_STRING')),
    inject: [ConfigService]
  },
];

import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
export const BullRedisConnToken = Symbol('BullRedisConn');

export const BullRedisConnProviders = {
  provide: BullRedisConnToken,
  useFactory: (config: ConfigService) => {
    const redisHost = config.get<string>('REDIS_HOST');
    const redisPort = config.get<string>('REDIS_PORT');
    const redisPassword = config.get<string>('REDIS_PASSWORD');
    return new IORedis(`redis://:${redisPassword}@${redisHost}:${redisPort}`, { maxRetriesPerRequest: null })
  },
  inject: [ConfigService]
}

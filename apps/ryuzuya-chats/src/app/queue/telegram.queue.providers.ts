import { Provider } from "@nestjs/common";
import { Queue, QueueEvents } from "bullmq";
import type IORedis from 'ioredis';
import { BullRedisConnToken } from "./bul.queue.providers";

export const TelegramQueueToken = Symbol('TelegramQueue');
// export const TelegramQueueEventsToken = Symbol('TelegramQueueEvents');

export const TelegramQueueProviders: Provider = {
  provide: TelegramQueueToken,
  useFactory: (connection: IORedis) => new Queue('telegram', {
    connection,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: 100
    }
  }),
  inject: [BullRedisConnToken]
}

// export const TelegramQueueEventsProviders: Provider = {
//   provide: TelegramQueueEventsToken,
//   useFactory: (connection: IORedis) => new QueueEvents('telegram', { connection }),
//   inject: [BullRedisConnToken]
// }

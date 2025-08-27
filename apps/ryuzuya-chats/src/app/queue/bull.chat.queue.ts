import { Provider } from "@nestjs/common";
import { Queue } from "bullmq";
import type IORedis from 'ioredis';
import { BullRedisConnToken } from "./bul.queue.providers";

export const ChatQueueToken = Symbol('ChatQueue');

export const ChatQueueProviders: Provider = {
  provide: ChatQueueToken,
  useFactory: (connection: IORedis) => new Queue('chat-queue', {
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

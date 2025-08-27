import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { BullRedisConnProviders, BullRedisConnToken } from './bul.queue.providers';
import {  TelegramQueueProviders, TelegramQueueToken } from './telegram.queue.providers';
import type IORedis from 'ioredis';
import { ChatQueueProviders, ChatQueueToken } from './bull.chat.queue';

@Module({
  providers: [BullRedisConnProviders, TelegramQueueProviders, ChatQueueProviders],
  exports: [TelegramQueueToken, BullRedisConnToken, ChatQueueToken]
})
export class QueueModule implements OnModuleDestroy {
  constructor(
    @Inject(BullRedisConnToken)
    private readonly conn: IORedis
  ) {}
  async onModuleDestroy() {
    await this.conn.quit()
  }
}

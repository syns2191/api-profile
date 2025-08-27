import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { RedisService } from '../adapters/redis.service';

@Module({
  providers: [RedisService, PresenceService],
  controllers: [PresenceController],
  exports: [PresenceService, RedisService]
})
export class PresenceModule {}

import { Injectable } from '@nestjs/common';
import { RedisService } from '../adapters/redis.service';
import { REDIS_KEY, TTL_SECONDS } from './presence.constant';

@Injectable()
export class PresenceService {
  constructor(
    private redis: RedisService
  ) { }

  refresh() {
    return this.redis?.clientOrThrow.set(REDIS_KEY, '1', { EX: TTL_SECONDS });
  }
  isOnline() {
    return this.redis?.clientOrThrow?.get(REDIS_KEY).then(Boolean);
  }
}

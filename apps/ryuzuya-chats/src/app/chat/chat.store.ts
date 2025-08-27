import { Injectable } from "@nestjs/common";
import { RedisService } from "../adapters/redis.service";
// For production, back this with Redis or DB.
export type Conversation = {
  id: string;
  socketId?: string;   // active visitor socket
  lastVisitorName?: string;
  guestId?: string;
};

@Injectable()
export class MemoryStore {
  constructor(
    private readonly redis: RedisService
  ) {}

  async upsert(c: Conversation) {
    const cachedValue = await this.redis?.clientOrThrow?.get(`${c.id}`);
    const cachedValueParsed = cachedValue ? JSON.parse(cachedValue.toString()) : {};
    this.redis?.clientOrThrow?.set(`${c.id}`, JSON.stringify({ ...c, ...cachedValueParsed }), { EX: 30_000 } )
  }

  async get(id: string) {
    const cachedValue = await this.redis.clientOrThrow.get(`${id}`);
    const cachedValueParsed = cachedValue ? JSON.parse(cachedValue.toString()) : {};
    return cachedValueParsed;
  }
}

import { Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
  private pubClient: RedisClientType;
  attach(client: RedisClientType) {
    console.log('client', client);
    this.pubClient = client;
  }

  get clientOrThrow(): RedisClientType {
    if (!this.pubClient) throw new Error('Redis not attached');
    return this.pubClient;
  }
}

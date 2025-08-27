
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;
  constructor(
    app: INestApplicationContext,
    private config: ConfigService
  ) {
    super(app)
  }

  async connectToRedis(): Promise<void> {
    const redisHost = this.config.get<string>('REDIS_HOST');
    const redisPort = this.config.get<string>('REDIS_PORT');
    const redisPassword = this.config.get<string>('REDIS_PASSWORD');
    this.pubClient = createClient({ url: `redis://:${redisPassword}@${redisHost}:${redisPort}` });
    this.subClient = this.pubClient.duplicate();

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient, { key: 'chat-key'});
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }

  getRedis(): RedisClientType {
    return this.pubClient;
  }
}


import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

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
    const pubClient = createClient({ url: `redis://:${redisPassword}@${redisHost}:${redisPort}`});
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RedisIoAdapter } from './app/adapters/redis.adapter';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './app/adapters/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configSercice = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors({ origin: '*', credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  const redisIoAdapter = new RedisIoAdapter(app, configSercice);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // attach redis
  const redisService = app.get(RedisService);
  console.log(redisService);
  redisService.attach(redisIoAdapter.getRedis());
  const port = process.env.PORT || 3034;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

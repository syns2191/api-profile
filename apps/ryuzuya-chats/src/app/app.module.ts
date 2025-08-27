import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chat/chat.module';
import { UserModule } from './users/user.module';
import { SkillCategoryModule } from './skill-categories/skill-category.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import { ProjectModule } from './projects/project.module';
import { TelegramController } from './telegram/telegram.controller';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { IntegrationModule } from './integrations/integration.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import databaseConfig from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { UploadModule } from './upload/upload.module';
import { RedisService } from './adapters/redis.service';
import { PresenceModule } from './presence/presence.module';
import { OwnerGateway } from './gateway/owner.gateway';
import { QueueModule } from './queue/queue.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig, redisConfig],
    }),
    ChatsModule,
    UserModule,
    SkillCategoryModule,
    TechStackModule,
    ProjectModule,
    TelegramModule,
    IntegrationModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 10,
        },
      ],
    }),
    S3Module,
    UploadModule,
    PresenceModule,
    QueueModule,
    WorkerModule,
  ],
  controllers: [AppController, TelegramController],
  providers: [
    RedisService,
    OwnerGateway,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AppService,
    TelegramService,
  ],
  exports: [RedisService],
})
export class AppModule {}

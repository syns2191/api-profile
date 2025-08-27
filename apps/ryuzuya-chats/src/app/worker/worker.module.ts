import { Module } from '@nestjs/common';
import { IntegrationModule } from '../integrations/integration.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { ChatsModule } from '../chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}), DatabaseModule, IntegrationModule, ChatsModule],
  providers: []
})
export class WorkerModule {}

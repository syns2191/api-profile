import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { IntegrationModule } from '../integrations/integration.module';
import { chatProviders } from './chat.providers';
import { DatabaseModule } from '../database/database.module';
import { ChatController } from './chat.controller';
import { MemoryStore } from './chat.store';
import { PresenceModule } from '../presence/presence.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [IntegrationModule, DatabaseModule, PresenceModule, QueueModule],
  providers: [ChatService, ChatGateway, ...chatProviders, MemoryStore],
  exports: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatsModule {}

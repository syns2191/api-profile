import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { IntegrationModule } from '../integrations/integration.module';

@Module({
  imports: [IntegrationModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway]
})
export class ChatsModule {}

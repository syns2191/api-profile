import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { ChatsModule } from '../chat/chat.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [ChatsModule, QueueModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}


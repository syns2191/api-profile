import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { ChatsModule } from '../chat/chat.module';

@Module({
  imports: [ChatsModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}


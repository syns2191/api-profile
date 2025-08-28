import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import { Queue } from 'bullmq';
import { ChatQueueToken } from '../queue/bull.chat.queue';
import { TelegramUpdate } from '../../interfaces/chat';
import { hash } from '../../libs/util';

@Injectable()
export class TelegramService {
  constructor(
    @Inject(ChatQueueToken)
    private readonly chatQueue: Queue
  ) {}
  async sendMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chatId, text });
  }

  async sendToClient(telegramUpdate: TelegramUpdate) {
    if (!telegramUpdate?.message?.text || !telegramUpdate?.message?.message_id || !telegramUpdate?.message?.reply_to_message?.text) {
      return;
    }
    const newTelegramData: TelegramUpdate = {
      message: {
        from: telegramUpdate?.message?.from,
        message_id: telegramUpdate?.message?.message_id,
        reply_to_message: {
          text: telegramUpdate?.message?.reply_to_message?.text
        },
        text: telegramUpdate?.message?.text,
        chat: telegramUpdate?.message?.chat
      }
    }
    if (!newTelegramData?.message?.text || !newTelegramData?.message?.message_id) {
      return;
    }
    const jobId = `telegram:${newTelegramData?.message?.message_id}:${hash(newTelegramData?.message?.text)}`;
    this.chatQueue.add('telegram:hook', newTelegramData, {
      jobId
    })
  }
}


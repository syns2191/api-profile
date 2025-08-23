import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  async sendMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chatId, text });
  }
}


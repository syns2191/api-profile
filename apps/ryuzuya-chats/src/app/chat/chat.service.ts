import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { isSeriousInquiry } from './utils/intents';
import { MemoryStore } from './chat.store';
import { IntegrationService } from '../integrations/integration.service';
import { ITelegramPayload } from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly integrationService: IntegrationService
  ) {}
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  seriousCheck(text: string) {
    return isSeriousInquiry(text);
  }

  async forwardToEmail(payload: { name: string; email?: string; message: string; conversationId: string; }) {
    const { name, email, message, conversationId } = payload;
    await this.transporter.sendMail({
      from: `"Portfolio Chat" <${'sutralian@gmail.com'}>`,
      to: process.env.EMAIL_TO,
      subject: `🔔 New Inquiry [#${conversationId}] from ${name}`,
      text: `[#${conversationId}] From: ${name}${email ? ` <${email}>` : ''}\n\n${message}\n`,
    });
  }

  async forwardToTelegram(payload: ITelegramPayload) {
    const { name, email, message, conversationId } = payload;
    const telegramCred = await this.integrationService.findByUserChannel(
      payload.profileId,
      'telegram'
    );
    console.log(telegramCred);
    const token = telegramCred.creds?.token;
    const chatId = telegramCred.creds?.chatId;
    const text =
      `📩 New Inquiry [#${conversationId}]\n` +
      `From: ${name}${email ? ` <${email}>` : ''}\n\n` +
      `${message}\n\n` +
      `↩️ Reply in this chat and KEEP [#${conversationId}] in your message.`;

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  }

  registerSocket(conversationId: string, socketId: string, name?: string, guestId?: string) {
    MemoryStore.upsert({ id: conversationId, socketId, lastVisitorName: name, guestId: guestId });
  }
}


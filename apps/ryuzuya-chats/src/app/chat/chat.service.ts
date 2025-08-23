import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { isSeriousInquiry } from './utils/intents';
import { MemoryStore } from './chat.store';
import { IntegrationService } from '../integrations/integration.service';
import { ITelegramPayload } from './interfaces/chat.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly config: ConfigService
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
      from: `"Profile Chat" <${'sutralian@gmail.com'}>`,
      to: process.env.EMAIL_TO,
      subject: `🔔 New Inquiry [#${conversationId}] from ${name}`,
      text: `[#${conversationId}] From: ${name}${email ? ` <${email}>` : ''}\n\n${message}\n`,
    });
  }

  async forwardToTelegram(payload: ITelegramPayload) {
    const telegramAPI = this.config.get<string>('TELEGRAM_API');
    const { name, email, message, conversationId } = payload;
    const telegramCred = await this.integrationService.findByUserChannel(
      payload.profileId,
      'telegram'
    );

    const token = telegramCred.creds?.token;
    const chatId = telegramCred.creds?.chatId;
    const text =
      `📩 New Message [#${conversationId}]\n` +
      `From: ${name}${email ? ` <${email}>` : ''}\n\n` +
      `${message}\n\n` +
      `↩️ Reply with [#${conversationId}].`;

    await axios.post(`${telegramAPI}/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  }

  registerSocket(conversationId: string, socketId: string, name?: string, guestId?: string) {
    MemoryStore.upsert({ id: conversationId, socketId, lastVisitorName: name, guestId: guestId });
  }
}


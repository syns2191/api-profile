import { Inject, Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { isSeriousInquiry } from './utils/intents';
import { MemoryStore } from './chat.store';
import { IntegrationService } from '../integrations/integration.service';
import { IChatMessage, ILastConversationRow, ITelegramPayload } from './interfaces/chat.interface';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { TelegramQueueToken } from '../queue/telegram.queue.providers';
import { Queue } from 'bullmq';
import { emit } from 'process';
import { profile } from 'console';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_MODEL')
    private readonly chatModel: Model<IChatMessage>,
    private readonly integrationService: IntegrationService,
    private readonly config: ConfigService,
    private readonly chatStore: MemoryStore,
    @Inject(TelegramQueueToken)
    private readonly telegramQueue: Queue
  ) { }

  private hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h.toString(16); }

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

  async forwardToQueue(payload: ITelegramPayload) {
    const { name, email, message, conversationId, profileId } = payload;
    const text =
      `📩 New Message [#${conversationId}]\n` +
      `From: ${name}${email ? ` <${email}>` : ''}\n\n` +
      `${message}\n\n` +
      `↩️ Reply with [#${conversationId}].`;

    const jobId = `${conversationId}:${this.hash(message)}`;
    await this.telegramQueue.add('sendToTelegram', {
      message: text,
      profileId
    }, { jobId });
  }

  async registerSocket(conversationId: string, socketId: string, name?: string, guestId?: string) {
    await this.chatStore.upsert({ id: conversationId, socketId, lastVisitorName: name, guestId: guestId });
  }

  async saveMessage(payload: IChatMessage) {
    await this.chatModel.insertOne(payload);
  }

  async findLatestChat(limit: number, page: number, conversationId: string): Promise<IChatMessage[]> {
    const chatList = await this.chatModel.find({
      conversationId
    }).sort({
      createdDate: 'desc'
    }).limit(100).skip(page * limit)
      .sort({
        createdAt: 'asc'
      });
    return chatList;
  }

  async findMyConversationList(profileId: string, limit: number): Promise<ILastConversationRow[]> {
    const chatConversation = await this.chatModel.aggregate([
      { $match: { profileId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          total: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$read', false] },
                    { $ne: ['$sender', profileId] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          conversationId: '$_id',
          lastMessage: {
            _id: '$lastMessage._id',
            name: '$lastMessage.name',
            message: '$lastMessage.message',
            read: '$lastMessage.read',
            createdAt: '$lastMessage.createdAt',
            profileId: '$lastMessage.profileId',
            sender: '$lastMessage.sender',
            to: '$lastMessage.to'
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      { $limit: limit }
    ]);
    return chatConversation;
  }

  async readMessage(conversationId: string, to: string) {
    await this.chatModel.updateOne(
      { conversationId: conversationId, to: to },
      { $set: { read: true } }
    )
  }
}


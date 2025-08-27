import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { PresenceService } from '../presence/presence.service';

interface IVisitor { conversationId?: string; name?: string; guestId?: string, profileId?: string};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chat: ChatService,
    private precenceService: PresenceService
  ) { }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    this.server.emit('message', data);
  }

  @SubscribeMessage('profile:join')
  handleProfileJoin(
    @MessageBody() data: IVisitor,
    @ConnectedSocket() client: Socket
  ) {
    console.log('profile:join', data);
    const chatEvent = `CHAT:${data.profileId}`;
    client.join(`CHAT:${data.profileId}`);
    this.chat.registerSocket(chatEvent, client.id, data.name, data.guestId);
  }

  @SubscribeMessage('visitor:join')
  handleJoin(
    @MessageBody() data: IVisitor,
    @ConnectedSocket() client: Socket
  ) {
    const conversationId = data?.conversationId || randomUUID().slice(0, 8);
    client.join(conversationId);
    this.chat.registerSocket(conversationId, client.id, data?.name, data?.guestId);
    client.emit('system:welcome', { conversationId });
  }

  @SubscribeMessage('admin:join')
  handleAdminJoin(
    @MessageBody() data: IVisitor,
    @ConnectedSocket() client: Socket
  ) {
    const conversationId = data?.conversationId;
    client.join(conversationId);
    this.chat.registerSocket(conversationId, client.id, data?.name, data?.guestId);
  }


  @SubscribeMessage('admin:message')
  async handleAdminMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket) {
    const conversationId = dto.conversationId || randomUUID().slice(0, 8);

    // Ensure client is in room
    client.join(conversationId);

    // Echo to visitor UI (optimistic)
    this.server.to(conversationId).emit('chat:admin:echo', {
      name: dto.name,
      sender: dto.sender,
      to: dto.to,
      message: dto.message,
      createdAt: new Date().toISOString(),
      profileId: dto.profileId,
      conversationId: dto.conversationId
    });
    this.server.to(conversationId).emit('admin:reply', {
      name: dto.name,
      sender: dto.sender,
      to: dto.to,
      message: dto.message,
      createdAt: new Date().toISOString(),
      profileId: dto.profileId,
      conversationId: dto.conversationId
    });
    this.chat.saveMessage({
        name: dto.name,
        message: dto.message,
        conversationId,
        profileId: dto.profileId,
        read: false,
        sender: dto.sender,
        to: dto.to,
        extraContent: dto.extraContent
      });
  }

  @SubscribeMessage('visitor:message')
  async handleVisitorMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket) {
    const conversationId = dto.conversationId || randomUUID().slice(0, 8);

    // Ensure client is in room
    client.join(conversationId);
    const profileConv = `CHAT:${dto.profileId}`;
    client.join(profileConv);

    const prepareMessage = {
      name: dto.name,
      sender: dto.name,
      to: dto.to,
      message: dto.message,
      conversationId: dto.conversationId,
      profileId: dto.profileId,
      createdAt: new Date().toISOString(),
      read: dto.read
    }

    // Echo to visitor UI (optimistic)
    this.server.to(conversationId).emit('chat:echo', prepareMessage);
    this.server.to(conversationId).emit('visitor:message', prepareMessage);
    this.server.to(profileConv).emit('conv:message', prepareMessage);

    // Detect and forward if serious
    const ownerOnline = await this.precenceService.isOnline();
    console.log('ownerOnline', ownerOnline);
    if (this.chat.seriousCheck(dto.message) || !ownerOnline) {
      await this.chat.forwardToQueue({
        name: dto.name,
        email: dto.guestId,
        message: dto.message,
        conversationId,
        profileId: dto.profileId,
        read: false
      });
      // await this.chat.forwardToEmail({ name: dto.name, email: dto.guestId, message: dto.message, conversationId });

      this.server.to(conversationId).emit('system:info',
        { message: 'Thanks! My master is not online and i try to reach out. I’ll reply shortly.' });
    } else {
      // Lightweight auto-reply example
      // this.server.to(conversationId).emit('bot:reply',
      //   { message: "Got it! If this is about a project (budget, timeline), I’ll fast-track it." });
    }

    this.chat.saveMessage({
        name: dto.name,
        message: dto.message,
        conversationId,
        profileId: dto.profileId,
        read: false,
        sender: dto.sender,
        to: dto.to,
        extraContent: dto.extraContent
      });
  }

  @SubscribeMessage('read:message')
  async readMessage(
    @MessageBody('conversationId') conversationId: string,
    @MessageBody('to') to: string,
    @ConnectedSocket() client: Socket
  ) {
    if (conversationId && to) {
      this.chat.readMessage(conversationId, to);
      this.server.to(conversationId).emit('admin:read:message', { conversationId, to });
    }
  }

  @SubscribeMessage('guest:read:message')
  async guestReadMessage(
    @MessageBody('conversationId') conversationId: string,
    @MessageBody('to') to: string,
  ) {
    console.log('guest read message', to);
    if (conversationId && to) {
      this.chat.readMessage(conversationId, to);
      this.server.to(conversationId).emit('guest:read:message', { conversationId, to });
    }
  }
  // Admin replies (from Telegram webhook) land here:
  sendAdminReply(conversationId: string, text: string) {
    this.server.to(conversationId).emit('admin:reply', {
      from: 'admin',
      message: text,
      at: new Date().toISOString(),
    });
  }
}

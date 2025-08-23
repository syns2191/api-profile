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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chat: ChatService
  ) { }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    this.server.emit('message', data);
  }

  @SubscribeMessage('visitor:join')
  handleJoin(
    @MessageBody() data: { conversationId?: string; name?: string; guestId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const conversationId = data?.conversationId || randomUUID().slice(0, 8);
    client.join(conversationId);
    this.chat.registerSocket(conversationId, client.id, data?.name, data?.guestId);
    client.emit('system:welcome', { conversationId });
  }

  @SubscribeMessage('visitor:message')
  async handleVisitorMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket) {
    const conversationId = dto.conversationId || randomUUID().slice(0, 8);

    // Ensure client is in room
    client.join(conversationId);

    // Echo to visitor UI (optimistic)
    this.server.to(conversationId).emit('chat:echo', {
      from: 'visitor',
      message: dto.message,
      at: new Date().toISOString(),
    });

    // Detect and forward if serious
    if (this.chat.seriousCheck(dto.message)) {
      await this.chat.forwardToTelegram({
        name: dto.name,
        email: dto.guestId,
        message: dto.message,
        conversationId,
        profileId: dto.profileId
      });
      // await this.chat.forwardToEmail({ name: dto.name, email: dto.guestId, message: dto.message, conversationId });

      this.server.to(conversationId).emit('system:info',
        { text: 'Thanks! Your inquiry reached me via Telegram. I’ll reply shortly.' });
    } else {
      // Lightweight auto-reply example
      this.server.to(conversationId).emit('bot:reply',
        { text: "Got it! If this is about a project (budget, timeline), I’ll fast-track it." });
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

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatService.findMyConversationList(id, 100);
  }

  @Get(':conversationId')
  async getChatByConversation(@Param('conversationId') id: string) {
    return this.chatService.findLatestChat(100, 0, id);
  }
}

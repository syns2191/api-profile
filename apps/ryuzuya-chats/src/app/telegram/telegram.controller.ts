import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway';

type TelegramUpdate = {
  message?: {
    text?: string;
    message_id: number;
    chat: { id: number; type: string; title?: string; username?: string };
    from?: { id: number; is_bot: boolean; first_name?: string; username?: string };
    reply_to_message?: {
      text?: string;
    }
  };
};

@Controller('telegram')
export class TelegramController {
  constructor(private readonly gateway: ChatGateway) { }

  @Post('webhook')
  @HttpCode(200)
  async webhook(@Body() update: TelegramUpdate) {
    console.log('telegram hook', update?.message?.text);
    const text = update?.message?.text || '';
    const replyToMessage = update?.message?.reply_to_message?.text;
    // Expecting: "... [#abcd1234] ..."
    const match = text.match(/\[#(\w{4,})\]/);
    const matchReply = replyToMessage?.match(/\[#(\w{4,})\]/);
    console.log('match', match);
    console.log('matchReply', matchReply);
    if (!match && !matchReply) return; // ignore unrelated messages

    let conversationId: string;
    if (match?.length > 1) {
      conversationId = match[1];
    }

    if (matchReply?.length > 1) {
      conversationId = matchReply[1];
    }

    const cleanText = text.replace(/\[#\w{4,}\]/g, '').trim();
    console.log('conversationId', conversationId);

    // Push to browser UI
    this.gateway.sendAdminReply(conversationId, cleanText || '(no text)');

    // (Optional) acknowledge in Telegram silently → do nothing to avoid noise
  }
}


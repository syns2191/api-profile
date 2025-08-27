export type TelegramUpdate = {
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

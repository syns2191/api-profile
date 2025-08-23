export interface ITelegramPayload {
  name: string;
  email?: string;
  message: string;
  conversationId: string;
  profileId: string;
}

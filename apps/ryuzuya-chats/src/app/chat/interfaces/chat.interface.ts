export interface ITelegramPayload {
  name: string;
  email?: string;
  message: string;
  conversationId: string;
  profileId: string;
  read: boolean
}

export interface IChatMessage {
  name?: string;
  message: string;
  conversationId: string;
  profileId: string;
  read?: boolean;
  sender: string;
  to: string;
  extraContent?: object;
}

export interface ILastConversationRow {
  conversationId: string;
  lastMessage: {
    _id: string;
    name: string;
    message: string;
    profileId: string;
    read: boolean;
    createdAt: Date;
  };
  unreadCount: number;
  total: number;
};

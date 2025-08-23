
// For production, back this with Redis or DB.
export type Conversation = {
  id: string;
  socketId?: string;   // active visitor socket
  lastVisitorName?: string;
  guestId?: string;
};

export class MemoryStore {
  private static conversations = new Map<string, Conversation>();

  static upsert(c: Conversation) {
    MemoryStore.conversations.set(c.id, { ...MemoryStore.conversations.get(c.id), ...c });
  }
  static get(id: string) {
    return MemoryStore.conversations.get(id);
  }
}

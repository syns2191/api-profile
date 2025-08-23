import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
  name: String,
  message: String,
  conversationId: String,
  guestId: String
});

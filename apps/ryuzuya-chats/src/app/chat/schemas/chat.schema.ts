import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
  name: String,
  message: String,
  extraContent: Object,
  conversationId: String,
  sender: String,
  to: String,
  guestId: String,
  read: Boolean,
  profileId: String
}, {
    timestamps: true
  });
ChatSchema.index({
  conversationId: 1, createdAt: -1
})

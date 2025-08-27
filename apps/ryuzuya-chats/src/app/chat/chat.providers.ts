import { Mongoose } from "mongoose";
import { ChatSchema } from "./schemas/chat.schema";

export const chatProviders = [
  {
    provide: 'CHAT_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Chat', ChatSchema),
    inject: ['DATABASE_CONNECTION'],
  }
]

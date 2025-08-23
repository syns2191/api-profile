import { Document } from "mongoose";

export interface IIntegration extends Document {
  channel: string;
  user: string;
  creds: {
    token?: string;
    chatId?: string;
  }
}

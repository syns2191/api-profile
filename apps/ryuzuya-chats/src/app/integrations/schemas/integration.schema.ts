import * as mongoose from 'mongoose';

export const IntegrationSchema = new mongoose.Schema({
  channel: String,
  creds: {},
  user: String
});

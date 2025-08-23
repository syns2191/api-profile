import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  linkedind: String,
  github: String,
  x: String,
  avatar: String,
  githubUsername: String,
  iseOwner: Boolean,
  profileBranding: String,
  profileDescription: String,
  profileCoverText: String,
  password: String,
  refreshToken: String,
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TechStack',
      index: true
    }
  ]
});

UserSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password
    return ret;
  }
});

UserSchema.set('toObject', {
  transform(_doc, ret) {
    delete ret.password
    return ret;
  }
})

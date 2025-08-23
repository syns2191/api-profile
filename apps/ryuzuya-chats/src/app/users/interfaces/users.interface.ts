import { Document } from "mongoose";

export interface IUser extends Document {
  readonly displayName: string;
  readonly email: string;
  readonly linkedind: string;
  readonly github: string;
  readonly x: string;
  readonly isOwner: boolean;
  readonly profileBranding: string;
  readonly profileDescription: string;
  readonly profileCoverText: string;
  readonly password: string;
  readonly skills: [];
  readonly refreshToken: string;
}

export interface IUserFilter {
  page?: number;
  limit?: number;
  email?: string;
}

export interface IUserSkill {

}

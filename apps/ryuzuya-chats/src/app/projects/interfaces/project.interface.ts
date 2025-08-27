import { Document } from "mongoose";

export interface IProject extends Document {
  readonly projectTitle: string;
  readonly projectShortDescription: string;
  readonly projectImage: string;
  readonly projectDemoLink: string;
  readonly projectCodeLink: string;
  readonly projectTeachStack: string[];
}

export interface IProjectFilter {
  page?: number,
  limit?: number,
  projectTitle?: string,
  user?: string
}

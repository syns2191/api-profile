import { Document } from "mongoose";

export interface ITechStack extends Document {
  stackName: string;
  stackIcon: string;
  categories: [];
}

export interface ITechStackFilter {
  stackName?: string;
  page?: number;
  limit?: number
}

export interface ITechStackCategory extends Document {
  category: string;
  stack: string;
};

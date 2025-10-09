import { Types } from "mongoose";

export interface TUser {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  avatar: string;
  gender: "male" | "female" | "other";
  blockUser?: Types.ObjectId[];
  isDeleted?: boolean;
  needsPasswordChange: boolean;
  passwordChangeAt: Date;
}

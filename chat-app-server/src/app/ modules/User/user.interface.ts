import { Model, Types } from "mongoose";

export interface TUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  avatar: string;
  gender: "male" | "female" | "other";
  isDeleted?: boolean;
  needsPasswordChange: boolean;
  passwordChangeAt: Date;
  lastSeen : Date
}

export interface UserModel extends Model<TUser> {
  isUserExistByCustomEmail(email: string): Promise<TUser>;
  isValidPassword(password: string, hashPassword: string): Promise<boolean>;
  isDeleted(id: string): Promise<TUser>;
  isJWTTokenIssuedBeforePassword(
    issuedAt: number,
    passwordChangeAt: Date
  ): Promise<boolean>;
}

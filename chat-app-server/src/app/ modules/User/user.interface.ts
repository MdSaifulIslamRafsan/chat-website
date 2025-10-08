export interface TUser {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  avatar: string;
  gender: "male" | "female" | "other";
  blockUser: string[];
  isDeleted: boolean;
  needsPasswordChange: boolean;
  passwordChangeAt: Date;
}

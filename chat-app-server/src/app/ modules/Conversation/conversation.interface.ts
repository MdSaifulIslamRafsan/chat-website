import { Types } from "mongoose";

export interface TConversation {
  name: string;
  isGroup: boolean;
  participants: Types.ObjectId[];
  groupAdmin?: Types.ObjectId[];
  isDeleted: boolean;
  lastMessage?: Types.ObjectId;
}

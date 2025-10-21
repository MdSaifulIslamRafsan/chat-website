import { Types } from "mongoose";

export interface TMessage {
  sender: Types.ObjectId;
  text: string;
  conversationId: Types.ObjectId;
  attachments: string[];
  isDeleted: boolean;
  deletedBy: Types.ObjectId[];
}


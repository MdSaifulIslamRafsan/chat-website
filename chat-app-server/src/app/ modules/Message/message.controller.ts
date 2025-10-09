import mongoose from "mongoose";
import { TMessage } from "./message.interface";

const messageSchema = new mongoose.Schema<TMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    conversationId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
      },
    ],

    attachments: [
      {
        type: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);

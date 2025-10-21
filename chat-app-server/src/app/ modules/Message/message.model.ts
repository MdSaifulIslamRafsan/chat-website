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
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

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

// Query Middleware
messageSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

messageSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Message = mongoose.model("Message", messageSchema);

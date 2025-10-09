import mongoose from "mongoose";
import { TConversation } from "./conversation.interface";

const conversationSchema = new mongoose.Schema<TConversation>(
  {
    name: {
      type: String,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

// Query Middleware
conversationSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

conversationSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const Conversation = mongoose.model("Conversation", conversationSchema);

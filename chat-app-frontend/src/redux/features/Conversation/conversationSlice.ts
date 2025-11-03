import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TConversation } from "../../../Types/conversationTypes";

interface ConversationState {
  conversations: TConversation[];
  onlineUsers: string[];
}

const initialState: ConversationState = {
  conversations: [],
  onlineUsers: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<TConversation[]>) {
      state.conversations = action.payload;
    },
    addConversation(state, action: PayloadAction<TConversation>) {
      const exists = state.conversations.find(
        (c) => c._id === action.payload._id
      );
      if (!exists) state.conversations.unshift(action.payload);
    },
    incrementUnreadCount(state, action: PayloadAction<string>) {
      const conv = state.conversations.find((c) => c._id === action.payload);

      if (conv) conv.unreadCount = (conv.unreadCount || 0) + 1;
    },
    resetUnreadCount(state, action: PayloadAction<string>) {
      const conv = state.conversations.find((c) => c._id === action.payload);
      if (conv) conv.unreadCount = 0;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setConversations,
  addConversation,
  incrementUnreadCount,
  resetUnreadCount,
  setOnlineUsers,
} = conversationSlice.actions;
export default conversationSlice.reducer;

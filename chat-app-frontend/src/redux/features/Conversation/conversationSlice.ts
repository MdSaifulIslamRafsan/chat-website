// conversationSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TConversation } from "../../../Types/conversationTypes";

interface ConversationState {
  conversations: TConversation[];
}

const initialState: ConversationState = { conversations: [] };

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
      if (!exists) state.conversations.push(action.payload);
    },
  },
});

export const { setConversations, addConversation } = conversationSlice.actions;
export default conversationSlice.reducer;

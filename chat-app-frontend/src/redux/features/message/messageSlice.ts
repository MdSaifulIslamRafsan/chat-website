import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TMessage } from "../../../Types/MessageTypes";

interface MessageState {
  messages: TMessage[];
  typingUsers: string[];
}

const initialState: MessageState = { messages: [], typingUsers: [] };

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<TMessage[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<TMessage>) {
      const exists = state.messages.find((c) => c._id === action.payload._id);
      if (!exists) state.messages.push(action.payload);
    },
    addOlderMessages(state, action: PayloadAction<TMessage[]>) {
      const existingIds = new Set(state.messages.map((msg) => msg._id));
      const newMessages = action.payload.filter(
        (msg) => !existingIds.has(msg._id)
      );
      state.messages = [...newMessages, ...state.messages];
    },
    setTypingUsers(state, action: PayloadAction<string[]>) {
      state.typingUsers = action.payload;
    },
  },
});

export const { setMessages, addMessage, addOlderMessages, setTypingUsers } =
  messageSlice.actions;
export default messageSlice.reducer;

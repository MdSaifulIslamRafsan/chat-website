
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TMessage } from "../../../Types/MessageTypes";


interface MessageState {
  messages: TMessage[];
}

const initialState: MessageState = { messages: [] };

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<TMessage[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<TMessage>) {
      const exists = state.messages.find(
        (c) => c._id === action.payload._id
      );
      if (!exists) state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;

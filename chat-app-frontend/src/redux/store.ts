import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";
import layoutReducer from "./features/layoutSlice";
import authReducer from "./features/auth/authSlice";
import conversationReducer from "./features/Conversation/conversationSlice";
import messageReducer from "./features/message/messageSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "auth",
  storage,
};
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    layout: layoutReducer,
    conversation: conversationReducer,
    message: messageReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const persistor = persistStore(store);

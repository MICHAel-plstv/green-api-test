import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '@/store/authSlice';
import { listenerMiddleware } from '@/store/listener';

import { chatsSlice } from '../pages/chat/store/chatsSlice';

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    [chatsSlice.reducerPath]: chatsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

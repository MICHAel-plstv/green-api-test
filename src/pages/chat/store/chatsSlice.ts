import {
  createSlice,
  createSelector,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { logOut } from '@/store/authSlice';
import { buildUrl, request } from '@/store/api';

import type { ChatsState, ReceivedMessage } from './types';

import { parseJournal } from '../helpers/schema';

const ensureChat = (state: ChatsState, chatId: string, time: number) => {
  state.chats[chatId] ??= { id: chatId, updatedAt: time, messages: [] };
  return state.chats[chatId];
};
const findMessage = (state: ChatsState, chatId: string, id: string) => {
  return state.chats[chatId]?.messages.find((message) => message.id === id);
};
const addMessage = (state: ChatsState, { chatId, chatName, message }: ReceivedMessage) => {
  const curChat = ensureChat(state, chatId, message.timestamp);
  if (chatName) {
    curChat.name = chatName;
  }

  if (curChat.messages.some(({ id }) => id === message.id)) {
    return;
  }

  curChat.messages.push(message);
  curChat.updatedAt = Math.max(curChat.updatedAt, message.timestamp);
};

const addHistory = (state: ChatsState, messages: ReceivedMessage[]) => {
  messages.forEach((item) => addMessage(state, item));
  new Set(messages.map(({ chatId }) => chatId)).forEach((chatId) => {
    state.chats[chatId].messages.sort((a, b) => a.timestamp - b.timestamp);
  });
};

const getCredentials = (state: RootState) => {
  const { credentials } = state.auth;
  if (!credentials) throw new Error('Not authorized');
  return credentials;
};

export const sendTextMessage = createAsyncThunk<
  { idMessage: string; },
  { chatId: string; text: string; },
  { state: RootState; pendingMeta: { sentAt: number; }; }
>(
  'chats/sendTextMessage',
  ({ chatId, text }, { getState }) => {
    return request(buildUrl(getCredentials(getState()), 'sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: text }),
    });
  },
  { getPendingMeta: () => ({ sentAt: Date.now() }) },
);

export const loadChatHistory = createAsyncThunk<
  ReceivedMessage[],
  string,
  { state: RootState; }
>(
  'chats/loadChatHistory',
  async (chatId, { getState, signal }) => {
    const body = await request(buildUrl(getCredentials(getState()), 'getChatHistory'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId }),
      signal,
    });
    return parseJournal(body);
  },
);

export const loadRecentChats = createAsyncThunk<
  ReceivedMessage[],
  void,
  { state: RootState; }
>(
  'chats/loadRecentChats',
  async (_, { getState, signal }) => {
    const credentials = getCredentials(getState());
    const journals = await Promise.all(
      ['lastIncomingMessages', 'lastOutgoingMessages'].map((method) =>
        request(buildUrl(credentials, method), { signal }),
      ),
    );
    return journals.flatMap(parseJournal);
  },
);

const initialState: ChatsState = {
  chats: {},
  pollingError: null,
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatOpened: (
      state,
      { payload }: PayloadAction<{ chatId: string; openedAt: number; }>,
    ) => {
      ensureChat(state, payload.chatId, payload.openedAt);
    },
    messageReceived: (state, { payload }: PayloadAction<ReceivedMessage>) => {
      addMessage(state, payload);
    },
    pollingErrorChanged: (state, { payload }: PayloadAction<string | null>) => {
      state.pollingError = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTextMessage.pending, (state, { meta }) => {
        const { chatId, text } = meta.arg;
        const chat = ensureChat(state, chatId, meta.sentAt);
        chat.messages.push({
          id: meta.requestId,
          text,
          timestamp: meta.sentAt,
          isOutgoing: true,
          status: 'pending',
        });
        chat.updatedAt = meta.sentAt;
      })
      .addCase(sendTextMessage.fulfilled, (state, { meta, payload }) => {
        const message = findMessage(state, meta.arg.chatId, meta.requestId);
        if (!message) return;
        message.id = payload.idMessage;
        message.status = 'sent';
      })
      .addCase(sendTextMessage.rejected, (state, { meta }) => {
        const message = findMessage(state, meta.arg.chatId, meta.requestId);
        if (message) message.status = 'failed';
      })
      .addCase(loadChatHistory.fulfilled, (state, { payload }) => {
        addHistory(state, payload);
      })
      .addCase(loadRecentChats.fulfilled, (state, { payload }) => {
        addHistory(state, payload);
      })
      .addCase(logOut, () => initialState);
  },
  selectors: {
    selectChat: (state, chatId: string) => state.chats[chatId],
    selectChatList: createSelector(
      [(state: ChatsState) => state.chats],
      (chats) => Object.values(chats).sort((a, b) => b.updatedAt - a.updatedAt),
    ),
    selectPollingError: (state) => state.pollingError,
  },
});

export const { chatOpened, messageReceived, pollingErrorChanged } =
  chatsSlice.actions;
export const { selectChat, selectChatList, selectPollingError } =
  chatsSlice.selectors;

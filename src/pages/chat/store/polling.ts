import { createAction, isAnyOf } from '@reduxjs/toolkit';

import { logOut } from '@/store/authSlice';
import { buildUrl, request } from '@/store/api';
import { startAppListening } from '@/store/listener';

import { messageReceived, pollingErrorChanged } from './chatsSlice';

import { envelopeSchema, parseNotification } from '../helpers/schema';
import {
  IDLE_DELAY_MS,
  RETRY_DELAY_MS,
  RECEIVE_TIMEOUT_SECONDS,
} from '../helpers/constants';

export const pollingStarted = createAction('chats/pollingStarted');
export const pollingStopped = createAction('chats/pollingStopped');

startAppListening({
  actionCreator: pollingStarted,
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();

    const loop = listenerApi.fork(async ({ pause, delay, signal }) => {
      while (true) {
        const { credentials } = listenerApi.getState().auth;
        if (!credentials) return;

        try {
          const url = `${buildUrl(credentials, 'receiveNotification')}?receiveTimeout=${RECEIVE_TIMEOUT_SECONDS}`;
          const notification = envelopeSchema.parse(
            await pause(request(url, { signal })),
          );

          if (listenerApi.getState().chats.pollingError) {
            listenerApi.dispatch(pollingErrorChanged(null));
          }

          if (!notification) {
            await delay(IDLE_DELAY_MS);
            continue;
          }

          const message = parseNotification(notification.body);
          if (message) {
            listenerApi.dispatch(messageReceived(message));
          }

          const deleteUrl = `${buildUrl(credentials, 'deleteNotification')}/${notification.receiptId}`;
          await pause(request(deleteUrl, { method: 'DELETE', signal }));
        } catch (error) {
          if (signal.aborted) return;

          console.error('Polling failed', error);
          listenerApi.dispatch(
            pollingErrorChanged('Нет связи с GREEN-API, переподключаемся…'),
          );
          await delay(RETRY_DELAY_MS);
        }
      }
    });

    try {
      await listenerApi.condition(isAnyOf(pollingStopped, logOut));
    } finally {
      loop.cancel();
    }
  },
});

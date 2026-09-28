import type { Message } from '../store/types';

export const CHAT_ID_SUFFIX = '@c.us';
export const RECEIVE_TIMEOUT_SECONDS = 20;
export const RETRY_DELAY_MS = 5000;
export const IDLE_DELAY_MS = 1000;
export const STATUS_ICONS: Record<Message['status'], string> = {
  pending: '…',
  sent: '✓',
  failed: '!',
};
export const STATUS_LABELS: Record<Message['status'], string> = {
  pending: 'Отправляется',
  sent: 'Отправлено',
  failed: 'Не отправлено',
};

import { CHAT_ID_SUFFIX } from './constants';

export const isPhone = (value: string) => /^\d{10,15}$/.test(value);
export const toChatId = (phone: string) => `${phone}${CHAT_ID_SUFFIX}`;
export const toPhone = (chatId: string) => chatId.replace(CHAT_ID_SUFFIX, '');
export const formatPhone = (chatId: string) => `+${toPhone(chatId)}`;
export const formatTime = (timestamp: number) => {
  const timeFormat = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return timeFormat.format(timestamp);
};

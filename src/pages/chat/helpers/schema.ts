import { z } from 'zod';

import { isPhone } from './utils';

import type { ReceivedMessage } from '../store/types';

export const newChatSchema = z.object({
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .refine(isPhone, 'Номер в международном формате, например 79001234567'),
});

export const envelopeSchema = z
  .object({ receiptId: z.number(), body: z.unknown() })
  .nullable();

const messageTextSchema = z.union([
  z
    .object({
      typeMessage: z.literal('textMessage'),
      textMessageData: z.object({ textMessage: z.string() }),
    })
    .transform((data) => data.textMessageData.textMessage),
  z
    .object({
      typeMessage: z.enum(['extendedTextMessage', 'quotedMessage']),
      extendedTextMessageData: z.object({ text: z.string() }),
    })
    .transform((data) => data.extendedTextMessageData.text),
]);

export const notificationSchema = z.object({
  typeWebhook: z.enum(['incomingMessageReceived', 'outgoingMessageReceived']),
  idMessage: z.string(),
  timestamp: z.number(),
  senderData: z.object({
    chatId: z.string().endsWith('@c.us'),
    chatName: z.string().optional(),
  }),
  messageData: messageTextSchema,
});

const journalMessageSchema = z.object({
  type: z.enum(['incoming', 'outgoing']),
  idMessage: z.string(),
  timestamp: z.number(),
  chatId: z.string().endsWith('@c.us'),
  senderName: z.string().optional(),
  textMessage: z.string().optional(),
  extendedTextMessage: z.object({ text: z.string() }).optional(),
});

export const parseJournal = (body: unknown): ReceivedMessage[] => {
  return z.array(z.unknown()).parse(body).flatMap((item) => {
    const result = journalMessageSchema.safeParse(item);
    if (!result.success) return [];

    const { type, idMessage, timestamp, chatId, senderName } = result.data;
    const text = result.data.textMessage ?? result.data.extendedTextMessage?.text;
    if (!text) return [];

    return {
      chatId,
      chatName: senderName || undefined,
      message: {
        id: idMessage,
        status: 'sent',
        text,
        timestamp: timestamp * 1000,
        isOutgoing: type === 'outgoing',
      },
    };
  });
};

export const parseNotification = (body: unknown): ReceivedMessage | null => {
  const result = notificationSchema.safeParse(body);

  if (!result.success) return null;

  const { typeWebhook, idMessage, timestamp, senderData, messageData } = result.data;

  return {
    chatId: senderData.chatId,
    chatName: senderData.chatName || undefined,
    message: {
      id: idMessage,
      status: 'sent',
      text: messageData,
      timestamp: timestamp * 1000,
      isOutgoing: typeWebhook === 'outgoingMessageReceived',
    },
  };
};

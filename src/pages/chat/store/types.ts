export interface Message {
  id: string;
  text: string;
  timestamp: number;
  isOutgoing: boolean;
  status: 'pending' | 'sent' | 'failed';
}

export interface Chat {
  id: string;
  name?: string;
  updatedAt: number;
  messages: Message[];
}

export interface ReceivedMessage {
  chatId: string;
  message: Message;
  chatName?: string;
}

export interface ChatsState {
  chats: Record<string, Chat>;
  pollingError: string | null;
}

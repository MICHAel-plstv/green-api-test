import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router';

import { useAppDispatch } from '@/store/hooks';

import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';

import { pollingStarted, pollingStopped } from './store/polling';
import { chatOpened, loadChatHistory, loadRecentChats } from './store/chatsSlice';

import { isPhone, toChatId } from './helpers/utils';

import './style.css';

export const ChatPage = () => {
  const { phone } = useParams();
  const dispatch = useAppDispatch();

  const chatId = phone && isPhone(phone) ? toChatId(phone) : null;

  useEffect(() => {
    dispatch(pollingStarted());

    return () => {
      dispatch(pollingStopped());
    };
  }, []);

  useEffect(() => {
    const request = dispatch(loadRecentChats());

    return () => request.abort();
  }, []);

  useEffect(() => {
    if (!chatId) return;

    dispatch(chatOpened({ chatId, openedAt: Date.now() }));
    const request = dispatch(loadChatHistory(chatId));

    return () => request.abort();
  }, [chatId]);

  if (phone && !chatId) {
    return <Navigate to='/chat' replace />;
  }

  const content = chatId ? (
    <ChatWindow key={chatId} chatId={chatId} />
  ) : (
    <div className='chat__empty'>
      <h2 className='chat__empty-title'>Chat</h2>
      <p>Выберите чат слева или создайте новый по номеру телефона</p>
    </div>
  );

  return (
    <main className='chat'>
      <Sidebar />

      {content}
    </main>
  );
};

export default ChatPage;
